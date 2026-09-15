import { Hono } from 'hono';
import { db } from '../db';
import { and, desc, eq, sql } from 'drizzle-orm';
import { cafesRestaurants, events, hotels, rentals, umkms } from '../db/schema';
import { getSingleTemplate } from './templates';

export const lifestyleRoutes = new Hono();

const strip = (item: any) => {
  const { pendingData: _p, comments: _c, ...rest } = item;
  return rest;
};

const isRunningCategoryOrName = (cat: string = '', name: string = '') => {
  const c = (cat || '').toLowerCase();
  const n = (name || '').toLowerCase();
  return (
    c.includes('lari') ||
    c.includes('run') ||
    c.includes('sport') ||
    c.includes('olahraga') ||
    c.includes('marathon') ||
    n.includes('lari') ||
    n.includes('run') ||
    n.includes('marathon')
  );
};

lifestyleRoutes.get('/v1/menu', async (c) => {
  const active = (col: any) => eq(col.isActive, 1);
  const userEvents = await db.query.events.findMany({ where: active(events) });
  const userHotels = await db.query.hotels.findMany({ where: active(hotels) });
  const userCafeRestaurants = await db.query.cafesRestaurants.findMany({ where: active(cafesRestaurants) });
  const userRentals = await db.query.rentals.findMany({ where: active(rentals) });
  const userUmkms = await db.query.umkms.findMany({ where: active(umkms) });

  const partnerMenus = [
    ...userEvents.map(e => {
      const isRunning = isRunningCategoryOrName(e.category || '', e.name || '');
      const entryMode = e.entryMode || 'manual';
      const externalProvider = e.externalProvider || '';
      const externalUrl = e.externalUrl || '';

      return {
        id: e.id,
        paymentType: "BILL_PAYMENT",
        amount: e.price || 0,
        screenId: "exploreScreen",
        transactionType: isRunning ? "running" : "event",
        category: isRunning ? "running" : (e.category || "event"),
        partnerAlias: e.name,
        partnerId: e.id,
        displayImage: e.bannerUrl || e.bannerUrls?.[0] || e.images?.[0],
        title: e.name,
        transactionTypeDisplay: isRunning ? "Running" : "Event",
        isActive: e.isActive === 1,
        entryMode,
        entry_mode: entryMode,
        externalProvider,
        external_provider: externalProvider,
        externalUrl,
        external_url: externalUrl,
        rawMenu: {
          ...strip(e),
          entryMode,
          entry_mode: entryMode,
          externalProvider,
          external_provider: externalProvider,
          externalUrl,
          external_url: externalUrl,
        },
      };
    }),
    ...userHotels.map(h => ({
      id: h.id,
      paymentType: "VIRTUAL_ACCOUNT",
      amount: 0,
      screenId: "hotelScreen",
      transactionType: "hotel",
      category: "hotel",
      partnerAlias: h.name,
      partnerId: h.id,
      displayImage: h.bannerUrl || h.images?.[0],
      title: h.name,
      transactionTypeDisplay: "Hotel",
      isActive: h.isActive === 1,
      rawMenu: strip(h),
    })),
    ...userCafeRestaurants.map(v => ({
      id: v.id,
      paymentType: "BILL_PAYMENT",
      amount: 0,
      screenId: "culinaryScreen",
      transactionType: v.category,
      category: v.category,
      partnerAlias: v.name,
      partnerId: v.id,
      displayImage: v.bannerUrl || v.images?.[0],
      title: v.name,
      transactionTypeDisplay: v.category.charAt(0).toUpperCase() + v.category.slice(1),
      isActive: v.isActive === 1,
      rawMenu: strip(v),
    })),
    ...userRentals.map(r => ({
      id: r.id,
      paymentType: "BILL_PAYMENT",
      amount: 0,
      screenId: "rentalScreen",
      transactionType: "rental",
      category: "rental",
      partnerAlias: r.name,
      partnerId: r.id,
      displayImage: r.bannerUrl || r.images?.[0],
      title: r.name,
      transactionTypeDisplay: "Rental",
      isActive: r.isActive === 1,
      rawMenu: strip(r),
    })),
    ...userUmkms.map(u => ({
      id: u.id,
      paymentType: "BILL_PAYMENT",
      amount: 0,
      screenId: "umkmScreen",
      transactionType: "umkm",
      category: "umkm",
      partnerAlias: u.name,
      partnerId: u.id,
      displayImage: u.bannerUrl || u.images?.[0],
      title: u.name,
      transactionTypeDisplay: "UMKM",
      isActive: u.isActive === 1,
      rawMenu: strip(u),
    })),
  ];

  return c.json({
    data: { isNeedUpdate: false, partnerMenus },
    latency: 0,
    statusCode: 200,
    message: "Success"
  });
});

lifestyleRoutes.get('/v1/all-events', async (c) => {
  try {
    const allEvents = await db.query.events.findMany({
      where: and(
        eq(events.isActive, 1),
        sql`(${events.approvalStatus} = 'APPROVED' OR ${events.reviewedDate} IS NOT NULL)`
      ),
      orderBy: [desc(events.createdAt)],
      with: { ticketCategories: { with: { tickets: true } } },
    });

    for (const ev of allEvents) {
      if (!ev.price || ev.price <= 0) {
        const minCatPrice = ev.ticketCategories?.length > 0
          ? Math.min(...ev.ticketCategories.map((cat: any) => cat.price))
          : 0;
        ev.price = minCatPrice;
        if (minCatPrice > 0) {
          await db.update(events)
            .set({ price: minCatPrice, updatedAt: new Date().toISOString() })
            .where(eq(events.id, ev.id));
        }
      }
    }

    const formattedEvents = await Promise.all(allEvents.map(async (ev: any) => {
      const cats = (ev.ticketCategories || []).map((cat: any) => {
        const stock = cat.stock || 0;
        const sold = cat.ticketsSold || 0;
        const remainingStock = Math.max(0, stock - sold);
        return {
          ...cat,
          stock,
          ticketsSold: sold,
          tickets_sold: sold,
          remainingStock,
          remaining_stock: remainingStock,
          isAvailable: remainingStock > 0 ? 1 : 0
        };
      });

      const totalTickets = cats.reduce((sum: number, cat: any) => sum + cat.stock, 0);
      const ticketsSold = cats.reduce((sum: number, cat: any) => sum + cat.ticketsSold, 0);
      const remainingStock = Math.max(0, totalTickets - ticketsSold);
      const entryMode = ev.entryMode || 'manual';
      const externalProvider = ev.externalProvider || '';
      const externalUrl = ev.externalUrl || '';
      const templateConfig = await getSingleTemplate(ev.templateId || '1');

      return {
        ...strip(ev),
        entryMode,
        entry_mode: entryMode,
        externalProvider,
        external_provider: externalProvider,
        externalUrl,
        external_url: externalUrl,
        totalTickets,
        total_tickets: totalTickets,
        ticketsSold,
        tickets_sold: ticketsSold,
        remainingTickets: remainingStock,
        remaining_tickets: remainingStock,
        remainingStock,
        remaining_stock: remainingStock,
        ticketCategories: cats,
        tickets: cats,
        ticket_tiers: cats,
        templateId: ev.templateId || '1',
        selected_template: ev.templateId || '1',
        selectedTemplate: ev.templateId || '1',
        templateConfig: templateConfig || null,
        templateSchema: templateConfig || null,
        templates: ev.templates || {
          index: { id: ev.templateId || 1, title: 'Event Detail', bannerUrl: ev.bannerUrl || '' }
        }
      };
    }));

    return c.json({ data: formattedEvents, latency: 0, statusCode: 200, message: "Success" });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

lifestyleRoutes.get('/v1/all-running-events', async (c) => {
  try {
    const data = await db.query.events.findMany({
      where: and(
        eq(events.isActive, 1),
        sql`(${events.approvalStatus} = 'APPROVED' OR ${events.reviewedDate} IS NOT NULL)`,
        sql`(
          LOWER(${events.category}) LIKE '%lari%' OR 
          LOWER(${events.category}) LIKE '%run%' OR 
          LOWER(${events.category}) LIKE '%sport%' OR 
          LOWER(${events.category}) LIKE '%olahraga%' OR 
          LOWER(${events.category}) LIKE '%marathon%' OR 
          LOWER(${events.name}) LIKE '%run%' OR 
          LOWER(${events.name}) LIKE '%lari%' OR 
          LOWER(${events.name}) LIKE '%marathon%'
        )`
      ),
      orderBy: [desc(events.createdAt)],
      with: { ticketCategories: { with: { tickets: true } } },
    });

    const formattedData = await Promise.all(data.map(async (ev: any) => {
      const cats = (ev.ticketCategories || []).map((cat: any) => {
        const stock = cat.stock || 0;
        const sold = cat.ticketsSold || 0;
        const remainingStock = Math.max(0, stock - sold);
        return {
          ...cat,
          stock,
          ticketsSold: sold,
          tickets_sold: sold,
          remainingStock,
          remaining_stock: remainingStock,
          isAvailable: remainingStock > 0 ? 1 : 0
        };
      });

      const totalTickets = cats.reduce((sum: number, cat: any) => sum + cat.stock, 0);
      const ticketsSold = cats.reduce((sum: number, cat: any) => sum + cat.ticketsSold, 0);
      const remainingStock = Math.max(0, totalTickets - ticketsSold);
      const entryMode = ev.entryMode || 'manual';
      const externalProvider = ev.externalProvider || '';
      const externalUrl = ev.externalUrl || '';
      const templateConfig = await getSingleTemplate(ev.templateId || '1');

      return {
        ...strip(ev),
        entryMode,
        entry_mode: entryMode,
        externalProvider,
        external_provider: externalProvider,
        externalUrl,
        external_url: externalUrl,
        totalTickets,
        total_tickets: totalTickets,
        ticketsSold,
        tickets_sold: ticketsSold,
        remainingTickets: remainingStock,
        remaining_tickets: remainingStock,
        remainingStock,
        remaining_stock: remainingStock,
        ticketCategories: cats,
        tickets: cats,
        ticket_tiers: cats,
        templateId: ev.templateId || '1',
        selected_template: ev.templateId || '1',
        selectedTemplate: ev.templateId || '1',
        templateConfig: templateConfig || null,
        templateSchema: templateConfig || null,
        templates: ev.templates || {
          index: { id: ev.templateId || 1, title: 'Event Detail', bannerUrl: ev.bannerUrl || '' }
        }
      };
    }));

    return c.json({ data: formattedData, latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch running events', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/favorite-events', async (c) => {
  try {
    const data = await db.query.events.findMany({
      where: and(
        eq(events.isActive, 1),
        sql`(${events.approvalStatus} = 'APPROVED' OR ${events.reviewedDate} IS NOT NULL)`
      ),
      orderBy: [desc(events.viewsDetail)],
      limit: 5,
      with: { ticketCategories: { with: { tickets: true } } },
    });

    const formattedEvents = await Promise.all(data.map(async (ev: any) => {
      const cats = (ev.ticketCategories || []).map((cat: any) => ({
        ...cat,
        stock: cat.stock || 0,
        ticketsSold: cat.ticketsSold || 0,
        remainingStock: Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0)),
        isAvailable: ((cat.stock || 0) - (cat.ticketsSold || 0)) > 0 ? 1 : 0
      }));
      const templateConfig = await getSingleTemplate(ev.templateId || '1');
      return {
        ...strip(ev),
        ticketCategories: cats,
        tickets: cats,
        ticket_tiers: cats,
        templateId: ev.templateId || '1',
        templateConfig: templateConfig || null,
        templateSchema: templateConfig || null,
      };
    }));

    return c.json({ data: formattedEvents, latency: 0, statusCode: 200, message: "Success" });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch favorite events', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-hotels', async (c) => {
  try {
    const allHotels = await db.query.hotels.findMany({
      where: eq(hotels.isActive, 1),
      orderBy: [desc(hotels.createdAt)],
      with: { categories: true },
    });
    return c.json({ data: allHotels.map(strip), latency: 0, statusCode: 200, message: "Success" });
  } catch (error: any) {
    console.error('Fetch Hotels Error:', error);
    return c.json({ error: 'Failed to fetch hotels', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-cafes', async (c) => {
  try {
    const data = await db.query.cafesRestaurants.findMany({
      where: and(eq(cafesRestaurants.category, 'cafe'), eq(cafesRestaurants.isActive, 1)),
      orderBy: [desc(cafesRestaurants.createdAt)],
    });
    return c.json({ data: data.map(strip), latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch cafes', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-restaurants', async (c) => {
  try {
    const data = await db.query.cafesRestaurants.findMany({
      where: and(eq(cafesRestaurants.category, 'restaurant'), eq(cafesRestaurants.isActive, 1)),
      orderBy: [desc(cafesRestaurants.createdAt)],
    });
    return c.json({ data: data.map(strip), latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch restaurants', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-rentals', async (c) => {
  try {
    const data = await db.query.rentals.findMany({
      where: eq(rentals.isActive, 1),
      orderBy: [desc(rentals.createdAt)],
    });
    return c.json({ data: data.map(strip), latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch rentals', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-umkms', async (c) => {
  try {
    const data = await db.query.umkms.findMany({
      where: eq(umkms.isActive, 1),
      orderBy: [desc(umkms.createdAt)],
    });
    return c.json({ data: data.map(strip), latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch umkms', details: error.message }, 500);
  }
});
