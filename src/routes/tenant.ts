import { Hono } from 'hono';
import { db } from '../db';
import { users, events, serviceOrders } from '../db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { verify } from 'hono/jwt';

export const tenantRoutes = new Hono();

// Helper to get authenticated user
async function getAuthUser(c: any): Promise<any | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || authHeader === 'Bearer undefined' || authHeader === 'Bearer null' || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'wondr-event-template-secret-key-2026';
    const token = authHeader.replace('Bearer ', '').trim();
    return await verify(token, JWT_SECRET, 'HS256');
  } catch (err) {
    return null;
  }
}

// ----------------------------------------------------------------------
// GET /api/v1/tenant/overview - Scoped strictly to logged-in tenant
// ----------------------------------------------------------------------
tenantRoutes.get('/overview', async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user) {
      return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
    }

    const tenantUser = await db.query.users.findFirst({ where: eq(users.id, user.sub) });
    if (!tenantUser) {
      return c.json({ error: 'Akun tenant tidak ditemukan' }, 404);
    }

    // STRICT TENANT SCOPE: Only events and orders belonging to this tenant
    const allEvents = await db.query.events.findMany({
      where: user.role === 'admin' ? undefined : eq(events.userId, tenantUser.id),
      with: { ticketCategories: true }
    });

    const allOrders = await db.query.serviceOrders.findMany({
      where: user.role === 'admin' ? undefined : eq(serviceOrders.vendorUserId, tenantUser.id),
    });

    const totalCount = allEvents.length;
    const activeCount = allEvents.filter(e => e.isActive === 1).length;
    const draftCount = totalCount - activeCount;

    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const pendingOrders = allOrders.filter(o => o.status === 'pending');
    const failedOrders = allOrders.filter(o => o.status === 'refund' || o.status === 'canceled' || o.status === 'failed');

    const totalRevenueNum = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalTicketsSold = completedOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);

    const revenueDisplay = totalRevenueNum >= 1_000_000_000
      ? `Rp ${(totalRevenueNum / 1_000_000_000).toFixed(1)} M`
      : totalRevenueNum >= 1_000_000
      ? `Rp ${(totalRevenueNum / 1_000_000).toFixed(0)} jt`
      : `Rp ${totalRevenueNum.toLocaleString('id-ID')}`;

    const totalPageViews = allEvents.reduce((sum, e) => sum + (e.viewsDetail || 0), 0);
    const clickBuy = totalPageViews > 0 ? Math.round(totalPageViews * 0.077) : 0;
    const checkout = clickBuy > 0 ? Math.round(clickBuy * 0.437) : 0;
    const successPayment = totalTicketsSold || completedOrders.length || 0;

    const conversionRate = totalPageViews > 0 ? `${((successPayment / totalPageViews) * 100).toFixed(1)}%` : '0.0%';

    const name = tenantUser.tenantName || tenantUser.name || 'Vendor Partner';
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VN';

    const tenantCode = tenantUser.tenantCode || `CMS-${tenantUser.id.slice(0, 6).toUpperCase()}`;
    const monthlyRevenue = totalRevenueNum > 0 ? `${revenueDisplay} / bln` : (tenantUser.monthlyRevenue || 'Rp 0 / bln');
    const joinDate = tenantUser.joinDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const joinDateDisplay = tenantUser.joinDateDisplay || `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`;

    const tenantInfo = {
      id: tenantCode,
      name,
      initials,
      status: (tenantUser.status as 'Active' | 'Inactive') || 'Active',
      joinDate,
      joinDateDisplay,
      eventsCount: totalCount,
      monthlyRevenue,
      picName: tenantUser.picName || name,
      picPhone: tenantUser.picPhone || '-',
      picEmail: tenantUser.picEmail || tenantUser.email,
      tenant_name: name,
      join_date: joinDate,
      join_date_display: joinDateDisplay,
      events_count: totalCount,
      monthly_revenue: monthlyRevenue,
      pic_name: tenantUser.picName || name,
      pic_phone: tenantUser.picPhone || '-',
      pic_email: tenantUser.picEmail || tenantUser.email,
    };

    const orderSummary = {
      total_orders: allOrders.length,
      totalOrders: allOrders.length,
      completed: completedOrders.length,
      pending: pendingOrders.length,
      refund_failed: failedOrders.length,
      refundFailed: failedOrders.length,
    };

    const kpis = [
      {
        label: "TOTAL REVENUE",
        value: revenueDisplay,
        caption: "All Time",
        isPrimary: true,
        is_primary: true
      },
      {
        label: "TOTAL PRODUK",
        value: `${totalCount}`,
        caption: `${activeCount} Active · ${draftCount} Draft`,
        isPrimary: false,
        is_primary: false
      },
      {
        label: "TOTAL PAGE VIEWS",
        value: totalPageViews.toLocaleString('id-ID'),
        caption: "All Time",
        isPrimary: false,
        is_primary: false
      },
      {
        label: "AVG. CONVERSION",
        value: conversionRate,
        caption: "All Time",
        isPrimary: false,
        is_primary: false
      }
    ];

    const totalEventsSummary = {
      total: totalCount,
      active: activeCount,
      draft: draftCount
    };

    const funnelStages = [
      {
        label: "Page Views",
        count: totalPageViews,
        percentage: totalPageViews > 0 ? 100 : 0,
        isDrop: false,
        is_drop: false,
        dropPercentage: 0,
        drop_percentage: 0
      },
      {
        label: "Klik Beli",
        count: clickBuy,
        percentage: totalPageViews > 0 ? 7.7 : 0,
        isDrop: true,
        is_drop: true,
        dropPercentage: 92.3,
        drop_percentage: 92.3
      },
      {
        label: "Checkout",
        count: checkout,
        percentage: clickBuy > 0 ? 43.7 : 0,
        isDrop: true,
        is_drop: true,
        dropPercentage: 56.3,
        drop_percentage: 56.3
      },
      {
        label: "Pembayaran Berhasil",
        count: successPayment,
        percentage: checkout > 0 ? 80.3 : 0,
        isDrop: false,
        is_drop: false,
        dropPercentage: 0,
        drop_percentage: 0
      }
    ];

    return c.json({
      tenant: tenantInfo,
      kpis,
      orderSummary,
      order_summary: orderSummary,
      totalEventsSummary,
      total_events_summary: totalEventsSummary,
      funnelStages,
      funnel_stages: funnelStages
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ----------------------------------------------------------------------
// GET /api/v1/tenant/products-performance (SCOPED STRICTLY TO TENANT)
// ----------------------------------------------------------------------
tenantRoutes.get('/products-performance', async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user) {
      return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
    }

    const eventList = await db.query.events.findMany({
      where: user.role === 'admin' ? undefined : eq(events.userId, user.sub),
      orderBy: [desc(events.createdAt)],
      with: { ticketCategories: true }
    });

    const performanceList = await Promise.all(eventList.map(async (ev) => {
      const orders = await db.query.serviceOrders.findMany({
        where: and(eq(serviceOrders.serviceId, ev.id), eq(serviceOrders.status, 'completed'))
      });

      const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      const catTicketsSold = ev.ticketCategories.reduce((sum, cat) => sum + (cat.ticketsSold || 0), 0);
      const ticketsSold = orders.length > 0 ? orders.reduce((sum, ord) => sum + (ord.quantity || 1), 0) : catTicketsSold;
      const totalTickets = ev.ticketCategories.reduce((sum, cat) => sum + (cat.stock || 0), 0);
      const remainingStock = Math.max(0, totalTickets - ticketsSold);
      const ticketTypesCount = ev.ticketCategories.length;
      const viewsDetail = ev.viewsDetail || 0;
      const viewsConfirm = ev.viewsConfirm || 0;

      const conversionRate = viewsDetail > 0 ? `${((ticketsSold / viewsDetail) * 100).toFixed(1)}%` : '0%';
      const revenueDisplay = `Rp ${totalRevenue.toLocaleString('id-ID')}`;

      let approvalStatus = (ev.approvalStatus || 'DRAFT').toUpperCase();
      if (approvalStatus === 'REQUESTED') approvalStatus = 'WAITING';

      const isExternal = ev.entryMode === 'external' || Boolean(ev.externalUrl) || (ev.name || '').toLowerCase().includes('webview');
      const entryMode = isExternal ? 'external' : (ev.entryMode || 'manual');

      return {
        id: ev.id,
        event_name: ev.name,
        name: ev.name,
        entry_mode: entryMode,
        entryMode: entryMode,
        external_provider: ev.externalProvider || '',
        externalProvider: ev.externalProvider || '',
        external_url: ev.externalUrl || '',
        externalUrl: ev.externalUrl || '',
        start_date: ev.startDate,
        event_date: ev.startDate,
        date: ev.startDate,
        event_format: ev.eventType || 'Offline Event',
        event_type: ev.eventType || 'Offline Event',
        type: ev.eventType || 'Offline Event',
        event_category: ev.category || 'Lari / Sports',
        category: ev.category || 'Lari / Sports',
        ticket_types_count: isExternal ? 0 : ticketTypesCount,
        ticketTypesCount: isExternal ? 0 : ticketTypesCount,
        total_tickets: isExternal ? 0 : totalTickets,
        totalTickets: isExternal ? 0 : totalTickets,
        tickets_sold: isExternal ? 0 : ticketsSold,
        ticketsSold: isExternal ? 0 : ticketsSold,
        remaining_stock: isExternal ? 0 : remainingStock,
        remainingStock: isExternal ? 0 : remainingStock,
        remaining_tickets: isExternal ? 0 : remainingStock,
        remainingTickets: isExternal ? 0 : remainingStock,
        conversion_rate: conversionRate,
        conversionRate,
        revenue: isExternal ? '-' : revenueDisplay,
        is_active: Boolean(ev.isActive),
        isActive: Boolean(ev.isActive),
        approval_status: approvalStatus,
        approvalStatus,
        views_detail: viewsDetail,
        viewsDetail,
        views_confirm: viewsConfirm,
        viewsConfirm,
        updated_at: ev.updatedAt || ev.createdAt,
        updatedAt: ev.updatedAt || ev.createdAt,
        thumbnail: ev.bannerUrls?.[0] || ev.bannerUrl || '',
      };
    }));

    return c.json(performanceList);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ----------------------------------------------------------------------
// GET /api/v1/tenant/profile (SCOPED STRICTLY TO TENANT)
// ----------------------------------------------------------------------
tenantRoutes.get('/profile', async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user) {
      return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
    }

    const tenantUser = await db.query.users.findFirst({ where: eq(users.id, user.sub) });
    if (!tenantUser) {
      return c.json({ error: 'Akun tidak ditemukan' }, 404);
    }

    const tenantEvents = await db.query.events.findMany({
      where: user.role === 'admin' ? undefined : eq(events.userId, tenantUser.id)
    });
    const eventsCount = tenantEvents.length;

    const tenantOrders = await db.query.serviceOrders.findMany({
      where: user.role === 'admin' ? undefined : eq(serviceOrders.vendorUserId, tenantUser.id)
    });
    const completedOrders = tenantOrders.filter(o => o.status === 'completed');
    const totalRevenueNum = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalTicketsSold = completedOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);
    const totalPageViews = tenantEvents.reduce((sum, e) => sum + (e.viewsDetail || 0), 0);
    const conversionRate = totalPageViews > 0 ? `${((totalTicketsSold / totalPageViews) * 100).toFixed(1)}%` : '0.0%';

    const revenueDisplay = totalRevenueNum >= 1_000_000_000
      ? `Rp ${(totalRevenueNum / 1_000_000_000).toFixed(1)} M`
      : totalRevenueNum >= 1_000_000
      ? `Rp ${(totalRevenueNum / 1_000_000).toFixed(0)} jt`
      : `Rp ${totalRevenueNum.toLocaleString('id-ID')}`;

    const accessList = [
      { id: "acc-1", name: "Create & Edit Event", isEnabled: true, is_enabled: true },
      { id: "acc-2", name: "Publish & Live Toggle", isEnabled: true, is_enabled: true },
      { id: "acc-3", name: "Ticket Pricing Management", isEnabled: true, is_enabled: true },
      { id: "acc-4", name: "Discount & Promo Codes", isEnabled: true, is_enabled: true },
      { id: "acc-5", name: "Sales Report Download", isEnabled: true, is_enabled: true },
      { id: "acc-6", name: "Attendee Check-in Scanner", isEnabled: false, is_enabled: false },
      { id: "acc-7", name: "Direct Settlement BNI", isEnabled: true, is_enabled: true }
    ];

    const name = tenantUser.tenantName || tenantUser.name || 'Vendor Partner';
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VN';

    const tenantCode = tenantUser.tenantCode || `CMS-${tenantUser.id.slice(0, 6).toUpperCase()}`;
    const monthlyRevenue = totalRevenueNum > 0 ? `${revenueDisplay} / bln` : (tenantUser.monthlyRevenue || 'Rp 0 / bln');
    const joinDate = tenantUser.joinDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const joinDateDisplay = tenantUser.joinDateDisplay || `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`;

    const tenantInfo = {
      id: tenantCode,
      name,
      initials,
      status: (tenantUser.status as 'Active' | 'Inactive') || 'Active',
      joinDate,
      joinDateDisplay,
      eventsCount,
      monthlyRevenue,
      picName: tenantUser.picName || name,
      picPhone: tenantUser.picPhone || '-',
      picEmail: tenantUser.picEmail || tenantUser.email,
      tenant_name: name,
      join_date: joinDate,
      join_date_display: joinDateDisplay,
      events_count: eventsCount,
      monthly_revenue: monthlyRevenue,
      pic_name: tenantUser.picName || name,
      pic_phone: tenantUser.picPhone || '-',
      pic_email: tenantUser.picEmail || tenantUser.email,
    };

    return c.json({
      tenant: tenantInfo,
      kpis: [
        { label: "TOTAL REVENUE", value: revenueDisplay, caption: "All Time", isPrimary: true, is_primary: true },
        { label: "TOTAL PRODUK", value: `${eventsCount}`, caption: "Active & Draft", isPrimary: false, is_primary: false },
        { label: "TOTAL PAGE VIEWS", value: totalPageViews.toLocaleString('id-ID'), caption: "All Time", isPrimary: false, is_primary: false },
        { label: "AVG. CONVERSION", value: conversionRate, caption: "All Time", isPrimary: false, is_primary: false }
      ],
      accessList,
      access_list: accessList
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ----------------------------------------------------------------------
// PUT /api/v1/tenant/profile (SCOPED STRICTLY TO TENANT)
// ----------------------------------------------------------------------
tenantRoutes.put('/profile', async (c) => {
  try {
    const user = await getAuthUser(c);
    if (!user) {
      return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
    }

    const body = await c.req.json();

    const name = body.name || body.tenant_name;
    const picName = body.picName || body.pic_name;
    const picPhone = body.picPhone || body.pic_phone;
    const picEmail = body.picEmail || body.pic_email;
    const accountNumberBNI = body.accountNumberBNI || body.bni_account_number;
    const description = body.description;

    await db.update(users).set({
      ...(name && { tenantName: name, name }),
      ...(picName && { picName }),
      ...(picPhone && { picPhone }),
      ...(picEmail && { picEmail }),
      ...(accountNumberBNI && { accountNumberBNI }),
      ...(description && { description }),
      updatedAt: new Date().toISOString()
    }).where(eq(users.id, user.sub));

    const updated = await db.query.users.findFirst({ where: eq(users.id, user.sub) });

    return c.json({
      success: true,
      message: "Profil tenant berhasil diperbarui",
      data: {
        id: updated?.tenantCode || "CMS-111-23",
        name: updated?.tenantName || updated?.name,
        tenant_name: updated?.tenantName || updated?.name,
        picName: updated?.picName,
        pic_name: updated?.picName,
        picPhone: updated?.picPhone,
        pic_phone: updated?.picPhone,
        picEmail: updated?.picEmail,
        pic_email: updated?.picEmail,
        status: updated?.status || "Active",
        joinDate: updated?.joinDate || "1 Agustus 2026",
        joinDateDisplay: updated?.joinDateDisplay || "Bergabung Jan 2025"
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
