import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { rentals } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

export const rentalRoutes = new Hono();
rentalRoutes.use("*", authMiddleware);

const vehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  transmission: z.enum(["manual", "automatic"]),
  capacity: z.number().min(1),
  pricePerDay: z.number().min(0),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
});

const rentalSchema = z.object({
  category: z.enum(["car", "motor"]),
  name: z.string().min(3),
  description: z.string().optional(),
  templates: z.object({
    index: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
    detail: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
  }).optional(),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional(),
  bannerUrl: z.array(z.string()).min(1),
  isActive: z.number().int().min(0).max(1).optional(),
  message: z.string().optional(),
  vehicles: z.array(vehicleSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(["approved", "rejected", "requested"]),
  message: z.string().optional(),
});

rentalRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const category = c.req.query("category");
  const status = c.req.query("status");

  const filters: any[] = [];
  if (!isAdmin) filters.push(eq(rentals.userId, user.sub));
  if (category) filters.push(eq(rentals.category, category));
  if (status) filters.push(eq(rentals.approvalStatus, status as any));

  const whereClause = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters as [any, any, ...any[]]);
  const data = await db.query.rentals.findMany({ where: whereClause, orderBy: [desc(rentals.createdAt)] });
  return c.json({
    data: data.map((item: any) =>
      item.pendingData && item.isActive === 1 ? { ...item, ...item.pendingData } : item
    ),
  });
});

rentalRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const data = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });
  if (!data) return c.json({ error: "Data rental tidak ditemukan" }, 404);

  if (data.pendingData && data.isActive === 1) {
    const pending = data.pendingData as any;
    return c.json({
      data: {
        ...data,
        ...pending,
        pendingData: data.pendingData,
        ...(isAdmin && { liveSnapshot: { vehicles: data.vehicles, bannerUrl: data.bannerUrl } }),
      },
    });
  }

  return c.json({ data });
});

rentalRoutes.post("/", zValidator("json", rentalSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const { bannerUrl, vehicles, ...rest } = c.req.valid("json");

  if (!isAdmin && !(user.roleType ?? []).includes("rental"))
    return c.json({ error: "Access denied: rental permission required" }, 403);

  const id = crypto.randomUUID();
  await db.insert(rentals).values({
    id, ...rest, images: bannerUrl, bannerUrl: bannerUrl[0],
    vehicles: vehicles.map((v) => ({ ...v, id: v.id || crypto.randomUUID(), isAvailable: v.isAvailable ?? true })),
    userId: user.sub, isActive: 0,
    approvalStatus: isAdmin ? "approved" : "requested",
    comments: [],
  });
  return c.json({ success: true, id }, 201);
});

rentalRoutes.put("/:id", zValidator("json", rentalSchema.partial()), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { bannerUrl, vehicles, isActive: _isActive, message, ...rest } = c.req.valid("json");

  const existing = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });
  if (!existing) return c.json({ error: "Data rental tidak ditemukan" }, 404);

  const newComment = (!isAdmin && message)
    ? { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: "requested", createdAt: new Date().toISOString() }
    : null;
  const updatedComments = newComment ? [...(existing.comments || []), newComment] : existing.comments;

  if (!isAdmin && existing.isActive === 1) {
    const pendingData: Record<string, any> = { ...rest };
    if (bannerUrl?.length) { pendingData.bannerUrl = bannerUrl[0]; pendingData.images = bannerUrl; }
    if (vehicles) pendingData.vehicles = vehicles.map((v) => ({ ...v, id: v.id || crypto.randomUUID(), isAvailable: v.isAvailable ?? true }));

    await db.update(rentals).set({
      pendingData,
      approvalStatus: "requested",
      ...(newComment && { comments: updatedComments }),
      updatedAt: new Date().toISOString(),
    }).where(eq(rentals.id, id));
    return c.json({ success: true });
  }

  await db.update(rentals).set({
    ...rest,
    ...(bannerUrl?.length && { images: bannerUrl, bannerUrl: bannerUrl[0] }),
    ...(vehicles && { vehicles: vehicles.map((v) => ({ ...v, id: v.id || crypto.randomUUID(), isAvailable: v.isAvailable ?? true })) }),
    ...(!isAdmin && { approvalStatus: "requested", isActive: 0, comments: updatedComments }),
    updatedAt: new Date().toISOString(),
  }).where(eq(rentals.id, id));

  return c.json({ success: true });
});

rentalRoutes.patch("/:id/status", zValidator("json", statusSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { status, message } = c.req.valid('json');

  if (status === "approved" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "rejected" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "requested" && isAdmin) return c.json({ error: "Only vendors can resubmit" }, 403);
  if (status === "rejected" && !message) return c.json({ error: "Message required when rejecting" }, 400);

  const record = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });
  if (!record) return c.json({ error: "Data rental tidak ditemukan" }, 404);

  if (status === "approved" && record.approvalStatus !== "requested")
    return c.json({ error: "Only requested items can be approved" }, 400);
  if (status === "rejected" && record.approvalStatus !== "requested")
    return c.json({ error: "Only requested items can be rejected" }, 400);
  if (status === "requested" && record.approvalStatus !== "rejected")
    return c.json({ error: "Only rejected items can be resubmitted" }, 400);

  const comments = message
    ? [...(record.comments || []), { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: status, createdAt: new Date().toISOString() }]
    : record.comments;

  const isLiveEdit = record.isActive === 1 && record.pendingData != null;

  if (status === "approved" && isLiveEdit) {
    await db.update(rentals).set({
      ...(record.pendingData as any),
      approvalStatus: "approved",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(rentals.id, id));
  } else if (status === "rejected" && isLiveEdit) {
    await db.update(rentals).set({
      approvalStatus: "rejected",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(rentals.id, id));
  } else {
    await db.update(rentals).set({
      approvalStatus: status,
      comments,
      ...(status === "requested" && { isActive: 0 }),
      updatedAt: new Date().toISOString(),
    }).where(eq(rentals.id, id));
  }

  return c.json({ success: true });
});

rentalRoutes.patch("/:id/active", zValidator("json", z.object({ isActive: z.number().int().min(0).max(1) })), async (c) => {
  const user = c.get("jwtPayload") as any;
  if (user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const id = c.req.param("id");
  const { isActive } = c.req.valid("json");

  const record = await db.query.rentals.findFirst({ where: eq(rentals.id, id) });
  if (!record) return c.json({ error: "Data rental tidak ditemukan" }, 404);
  if (isActive === 1 && record.approvalStatus !== "approved")
    return c.json({ error: "Cannot activate unapproved listing" }, 400);

  await db.update(rentals).set({ isActive, updatedAt: new Date().toISOString() }).where(eq(rentals.id, id));
  return c.json({ success: true, isActive });
});

rentalRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const deleted = await db.delete(rentals)
    .where(isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)))
    .returning();
  if (!deleted.length) return c.json({ error: "Data rental tidak ditemukan" }, 404);
  return c.json({ success: true });
});
