import { Hono } from 'hono';
import { db } from '../db';
import { cafesRestaurants, events, hotels, rentals, runningEvents, serviceOrders, umkms } from '../db/schema';
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

    const userRentals = await db.query.rentals.findMany({
      where: isAdmin ? undefined : eq(rentals.userId, userId),
      orderBy: [desc(rentals.createdAt)],
    });

    const userUmkms = await db.query.umkms.findMany({
      where: isAdmin ? undefined : eq(umkms.userId, userId),
      orderBy: [desc(umkms.createdAt)],
    });

    const userRunningEvents = await db.query.runningEvents.findMany({
      where: isAdmin ? undefined : eq(runningEvents.userId, userId),
      orderBy: [desc(runningEvents.createdAt)],
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
      })),
      ...userRentals.map((r) => ({
        id: r.id,
        name: r.name,
        type: 'RENTAL',
        createdAt: r.createdAt,
        status: 'Active',
        location: r.location,
      })),
      ...userUmkms.map((u) => ({
        id: u.id,
        name: u.name,
        type: 'UMKM',
        createdAt: u.createdAt,
        status: 'Active',
        location: u.location,
      })),
      ...userRunningEvents.map((e) => ({
        id: e.id,
        name: e.name,
        type: 'RUNNING',
        createdAt: e.createdAt,
        status: 'Active',
        location: e.location,
      }))
    ].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    return c.json({
      success: true,
      message: "Data dashboard berhasil dimuat",
      data: {
        summary: summary,
        totalEvents: userEvents.length,
        totalHotels: userHotels.length,
        totalCafesRestaurants: userCafeRestaurants.length,
        totalRentals: userRentals.length,
        totalUmkms: userUmkms.length,
        totalRunningEvents: userRunningEvents.length,
        totalOrders: userOrders.length,
        raw: {
          events: userEvents,
          hotels: userHotels,
          cafesRestaurants: userCafeRestaurants,
          rentals: userRentals,
          umkms: userUmkms,
          runningEvents: userRunningEvents,
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
