import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { cafesRestaurants, events, hotels, serviceOrders } from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../middleware/auth";

export const orderRoutes = new Hono();

const createOrderSchema = z.object({
  orderType: z.enum(["event", "hotel", "cafe", "restaurant"]),
  serviceId: z.string().min(1),
  customerName: z.string().min(2),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  quantity: z.number().int().min(1).optional().default(1),
  totalAmount: z.number().min(0).optional().default(0),
  orderPayload: z.record(z.string(), z.any()).optional().default({}),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed"]),
});

async function resolveVendorAndName(orderType: string, serviceId: string) {
  if (orderType === "event") {
    const data = await db.query.events.findFirst({ where: eq(events.id, serviceId) });
    return { vendorUserId: data?.userId || null, serviceName: data?.name || "Event" };
  }
  if (orderType === "hotel") {
    const data = await db.query.hotels.findFirst({ where: eq(hotels.id, serviceId) });
    return { vendorUserId: data?.userId || null, serviceName: data?.name || "Hotel" };
  }
  const data = await db.query.cafesRestaurants.findFirst({ where: eq(cafesRestaurants.id, serviceId) });
  return { vendorUserId: data?.userId || null, serviceName: data?.name || "Cafe/Restoran" };
}

orderRoutes.get("/", async (c) => {
  const authResult = await authMiddleware(c, async () => {});
  if (authResult) return authResult as any;

  const user = c.get("jwtPayload") as any;
  const status = c.req.query("status");
  const orderType = c.req.query("orderType");

  const clauses = [eq(serviceOrders.vendorUserId, user.sub)];
  if (status) clauses.push(eq(serviceOrders.status, status));
  if (orderType) clauses.push(eq(serviceOrders.orderType, orderType));

  const data = await db.query.serviceOrders.findMany({
    where: and(...clauses),
    orderBy: [desc(serviceOrders.createdAt)],
  });

  return c.json({ data });
});

orderRoutes.post("/", zValidator("json", createOrderSchema), async (c) => {
  const payload = c.req.valid("json");
  const id = uuidv4();
  const { vendorUserId, serviceName } = await resolveVendorAndName(payload.orderType, payload.serviceId);

  await db.insert(serviceOrders).values({
    id,
    ...payload,
    serviceName,
    vendorUserId: vendorUserId || null,
  });

  return c.json({ success: true, id }, 201);
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
