import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { umkms } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

export const umkmRoutes = new Hono();
umkmRoutes.use("*", authMiddleware);

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
  stock: z.number().optional().default(100),
});

const umkmSchema = z.object({
  category: z.enum(["product", "food", "service"]),
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
  products: z.array(productSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(["approved", "rejected", "requested"]),
  message: z.string().optional(),
});

umkmRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const category = c.req.query("category");
  const status = c.req.query("status");

  const filters: any[] = [];
  if (!isAdmin) filters.push(eq(umkms.userId, user.sub));
  if (category) filters.push(eq(umkms.category, category));
  if (status) filters.push(eq(umkms.approvalStatus, status as any));

  const whereClause = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters as [any, any, ...any[]]);
  const data = await db.query.umkms.findMany({ where: whereClause, orderBy: [desc(umkms.createdAt)] });
  return c.json({
    data: data.map((item: any) =>
      item.pendingData && item.isActive === 1 ? { ...item, ...item.pendingData } : item
    ),
  });
});

umkmRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const data = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });
  if (!data) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);

  if (data.pendingData && data.isActive === 1) {
    const pending = data.pendingData as any;
    return c.json({
      data: {
        ...data,
        ...pending,
        pendingData: data.pendingData,
        ...(isAdmin && { liveSnapshot: { products: data.products, bannerUrl: data.bannerUrl } }),
      },
    });
  }

  return c.json({ data });
});

umkmRoutes.post("/", zValidator("json", umkmSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const payload = c.req.valid("json");
  const { bannerUrl, products, ...rest } = payload;

  if (!isAdmin && !(user.roleType ?? []).includes("umkm"))
    return c.json({ error: "Access denied: umkm permission required" }, 403);

  const id = crypto.randomUUID();
  await db.insert(umkms).values({
    id, ...rest, images: bannerUrl, bannerUrl: bannerUrl[0],
    products: products.map((p) => ({ ...p, id: p.id || crypto.randomUUID(), isAvailable: p.isAvailable ?? true })),
    userId: user.sub, isActive: 0,
    approvalStatus: isAdmin ? "approved" : "requested",
    comments: [],
  });
  return c.json({ success: true, id }, 201);
});

umkmRoutes.put("/:id", zValidator("json", umkmSchema.partial()), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { bannerUrl, products, isActive: _isActive, message, ...rest } = c.req.valid("json");

  const existing = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });
  if (!existing) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);

  const newComment = (!isAdmin && message)
    ? { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: "requested", createdAt: new Date().toISOString() }
    : null;
  const updatedComments = newComment ? [...(existing.comments || []), newComment] : existing.comments;

  if (!isAdmin && existing.isActive === 1) {
    const pendingData: Record<string, any> = { ...rest };
    if (bannerUrl?.length) { pendingData.bannerUrl = bannerUrl[0]; pendingData.images = bannerUrl; }
    if (products) pendingData.products = products.map((p) => ({ ...p, id: p.id || crypto.randomUUID(), isAvailable: p.isAvailable ?? true }));

    await db.update(umkms).set({
      pendingData,
      approvalStatus: "requested",
      ...(newComment && { comments: updatedComments }),
      updatedAt: new Date().toISOString(),
    }).where(eq(umkms.id, id));
    return c.json({ success: true });
  }

  await db.update(umkms).set({
    ...rest,
    ...(bannerUrl?.length && { images: bannerUrl, bannerUrl: bannerUrl[0] }),
    ...(products && { products: products.map((p) => ({ ...p, id: p.id || crypto.randomUUID(), isAvailable: p.isAvailable ?? true })) }),
    ...(!isAdmin && { approvalStatus: "requested", isActive: 0, comments: updatedComments }),
    updatedAt: new Date().toISOString(),
  }).where(eq(umkms.id, id));

  return c.json({ success: true });
});

umkmRoutes.patch("/:id/status", zValidator("json", statusSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");
  const { status, message } = c.req.valid("json");

  if (status === "approved" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "rejected" && !isAdmin) return c.json({ error: "Forbidden" }, 403);
  if (status === "requested" && isAdmin) return c.json({ error: "Only vendors can resubmit" }, 403);
  if (status === "rejected" && !message) return c.json({ error: "Message required when rejecting" }, 400);

  const record = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });
  if (!record) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);

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
    await db.update(umkms).set({
      ...(record.pendingData as any),
      approvalStatus: "approved",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(umkms.id, id));
  } else if (status === "rejected" && isLiveEdit) {
    await db.update(umkms).set({
      approvalStatus: "rejected",
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(umkms.id, id));
  } else {
    await db.update(umkms).set({
      approvalStatus: status,
      comments,
      ...(status === "requested" && { isActive: 0 }),
      updatedAt: new Date().toISOString(),
    }).where(eq(umkms.id, id));
  }

  return c.json({ success: true });
});

umkmRoutes.patch("/:id/active", zValidator("json", z.object({ isActive: z.number().int().min(0).max(1) })), async (c) => {
  const user = c.get("jwtPayload") as any;
  if (user.role !== "admin") return c.json({ error: "Forbidden" }, 403);
  const id = c.req.param("id");
  const { isActive } = c.req.valid("json");

  const record = await db.query.umkms.findFirst({ where: eq(umkms.id, id) });
  if (!record) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);
  if (isActive === 1 && record.approvalStatus !== "approved")
    return c.json({ error: "Cannot activate unapproved listing" }, 400);

  await db.update(umkms).set({ isActive, updatedAt: new Date().toISOString() }).where(eq(umkms.id, id));
  return c.json({ success: true, isActive });
});

umkmRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const isAdmin = user.role === "admin";
  const id = c.req.param("id");

  const deleted = await db.delete(umkms)
    .where(isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)))
    .returning();
  if (!deleted.length) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);
  return c.json({ success: true });
});
