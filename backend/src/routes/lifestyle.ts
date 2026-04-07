import { Hono } from 'hono';
import { db } from '../db';
import { desc, eq } from 'drizzle-orm';
import { cafesRestaurants, events, hotels } from '../db/schema';


export const lifestyleRoutes = new Hono();

// Mimic: lifestyle/v1/menu
lifestyleRoutes.get('/v1/menu', (c) => {
  return c.json({
    data: {
      partnerMenus: [
        // This will be populated dynamically from DB later
        {
          id: "dummy-event-1",
          paymentType: "BILL_PAYMENT",
          amount: 100000,
          screenId: "exploreScreen",
          transactionType: "jjf",
          category: "event",
          partnerAlias: "RINTIS",
          partnerId: "0100010000060004",
          displayImage: "https://placehold.co/600x400",
          billerName: "Wondr Event",
          billerCode: "01",
          isActive: true
        }
      ]
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
