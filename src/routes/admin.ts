import { Hono } from 'hono';
import { db } from '../db';
import { events, ticketCategories, tickets, users } from '../db/schema';
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
// GET /api/v1/admin/dashboard - Metrics overview for admin
// ----------------------------------------------------------------------
adminRoutes.get('/dashboard', async (c) => {
  const admin = await getAuthAdmin(c);
  if (!admin) {
    return c.json({ error: 'Unauthorized: Hanya akun Admin yang dapat mengakses endpoint ini' }, 403);
  }

  const allEvents = await db.query.events.findMany();
  const allVendors = await db.query.users.findMany({
    where: eq(users.role, 'vendor')
  });

  const waitingCount = allEvents.filter(e => (e.approvalStatus || 'DRAFT').toUpperCase() === 'WAITING' || (e.approvalStatus || '').toUpperCase() === 'REQUESTED').length;
  const approvedCount = allEvents.filter(e => (e.approvalStatus || '').toUpperCase() === 'APPROVED').length;
  const rejectedCount = allEvents.filter(e => (e.approvalStatus || '').toUpperCase() === 'REJECTED').length;
  const draftCount = allEvents.filter(e => (e.approvalStatus || 'DRAFT').toUpperCase() === 'DRAFT').length;

  return c.json({
    success: true,
    data: {
      totalEvents: allEvents.length,
      totalVendors: allVendors.length,
      waitingReviewCount: waitingCount,
      approvedCount,
      rejectedCount,
      draftCount,
    }
  });
});
