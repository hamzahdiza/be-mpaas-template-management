import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import {
  cafesRestaurants, events, hotels, rentals, runningEvents, serviceOrders, umkms, runningTickets,
  tickets
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
  notes: z.string().optional(),
  status: z.string().optional().default("completed"),
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
      let data = await db.query.events.findFirst({ where: eq(events.id, serviceId) });

      if (!data && serviceId.startsWith("EVENT-")) {
        const namePart = serviceId.replace("EVENT-", "").replace("-", " ");
        data = await db.query.events.findFirst({
          where: sql`LOWER(${events.name}) LIKE ${'%' + namePart.toLowerCase() + '%'}`
        });
      }

      if (!data) {
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
  const authResult = await authMiddleware(c, async () => { });
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

  if (authHeader && authHeader !== 'Bearer undefined' && authHeader !== 'Bearer null' && authHeader !== 'Bearer ') {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
      const token = authHeader.replace('Bearer ', '');
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

  console.log(`[GET /orders] Querying with serviceId: ${serviceId}, user: ${user?.sub}`);

  const data = await db.query.serviceOrders.findMany({
    where: clauses.length > 0 ? and(...clauses) : undefined,
    orderBy: [desc(serviceOrders.createdAt)],
  });

  console.log(`[GET /orders] Found ${data.length} records`);

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
  const authResult = await authMiddleware(c, async () => { });
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

const completePaymentSchema = z.object({
  serviceId: z.string().optional(),
  orderType: z.string().optional(),
  tickets: z.array(z.any()).optional(),
  paymentMethod: z.string().optional().default("VA")
});

orderRoutes.post("/:id/complete-payment", zValidator("json", completePaymentSchema), async (c) => {
  const orderId = c.req.param("id");
  const payload = c.req.valid("json");

  try {
    const existingOrder = await db.query.serviceOrders.findFirst({
      where: eq(serviceOrders.id, orderId)
    });

    if (!existingOrder) {
      return c.json({ error: "Order not found" }, 404);
    }

    const serviceId = payload.serviceId || existingOrder.serviceId;
    const purchasedTicketList = payload.tickets || (existingOrder.orderPayload as any)?.tickets || [];

    console.log("Processing complete-payment for Service ID:", serviceId);
    console.log("Purchased Ticket List:", JSON.stringify(purchasedTicketList, null, 2));

    for (const ticketItem of purchasedTicketList) {
      const qty = Number(ticketItem.ticketQty || ticketItem.total || (ticketItem.customerTicket ? ticketItem.customerTicket.length : 1));

      let candidateIds: string[] = [];
      if (ticketItem.ticketId) candidateIds.push(ticketItem.ticketId);
      if (ticketItem.id) candidateIds.push(ticketItem.id);
      if (typeof ticketItem.category3 === 'string') candidateIds.push(ticketItem.category3.split('_')[0]);
      if (typeof ticketItem.category2 === 'string') candidateIds.push(ticketItem.category2);
      if (typeof ticketItem.category === 'string') candidateIds.push(ticketItem.category);

      candidateIds = candidateIds.filter(id => Boolean(id) && typeof id === 'string');

      const candidateName = ticketItem.name ||
        ticketItem.ticketName ||
        ticketItem.title ||
        (ticketItem.customerTicket && ticketItem.customerTicket[0]?.ticketName) ||
        "";

      let runningTicketFound: any = null;

      for (const idToTry of candidateIds) {
        let t = await db.query.runningTickets.findFirst({
          where: eq(runningTickets.id, idToTry)
        });
        if (!t) {
          t = await db.query.runningTickets.findFirst({
            where: eq(runningTickets.categoryId, idToTry)
          });
        }
        if (t) {
          runningTicketFound = t;
          break;
        }
      }

      if (!runningTicketFound && serviceId) {
        const eventWithCats = await db.query.runningEvents.findFirst({
          where: eq(runningEvents.id, serviceId),
          with: {
            categories: {
              with: {
                tickets: true
              }
            }
          }
        });

        if (eventWithCats && eventWithCats.categories.length > 0) {
          for (const cat of eventWithCats.categories) {
            for (const t of cat.tickets) {
              if (
                candidateName &&
                (t.name.toLowerCase().includes(candidateName.toLowerCase()) ||
                  cat.name.toLowerCase().includes(candidateName.toLowerCase()))
              ) {
                runningTicketFound = t;
                break;
              }
            }
            if (runningTicketFound) break;
          }

          if (!runningTicketFound && eventWithCats.categories[0]?.tickets[0]) {
            runningTicketFound = eventWithCats.categories[0].tickets[0];
          }
        }
      }

      if (runningTicketFound) {
        const currentStock = Number(runningTicketFound.stock ?? 30);
        const currentOrder = Number(runningTicketFound.order ?? 0);

        const newStock = Math.max(0, currentStock - qty);
        const newOrder = currentOrder + qty;

        await db.update(runningTickets)
          .set({
            stock: newStock,
            order: newOrder,
            isAvailable: newStock > 0 ? 1 : 0
          })
          .where(eq(runningTickets.id, runningTicketFound.id));

        console.log(`[SUCCESS] Running Ticket "${runningTicketFound.name}" (${runningTicketFound.id}) Updated:`);
        console.log(`- Stock: ${currentStock} -> ${newStock}`);
        console.log(`- Order: ${currentOrder} -> ${newOrder}`);
        continue;
      }

      for (const idToTry of candidateIds) {
        const regTicket = await db.query.tickets.findFirst({
          where: eq(tickets.id, idToTry)
        });
        if (regTicket) {
          const curOrder = Number(regTicket.order ?? 0);
          await db.update(tickets)
            .set({
              order: curOrder + qty,
              isAvailable: 1
            })
            .where(eq(tickets.id, regTicket.id));
          break;
        }
      }
    }

    const updatedOrder = await db.update(serviceOrders)
      .set({
        status: "completed",
        paymentMethod: payload.paymentMethod || "VA",
        invoiceNumber: `INV-${Date.now()}-${orderId.slice(-4).toUpperCase()}`,
        completedAt: new Date().toISOString(),
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(serviceOrders.id, orderId))
      .returning();

    return c.json({
      success: true,
      message: "Payment processed, stock deducted, and order count updated",
      data: updatedOrder[0]
    });

  } catch (error) {
    console.error("Error in complete-payment:", error);
    return c.json({ error: "Internal Server Error", details: String(error) }, 500);
  }
});