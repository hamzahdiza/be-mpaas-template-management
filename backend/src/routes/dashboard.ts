import { Hono } from 'hono';
import { db } from '../db';
import { cafesRestaurants, events, hotels, serviceOrders } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth'; 

export const dashboardRoutes = new Hono();

dashboardRoutes.use('*', authMiddleware);

dashboardRoutes.get('/all-services', async (c) => {
  const user = c.get('jwtPayload') as any;
  const userId = user.sub;
  const isAdmin = user.role === 'admin';

  try {
    const userEvents = await db.query.events.findMany({
      where: isAdmin ? undefined : eq(events.userId, userId),
      orderBy: [desc(events.createdAt)],
    });

    const userHotels = await db.query.hotels.findMany({
      where: isAdmin ? undefined : eq(hotels.userId, userId),
      orderBy: [desc(hotels.createdAt)],
    });

    const userCafeRestaurants = await db.query.cafesRestaurants.findMany({
      where: isAdmin ? undefined : eq(cafesRestaurants.userId, userId),
      orderBy: [desc(cafesRestaurants.createdAt)],
    });

    const userOrders = await db.query.serviceOrders.findMany({
      where: isAdmin ? undefined : eq(serviceOrders.vendorUserId, userId),
      orderBy: [desc(serviceOrders.createdAt)],
    });

    const summary = [
      ...userEvents.map(e => ({ 
        id: e.id, 
        name: e.name, 
        type: 'EVENT', 
        createdAt: e.createdAt,
        status: 'Active', 
        location: e.location 
      })),
      ...userHotels.map(h => ({ 
        id: h.id, 
        name: h.name, 
        type: 'HOTEL', 
        createdAt: h.createdAt,
        status: 'Active',
        location: h.location 
      })),
      ...userCafeRestaurants.map((v) => ({
        id: v.id,
        name: v.name,
        type: v.category.toUpperCase(),
        createdAt: v.createdAt,
        status: 'Active',
        location: v.location,
      }))
    ].sort((a, b) => {
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });

    return c.json({
      success: true,
      message: "Data dashboard berhasil dimuat",
      data: {
        summary: summary,
        totalEvents: userEvents.length,
        totalHotels: userHotels.length,
        totalCafesRestaurants: userCafeRestaurants.length,
        totalOrders: userOrders.length,
        raw: {
          events: userEvents,
          hotels: userHotels,
          cafesRestaurants: userCafeRestaurants,
          orders: userOrders
        }
      }
    });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    return c.json({ 
      error: 'Gagal mengambil data dashboard', 
      details: error.message 
    }, 500);
  }
});
