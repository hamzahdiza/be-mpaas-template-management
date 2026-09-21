import { Hono } from 'hono';
import { db } from '../db';
import { events, ticketCategories, tickets, serviceOrders, issuedTickets } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { verify } from 'hono/jwt';
import { eventTemplatesMap } from '../templates/event-templates';

export const eventRoutes = new Hono();

// Helper to extract authenticated user
export async function getAuthUser(c: any): Promise<any | null> {
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

// Helper to format event object to EventDetailFull
export function formatEventDetail(ev: any, cats: any[] = [], forCMS: boolean = true): any {
  if (!ev) return null;

  let displayEv = ev;
  let displayCats = cats || [];

  // When viewing in CMS for an event that has pending changes submitted for review
  if (forCMS && ev.approvalStatus === 'WAITING' && ev.pendingData) {
    const p = ev.pendingData;
    displayEv = {
      ...ev,
      ...p,
      name: p.event_name || p.name || ev.name,
      category: p.event_category || p.category || ev.category,
      eventType: p.type || p.event_type || ev.eventType,
      eventFormat: p.event_format || p.format || ev.eventFormat,
      description: p.description ?? ev.description,
      termsAndConditions: p.terms_and_conditions || p.termsAndConditions || ev.termsAndConditions,
      startDate: p.start_date || p.startDate || ev.startDate,
      endDate: p.end_date || p.endDate || ev.endDate,
      startTime: p.event_start_time || p.startTime || ev.startTime,
      timezone: p.timezone || ev.timezone,
      location: p.location_name || p.location || p.venueLocation || ev.location,
      locationAddress: p.locationAddress ?? ev.locationAddress,
      locationUrl: p.locationUrl ?? ev.locationUrl,
      meetingUrl: p.meeting_url || p.onlineMeetingLink || ev.meetingUrl,
      bannerUrls: p.banner_urls || p.bannerUrls || ev.bannerUrls,
      bannerUrl: p.banner_urls?.[0] || p.bannerUrls?.[0] || p.bannerUrl || ev.bannerUrl,
      templateId: String(p.selected_template || p.selectedTemplate || p.templateId || p.template_id || ev.templateId || '1'),
      approvalStatus: 'WAITING',
    };

    if (p.ticket_tiers || p.tickets) {
      const pTiers = p.ticket_tiers || p.tickets;
      displayCats = pTiers.map((t: any, i: number) => {
        const rawId = t.ticket_id || t.id || t.category_id_ref || `tier-pending-${i}`;
        const existingCat = (cats || []).find(c => c.id === rawId || c.name === (t.ticket_name || t.name));
        const sold = existingCat?.ticketsSold || 0;
        const stock = Number(t.ticket_stock ?? t.stock ?? 100);
        return {
          id: rawId,
          eventId: ev.id,
          name: t.ticket_name || t.name || `Tiket ${i + 1}`,
          type: t.ticket_type || t.type || 'Normal',
          description: t.ticket_description || t.description || '',
          price: Number(t.ticket_price ?? t.price ?? 0),
          maxPrice: Number(t.ticket_normal_price ?? t.normalPrice ?? t.maxPrice ?? t.price ?? 0),
          discountedPrice: t.ticket_discounted_price ? Number(t.ticket_discounted_price) : (t.discountedPrice ? Number(t.discountedPrice) : null),
          isPromoActive: (t.is_promo_active || t.isPromoActive) ? 1 : 0,
          stock,
          ticketsSold: sold,
          status: sold >= stock ? 'sold_out' : 'available',
          isAvailable: 1,
          order: i,
        };
      });
    }
  }

  const ticketTypesCount = displayCats.length;
  const totalTickets = displayCats.reduce((sum, cat) => sum + (cat.stock || 0), 0);
  const ticketsSold = displayCats.reduce((sum, cat) => sum + (cat.ticketsSold || 0), 0);
  const remainingTickets = Math.max(0, totalTickets - ticketsSold);

  const ticketDetails = displayCats.map(cat => ({
    id: cat.id,
    name: cat.name,
    category: cat.name,
    stock: cat.stock || 0,
    remainingStock: Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0)),
    remaining_stock: Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0)),
    price: cat.price || 0,
    normalPrice: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
    maxPrice: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
    ticket_normal_price: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
    discountedPrice: cat.discountedPrice || null,
    description: cat.description || '',
    type: cat.type || 'Normal',
    isPromoActive: Boolean(cat.isPromoActive),
    ticketsSold: cat.ticketsSold || 0,
    status: cat.status || 'available',
  }));

  const ticketTiers = displayCats.map(cat => ({
    ticket_id: cat.id,
    ticket_name: cat.name,
    ticket_type: cat.type || 'Normal',
    ticket_stock: cat.stock || 0,
    remaining_stock: Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0)),
    remainingStock: Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0)),
    category_id_ref: cat.id,
    ticket_description: cat.description || '',
    ticket_price: cat.price || 0,
    is_promo_active: Boolean(cat.isPromoActive),
    ticket_normal_price: cat.maxPrice || cat.price,
    ticket_discounted_price: cat.discountedPrice || null,
    // Aliases
    id: cat.id,
    name: cat.name,
    category: cat.name,
    stock: cat.stock || 0,
    price: cat.price || 0,
    discountedPrice: cat.discountedPrice || null,
    description: cat.description || '',
  }));

  const ticketGroups = displayCats.length > 0
    ? displayCats.map((cat, idx) => {
        const stock = Number(cat.stock || 0);
        const sold = Number(cat.ticketsSold || 0);
        const remaining = Math.max(0, stock - sold);
        const isSoldOut = stock > 0 ? remaining <= 0 : false;
        const percentageSold = stock > 0 ? Math.min(100, Math.round((sold / stock) * 100)) : 0;
        const percentageRemaining = stock > 0 ? Math.max(0, 100 - percentageSold) : 0;

        return {
          id: cat.id || `category-${idx + 1}`,
          categoryName: cat.categoryName || cat.name || `[Kategori Tiket ${idx + 1}]`,
          category_name: cat.categoryName || cat.name || `[Kategori Tiket ${idx + 1}]`,
          tickets: [
            {
              id: cat.id,
              name: cat.name || `Tiket ${idx + 1}`,
              type: cat.type || 'Normal',
              description: cat.description || 'Akses penuh hadir langsung + makan siang',
              price: Number(cat.price || 0),
              normalPrice: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
              maxPrice: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
              ticket_normal_price: Number(cat.maxPrice || cat.normalPrice || cat.price || 0),
              discountedPrice: cat.discountedPrice || null,
              priceDisplay: `Rp ${Number(cat.price || 0).toLocaleString('id-ID')}`,
              price_display: `Rp ${Number(cat.price || 0).toLocaleString('id-ID')}`,
              stock,
              ticketsSold: sold,
              tickets_sold: sold,
              remainingStock: remaining,
              remaining_stock: remaining,
              isSoldOut,
              is_sold_out: isSoldOut,
              percentageSold,
              percentage_sold: percentageSold,
              percentageRemaining,
              percentage_remaining: percentageRemaining,
              status: isSoldOut ? 'sold_out' : (cat.status || 'available')
            }
          ]
        };
      })
    : [];

  const bannerUrls = displayEv.bannerUrls && displayEv.bannerUrls.length > 0
    ? displayEv.bannerUrls
    : (displayEv.bannerUrl ? [displayEv.bannerUrl] : []);

  let approvalStatus = (displayEv.approvalStatus || 'DRAFT').toUpperCase();
  if (approvalStatus === 'REQUESTED') approvalStatus = 'WAITING';

  const defaultTerms = `Terms and Conditions for Music Event
• Event Details: The music event will take place on ${displayEv.startDate || 'tanggal event'} at ${displayEv.location || 'venue'}.
• Tickets: Tickets are non-refundable and must be presented at the entrance.
• Age Restrictions: Attendees must be 18 years old or older.
• Conduct: Attendees are expected to behave respectfully. Disruptive behavior may result in removal from the event.
• Liability: The organizers are not liable for any personal injury or loss of property during the event.
• Photography: By attending, you consent to being photographed or recorded for promotional purposes.
• Changes: The organizers reserve the right to change the lineup or schedule without prior notice.
• Contact: For inquiries, contact us via organizer support.

By purchasing a ticket, you agree to these terms.`;

  return {
    id: displayEv.id,
    name: displayEv.name,
    event_name: displayEv.name,
    date: displayEv.startDate || '',
    start_date: displayEv.startDate || '',
    startDate: displayEv.startDate || '',
    end_date: displayEv.endDate || '',
    endDate: displayEv.endDate || '',
    is_one_day_event: Boolean(displayEv.isOneDayEvent),
    isOneDayEvent: Boolean(displayEv.isOneDayEvent),
    event_start_time: displayEv.startTime || '06:00',
    startTime: displayEv.startTime || '06:00',
    timezone: displayEv.timezone || 'WIB',
    type: displayEv.eventType || 'Offline Event',
    event_type: displayEv.eventType || 'Offline Event',
    event_format: displayEv.eventFormat || 'offline',
    format: displayEv.eventFormat || 'offline',
    category: displayEv.category || 'Lari / Sports',
    event_category: displayEv.category || 'Lari / Sports',
    entry_mode: displayEv.entryMode || 'manual',
    entryMode: displayEv.entryMode || 'manual',
    external_provider: displayEv.externalProvider || '',
    externalProvider: displayEv.externalProvider || '',
    external_url: displayEv.externalUrl || '',
    externalUrl: displayEv.externalUrl || '',
    description: displayEv.description || '',
    terms_and_conditions: displayEv.termsAndConditions || defaultTerms,
    termsAndConditions: displayEv.termsAndConditions || defaultTerms,
    banner_urls: bannerUrls,
    bannerUrls: bannerUrls,
    bannerUrl: bannerUrls[0] || '',
    images: displayEv.images || [],
    themeColor: displayEv.themeColor || '#FFFFFF',
    location: displayEv.location || '',
    location_name: displayEv.location || '',
    venueLocation: displayEv.location || '',
    venue_location: displayEv.location || '',
    locationAddress: displayEv.locationAddress || '',
    locationUrl: displayEv.locationUrl || '',
    meeting_url: displayEv.meetingUrl || '',
    onlineMeetingLink: displayEv.meetingUrl || '',
    online_meeting_link: displayEv.meetingUrl || '',
    seatingPlanUrl: displayEv.seatingPlanUrl || '',
    price: displayEv.price || (displayCats.length ? Math.min(...displayCats.map(c => c.price)) : 0),
    is_payment_enabled: Boolean(displayEv.isPaymentEnabled),
    isPaymentEnabled: Boolean(displayEv.isPaymentEnabled),
    payment_channels: displayEv.paymentChannels || ['bni_va'],
    paymentChannels: displayEv.paymentChannels || ['bni_va'],
    fee_payer: displayEv.feePayer || 'customer',
    feePayer: displayEv.feePayer || 'customer',
    payment_method: displayEv.paymentMethod || 'Transfer',
    paymentMethod: displayEv.paymentMethod || 'Transfer',
    bni_account_number: displayEv.accountNumberBNI || '2132134142342',
    accountNumberBNI: displayEv.accountNumberBNI || '2132134142342',
    selected_template: String(displayEv.templateId || '1'),
    selectedTemplate: String(displayEv.templateId || '1'),
    templateId: String(displayEv.templateId || '1'),
    template_id: String(displayEv.templateId || '1'),
    templateSelection: typeof displayEv.templateId === 'string' && displayEv.templateId.startsWith('template-') ? displayEv.templateId : `Template ${displayEv.templateId || 1}`,
    template_selection: typeof displayEv.templateId === 'string' && displayEv.templateId.startsWith('template-') ? displayEv.templateId : `Template ${displayEv.templateId || 1}`,
    templateConfig: displayEv.templateConfig || eventTemplatesMap[String(displayEv.templateId || '1')] || eventTemplatesMap[`template-${displayEv.templateId || '1'}`] || null,
    templateSchema: displayEv.templateConfig || eventTemplatesMap[String(displayEv.templateId || '1')] || eventTemplatesMap[`template-${displayEv.templateId || '1'}`] || null,
    templates: displayEv.templates || {
      index: { id: displayEv.templateId || 1, title: 'Event Detail', bannerUrl: bannerUrls[0] || '' },
      bookTicket: { id: 2, title: 'Select Ticket', bannerUrl: bannerUrls[0] || '' },
      visitorList: { id: 3, title: 'Attendee List', bannerUrl: bannerUrls[0] || '' },
      visitorInput: { id: 4, title: 'Attendee Form', bannerUrl: bannerUrls[0] || '' }
    },
    socials: displayEv.socials || {},
    vendorConfig: displayEv.vendorConfig || { purchaseMode: 'single' },
    tickets: ticketDetails,
    ticket_tiers: ticketTiers,
    ticketGroups,
    ticket_groups: ticketGroups,
    categories: ticketGroups,
    ticketTypesCount,
    ticket_types_count: ticketTypesCount,
    totalTickets,
    total_tickets: totalTickets,
    ticketsSold,
    tickets_sold: ticketsSold,
    remainingTickets,
    remaining_tickets: remainingTickets,
    remainingStock: remainingTickets,
    remaining_stock: remainingTickets,
    isActive: Boolean(displayEv.isActive),
    is_active: Boolean(displayEv.isActive),
    approvalStatus,
    approval_status: approvalStatus,
    submission_option: displayEv.submissionOption || 'draft',
    submissionOption: displayEv.submissionOption || 'draft',
    submittedDate: displayEv.submittedDate || null,
    submitted_date: displayEv.submittedDate || null,
    reviewedDate: displayEv.reviewedDate || displayEv.createdAt || null,
    reviewed_date: displayEv.reviewedDate || displayEv.createdAt || null,
    savedDate: displayEv.savedDate || null,
    saved_date: displayEv.savedDate || null,
    rejectionNote: displayEv.rejectionNote || null,
    rejection_note: displayEv.rejectionNote || null,
    comments: displayEv.comments || [],
    pendingData: ev.pendingData || null,
    pending_data: ev.pendingData || null,
    views_detail: displayEv.viewsDetail || 0,
    viewsDetail: displayEv.viewsDetail || 0,
    views_confirm: displayEv.viewsConfirm || 0,
    viewsConfirm: displayEv.viewsConfirm || 0,
    created_at: displayEv.createdAt,
    createdAt: displayEv.createdAt,
    updated_at: displayEv.updatedAt,
    updatedAt: displayEv.updatedAt,
  };
}

// ----------------------------------------------------------------------
// GET /api/v1/events - List events (SCOPED STRICTLY TO AUTHENTICATED TENANT)
// ----------------------------------------------------------------------
eventRoutes.get('/', async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
  }

  const statusParam = c.req.query('status');
  const categoryParam = c.req.query('category');
  const searchParam = c.req.query('search');

  const conditions: any[] = [];

  // Tenant / Vendor only sees their own events
  if (user.role !== 'admin') {
    conditions.push(eq(events.userId, user.sub));
  }

  if (statusParam && statusParam !== 'ALL') {
    const statusUpper = statusParam.toUpperCase();
    const statusLower = statusParam.toLowerCase();
    conditions.push(sql`(${events.approvalStatus} = ${statusUpper} OR ${events.approvalStatus} = ${statusLower})`);
  }

  if (categoryParam && categoryParam !== 'all') {
    conditions.push(sql`LOWER(${events.category}) LIKE ${'%' + categoryParam.toLowerCase() + '%'}`);
  }

  if (searchParam) {
    conditions.push(sql`LOWER(${events.name}) LIKE ${'%' + searchParam.toLowerCase() + '%'}`);
  }

  const whereClause = conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions);

  const eventList = await db.query.events.findMany({
    where: whereClause,
    orderBy: [desc(events.createdAt)],
    with: {
      ticketCategories: {
        with: { tickets: true }
      }
    }
  });

  const formatted = eventList.map(ev => formatEventDetail(ev, ev.ticketCategories));
  return c.json(formatted);
});

// ----------------------------------------------------------------------
// GET /api/v1/events/:id - Get single event detail (SCOPED TO TENANT)
// ----------------------------------------------------------------------
eventRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
  }

  const ev = await db.query.events.findFirst({
    where: user.role === 'admin'
      ? eq(events.id, id)
      : and(eq(events.id, id), eq(events.userId, user.sub)),
    with: {
      ticketCategories: {
        with: { tickets: true }
      }
    }
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan atau Anda tidak memiliki akses' }, 404);
  }

  const formatted = formatEventDetail(ev, ev.ticketCategories);
  return c.json(formatted);
});

// ----------------------------------------------------------------------
// Helper to save ticket tiers (Safe Upsert)
// ----------------------------------------------------------------------
export async function saveTicketTiers(eventId: string, tiers: any[]) {
  if (!tiers || !Array.isArray(tiers)) return;

  const existingCategories = await db.query.ticketCategories.findMany({
    where: eq(ticketCategories.eventId, eventId),
  });

  const incomingIds = new Set<string>();

  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const rawId = t.ticket_id || t.id || t.category_id_ref;
    const name = t.ticket_name || t.name || `Tiket ${i + 1}`;
    const priceNum = Math.round(Number(t.ticket_price ?? t.price ?? 0));
    const maxPriceNum = Math.round(Number(t.ticket_normal_price ?? t.normalPrice ?? t.maxPrice ?? priceNum));
    const rawDisc = t.ticket_discounted_price ?? t.discountedPrice;
    const discountedPriceNum = (rawDisc !== undefined && rawDisc !== null && rawDisc !== '' && !isNaN(Number(rawDisc)))
      ? Math.round(Number(rawDisc))
      : null;
    const stockNum = Math.round(Number(t.ticket_stock ?? t.stock ?? 100));
    const description = String(t.ticket_description || t.description || '');
    const type = String(t.ticket_type || t.type || 'Normal');
    const isPromoActive = (t.is_promo_active || t.isPromoActive) ? 1 : 0;

    const existingCat = existingCategories.find(c => (rawId && c.id === rawId) || c.name === name);
    let catId: string;
    if (existingCat?.id) {
      catId = existingCat.id;
    } else if (rawId) {
      const existingGlobal = await db.query.ticketCategories.findFirst({
        where: eq(ticketCategories.id, rawId),
      });
      catId = existingGlobal ? `${rawId}-${crypto.randomUUID().slice(0, 8)}` : rawId;
    } else {
      catId = crypto.randomUUID();
    }
    incomingIds.add(catId);

    if (existingCat) {
      const sold = existingCat.ticketsSold || 0;
      await db.update(ticketCategories).set({
        name,
        type,
        description,
        price: priceNum,
        maxPrice: maxPriceNum,
        discountedPrice: discountedPriceNum,
        isPromoActive,
        stock: stockNum,
        status: sold >= stockNum ? 'sold_out' : 'available',
        isAvailable: 1,
        order: i,
        updatedAt: new Date().toISOString(),
      }).where(eq(ticketCategories.id, existingCat.id));

      const existingTix = await db.query.tickets.findFirst({
        where: eq(tickets.categoryId, existingCat.id),
      });

      if (existingTix) {
        await db.update(tickets).set({
          name,
          description,
          price: priceNum,
          normalPrice: maxPriceNum,
          discountedPrice: discountedPriceNum,
          stock: stockNum,
          isAvailable: 1,
          order: i,
          updatedAt: new Date().toISOString(),
        }).where(eq(tickets.id, existingTix.id));
      } else {
        await db.insert(tickets).values({
          id: crypto.randomUUID(),
          categoryId: existingCat.id,
          name,
          description,
          type: 'normal',
          price: priceNum,
          normalPrice: maxPriceNum,
          discountedPrice: discountedPriceNum,
          stock: stockNum,
          isAvailable: 1,
          order: i,
        });
      }
    } else {
      await db.insert(ticketCategories).values({
        id: catId,
        eventId,
        name,
        type,
        description,
        price: priceNum,
        maxPrice: maxPriceNum,
        discountedPrice: discountedPriceNum,
        isPromoActive,
        stock: stockNum,
        ticketsSold: 0,
        status: 'available',
        isAvailable: 1,
        order: i,
      });

      await db.insert(tickets).values({
        id: crypto.randomUUID(),
        categoryId: catId,
        name,
        description,
        type: 'normal',
        price: priceNum,
        normalPrice: maxPriceNum,
        discountedPrice: discountedPriceNum,
        stock: stockNum,
        isAvailable: 1,
        order: i,
      });
    }
  }

  // Handle removed categories safely (do not delete if referenced in issued_tickets)
  for (const oldCat of existingCategories) {
    if (!incomingIds.has(oldCat.id)) {
      const hasIssued = await db.query.issuedTickets.findFirst({
        where: eq(issuedTickets.ticketCategoryId, oldCat.id),
      });
      if (!hasIssued) {
        await db.delete(tickets).where(eq(tickets.categoryId, oldCat.id));
        await db.delete(ticketCategories).where(eq(ticketCategories.id, oldCat.id));
      } else {
        await db.update(ticketCategories).set({ isAvailable: 0, status: 'sold_out' }).where(eq(ticketCategories.id, oldCat.id));
      }
    }
  }
}

// ----------------------------------------------------------------------
// POST /api/v1/events - Create new event (SCOPED TO TENANT)
// ----------------------------------------------------------------------
eventRoutes.post('/', async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
  }

  try {
    const body = await c.req.json();

    const id = body.id || crypto.randomUUID();
    const name = body.event_name || body.name || 'Event Baru';
    const category = body.event_category || body.category || 'Lari / Sports';
    const eventType = body.type || body.event_type || 'Offline Event';
    const eventFormat = body.event_format || body.format || 'offline';
    const entryMode = body.entry_mode || body.entryMode || 'manual';
    const externalProvider = body.external_provider || body.externalProvider || '';
    const externalUrl = body.external_url || body.externalUrl || '';
    const description = body.description || '';
    const termsAndConditions = body.terms_and_conditions || body.termsAndConditions || '';
    
    const bannerUrls = Array.isArray(body.banner_urls)
      ? body.banner_urls
      : (Array.isArray(body.bannerUrls) ? body.bannerUrls : (body.bannerUrl ? [body.bannerUrl] : []));
    const bannerUrl = bannerUrls[0] || body.bannerUrl || '';

    const startDate = body.start_date || body.startDate || new Date().toISOString().split('T')[0];
    const endDate = body.end_date || body.endDate || startDate;
    const isOneDayEvent = body.is_one_day_event || body.isOneDayEvent ? 1 : 0;
    const startTime = body.event_start_time || body.startTime || '06:00';
    const timezone = body.timezone || 'WIB';
    const location = body.location_name || body.location || body.venueLocation || '';
    const locationAddress = body.locationAddress || '';
    const locationUrl = body.locationUrl || '';
    const meetingUrl = body.meeting_url || body.onlineMeetingLink || '';
    const isPaymentEnabled = body.is_payment_enabled !== false ? 1 : 0;
    
    const paymentChannels = Array.isArray(body.payment_channels)
      ? body.payment_channels
      : (Array.isArray(body.paymentChannels) ? body.paymentChannels : ['bni_va']);
    
    const feePayer = body.fee_payer || body.feePayer || 'customer';
    const paymentMethod = body.payment_method || body.paymentMethod || 'VA';
    const accountNumberBNI = body.bni_account_number || body.accountNumberBNI || '';
    const templateId = String(body.selected_template || body.selectedTemplate || body.templateId || body.template_id || '1');
    const submissionOption = body.submission_option || body.submissionOption || 'draft';
    const approvalStatus = submissionOption === 'review' ? 'WAITING' : (body.approval_status || body.approvalStatus || 'DRAFT');

    const ticketTiers = body.ticket_tiers || body.tickets || [];
    const lowestPrice = ticketTiers.length
      ? Math.min(...ticketTiers.map((t: any) => Number(t.ticket_price ?? t.price ?? 0)))
      : Number(body.price || 0);

    await db.insert(events).values({
      id,
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
      userId: user.sub,
      isActive: 0,
      approvalStatus: approvalStatus as any,
      submissionOption,
      submittedDate: submissionOption === 'review' ? new Date().toISOString() : null,
      savedDate: new Date().toISOString(),
      comments: [],
    });

    try {
      await saveTicketTiers(id, ticketTiers);
    } catch (saveTierErr: any) {
      // Rollback newly inserted event so orphaned draft rows are not left in DB
      await db.delete(events).where(eq(events.id, id));
      throw saveTierErr;
    }

    const created = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: { ticketCategories: { with: { tickets: true } } }
    });

    return c.json({
      success: true,
      message: 'Event berhasil dibuat',
      data: formatEventDetail(created, created?.ticketCategories || [])
    }, 201);
  } catch (error: any) {
    console.error('[EventRoutes] Error creating event:', error);
    return c.json({
      error: 'Failed to create event',
      message: error?.message || 'Terjadi kesalahan saat membuat event',
      details: error?.message
    }, 500);
  }
});

// ----------------------------------------------------------------------
// PUT /api/v1/events/:id - Update event (SCOPED TO TENANT)
// ----------------------------------------------------------------------
eventRoutes.put('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized: Harap login terlebih dahulu' }, 401);
  }

  try {
    const body = await c.req.json();

    const existing = await db.query.events.findFirst({
      where: user.role === 'admin'
        ? eq(events.id, id)
        : and(eq(events.id, id), eq(events.userId, user.sub)),
    });

    if (!existing) {
      return c.json({ error: 'Event tidak ditemukan atau Anda tidak memiliki akses' }, 404);
    }

    const submissionOption = body.submission_option || body.submissionOption || existing.submissionOption;
    const isCurrentlyApproved = (existing.approvalStatus || '').toUpperCase() === 'APPROVED' || existing.reviewedDate !== null;
    const isRequestingReview = submissionOption === 'review';

    const name = body.event_name || body.name || existing.name;
    const category = body.event_category || body.category || existing.category;
    const eventType = body.type || body.event_type || existing.eventType;
    const eventFormat = body.event_format || body.format || existing.eventFormat;
    const entryMode = body.entry_mode || existing.entryMode;
    const externalProvider = body.external_provider ?? existing.externalProvider;
    const externalUrl = body.external_url ?? existing.externalUrl;
    const description = body.description ?? existing.description;
    const termsAndConditions = body.terms_and_conditions || body.termsAndConditions || existing.termsAndConditions;
    const bannerUrls = body.banner_urls || body.bannerUrls || existing.bannerUrls;
    const bannerUrl = bannerUrls?.[0] || body.bannerUrl || existing.bannerUrl;
    const startDate = body.start_date || body.startDate || existing.startDate;
    const endDate = body.end_date || body.endDate || existing.endDate;
    const isOneDayEvent = body.is_one_day_event !== undefined ? (body.is_one_day_event ? 1 : 0) : existing.isOneDayEvent;
    const startTime = body.event_start_time || body.startTime || existing.startTime;
    const timezone = body.timezone || existing.timezone;
    const location = body.location_name || body.location || body.venueLocation || existing.location;
    const locationAddress = body.locationAddress ?? existing.locationAddress;
    const locationUrl = body.locationUrl ?? existing.locationUrl;
    const meetingUrl = body.meeting_url || body.onlineMeetingLink || existing.meetingUrl;
    const isPaymentEnabled = body.is_payment_enabled !== undefined ? (body.is_payment_enabled ? 1 : 0) : existing.isPaymentEnabled;
    const paymentChannels = body.payment_channels || body.paymentChannels || existing.paymentChannels;
    const feePayer = body.fee_payer || body.feePayer || existing.feePayer;
    const paymentMethod = body.payment_method || body.paymentMethod || existing.paymentMethod;
    const accountNumberBNI = body.bni_account_number || body.accountNumberBNI || existing.accountNumberBNI;
    const templateId = body.selected_template !== undefined
      ? String(body.selected_template)
      : (body.selectedTemplate !== undefined
        ? String(body.selectedTemplate)
        : (body.templateId !== undefined
          ? String(body.templateId)
          : (body.template_id !== undefined
            ? String(body.template_id)
            : existing.templateId)));

    const ticketTiers = body.ticket_tiers || body.tickets;
    let lowestPrice = existing.price;
    if (ticketTiers?.length) {
      lowestPrice = Math.min(...ticketTiers.map((t: any) => Number(t.ticket_price ?? t.price ?? 0)));
    }

    if (isCurrentlyApproved && isRequestingReview) {
      // 1. Stage the edits in pendingData so live data in Mini Program remains intact with old data
      await db.update(events).set({
        pendingData: body,
        approvalStatus: 'WAITING',
        submissionOption: 'review',
        submittedDate: new Date().toISOString(),
        rejectionNote: null,
        savedDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).where(eq(events.id, id));
    } else {
      // 2. Direct update for drafts or new unapproved events
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
        approvalStatus: isRequestingReview ? 'WAITING' : (body.approval_status || existing.approvalStatus || 'DRAFT'),
        submissionOption,
        submittedDate: isRequestingReview ? new Date().toISOString() : existing.submittedDate,
        savedDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pendingData: null,
      }).where(eq(events.id, id));

      if (ticketTiers) {
        await saveTicketTiers(id, ticketTiers);
      }
    }

    const updated = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: { ticketCategories: { with: { tickets: true } } }
    });

    return c.json({
      success: true,
      message: isCurrentlyApproved && isRequestingReview
        ? 'Perubahan event berhasil disimpan dan diajukan ke Admin untuk ditinjau (Live Mini Program tetap menampilkan data saat ini hingga disetujui)'
        : 'Event berhasil diperbarui',
      data: formatEventDetail(updated, updated?.ticketCategories || [])
    });
  } catch (err: any) {
    console.error('Error updating event:', err);
    return c.json({ error: `Gagal memperbarui event: ${err.message || 'Internal Server Error'}` }, 500);
  }
});

// ----------------------------------------------------------------------
// POST /api/v1/events/:id/review - Review Event (Admin only)
// ----------------------------------------------------------------------
eventRoutes.post('/:id/review', async (c) => {
  const user = await getAuthUser(c);
  if (!user || user.role !== 'admin') {
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
      const templateId = p.selected_template !== undefined
        ? String(p.selected_template)
        : (p.selectedTemplate !== undefined
          ? String(p.selectedTemplate)
          : (p.templateId !== undefined
            ? String(p.templateId)
            : (p.template_id !== undefined
              ? String(p.template_id)
              : ev.templateId)));

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
      data: formatEventDetail(updated, updated?.ticketCategories || [])
    });
  } else {
    await db.update(events).set({
      approvalStatus: 'REJECTED',
      rejectionNote: rejectionNote || 'Event ditolak oleh Administrator.',
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
      data: formatEventDetail(updated, updated?.ticketCategories || [])
    });
  }
});

// ----------------------------------------------------------------------
// POST /api/v1/events/:id/submit-review (SCOPED TO TENANT)
// ----------------------------------------------------------------------
eventRoutes.post('/:id/submit-review', async (c) => {
  const id = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const existing = await db.query.events.findFirst({
    where: user.role === 'admin'
      ? eq(events.id, id)
      : and(eq(events.id, id), eq(events.userId, user.sub)),
  });

  if (!existing) {
    return c.json({ error: 'Event tidak ditemukan atau Anda tidak memiliki akses' }, 404);
  }

  await db.update(events).set({
    approvalStatus: 'WAITING' as any,
    submissionOption: 'review',
    submittedDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }).where(eq(events.id, id));

  const updated = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: { ticketCategories: { with: { tickets: true } } }
  });

  return c.json({
    success: true,
    message: 'Event berhasil diajukan untuk ditinjau',
    data: formatEventDetail(updated, updated?.ticketCategories || [])
  });
});

// ----------------------------------------------------------------------
// PATCH /api/v1/events/:id/live-status (ONLY ALLOWED IF APPROVED)
// ----------------------------------------------------------------------
eventRoutes.patch('/:id/live-status', async (c) => {
  const id = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const existing = await db.query.events.findFirst({
    where: user.role === 'admin'
      ? eq(events.id, id)
      : and(eq(events.id, id), eq(events.userId, user.sub)),
  });

  if (!existing) {
    return c.json({ error: 'Event tidak ditemukan atau Anda tidak memiliki akses' }, 404);
  }

  const body = await c.req.json();
  const wantActive = Boolean(body.isActive);

  // VALIDATION: Tombol switch activate hanya dapat ditekan/diaktifkan ketika sudah disetujui (APPROVED)
  let statusUpper = (existing.approvalStatus || '').toUpperCase();
  if (statusUpper === 'REQUESTED') statusUpper = 'WAITING';

  if (wantActive && statusUpper !== 'APPROVED') {
    return c.json({
      error: 'Event belum dapat diaktifkan. Tombol aktifasi hanya dapat digunakan setelah event disetujui (Approved) oleh Super Admin.'
    }, 400);
  }

  await db.update(events).set({
    isActive: wantActive ? 1 : 0,
    updatedAt: new Date().toISOString()
  }).where(eq(events.id, id));

  return c.json({
    success: true,
    message: `Status live event berhasil diubah menjadi ${wantActive ? 'Aktif' : 'Nonaktif'}`,
    data: { id, isActive: wantActive }
  });
});

// ----------------------------------------------------------------------
// DELETE /api/v1/events/:id (SCOPED TO TENANT)
// ----------------------------------------------------------------------
eventRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const deleted = await db.delete(events)
    .where(user.role === 'admin' ? eq(events.id, id) : and(eq(events.id, id), eq(events.userId, user.sub)))
    .returning();

  if (!deleted.length) {
    return c.json({ error: 'Event tidak ditemukan atau Anda tidak memiliki akses' }, 404);
  }

  return c.json({ success: true, message: 'Event berhasil dihapus', data: { id } });
});

// ----------------------------------------------------------------------
// GET /api/v1/events/:id/sales-summary - Event sales metrics & daily report (SCOPED)
// ----------------------------------------------------------------------
eventRoutes.get('/:id/sales-summary', async (c) => {
  const eventId = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const ev = await db.query.events.findFirst({
    where: user.role === 'admin' ? eq(events.id, eventId) : and(eq(events.id, eventId), eq(events.userId, user.sub)),
    with: { ticketCategories: true }
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan' }, 404);
  }

  const orders = await db.query.serviceOrders.findMany({
    where: and(eq(serviceOrders.serviceId, eventId), eq(serviceOrders.status, 'completed'))
  });

  const dbRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const dbTicketsSold = orders.reduce((sum, ord) => sum + (ord.quantity || 1), 0);
  const totalStock = ev.ticketCategories.reduce((sum, c) => sum + (c.stock || 0), 0);
  
  const ticketsSold = dbTicketsSold;
  const totalRevenue = dbRevenue;
  const remainingStock = Math.max(0, totalStock - ticketsSold);
  const transactionsCount = orders.length;
  const attendanceRate = totalStock > 0 ? `${((ticketsSold / totalStock) * 100).toFixed(1)}%` : '0.0%';

  const revenueDisplay = dbRevenue >= 1_000_000_000
    ? `Rp ${(dbRevenue / 1_000_000_000).toFixed(1)} M`
    : dbRevenue >= 1_000_000
    ? `Rp ${(dbRevenue / 1_000_000).toFixed(1)} jt`
    : `Rp ${dbRevenue.toLocaleString('id-ID')}`;

  const dailySales = orders.length > 0 ? [
    { date: "01 Oct 2026", amount: Math.round(totalRevenue * 0.15), tickets: Math.round(ticketsSold * 0.15) },
    { date: "05 Oct 2026", amount: Math.round(totalRevenue * 0.25), tickets: Math.round(ticketsSold * 0.25) },
    { date: "10 Oct 2026", amount: Math.round(totalRevenue * 0.35), tickets: Math.round(ticketsSold * 0.35) },
    { date: "15 Oct 2026", amount: Math.round(totalRevenue * 0.25), tickets: Math.round(ticketsSold * 0.25) },
  ] : [];

  return c.json({
    event_id: ev.id,
    eventId: ev.id,
    event_name: ev.name,
    eventName: ev.name,
    event_date: ev.startDate,
    eventDate: ev.startDate,
    start_date: ev.startDate,
    end_date: ev.endDate,
    event_format: ev.eventFormat,
    event_type: ev.eventType,
    eventType: ev.eventType,
    location_name: ev.location,
    venue: ev.location,
    is_active: Boolean(ev.isActive),
    isActive: Boolean(ev.isActive),
    total_revenue: totalRevenue,
    totalRevenue,
    revenue_display: revenueDisplay,
    revenueDisplay,
    tickets_sold: ticketsSold,
    ticketsSold,
    total_stock: totalStock,
    totalStock,
    remaining_stock: remainingStock,
    remainingStock,
    transactions_count: transactionsCount,
    transactionsCount,
    attendance_rate: attendanceRate,
    attendanceRate,
    daily_sales: dailySales,
    dailySales,
  });
});

// ----------------------------------------------------------------------
// GET /api/v1/events/:id/attendees (SCOPED)
// ----------------------------------------------------------------------
eventRoutes.get('/:id/attendees', async (c) => {
  const eventId = c.req.param('id');
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const ev = await db.query.events.findFirst({
    where: user.role === 'admin' ? eq(events.id, eventId) : and(eq(events.id, eventId), eq(events.userId, user.sub))
  });

  if (!ev) {
    return c.json({ error: 'Event tidak ditemukan' }, 404);
  }

  const statusParam = c.req.query('status');
  const searchParam = c.req.query('search');

  const conditions: any[] = [eq(issuedTickets.eventId, eventId)];

  if (statusParam && statusParam !== 'ALL') {
    conditions.push(eq(issuedTickets.status, statusParam.toUpperCase()));
  }

  if (searchParam) {
    conditions.push(sql`(LOWER(${issuedTickets.participantName}) LIKE ${'%' + searchParam.toLowerCase() + '%'} OR LOWER(${issuedTickets.buyerName}) LIKE ${'%' + searchParam.toLowerCase() + '%'} OR ${issuedTickets.nik} LIKE ${'%' + searchParam + '%'})`);
  }

  const attendeesList = await db.query.issuedTickets.findMany({
    where: and(...conditions),
    orderBy: [desc(issuedTickets.createdAt)]
  });

  const formattedAttendees = attendeesList.map(a => ({
    id: a.id,
    order_id: a.orderId || '',
    orderId: a.orderId || '',
    participant_name: a.participantName,
    participantName: a.participantName,
    nik: a.nik,
    ticket_name: a.ticketName || 'Tiket Masuk',
    ticketName: a.ticketName || 'Tiket Masuk',
    ticket_category: a.ticketCategory || 'Regular',
    ticketCategory: a.ticketCategory || 'Regular',
    category_id_ref: a.ticketCategoryId || '',
    buyer_name: a.buyerName || a.participantName,
    buyerName: a.buyerName || a.participantName,
    buyer_phone: a.buyerPhone || a.phone || '',
    buyerPhone: a.buyerPhone || a.phone || '',
    ticket_quantity: a.ticketQuantity || 1,
    ticketQuantity: a.ticketQuantity || 1,
    ticket_index: a.ticketIndex || 1,
    ticketIndex: a.ticketIndex || 1,
    nominal: a.nominal || 0,
    status: a.status as any,
    purchase_date: a.purchaseDate || a.createdAt || '',
    purchaseDate: a.purchaseDate || a.createdAt || '',
  }));

  let combinedAttendees = formattedAttendees;

  if (statusParam && statusParam !== 'ALL') {
    combinedAttendees = combinedAttendees.filter(a => a.status.toUpperCase() === statusParam.toUpperCase());
  }

  if (searchParam) {
    const q = searchParam.toLowerCase();
    combinedAttendees = combinedAttendees.filter(a =>
      a.participantName.toLowerCase().includes(q) ||
      a.buyerName.toLowerCase().includes(q) ||
      a.nik.includes(searchParam) ||
      a.ticketName.toLowerCase().includes(q)
    );
  }

  const successCount = combinedAttendees.filter(a => a.status === 'COMPLETED' || (a.status as string) === 'CHECKED_IN').length;
  const pendingCount = combinedAttendees.filter(a => a.status === 'PENDING').length;
  const canceledCount = combinedAttendees.filter(a => a.status === 'REFUND' || (a.status as string) === 'CANCELED').length;

  return c.json({
    event_id: eventId,
    eventId,
    total_attendees: combinedAttendees.length,
    totalAttendees: combinedAttendees.length,
    attendees: combinedAttendees,
    summary: {
      success_count: successCount,
      successCount,
      pending_count: pendingCount,
      pendingCount,
      canceled_count: canceledCount,
      canceledCount,
    }
  });
});
