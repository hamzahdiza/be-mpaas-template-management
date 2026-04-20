import { Hono } from 'hono';
import { db } from '../db';
import { desc, eq } from 'drizzle-orm';
import { cafesRestaurants, events, hotels, rentals, umkms } from '../db/schema';


export const lifestyleRoutes = new Hono();

// Mimic: lifestyle/v1/menu
lifestyleRoutes.get('/v1/menu', async (c) => {
  const userEvents = await db.query.events.findMany();
  const userHotels = await db.query.hotels.findMany();
  const userCafeRestaurants = await db.query.cafesRestaurants.findMany();
  const userRentals = await db.query.rentals.findMany();
  const userUmkms = await db.query.umkms.findMany();

  const partnerMenus = [
    ...userEvents.map(e => ({
      id: e.id,
      paymentType: "BILL_PAYMENT",
      amount: e.price || 0,
      screenId: "exploreScreen",
      transactionType: "event",
      category: "event",
      partnerAlias: e.name,
      partnerId: e.id,
      displayImage: e.bannerUrl || e.images?.[0],
      title: e.name,
      transactionTypeDisplay: "Event",
      isActive: true,
      rawMenu: e
    })),
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
      isActive: true,
      rawMenu: h
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
      isActive: true,
      rawMenu: v
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
      isActive: true,
      rawMenu: r
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
      isActive: true,
      rawMenu: u
    }))
  ];

  return c.json({
    data: {
      isNeedUpdate: false,
      partnerMenus
    },
    latency: 0,
    statusCode: 200,
    message: "Success"
  });
});

// Mock: lifestyle/v1/all-events
lifestyleRoutes.get('/v1/all-events', async (c) => {
  try {
    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.createdAt)],
      with: {
        ticketCategories: {
          with: {
            tickets: true
          }
        }
      }
    });

    // Backfill and present price if missing: use minimum price from categories
    for (const ev of allEvents) {
      if (!ev.price || ev.price <= 0) {
        const minCatPrice = ev.ticketCategories && ev.ticketCategories.length > 0
          ? Math.min(...ev.ticketCategories.map(c => c.price))
          : 0;
        ev.price = minCatPrice;
        if (minCatPrice > 0) {
          // best-effort update to DB so subsequent fetches are consistent
          await db.update(events)
            .set({ price: minCatPrice, updatedAt: new Date().toISOString() })
            .where(eq(events.id, ev.id));
        }
      }
    }

    // Transform to match miniprogram landing page expectation if needed
    // The miniprogram calls /lifestyle/v1/all-events and expects a list of events
    
    console.log(allEvents);
    return c.json({
      data: allEvents,
      latency: 0,
      statusCode: 200,
      message: "Success"
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

lifestyleRoutes.get('/v1/all-hotels', async (c) => {
  try {
    const allHotels = await db.query.hotels.findMany({
      orderBy: [desc(hotels.createdAt)],
      with: {
        categories: true 
      }
    });

    return c.json({
      data: allHotels,
      latency: 0,
      statusCode: 200,
      message: "Success"
    });
  } catch (error: any) {
    console.error('Fetch Hotels Error:', error);
    return c.json({ 
      error: 'Failed to fetch hotels', 
      details: error.message 
    }, 500);
  }
});

lifestyleRoutes.get('/v1/all-cafes', async (c) => {
  try {
    const data = await db.query.cafesRestaurants.findMany({
      where: eq(cafesRestaurants.category, 'cafe'),
      orderBy: [desc(cafesRestaurants.createdAt)],
    });
    return c.json({ data, latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch cafes', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-restaurants', async (c) => {
  try {
    const data = await db.query.cafesRestaurants.findMany({
      where: eq(cafesRestaurants.category, 'restaurant'),
      orderBy: [desc(cafesRestaurants.createdAt)],
    });
    return c.json({ data, latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch restaurants', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-rentals', async (c) => {
  try {
    const data = await db.query.rentals.findMany({
      orderBy: [desc(rentals.createdAt)],
    });
    return c.json({ data, latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch rentals', details: error.message }, 500);
  }
});

lifestyleRoutes.get('/v1/all-umkms', async (c) => {
  try {
    const data = await db.query.umkms.findMany({
      orderBy: [desc(umkms.createdAt)],
    });
    return c.json({ data, latency: 0, statusCode: 200, message: 'Success' });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch umkms', details: error.message }, 500);
  }
});
