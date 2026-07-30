import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { cafesRestaurants } from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

export const cafeRestaurantRoutes = new Hono();
cafeRestaurantRoutes.use("*", authMiddleware);

const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
});

const cafeRestaurantSchema = z.object({
  category: z.enum(["cafe", "restaurant"]),
  name: z.string().min(3),
  description: z.string().optional(),
  templates: z.object({
    index: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
    detail: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
  }).optional(),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional(),
  halalStatus: z.enum(["halal-certified", "muslim-friendly", "non-halal"]).optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  priceRangeMin: z.number().min(0).optional(),
  priceRangeMax: z.number().min(0).optional(),
  bannerUrl: z.array(z.string()).min(1),
  amenities: z.array(z.string()).optional().default([]),
  isActive: z.number().int().min(0).max(1).optional(),
  message: z.string().optional(),
  menuItems: z.array(menuItemSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(["approved", "rejected", "requested"]),
  message: z.string().optional(),
});

cafeRestaurantRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const category = c.req.query("category");
  const status = c.req.query("status");

  const filters: any[] = [];
  if (!isAdmin) filters.push(eq(cafesRestaurants.userId, user.sub));
  if (category) filters.push(eq(cafesRestaurants.category, category));
  if (status) filters.push(eq(cafesRestaurants.approvalStatus, status as any));

  const whereClause = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters as [any, any, ...any[]]);
  const data = await db.query.cafesRestaurants.findMany({ where: whereClause, orderBy: [desc(cafesRestaurants.createdAt)] });
  return c.json({
    data: data.map((item: any) =>
      item.pendingData && item.isActive === 1 ? { ...item, ...item.pendingData } : item
    ),
  });
});

cafeRestaurantRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const data = await db.query.cafesRestaurants.findFirst({
    where: isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)),
  });
  if (!data) return c.json({ error: "Data cafe/restoran tidak ditemukan" }, 404);

  if (data.pendingData && data.isActive === 1) {
    const pending = data.pendingData as any;
    return c.json({
      data: {
        ...data,
        ...pending,
        pendingData: data.pendingData,
        ...(isAdmin && { liveSnapshot: { menuItems: data.menuItems, bannerUrl: data.bannerUrl } }),
      },
    });
  }

  return c.json({ data });
});

cafeRestaurantRoutes.post("/", zValidator("json", cafeRestaurantSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const payload = c.req.valid("json");
  const { bannerUrl, menuItems, ...rest } = payload;

  if (!isAdmin && !(user.roleType ?? []).includes(payload.category))
    return c.json({ error: `Access denied: ${payload.category} permission required` }, 403);

  const id = crypto.randomUUID();
  await db.insert(cafesRestaurants).values({
    id, ...rest, images: bannerUrl, bannerUrl: bannerUrl[0],
    menuItems: menuItems.map((item) => ({ ...item, id: item.id || crypto.randomUUID(), isAvailable: item.isAvailable ?? true })),
    userId: user.sub, isActive: 0,
    approvalStatus: isAdmin ? "approved" : "requested",
    comments: [],
  });
  return c.json({ success: true, id }, 201);
});

cafeRestaurantRoutes.put("/:id", zValidator("json", cafeRestaurantSchema.partial()), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { bannerUrl, menuItems, isActive: _isActive, message, ...rest } = c.req.valid("json");

  const existing = await db.query.cafesRestaurants.findFirst({
    where: isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)),
  });
  if (!existing) return c.json({ error: "Data tidak ditemukan" }, 404);

  const newComment = (!isAdmin && message)
    ? { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: "requested", createdAt: new Date().toISOString() }
    : null;
  const updatedComments = newComment ? [...(existing.comments || []), newComment] : existing.comments;

  if (!isAdmin && existing.isActive === 1) {
    const pendingData: Record<string, any> = { ...rest };
    if (bannerUrl?.length) { pendingData.bannerUrl = bannerUrl[0]; pendingData.images = bannerUrl; }
    if (menuItems) pendingData.menuItems = menuItems.map((item) => ({ ...item, id: item.id || crypto.randomUUID(), isAvailable: item.isAvailable ?? true }));

    await db.update(cafesRestaurants).set({
      pendingData,
      approvalStatus: "requested",
      ...(newComment && { comments: updatedComments }),
      updatedAt: new Date().toISOString(),
    }).where(eq(cafesRestaurants.id, id));
    return c.json({ success: true });
  }

  await db.update(cafesRestaurants).set({
    ...rest,
    ...(bannerUrl?.length && { images: bannerUrl, bannerUrl: bannerUrl[0] }),
    ...(menuItems && { menuItems: menuItems.map((item) => ({ ...item, id: item.id || crypto.randomUUID(), isAvailable: item.isAvailable ?? true })) }),
    ...(!isAdmin && { approvalStatus: "requested", isActive: 0, comments: updatedComments }),
    updatedAt: sql`CURRENT_TIMESTAMP`,
  }).where(eq(cafesRestaurants.id, id));

  return c.json({ success: true });
});

cafeRestaurantRoutes.patch("/:id/status", zValidator("json", statusSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { status, message } = c.req.valid("json");

  if (status === "approved" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "rejected" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "requested" && isAdmin) return c.json({ error: "Only vendors can resubmit" }, 403);
  if (status === "rejected" && !message) return c.json({ error: "Message required when rejecting" }, 400);

  const record = await db.query.cafesRestaurants.findFirst({
    where: isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)),
  });
  if (!record) return c.json({ error: "Data cafe/restoran tidak ditemukan" }, 404);

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
    await db.update(cafesRestaurants).set({
      ...(record.pendingData as any),
      approvalStatus: "approved",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(cafesRestaurants.id, id));
  } else if (status === "rejected" && isLiveEdit) {
    await db.update(cafesRestaurants).set({
      approvalStatus: "rejected",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(cafesRestaurants.id, id));
  } else {
    await db.update(cafesRestaurants).set({
      approvalStatus: status,
      comments,
      ...(status === "requested" && { isActive: 0 }),
      updatedAt: new Date().toISOString(),
    }).where(eq(cafesRestaurants.id, id));
  }

  return c.json({ success: true });
});

cafeRestaurantRoutes.patch("/:id/active", zValidator("json", z.object({ isActive: z.number().int().min(0).max(1) })), async (c) => {
  const user = c.get("jwtPayload") as any;
  if (user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const id = c.req.param("id");
  const { isActive } = c.req.valid("json");

  const record = await db.query.cafesRestaurants.findFirst({ where: eq(cafesRestaurants.id, id) });
  if (!record) return c.json({ error: "Data cafe/restoran tidak ditemukan" }, 404);
  if (isActive === 1 && record.approvalStatus !== "approved")
    return c.json({ error: "Cannot activate unapproved listing" }, 400);

  await db.update(cafesRestaurants).set({ isActive, updatedAt: new Date().toISOString() }).where(eq(cafesRestaurants.id, id));
  return c.json({ success: true, isActive });
});

cafeRestaurantRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const deleted = await db.delete(cafesRestaurants)
    .where(isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)))
    .returning();
  if (!deleted.length) return c.json({ error: "Data tidak ditemukan" }, 404);
  return c.json({ success: true });
});
