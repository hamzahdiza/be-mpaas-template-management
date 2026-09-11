import { Hono } from 'hono';
import { db } from '../db';
import { cafesRestaurants, events, hotels, rentals, serviceOrders, umkms } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const dashboardRoutes = new Hono();

dashboardRoutes.use('*', authMiddleware);

const merge = (item: any) => {
  const hasPendingEdit = item.pendingData != null && item.isActive === 1;
  if (hasPendingEdit) {
    return { ...item, ...item.pendingData, pendingData: item.pendingData, hasPendingEdit: true };
  }
  return { ...item, hasPendingEdit: false };
};

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

    const userOrders = await db.query.serviceOrders.findMany({
      where: isAdmin ? undefined : eq(serviceOrders.vendorUserId, userId),
      orderBy: [desc(serviceOrders.createdAt)],
    });

    const mergedEvents = userEvents.map(merge);
    const mergedHotels = userHotels.map(merge);
    const mergedCafes = userCafeRestaurants.map(merge);
    const mergedRentals = userRentals.map(merge);
    const mergedUmkms = userUmkms.map(merge);

    const summary = [
      ...mergedEvents.map((e: any) => ({
        id: e.id,
        name: e.name,
        type: ((e.category || '').toLowerCase().includes('lari') || (e.category || '').toLowerCase().includes('run')) ? 'RUNNING' : 'EVENT',
        createdAt: e.createdAt,
        approvalStatus: e.approvalStatus,
        isActive: e.isActive,
        hasPendingEdit: e.hasPendingEdit,
        location: e.location,
      })),
      ...mergedHotels.map((h: any) => ({
        id: h.id,
        name: h.name,
        type: 'HOTEL',
        createdAt: h.createdAt,
        approvalStatus: h.approvalStatus,
        isActive: h.isActive,
        hasPendingEdit: h.hasPendingEdit,
        location: h.location,
      })),
      ...mergedCafes.map((v: any) => ({
        id: v.id,
        name: v.name,
        type: v.category.toUpperCase(),
        createdAt: v.createdAt,
        approvalStatus: v.approvalStatus,
        isActive: v.isActive,
        hasPendingEdit: v.hasPendingEdit,
        location: v.location,
      })),
      ...mergedRentals.map((r: any) => ({
        id: r.id,
        name: r.name,
        type: 'RENTAL',
        createdAt: r.createdAt,
        approvalStatus: r.approvalStatus,
        isActive: r.isActive,
        hasPendingEdit: r.hasPendingEdit,
        location: r.location,
      })),
      ...mergedUmkms.map((u: any) => ({
        id: u.id,
        name: u.name,
        type: 'UMKM',
        createdAt: u.createdAt,
        approvalStatus: u.approvalStatus,
        isActive: u.isActive,
        hasPendingEdit: u.hasPendingEdit,
        location: u.location,
      })),
    ].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return c.json({
      success: true,
      message: "Data dashboard berhasil dimuat",
      data: {
        summary,
        totalEvents: userEvents.length,
        totalHotels: userHotels.length,
        totalCafesRestaurants: userCafeRestaurants.length,
        totalRentals: userRentals.length,
        totalUmkms: userUmkms.length,
        totalOrders: userOrders.length,
        raw: {
          events: mergedEvents,
          hotels: mergedHotels,
          cafesRestaurants: mergedCafes,
          rentals: mergedRentals,
          umkms: mergedUmkms,
          orders: userOrders,
        },
      },
    });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    return c.json({ error: 'Gagal mengambil data dashboard', details: error.message }, 500);
  }
});
