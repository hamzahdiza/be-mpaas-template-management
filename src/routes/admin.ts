import { Hono } from 'hono';
import { db } from '../db';
import { events, ticketCategories, tickets, users, serviceOrders, issuedTickets } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { verify } from 'hono/jwt';
import { formatEventDetail, saveTicketTiers } from './events';

export const adminRoutes = new Hono();

// Helper to extract authenticated admin user
async function getAuthAdmin(c: any): Promise<any | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || authHeader === 'Bearer undefined' || authHeader === 'Bearer null' || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'wondr-event-template-secret-key-2026';
    const token = authHeader.replace('Bearer ', '').trim();
    const payload = await verify(token, JWT_SECRET, 'HS256');
    if (payload.role !== 'admin') {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// ----------------------------------------------------------------------
// GET /api/v1/admin/events - List all events for admin review
// ----------------------------------------------------------------------
adminRoutes.get('/events', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const statusParam = c.req.query('status')?.toUpperCase();
  const searchParam = c.req.query('search')?.toLowerCase();

  const allEvents = await db.query.events.findMany({
    orderBy: [desc(events.updatedAt), desc(events.createdAt)],
    with: {
      ticketCategories: { with: { tickets: true } },
      user: true,
    }
  });

  let filtered = allEvents;

  if (statusParam && statusParam !== 'ALL') {
    filtered = filtered.filter(e => {
      const s = (e.approvalStatus || 'DRAFT').toUpperCase();
      if (statusParam === 'WAITING' || statusParam === 'PENDING' || statusParam === 'REQUESTED') {
        return s === 'WAITING' || s === 'REQUESTED';
      }
      return s === statusParam;
    });
  }

  if (searchParam) {
    filtered = filtered.filter(e =>
      (e.name || '').toLowerCase().includes(searchParam) ||
      (e.category || '').toLowerCase().includes(searchParam) ||
      (e.user?.tenantName || '').toLowerCase().includes(searchParam)
    );
  }

  const items = filtered.map(ev => {
    const detail = formatEventDetail(ev, ev.ticketCategories, true);
    return {
      id: ev.id,
      name: detail.name,
      liveName: ev.name,
      category: detail.category,
      eventType: detail.type,
      startDate: detail.startDate,
      endDate: detail.endDate,
      price: detail.price,
      approvalStatus: detail.approvalStatus,
      submissionOption: ev.submissionOption || 'draft',
      submittedDate: ev.submittedDate,
      reviewedDate: ev.reviewedDate,
      savedDate: ev.savedDate,
      rejectionNote: ev.rejectionNote,
      isActive: Boolean(ev.isActive),
      hasPendingUpdates: Boolean(ev.pendingData),
      totalTickets: detail.totalTickets,
      ticketsSold: detail.ticketsSold,
      remainingTickets: detail.remainingTickets,
      vendor: {
        id: ev.user?.id || ev.userId,
        name: ev.user?.name,
        tenantName: ev.user?.tenantName || 'Vendor Partner',
        tenantCode: ev.user?.tenantCode,
        email: ev.user?.email,
      }
    };
  });

  return c.json({
    success: true,
    count: items.length,
    data: items,
  });
});

// ----------------------------------------------------------------------
// GET /api/v1/admin/events/:id - Get event review details with diff
// ----------------------------------------------------------------------
adminRoutes.get('/events/:id', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const id = c.req.param('id');
  const ev = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      ticketCategories: { with: { tickets: true } },
      user: true,
    }
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan' }, 404);
  }

  const liveVersion = formatEventDetail(ev, ev.ticketCategories, false);
  const pendingVersion = formatEventDetail(ev, ev.ticketCategories, true);

  return c.json({
    success: true,
    data: {
      event: pendingVersion,
      liveVersion,
      hasPendingUpdates: Boolean(ev.pendingData),
      pendingData: ev.pendingData || null,
      vendor: {
        id: ev.user?.id || ev.userId,
        name: ev.user?.name,
        tenantName: ev.user?.tenantName,
        tenantCode: ev.user?.tenantCode,
        email: ev.user?.email,
        phone: ev.user?.picPhone,
      }
    }
  });
});

// ----------------------------------------------------------------------
// POST /api/v1/admin/events/:id/review - Approve or Reject an Event
// ----------------------------------------------------------------------
adminRoutes.post('/events/:id/review', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat melakukan review' }, 403);
  }

  const id = c.req.param('id');
  const body = await c.req.json();
  const action = (body.action || body.status || '').toUpperCase();
  const rejectionNote = body.rejectionNote || body.rejection_note || body.note || null;

  if (action !== 'APPROVE' && action !== 'APPROVED' && action !== 'REJECT' && action !== 'REJECTED') {
    return c.json({
      error: 'Action tidak valid. Gunakan { "action": "APPROVE" } atau { "action": "REJECT", "rejectionNote": "Alasan" }'
    }, 400);
  }

  const ev = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: { ticketCategories: { with: { tickets: true } } }
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan' }, 404);
  }

  const now = new Date().toISOString();

  if (action === 'APPROVE' || action === 'APPROVED') {
    const p = ev.pendingData;
    if (p) {
      // Merge pending fields into live event columns
      const name = p.event_name || p.name || ev.name;
      const category = p.event_category || p.category || ev.category;
      const eventType = p.type || p.event_type || ev.eventType;
      const eventFormat = p.event_format || p.format || ev.eventFormat;
      const entryMode = p.entry_mode || ev.entryMode;
      const externalProvider = p.external_provider ?? ev.externalProvider;
      const externalUrl = p.external_url ?? ev.externalUrl;
      const description = p.description ?? ev.description;
      const termsAndConditions = p.terms_and_conditions || p.termsAndConditions || ev.termsAndConditions;
      const bannerUrls = p.banner_urls || p.bannerUrls || ev.bannerUrls;
      const bannerUrl = bannerUrls?.[0] || p.bannerUrl || ev.bannerUrl;
      const startDate = p.start_date || p.startDate || ev.startDate;
      const endDate = p.end_date || p.endDate || ev.endDate;
      const isOneDayEvent = p.is_one_day_event !== undefined ? (p.is_one_day_event ? 1 : 0) : ev.isOneDayEvent;
      const startTime = p.event_start_time || p.startTime || ev.startTime;
      const timezone = p.timezone || ev.timezone;
      const location = p.location_name || p.location || p.venueLocation || ev.location;
      const locationAddress = p.locationAddress ?? ev.locationAddress;
      const locationUrl = p.locationUrl ?? ev.locationUrl;
      const meetingUrl = p.meeting_url || p.onlineMeetingLink || ev.meetingUrl;
      const isPaymentEnabled = p.is_payment_enabled !== undefined ? (p.is_payment_enabled ? 1 : 0) : ev.isPaymentEnabled;
      const paymentChannels = p.payment_channels || p.paymentChannels || ev.paymentChannels;
      const feePayer = p.fee_payer || p.feePayer || ev.feePayer;
      const paymentMethod = p.payment_method || p.paymentMethod || ev.paymentMethod;
      const accountNumberBNI = p.bni_account_number || p.accountNumberBNI || ev.accountNumberBNI;
      const templateId = p.selected_template ? Number(p.selected_template) : (p.templateId ? Number(p.templateId) : ev.templateId);

      const ticketTiers = p.ticket_tiers || p.tickets;
      let lowestPrice = ev.price;
      if (ticketTiers?.length) {
        lowestPrice = Math.min(...ticketTiers.map((t: any) => Number(t.ticket_price ?? t.price ?? 0)));
      }

      await db.update(events).set({
        name,
        category,
        eventType,
        eventFormat,
        entryMode,
        externalProvider,
        externalUrl,
        description,
        termsAndConditions,
        startDate,
        endDate,
        isOneDayEvent,
        startTime,
        timezone,
        price: lowestPrice,
        location,
        locationAddress,
        locationUrl,
        meetingUrl,
        bannerUrl,
        bannerUrls,
        isPaymentEnabled,
        paymentChannels,
        feePayer,
        paymentMethod,
        accountNumberBNI,
        templateId,
        approvalStatus: 'APPROVED',
        isActive: 1,
        reviewedDate: now,
        rejectionNote: null,
        pendingData: null,
        updatedAt: now,
      }).where(eq(events.id, id));

      if (ticketTiers) {
        await saveTicketTiers(id, ticketTiers);
      }
    } else {
      await db.update(events).set({
        approvalStatus: 'APPROVED',
        isActive: 1,
        reviewedDate: now,
        rejectionNote: null,
        updatedAt: now,
      }).where(eq(events.id, id));
    }

    const updated = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: { ticketCategories: { with: { tickets: true } } }
    });

    return c.json({
      success: true,
      action: 'APPROVE',
      message: `Event '${updated?.name}' berhasil DISETUJUI (APPROVED) dan kini live di Mini Program`,
      data: formatEventDetail(updated, updated?.ticketCategories || [], false)
    });
  } else {
    // REJECT
    await db.update(events).set({
      approvalStatus: 'REJECTED',
      rejectionNote: rejectionNote || 'Event ditolak oleh Administrator. Silakan periksa kembali konfigurasi event Anda.',
      reviewedDate: now,
      updatedAt: now,
    }).where(eq(events.id, id));

    const updated = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: { ticketCategories: { with: { tickets: true } } }
    });

    return c.json({
      success: true,
      action: 'REJECT',
      message: `Event '${updated?.name}' telah DITOLAK (REJECTED)`,
      rejectionNote: rejectionNote || 'Event ditolak oleh Administrator.',
      data: formatEventDetail(updated, updated?.ticketCategories || [], true)
    });
  }
});

// ----------------------------------------------------------------------
// GET /api/v1/admin/dashboard - Metrics, stats, recent activities & approved events
// ----------------------------------------------------------------------
adminRoutes.get('/dashboard', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const allEvents = await db.query.events.findMany({
    with: {
      ticketCategories: true,
      user: true,
    },
    orderBy: [desc(events.createdAt)],
  });

  const allVendors = await db.query.users.findMany({
    where: eq(users.role, 'vendor')
  });

  const allOrders = await db.query.serviceOrders.findMany({
    orderBy: [desc(serviceOrders.completedAt), desc(serviceOrders.id)]
  });

  const completedOrdersList = allOrders.filter(o => o.status === 'completed');
  const pendingOrdersList = allOrders.filter(o => o.status === 'pending');
  const refundOrdersList = allOrders.filter(o => o.status === 'refund' || o.status === 'canceled');

  const dbTotalOrders = allOrders.length;
  const dbCompleted = completedOrdersList.length;
  const dbPending = pendingOrdersList.length;
  const dbRefund = refundOrdersList.length;

  const totalRevenueNum = completedOrdersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const waitingCount = allEvents.filter(e => (e.approvalStatus || 'DRAFT').toUpperCase() === 'WAITING' || (e.approvalStatus || '').toUpperCase() === 'REQUESTED').length;
  const approvedEventsList = allEvents.filter(e => (e.approvalStatus || '').toUpperCase() === 'APPROVED');
  const approvedCount = approvedEventsList.length;
  const rejectedCount = allEvents.filter(e => (e.approvalStatus || '').toUpperCase() === 'REJECTED').length;
  const draftCount = allEvents.filter(e => (e.approvalStatus || 'DRAFT').toUpperCase() === 'DRAFT').length;

  // Recent order activities (combining live db orders and sample activities for rich UI)
  const recentActivities = allOrders.slice(0, 10).map((ord) => {
    const formattedAmount = `Rp ${(ord.totalAmount || 0).toLocaleString('id-ID')}`;
    const statusUpper = (ord.status || 'PENDING').toUpperCase();
    return {
      id: ord.id,
      customerName: ord.customerName || 'Pembeli Tiket',
      serviceName: ord.serviceName || 'Event Lifestyle',
      status: statusUpper,
      amount: ord.totalAmount || 0,
      amountDisplay: formattedAmount,
      dateDisplay: 'Hari ini, 09:14',
      createdAt: ord.completedAt || new Date().toISOString(),
    };
  });

  // Approved events table data
  const approvedEventsTable = approvedEventsList.map((ev) => {
    const detail = formatEventDetail(ev, ev.ticketCategories, false);
    const evOrders = completedOrdersList.filter(o => o.serviceId === ev.id);
    const evRevenue = evOrders.length > 0
      ? evOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      : (detail.ticketsSold * (detail.price || 50000));

    return {
      id: ev.id,
      name: ev.name,
      eventName: ev.name,
      startDate: ev.startDate || '15 Oct 2026',
      eventType: ev.eventType || 'Offline Event',
      format: ev.eventFormat || 'Offline',
      bannerUrl: ev.bannerUrl || (ev.bannerUrls && ev.bannerUrls[0]) || '',
      tenantName: ev.user?.tenantName || 'Orbital Inc.',
      vendorName: ev.user?.name || ev.user?.tenantName || 'Vendor Partner',
      ticketsSold: detail.ticketsSold || evOrders.reduce((sum, o) => sum + (o.quantity || 1), 0),
      totalTickets: detail.totalTickets || 1000,
      remainingTickets: detail.remainingTickets,
      revenue: evRevenue,
      revenueDisplay: `Rp ${evRevenue.toLocaleString('id-ID')}`,
      isActive: Boolean(ev.isActive),
    };
  });

  return c.json({
    success: true,
    data: {
      stats: {
        totalOrders: 15240 + dbTotalOrders,
        totalOrdersGrowth: '+12%',
        completedOrders: 14800 + dbCompleted,
        completedOrdersGrowth: '+8%',
        pendingOrders: 415 + dbPending,
        pendingOrdersGrowth: '2%',
        refundOrders: 25 + dbRefund,
        refundOrdersGrowth: '5%',
        totalRevenue: totalRevenueNum,
        totalRevenueDisplay: `Rp ${totalRevenueNum.toLocaleString('id-ID')}`,
      },
      recentActivities: recentActivities.length > 0 ? recentActivities : [
        {
          id: 'ORD-DEMO-1',
          customerName: 'Syamsul Bahri',
          serviceName: 'Jakarta Running Festival 2026',
          status: 'COMPLETED',
          amount: 24000000,
          amountDisplay: 'Rp 24.000.000',
          dateDisplay: 'Hari ini, 09:14',
        },
        {
          id: 'ORD-DEMO-2',
          customerName: 'Syamsul Bahri',
          serviceName: 'Hindia - Tur Menari Dalam Bayangan 2026',
          status: 'PENDING',
          amount: 24000000,
          amountDisplay: 'Rp 24.000.000',
          dateDisplay: 'Hari ini, 09:14',
        },
        {
          id: 'ORD-DEMO-3',
          customerName: 'Syamsul Bahri',
          serviceName: 'Hindia - Tur Menari Dalam Bayangan 2026',
          status: 'PENDING',
          amount: 24000000,
          amountDisplay: 'Rp 24.000.000',
          dateDisplay: '23 Agu, 09:14',
        },
        {
          id: 'ORD-DEMO-4',
          customerName: 'Syamsul Bahri',
          serviceName: 'Melawai Running 2026',
          status: 'REFUND',
          amount: 24000000,
          amountDisplay: 'Rp 24.000.000',
          dateDisplay: 'Hari ini, 09:14',
        }
      ],
      approvedEvents: approvedEventsTable,
      moderationSummary: {
        totalEvents: allEvents.length,
        totalVendors: allVendors.length,
        waitingReviewCount: waitingCount,
        approvedCount,
        rejectedCount,
        draftCount,
      }
    }
  });
});

// ----------------------------------------------------------------------
// PATCH /api/v1/admin/events/:id/live-status - Toggle or update event live status
// ----------------------------------------------------------------------
adminRoutes.patch('/events/:id/live-status', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengubah status live event' }, 403);
  }

  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  
  const ev = await db.query.events.findFirst({
    where: eq(events.id, id)
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan' }, 404);
  }

  const nextStatus = body.isActive !== undefined ? (body.isActive ? 1 : 0) : (ev.isActive ? 0 : 1);

  await db.update(events).set({
    isActive: nextStatus,
    updatedAt: new Date().toISOString()
  }).where(eq(events.id, id));

  return c.json({
    success: true,
    message: `Status live event '${ev.name}' berhasil diubah menjadi ${nextStatus ? 'Aktif' : 'Nonaktif'}`,
    data: {
      id: ev.id,
      name: ev.name,
      isActive: Boolean(nextStatus)
    }
  });
});

// ----------------------------------------------------------------------
// GET /api/v1/admin/tenants - List all registered tenants
// ----------------------------------------------------------------------
adminRoutes.get('/tenants', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const allVendors = await db.query.users.findMany({
    where: eq(users.role, 'vendor'),
    with: {
      events: {
        with: {
          ticketCategories: true
        }
      }
    },
    orderBy: [desc(users.createdAt)]
  });

  const tenants = allVendors.map(v => {
    const vEvents = v.events || [];
    const activeEvents = vEvents.filter(e => e.isActive && e.approvalStatus === 'APPROVED').length;
    const totalEvents = vEvents.length;

    return {
      id: v.id,
      tenantCode: v.tenantCode || `TEN-${v.id.slice(0, 6).toUpperCase()}`,
      tenantName: v.tenantName || v.name || 'Tenant Mitra',
      name: v.name,
      email: v.email,
      category: v.category || 'Event & Lifestyle',
      picName: v.picName || v.name,
      picPhone: v.picPhone || '-',
      picEmail: v.picEmail || v.email,
      accountNumberBNI: v.accountNumberBNI || '-',
      status: v.status || 'Active',
      joinDate: v.createdAt || '2026-09-01',
      activeEvents,
      totalEvents,
    };
  });

  return c.json({
    success: true,
    count: tenants.length,
    data: tenants
  });
});

// ----------------------------------------------------------------------
// GET /api/v1/admin/orders - List all orders across all tenants
// ----------------------------------------------------------------------
adminRoutes.get('/orders', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const statusParam = c.req.query('status')?.toLowerCase();
  const searchParam = c.req.query('search')?.toLowerCase();

  const allOrders = await db.query.serviceOrders.findMany({
    orderBy: [desc(serviceOrders.completedAt), desc(serviceOrders.id)]
  });

  let filtered = allOrders;
  if (statusParam && statusParam !== 'all') {
    filtered = filtered.filter(o => o.status?.toLowerCase() === statusParam);
  }
  if (searchParam) {
    filtered = filtered.filter(o =>
      (o.customerName || '').toLowerCase().includes(searchParam) ||
      (o.serviceName || '').toLowerCase().includes(searchParam) ||
      (o.id || '').toLowerCase().includes(searchParam)
    );
  }

  const data = filtered.map(o => ({
    id: o.id,
    orderType: o.orderType,
    serviceId: o.serviceId,
    serviceName: o.serviceName,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    quantity: o.quantity,
    totalAmount: o.totalAmount,
    amountDisplay: `Rp ${(o.totalAmount || 0).toLocaleString('id-ID')}`,
    status: (o.status || 'pending').toUpperCase(),
    paymentMethod: o.paymentMethod,
    invoiceNumber: o.invoiceNumber,
    completedAt: o.completedAt,
  }));

  return c.json({
    success: true,
    count: data.length,
    data
  });
});
