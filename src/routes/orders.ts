import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { cafesRestaurants, events, hotels, rentals, runningEvents, serviceOrders, umkms } from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { verify } from "hono/jwt";

export const orderRoutes = new Hono();

const createOrderSchema = z.object({
  orderType: z.string().min(1),
  serviceId: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  quantity: z.number().int().min(1).optional().default(1),
  totalAmount: z.number().min(0).optional().default(0),
  orderPayload: z.record(z.string(), z.any()).optional().default({}),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "rejected",
    "completed",
    "preparing",
    "ready",
    "ready_to_pick",
    "searching_driver",
    "driver_found",
    "delivering"
  ]),
  paymentMethod: z.string().optional(),
});

async function resolveVendorAndName(orderType: string, serviceId: string) {
  try {
    const type = orderType.toLowerCase();
    if (type === "event") {
      // Coba cari berdasarkan ID (UUID)
      let data = await db.query.events.findFirst({ where: eq(events.id, serviceId) });

      // Jika tidak ketemu ID, coba cari berdasarkan nama (untuk case "EVENT-JJF" atau sejenisnya)
      if (!data && serviceId.startsWith("EVENT-")) {
        const namePart = serviceId.replace("EVENT-", "").replace("-", " ");
        data = await db.query.events.findFirst({
          where: sql`LOWER(${events.name}) LIKE ${'%' + namePart.toLowerCase() + '%'}`
        });
      }

      if (!data) {
        // Fallback terakhir: ambil event pertama milik user tersebut jika ada context user,
        // tapi di sini kita tidak punya user context.
        // Jadi kita hanya ambil event paling baru sebagai best effort daripada null.
        const latestEvent = await db.query.events.findFirst({ orderBy: [desc(events.createdAt)] });
        return { vendorUserId: latestEvent?.userId || null, serviceName: latestEvent?.name || "Event" };
      }
      return { vendorUserId: data.userId || null, serviceName: data.name || "Event" };
    }
    if (type === "hotel") {
      const data = await db.query.hotels.findFirst({ where: eq(hotels.id, serviceId) });
      if (!data) {
        const latestHotel = await db.query.hotels.findFirst({ orderBy: [desc(hotels.createdAt)] });
        return { vendorUserId: latestHotel?.userId || null, serviceName: latestHotel?.name || "Hotel" };
      }
      return { vendorUserId: data.userId || null, serviceName: data.name || "Hotel" };
    }
    if (type === "rental") {
      const data = await db.query.rentals.findFirst({ where: eq(rentals.id, serviceId) });
      if (!data) {
        const latestRental = await db.query.rentals.findFirst({ orderBy: [desc(rentals.createdAt)] });
        return { vendorUserId: latestRental?.userId || null, serviceName: latestRental?.name || "Rental" };
      }
      return { vendorUserId: data.userId || null, serviceName: data.name || "Rental" };
    }
    if (type === "umkm") {
      const data = await db.query.umkms.findFirst({ where: eq(umkms.id, serviceId) });
      if (!data) {
        const latestUmkm = await db.query.umkms.findFirst({ orderBy: [desc(umkms.createdAt)] });
        return { vendorUserId: latestUmkm?.userId || null, serviceName: latestUmkm?.name || "UMKM" };
      }
      return { vendorUserId: data.userId || null, serviceName: data.name || "UMKM" };
    }
    if (type === "running") {
      const data = await db.query.runningEvents.findFirst({ where: eq(runningEvents.id, serviceId) });
      if (!data) {
        const latest = await db.query.runningEvents.findFirst({ orderBy: [desc(runningEvents.createdAt)] });
        return { vendorUserId: latest?.userId || null, serviceName: latest?.name || "Running Event" };
      }
      return { vendorUserId: data.userId || null, serviceName: data.name || "Running Event" };
    }
    // Handle "CULINARY", "cafe", or "restaurant"
    const data = await db.query.cafesRestaurants.findFirst({ where: eq(cafesRestaurants.id, serviceId) });
    if (!data) {
      const latestCafe = await db.query.cafesRestaurants.findFirst({ orderBy: [desc(cafesRestaurants.createdAt)] });
      return { vendorUserId: latestCafe?.userId || null, serviceName: latestCafe?.name || "Cafe/Restoran" };
    }
    return { vendorUserId: data.userId || null, serviceName: data.name || "Cafe/Restoran" };
  } catch (err) {
    console.error("Error resolving vendor:", err);
    return { vendorUserId: null, serviceName: "Service" };
  }
}

orderRoutes.post("/:id/checkout", zValidator("json", z.object({ paymentMethod: z.string() })), async (c) => {
  const authResult = await authMiddleware(c, async () => {});
  if (authResult) return authResult as any;

  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const { paymentMethod } = c.req.valid("json");

  const order = await db.query.serviceOrders.findFirst({
    where: and(eq(serviceOrders.id, id), eq(serviceOrders.vendorUserId, user.sub))
  });

  if (!order) return c.json({ error: "Order tidak ditemukan" }, 404);

  const invoiceNumber = `INV-${Date.now()}-${order.id.slice(-4).toUpperCase()}`;

  const updated = await db
    .update(serviceOrders)
    .set({
      status: 'completed',
      paymentMethod,
      invoiceNumber,
      completedAt: new Date().toISOString(),
      updatedAt: sql`CURRENT_TIMESTAMP`
    })
    .where(eq(serviceOrders.id, id))
    .returning();

  return c.json({ success: true, data: updated[0] });
});

orderRoutes.get("/", async (c) => {
  const authHeader = c.req.header('Authorization');
  let user: any = null;
  let isAdmin = false;

  // Hanya coba auth jika ada header yang valid
  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'Bearer null' && authHeader !== 'Bearer ') {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
      const token = authHeader.replace('Bearer ', '');
      user = await verify(token, JWT_SECRET, 'HS256');
      isAdmin = user?.role === 'admin';
    } catch (err) {
      // Token tidak valid, anggap sebagai visitor biasa (jangan return 401 di sini)
      console.log("Invalid token in GET /orders, treating as visitor");
    }
  }

  const status = c.req.query("status");
  const orderType = c.req.query("orderType");
  const customerPhone = c.req.query("customerPhone");

  const clauses = [];

  // Jika ada user (Vendor/Admin), filter berdasarkan hak akses mereka
  if (user) {
    if (!isAdmin) {
      clauses.push(eq(serviceOrders.vendorUserId, user.sub));
    }
  } else {
    // Jika visitor (tanpa auth), WAJIB filter berdasarkan customerPhone
    // agar tidak bisa melihat pesanan orang lain secara sembarangan
    if (customerPhone) {
      clauses.push(eq(serviceOrders.customerPhone, customerPhone));
    } else {
      // Jika tidak ada auth dan tidak ada filter phone, kembalikan data kosong demi keamanan
      // (Kecuali untuk demo ini kita izinkan lihat semua jika memang itu tujuannya)
      // Untuk "Real Life", kita batasi.
      return c.json({ data: [] });
    }
  }

  if (status) clauses.push(eq(serviceOrders.status, status));
  if (orderType) clauses.push(eq(serviceOrders.orderType, orderType));

  const data = await db.query.serviceOrders.findMany({
    where: clauses.length > 0 ? and(...clauses) : undefined,
    orderBy: [desc(serviceOrders.createdAt)],
  });

  return c.json({ data });
});

orderRoutes.post("/", zValidator("json", createOrderSchema), async (c) => {
  const payload = c.req.valid("json");
  console.log("Creating order with payload:", JSON.stringify(payload, null, 2));

  const id = crypto.randomUUID();
  const { vendorUserId, serviceName } = await resolveVendorAndName(payload.orderType, payload.serviceId);

  console.log("Resolved vendor:", vendorUserId, "Service name:", serviceName);

  try {
    const newOrder = await db.insert(serviceOrders).values({
      id,
      ...payload,
      vendorUserId,
      serviceName,
      status: (payload as any).status || "pending",
    }).returning();

    console.log("Order created successfully:", newOrder[0].id);
    return c.json({ success: true, id: newOrder[0].id, data: newOrder[0] }, 201);
  } catch (err) {
    console.error("Database error creating order:", err);
    return c.json({ error: "Gagal menyimpan order ke database", details: String(err) }, 500);
  }
});

orderRoutes.patch("/:id/status", zValidator("json", updateStatusSchema), async (c) => {
  const authResult = await authMiddleware(c, async () => {});
  if (authResult) return authResult as any;

  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const { status } = c.req.valid("json");

  const updated = await db
    .update(serviceOrders)
    .set({ status, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(and(eq(serviceOrders.id, id), eq(serviceOrders.vendorUserId, user.sub)))
    .returning();

  if (!updated.length) return c.json({ error: "Order tidak ditemukan / tidak berizin" }, 404);
  return c.json({ success: true, data: updated[0] });
});
