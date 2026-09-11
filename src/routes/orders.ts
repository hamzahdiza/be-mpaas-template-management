import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import {
  cafesRestaurants, events, hotels, rentals, serviceOrders, umkms,
  ticketCategories, tickets, issuedTickets
} from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { verify } from "hono/jwt";

export const orderRoutes = new Hono();

const createOrderSchema = z.object({
  orderType: z.string().min(1),
  serviceId: z.string().min(1),
  customerName: z.string().optional().default("User Lifestyle"),
  customerPhone: z.string().optional().default("-"),
  customerEmail: z.string().optional(),
  customerNik: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional().default("completed"),
  quantity: z.number().int().min(1).optional().default(1),
  totalAmount: z.number().min(0).optional().default(0),
  paymentMethod: z.string().optional().default("va"),
  vaNumber: z.string().optional(),
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
    "delivering",
    "canceled",
    "refund"
  ]),
  paymentMethod: z.string().optional(),
});

async function resolveVendorAndName(orderType: string, serviceId: string) {
  try {
    // 1. Cek tabel events terlebih dahulu
    let eventData = await db.query.events.findFirst({ where: eq(events.id, serviceId) });
    if (!eventData && serviceId && serviceId.startsWith("EVENT-")) {
      const namePart = serviceId.replace("EVENT-", "").replace(/-/g, " ");
      eventData = await db.query.events.findFirst({
        where: sql`LOWER(${events.name}) LIKE ${'%' + namePart.toLowerCase() + '%'}`
      });
    }
    if (eventData) {
      return { vendorUserId: eventData.userId || null, serviceName: eventData.name || "Event" };
    }

    const type = (orderType || '').toLowerCase();
    if (type === "event" || type === "running" || type === "lari" || type.includes("sport") || type.includes("musik")) {
      const latestEvent = await db.query.events.findFirst({ orderBy: [desc(events.createdAt)] });
      return { vendorUserId: latestEvent?.userId || null, serviceName: latestEvent?.name || "Event" };
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

// Helper: Handle Stock Deduction, Revenue, and Issued Tickets on Completed Order
// ----------------------------------------------------------------------
async function handleOrderCompletion(order: any, extraPayload?: any) {
  try {
    let ev = await db.query.events.findFirst({
      where: eq(events.id, order.serviceId),
      with: { ticketCategories: true }
    });

    if (!ev && order.serviceId && order.serviceId.startsWith("EVENT-")) {
      const namePart = order.serviceId.replace("EVENT-", "").replace(/-/g, " ");
      ev = await db.query.events.findFirst({
        where: sql`LOWER(${events.name}) LIKE ${'%' + namePart.toLowerCase() + '%'}`,
        with: { ticketCategories: true }
      });
    }

    if (!ev && order.serviceName) {
      ev = await db.query.events.findFirst({
        where: sql`LOWER(${events.name}) LIKE ${'%' + order.serviceName.toLowerCase() + '%'}`,
        with: { ticketCategories: true }
      });
    }

    const isEvent = Boolean(ev) || (order.orderType || '').toLowerCase() === 'event' || (order.orderType || '').toLowerCase() === 'running';
    if (!isEvent) return;

    if (ev && ev.userId && order.vendorUserId !== ev.userId) {
      await db.update(serviceOrders).set({
        vendorUserId: ev.userId,
        serviceId: ev.id,
        serviceName: ev.name
      }).where(eq(serviceOrders.id, order.id));
      order.vendorUserId = ev.userId;
      order.serviceId = ev.id;
      order.serviceName = ev.name;
    }

    const payload = { ...(order.orderPayload || {}), ...(extraPayload || {}) };
    const ticketsPurchased = payload.tickets || payload.ticketTiers || [];
    let attendees = payload.attendees || payload.participants || [];

    // Extract customerTicket from ticketsPurchased if present
    if (attendees.length === 0 && ticketsPurchased.length > 0) {
      for (const tix of ticketsPurchased) {
        if (Array.isArray(tix.customerTicket) && tix.customerTicket.length > 0) {
          tix.customerTicket.forEach((cust: any) => {
            attendees.push({
              name: cust.fullName || cust.name || order.customerName,
              fullName: cust.fullName || cust.name || order.customerName,
              nik: cust.idCard || cust.nik || order.customerNik,
              idCard: cust.idCard || cust.nik || order.customerNik,
              email: cust.email || order.customerEmail || "",
              phone: cust.phone || order.customerPhone || "",
              ticketName: cust.ticketName || tix.title || tix.ticketName || tix.name,
              categoryId: cust.ticketId || cust.categoryId || tix.ticketId || tix.categoryId || tix.id,
              ticketId: cust.ticketId || cust.categoryId || tix.ticketId || tix.categoryId || tix.id,
              price: cust.price !== undefined ? cust.price : tix.price,
            });
          });
        }
      }
    }

    const totalQty = order.quantity || (ticketsPurchased.length > 0 ? ticketsPurchased.reduce((s: number, t: any) => s + Number(t.ticketQty || t.quantity || t.qty || t.total || 1), 0) : 1);

    // 1. DEDUCT TICKET STOCK & INCREMENT TICKETS_SOLD
    if (ev && ev.ticketCategories && ev.ticketCategories.length > 0) {
      const catCountMap = new Map<string, number>();

      // A. If we have attendees list with specific ticket info per attendee
      if (attendees.length > 0) {
        for (const att of attendees) {
          const tixId = att.ticketId || att.categoryId;
          const matchedCat = ev.ticketCategories.find((c: any) =>
            (tixId && c.id === tixId) ||
            (att.ticketName && c.name.toLowerCase() === att.ticketName.toLowerCase()) ||
            (att.title && c.name.toLowerCase() === att.title.toLowerCase())
          );
          if (matchedCat) {
            catCountMap.set(matchedCat.id, (catCountMap.get(matchedCat.id) || 0) + 1);
          }
        }
      }

      // B. If catCountMap is still empty (e.g. no attendees or no match), count from ticketsPurchased
      if (catCountMap.size === 0 && ticketsPurchased.length > 0) {
        for (const tix of ticketsPurchased) {
          const qty = Number(tix.ticketQty || tix.quantity || tix.qty || tix.total || 1);
          const tixId = tix.ticketId || tix.categoryId || tix.id;
          const matchedCat = ev.ticketCategories.find((c: any) =>
            (tixId && c.id === tixId) ||
            (tix.ticketName && c.name.toLowerCase() === tix.ticketName.toLowerCase()) ||
            (tix.title && c.name.toLowerCase() === tix.title.toLowerCase()) ||
            (tix.name && c.name.toLowerCase() === tix.name.toLowerCase())
          ) || ev.ticketCategories[0];

          if (matchedCat) {
            catCountMap.set(matchedCat.id, (catCountMap.get(matchedCat.id) || 0) + qty);
          }
        }
      }

      // C. If still empty, fallback to first category
      if (catCountMap.size === 0) {
        const firstCat = ev.ticketCategories[0];
        catCountMap.set(firstCat.id, totalQty);
      }

      for (const [catId, qty] of catCountMap.entries()) {
        console.log(`[Order Completion] Deducting stock for Cat ID: ${catId}, Sold Qty: +${qty}`);
        await db.update(ticketCategories).set({
          ticketsSold: sql`COALESCE(${ticketCategories.ticketsSold}, 0) + ${qty}`,
          updatedAt: new Date().toISOString()
        }).where(eq(ticketCategories.id, catId));
      }
    }

    // 2. CREATE ISSUED TICKETS (ATTENDEES / E-TICKETS)
    const existingIssued = await db.query.issuedTickets.findMany({
      where: eq(issuedTickets.orderId, order.id)
    });

    if (existingIssued.length === 0) {
      const countToCreate = Math.max(attendees.length, totalQty, 1);
      for (let i = 0; i < countToCreate; i++) {
        const att = attendees[i] || attendees[0] || {};
        const tix = ticketsPurchased[i] || ticketsPurchased[0] || {};
        const tixId = att.ticketId || att.categoryId || tix.ticketId || tix.categoryId || tix.id;
        const matchedCat = ev?.ticketCategories?.find((c: any) => 
          (tixId && c.id === tixId) ||
          (att.ticketName && c.name.toLowerCase() === att.ticketName.toLowerCase()) ||
          (tix.ticketName && c.name.toLowerCase() === tix.ticketName.toLowerCase())
        ) || ev?.ticketCategories?.[0];

        const participantName = att.name || att.participantName || att.fullName || order.customerName || `Peserta ${i + 1}`;
        const nik = att.nik || att.idCard || order.customerNik || `31710${Date.now().toString().slice(-6)}${String(i + 1).padStart(2, '0')}`;
        const email = att.email || order.customerEmail || "";
        const phone = att.phone || order.customerPhone || "";
        const ticketName = att.ticketName || matchedCat?.name || tix.ticketName || tix.title || tix.name || "Tiket Masuk";
        const ticketCategory = matchedCat?.type || tix.category || tix.ticketCategory || "Regular";
        const nominal = Number(
          att.nominal ||
          att.price ||
          matchedCat?.price ||
          (tix.price !== undefined && totalQty === 1 ? tix.price : (order.totalAmount / countToCreate))
        );
        const tixGenId = `TIX-${Date.now().toString().slice(-6)}-${String(i + 1).padStart(2, '0')}`;

        await db.insert(issuedTickets).values({
          id: tixGenId,
          orderId: order.id,
          eventId: ev?.id || order.serviceId,
          ticketCategoryId: matchedCat?.id || null,
          participantName,
          nik,
          email,
          phone,
          buyerName: order.customerName || participantName,
          buyerPhone: order.customerPhone || phone,
          buyerEmail: order.customerEmail || email,
          ticketName,
          ticketCategory,
          ticketQuantity: 1,
          ticketIndex: i + 1,
          nominal,
          status: 'COMPLETED',
          qrCode: `QR-${order.id.slice(0, 8).toUpperCase()}-${i + 1}`,
          purchaseDate: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.error("Error processing completed order stock/attendees:", err);
  }
}

// ----------------------------------------------------------------------
// GET /api/orders - List orders
// ----------------------------------------------------------------------
orderRoutes.get("/", async (c) => {
  const authHeader = c.req.header('Authorization');
  let user: any = null;
  let isAdmin = false;

  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'Bearer null' && authHeader.startsWith('Bearer ')) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'wondr-event-template-secret-key-2026';
      const token = authHeader.replace('Bearer ', '').trim();
      user = await verify(token, JWT_SECRET, 'HS256');
      isAdmin = user?.role === 'admin';
    } catch (err) {
      console.log("Invalid token in GET /orders");
    }
  }

  const status = c.req.query("status");
  const orderType = c.req.query("orderType");
  const serviceId = c.req.query("serviceId");
  const customerPhone = c.req.query("customerPhone");

  const clauses = [];

  if (serviceId) {
    clauses.push(eq(serviceOrders.serviceId, serviceId));
  } else if (user && !isAdmin) {
    clauses.push(eq(serviceOrders.vendorUserId, user.sub));
  }

  if (status) clauses.push(eq(serviceOrders.status, status));
  if (orderType) clauses.push(eq(serviceOrders.orderType, orderType));
  if (customerPhone) clauses.push(eq(serviceOrders.customerPhone, customerPhone));

  const data = await db.query.serviceOrders.findMany({
    where: clauses.length > 0 ? and(...clauses) : undefined,
    orderBy: [desc(serviceOrders.createdAt)],
  });

  return c.json({ data });
});

// ----------------------------------------------------------------------
// POST /api/orders - Create new order
// ----------------------------------------------------------------------
orderRoutes.post("/", zValidator("json", createOrderSchema), async (c) => {
  const payload = c.req.valid("json");
  const id = crypto.randomUUID();
  const resolved = await resolveVendorAndName(payload.orderType, payload.serviceId);
  const serviceName = payload.serviceName && payload.serviceName !== "Service" ? payload.serviceName : resolved.serviceName;
  const vendorUserId = resolved.vendorUserId;

  try {
    const newOrder = await db.insert(serviceOrders).values({
      id,
      ...payload,
      vendorUserId,
      serviceName,
      status: payload.status || "pending",
    }).returning();

    if (payload.status === 'completed') {
      await handleOrderCompletion(newOrder[0], payload.orderPayload);
    }

    return c.json({ success: true, id: newOrder[0].id, data: newOrder[0] }, 201);
  } catch (err) {
    console.error("Database error creating order:", err);
    return c.json({ error: "Gagal menyimpan order ke database", details: String(err) }, 500);
  }
});

// ----------------------------------------------------------------------
// POST /api/orders/:id/checkout - Complete order checkout
// ----------------------------------------------------------------------
orderRoutes.post("/:id/checkout", zValidator("json", z.object({ paymentMethod: z.string().optional().default("VA") })), async (c) => {
  const id = c.req.param("id");
  const { paymentMethod } = c.req.valid("json");

  const order = await db.query.serviceOrders.findFirst({
    where: eq(serviceOrders.id, id)
  });

  if (!order) return c.json({ error: "Order tidak ditemukan" }, 404);

  if (order.status === 'completed') {
    return c.json({ success: true, message: "Order already completed", data: order });
  }

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

  await handleOrderCompletion(updated[0]);

  return c.json({ success: true, data: updated[0] });
});

// ----------------------------------------------------------------------
// POST /api/orders/:id/complete-payment - Complete payment simulation
// ----------------------------------------------------------------------
orderRoutes.post("/:id/complete-payment", async (c) => {
  const orderId = c.req.param("id");
  let body: any = {};
  try {
    body = await c.req.json();
  } catch (e) {
    // optional body
  }

  const existingOrder = await db.query.serviceOrders.findFirst({
    where: eq(serviceOrders.id, orderId)
  });

  if (!existingOrder) {
    return c.json({ error: "Order not found" }, 404);
  }

  if (existingOrder.status === 'completed') {
    return c.json({ success: true, message: "Order already completed", data: existingOrder });
  }

  const invoiceNumber = `INV-${Date.now()}-${existingOrder.id.slice(-4).toUpperCase()}`;

  const updated = await db.update(serviceOrders).set({
    status: 'completed',
    invoiceNumber,
    paymentMethod: body.paymentMethod || existingOrder.paymentMethod || 'VA',
    completedAt: new Date().toISOString(),
    updatedAt: sql`CURRENT_TIMESTAMP`
  }).where(eq(serviceOrders.id, orderId)).returning();

  await handleOrderCompletion(updated[0], body);

  return c.json({ success: true, message: "Payment completed successfully", data: updated[0] });
});

// ----------------------------------------------------------------------
// PATCH /api/orders/:id/status - Update order status
// ----------------------------------------------------------------------
orderRoutes.patch("/:id/status", zValidator("json", updateStatusSchema), async (c) => {
  const id = c.req.param("id");
  const { status, paymentMethod } = c.req.valid("json");

  const updated = await db
    .update(serviceOrders)
    .set({
      status,
      ...(paymentMethod && { paymentMethod }),
      updatedAt: sql`CURRENT_TIMESTAMP`
    })
    .where(eq(serviceOrders.id, id))
    .returning();

  if (!updated.length) return c.json({ error: "Order tidak ditemukan" }, 404);

  if (status === 'completed') {
    await handleOrderCompletion(updated[0]);
  }

  return c.json({ success: true, data: updated[0] });
});