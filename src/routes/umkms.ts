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
  templates: z
    .object({
      index: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
      detail: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
    })
    .optional(),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional(),
  bannerUrl: z.array(z.string()).min(1),
  isActive: z.number().int().min(0).max(1).optional(),
  products: z.array(productSchema).min(1),
});

umkmRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const category = c.req.query("category");
  const isAdmin = user.role === "admin";

  const whereClause = category
    ? isAdmin
      ? eq(umkms.category, category)
      : and(eq(umkms.userId, user.sub), eq(umkms.category, category))
    : isAdmin
      ? undefined
      : eq(umkms.userId, user.sub);

  const data = await db.query.umkms.findMany({
    where: whereClause,
    orderBy: [desc(umkms.createdAt)],
  });

  return c.json({ data });
});

umkmRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const data = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });

  if (!data) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);
  return c.json({ data });
});

umkmRoutes.post("/", zValidator("json", umkmSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const payload = c.req.valid("json");
  const id = crypto.randomUUID();

  const { bannerUrl, products, ...rest } = payload;

  await db.insert(umkms).values({
    id,
    ...rest,
    images: bannerUrl,
    bannerUrl: bannerUrl[0],
    products: products.map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
      isAvailable: p.isAvailable ?? true,
    })),
    userId: user.sub,
    isActive: 0,
  });

  return c.json({ success: true, id }, 201);
});

umkmRoutes.put("/:id", zValidator("json", umkmSchema.partial()), async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const isAdmin = user.role === "admin";

  const existing = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });

  if (!existing) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);

  const { bannerUrl, products, ...rest } = payload;

  if (!isAdmin) delete (rest as any).isActive;

  await db
    .update(umkms)
    .set({
      ...rest,
      ...(bannerUrl !== undefined && {
        images: bannerUrl,
        bannerUrl: bannerUrl[0],
      }),
      ...(products !== undefined && {
        products: products.map((p) => ({
          ...p,
          id: p.id || crypto.randomUUID(),
          isAvailable: p.isAvailable ?? true,
        })),
      }),
      updatedAt: new Date().toISOString(),
    })
    .where(isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)));

  return c.json({ success: true });
});

umkmRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const existing = await db.query.umkms.findFirst({
    where: isAdmin ? eq(umkms.id, id) : and(eq(umkms.id, id), eq(umkms.userId, user.sub)),
  });

  if (!existing) return c.json({ error: "Data UMKM tidak ditemukan" }, 404);

  await db.delete(umkms).where(eq(umkms.id, id));

  return c.json({ success: true });
});
