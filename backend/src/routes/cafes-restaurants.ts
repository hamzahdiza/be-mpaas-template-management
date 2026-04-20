import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { cafesRestaurants } from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
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
  templates: z
    .object({
      index: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
      detail: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
    })
    .optional(),
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
  menuItems: z.array(menuItemSchema).min(1),
});

cafeRestaurantRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const category = c.req.query("category");
  const isAdmin = user.role === "admin";

  const whereClause = category
    ? isAdmin
      ? eq(cafesRestaurants.category, category)
      : and(eq(cafesRestaurants.userId, user.sub), eq(cafesRestaurants.category, category))
    : isAdmin
      ? undefined
      : eq(cafesRestaurants.userId, user.sub);

  const data = await db.query.cafesRestaurants.findMany({
    where: whereClause,
    orderBy: [desc(cafesRestaurants.createdAt)],
  });

  return c.json({ data });
});

cafeRestaurantRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const data = await db.query.cafesRestaurants.findFirst({
    where: isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)),
  });

  if (!data) return c.json({ error: "Data cafe/restoran tidak ditemukan" }, 404);
  return c.json({ data });
});

cafeRestaurantRoutes.post("/", zValidator("json", cafeRestaurantSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const payload = c.req.valid("json");
  const id = uuidv4();

  const { bannerUrl, menuItems, ...rest } = payload;

  await db.insert(cafesRestaurants).values({
    id,
    ...rest,
    images: bannerUrl,
    bannerUrl: bannerUrl[0],
    menuItems: menuItems.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
      isAvailable: item.isAvailable ?? true,
    })),
    userId: user.sub,
  });

  return c.json({ success: true, id }, 201);
});

cafeRestaurantRoutes.put("/:id", zValidator("json", cafeRestaurantSchema.partial()), async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const isAdmin = user.role === "admin";

  const { bannerUrl, menuItems, ...rest } = payload;
  const updatePayload: Record<string, any> = {
    ...rest,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  };

  if (bannerUrl && bannerUrl.length > 0) {
    updatePayload.images = bannerUrl;
    updatePayload.bannerUrl = bannerUrl[0];
  }

  if (menuItems) {
    updatePayload.menuItems = menuItems.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
      isAvailable: item.isAvailable ?? true,
    }));
  }

  const updated = await db
    .update(cafesRestaurants)
    .set(updatePayload)
    .where(isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)))
    .returning();

  if (!updated.length) return c.json({ error: "Data tidak ditemukan / tidak berizin" }, 404);
  return c.json({ success: true, data: updated[0] });
});

cafeRestaurantRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const deleted = await db
    .delete(cafesRestaurants)
    .where(isAdmin ? eq(cafesRestaurants.id, id) : and(eq(cafesRestaurants.id, id), eq(cafesRestaurants.userId, user.sub)))
    .returning();

  if (!deleted.length) return c.json({ error: "Data tidak ditemukan / tidak berizin" }, 404);
  return c.json({ success: true, data: deleted[0] });
});
