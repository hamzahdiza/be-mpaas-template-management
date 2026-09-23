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
    // 1b. Cek apakah serviceId adalah ticketCategoryId
    if (!eventData && serviceId) {
      const cat = await db.query.ticketCategories.findFirst({ where: eq(ticketCategories.id, serviceId) });
      if (cat && cat.eventId) {
        eventData = await db.query.events.findFirst({ where: eq(events.id, cat.eventId) });
      }
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
    const payload = { ...(order.orderPayload || {}), ...(extraPayload || {}) };
    const ticketsPurchased = payload.tickets || payload.ticketTiers || [];
    let attendees = payload.attendees || payload.participants || [];

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

    if (!ev && (order.serviceName && order.serviceName !== 'BNI RUNNING 2026' && order.serviceName !== 'Event' && order.serviceName !== 'Service')) {
      ev = await db.query.events.findFirst({
        where: sql`LOWER(${events.name}) LIKE ${'%' + order.serviceName.toLowerCase() + '%'}`,
        with: { ticketCategories: true }
      });
    }

    // Inspect tickets payload to discover the actual event
    if (!ev && ticketsPurchased.length > 0) {
      for (const t of ticketsPurchased) {
        const potentialEventId = t.category || t.categoryId;
        if (potentialEventId) {
          const foundEv = await db.query.events.findFirst({
            where: eq(events.id, potentialEventId),
            with: { ticketCategories: true }
          });
          if (foundEv) {
            ev = foundEv;
            break;
          }
        }
        const tixId = t.ticketId || t.id;
        if (tixId) {
          const cat = await db.query.ticketCategories.findFirst({
            where: eq(ticketCategories.id, tixId)
          });
          if (cat && cat.eventId) {
            ev = await db.query.events.findFirst({
              where: eq(events.id, cat.eventId),
              with: { ticketCategories: true }
            });
            if (ev) break;
          }
        }
      }
    }

    const isEvent = Boolean(ev) || (order.orderType || '').toLowerCase() === 'event' || (order.orderType || '').toLowerCase() === 'running';
    if (!isEvent) return;

    if (ev && (order.serviceId !== ev.id || order.vendorUserId !== ev.userId || order.serviceName !== ev.name)) {
      await db.update(serviceOrders).set({
        vendorUserId: ev.userId,
        serviceId: ev.id,
        serviceName: ev.name
      }).where(eq(serviceOrders.id, order.id));
      order.vendorUserId = ev.userId;
      order.serviceId = ev.id;
      order.serviceName = ev.name;
    }

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

  let dbOrders = await db.query.serviceOrders.findMany({
    where: clauses.length > 0 ? and(...clauses) : undefined,
    orderBy: [desc(serviceOrders.createdAt)],
  });

  // Attach issuedTickets to dbOrders if present
  let formattedData = await Promise.all(dbOrders.map(async (ord: any) => {
    const tix = await db.query.issuedTickets.findMany({
      where: eq(issuedTickets.orderId, ord.id)
    });
    return {
      ...ord,
      transactionId: ord.id,
      eventName: ord.serviceName,
      eventDate: ord.createdAt,
      totalAmount: ord.totalAmount,
      issuedTickets: tix,
      tickets: tix.map((t: any, idx: number) => ({
        ticketNumber: idx + 1,
        totalTickets: tix.length,
        ticketTitle: `TIKET ${(t.ticketName || 'REGULER').toUpperCase()}`,
        category: t.ticketCategory || t.ticketName || "Regular",
        gate: "Pintu A",
        bookingCode: t.qrCode || `BOOKING-CODE-0${idx + 1}`,
        qrValue: t.qrCode || `BOOKING-CODE-0${idx + 1}`,
        holderName: t.participantName || ord.customerName
      }))
    };
  }));

  // Dummy fallback data if DB yields no matching orders
  const dummyList = [
    {
      id: "a3f1c2e0-9b4d-4e7a-8f6a-2d3b1c4e5f60",
      transactionId: "a3f1c2e0-9b4d-4e7a-8f6a-2d3b1c4e5f60",
      orderType: "event",
      serviceId: "ev-concert-2026",
      serviceName: "Konser Musik Andrea Bocelli 2026",
      eventName: "Konser Musik Andrea Bocelli 2026",
      customerName: "Putra Nagara",
      customerPhone: customerPhone || "081234567890",
      customerEmail: "putra.nagara@example.com",
      quantity: 2,
      totalAmount: 1000000,
      status: "completed",
      paymentMethod: "VA BNI",
      invoiceNumber: "INV-20260825-001",
      createdAt: "2026-08-25T10:18:42+07:00",
      location: "Stadion Utama Gelora Bung Karno",
      eventDate: "2026-11-20 19:00:00.000 +0700",
      tickets: [
        {
          ticketNumber: 1,
          totalTickets: 2,
          ticketTitle: "TIKET VIP",
          category: "VIP",
          gate: "Pintu VIP (Gate 1)",
          bookingCode: "BOOKING-CODE-01-EXAMPLE",
          qrValue: "BOOKING-CODE-01-EXAMPLE",
          holderName: "Putra Nagara"
        },
        {
          ticketNumber: 2,
          totalTickets: 2,
          ticketTitle: "TIKET REGULAR",
          category: "Regular",
          gate: "Pintu A (Gate 3)",
          bookingCode: "BOOKING-CODE-02-EXAMPLE",
          qrValue: "BOOKING-CODE-02-EXAMPLE",
          holderName: "Putra Nagara"
        }
      ]
    },
    {
      id: "ord-run-2026-002",
      transactionId: "ord-run-2026-002",
      orderType: "event",
      serviceId: "run-004",
      serviceName: "BNI Marathon 2026 - 10K",
      eventName: "BNI Marathon 2026 - 10K",
      customerName: "Putra Nagara",
      customerPhone: customerPhone || "081234567890",
      customerEmail: "putra.nagara@example.com",
      quantity: 1,
      totalAmount: 350000,
      status: "completed",
      paymentMethod: "VA BNI",
      invoiceNumber: "INV-20260901-002",
      createdAt: "2026-09-01T08:30:00+07:00",
      location: "Plaza Selatan Gelora Bung Karno",
      eventDate: "2026-10-15 05:30:00.000 +0700",
      tickets: [
        {
          ticketNumber: 1,
          totalTickets: 1,
          ticketTitle: "TIKET 10K RUNNER",
          category: "10K Master",
          gate: "Wave 1 - Gate Start",
          bookingCode: "BNI-RUN-10K-9912",
          qrValue: "BNI-RUN-10K-9912",
          holderName: "Putra Nagara"
        }
      ]
    }
  ];

  const finalData = formattedData.length > 0 ? formattedData : dummyList;

  return c.json({ data: finalData, dataProtected: { historyList: finalData } });
});

// ----------------------------------------------------------------------
// GET /api/orders/:id - Get single order detail
// ----------------------------------------------------------------------
orderRoutes.get("/:id", async (c) => {
  const orderId = c.req.param("id");
  const ord = await db.query.serviceOrders.findFirst({
    where: eq(serviceOrders.id, orderId)
  });

  if (ord) {
    const tix = await db.query.issuedTickets.findMany({
      where: eq(issuedTickets.orderId, ord.id)
    });
    const ticketsFormatted = tix.map((t: any, idx: number) => ({
      ticketNumber: idx + 1,
      totalTickets: tix.length,
      ticketTitle: `TIKET ${(t.ticketName || 'REGULER').toUpperCase()}`,
      category: t.ticketCategory || t.ticketName || "Regular",
      gate: "Pintu A",
      bookingCode: t.qrCode || `BOOKING-CODE-0${idx + 1}`,
      qrValue: t.qrCode || `BOOKING-CODE-0${idx + 1}`,
      holderName: t.participantName || ord.customerName
    }));

    const ordStatus = (ord.status || 'COMPLETED').toUpperCase();
    const responseObj = {
      ...ord,
      transactionId: ord.id,
      status: ordStatus === 'COMPLETED' ? 'SUCCESS' : ordStatus,
      coreBankingRef: ord.invoiceNumber || `REF-${ord.id.slice(0, 8).toUpperCase()}`,
      transactionDate: ord.createdAt,
      eventName: ord.serviceName,
      eventDate: ord.createdAt,
      location: "Venue Utama BNI Lifestyle",
      fullName: ord.customerName,
      accountName: ord.customerName,
      accountNumber: ord.vaNumber || "123456789",
      accountProductName: "Taplus Bisnis BNI",
      formattedTotalAmount: `Rp ${(ord.totalAmount || 0).toLocaleString('id-ID')}`,
      products: ticketsFormatted.length > 0 ? ticketsFormatted : [
        {
          productId: "p-01",
          productName: "Regular",
          bookingCode: `BOOKING-${ord.id.slice(0, 6).toUpperCase()}-01`,
          qrValue: `BOOKING-${ord.id.slice(0, 6).toUpperCase()}-01`,
          holderName: ord.customerName
        }
      ]
    };
    return c.json({ data: responseObj, dataProtected: responseObj });
  }

  // Fallback dummy order for testing
  const dummyDetail = {
    transactionId: orderId,
    status: "SUCCESS",
    coreBankingRef: "1234567890123",
    transactionDate: "2026-08-25T10:18:42+07:00",
    eventName: "Konser Musik Andrea Bocelli 2026",
    eventDate: "2026-11-20 19:00:00.000 +0700",
    location: "Stadion Utama Gelora Bung Karno",
    fullName: "Putra Nagara",
    accountName: "Putra Nagara",
    accountNumber: "123456789",
    accountProductName: "Taplus Bisnis BNI",
    formattedTotalAmount: "Rp 1.000.000",
    products: [
      {
        productId: "8Jz3nR2qXpL9mV1kT",
        productName: "VIP",
        bookingCode: "BOOKING-CODE-01-EXAMPLE",
        qrValue: "BOOKING-CODE-01-EXAMPLE",
        holderName: "Putra Nagara"
      },
      {
        productId: "kR7wQ4sD1nF8yB2eC",
        productName: "Regular",
        bookingCode: "BOOKING-CODE-02-EXAMPLE",
        qrValue: "BOOKING-CODE-02-EXAMPLE",
        holderName: "Putra Nagara"
      }
    ]
  };

  return c.json({ data: dummyDetail, dataProtected: dummyDetail });
});

// ----------------------------------------------------------------------
// POST /api/orders - Create new order
// ----------------------------------------------------------------------
orderRoutes.post("/", zValidator("json", createOrderSchema), async (c) => {
  const payload = c.req.valid("json");
  const id = crypto.randomUUID();
  const resolved = await resolveVendorAndName(payload.orderType, payload.serviceId);
  const rawPayload = payload as any;
  const serviceName = rawPayload.serviceName && rawPayload.serviceName !== "Service" ? rawPayload.serviceName : resolved.serviceName;
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
    // If order was not created beforehand, create it as completed directly
    const orderType = body.orderType || "event";
    const serviceId = body.serviceId || "run-004";
    const resolved = await resolveVendorAndName(orderType, serviceId);
    const serviceName = body.serviceName && body.serviceName !== "Service" ? body.serviceName : resolved.serviceName;
    const vendorUserId = resolved.vendorUserId;
    const invoiceNumber = `INV-${Date.now()}-${orderId.slice(-4).toUpperCase()}`;

    const newOrders = await db.insert(serviceOrders).values({
      id: orderId,
      orderType,
      serviceId,
      serviceName,
      vendorUserId,
      customerName: body.customerName || "User Lifestyle",
      customerPhone: body.customerPhone || "-",
      notes: body.notes || `Order ${orderType}: ${body.customerName || 'User Lifestyle'}`,
      quantity: Number(body.quantity || (body.tickets ? body.tickets.length : 1)),
      totalAmount: Number(body.totalAmount || 0),
      paymentMethod: body.paymentMethod || 'VA',
      status: 'completed',
      invoiceNumber,
      orderPayload: body.orderPayload || body,
      completedAt: new Date().toISOString(),
    }).returning();

    await handleOrderCompletion(newOrders[0], body);
    return c.json({ success: true, message: "Payment completed successfully", data: newOrders[0] });
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