import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { rentals } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
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
  vehicles: z.array(vehicleSchema).min(1),
});

rentalRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload") as any;
  const category = c.req.query("category");
  const isAdmin = user.role === "admin";

  const whereClause = category
    ? isAdmin
      ? eq(rentals.category, category)
      : and(eq(rentals.userId, user.sub), eq(rentals.category, category))
    : isAdmin
      ? undefined
      : eq(rentals.userId, user.sub);

  const data = await db.query.rentals.findMany({
    where: whereClause,
    orderBy: [desc(rentals.createdAt)],
  });

  return c.json({ data });
});

rentalRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const data = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });

  if (!data) return c.json({ error: "Data rental tidak ditemukan" }, 404);
  return c.json({ data });
});

rentalRoutes.post("/", zValidator("json", rentalSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const payload = c.req.valid("json");
  const id = uuidv4();

  const { bannerUrl, vehicles, ...rest } = payload;

  await db.insert(rentals).values({
    id,
    ...rest,
    images: bannerUrl,
    bannerUrl: bannerUrl[0],
    vehicles: vehicles.map((v) => ({
      ...v,
      id: v.id || uuidv4(),
      isAvailable: v.isAvailable ?? true,
    })),
    userId: user.sub,
  });

  return c.json({ success: true, id }, 201);
});

rentalRoutes.put("/:id", zValidator("json", rentalSchema), async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const isAdmin = user.role === "admin";

  const existing = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });

  if (!existing) return c.json({ error: "Data rental tidak ditemukan" }, 404);

  const { bannerUrl, vehicles, ...rest } = payload;

  await db
    .update(rentals)
    .set({
      ...rest,
      images: bannerUrl,
      bannerUrl: bannerUrl[0],
      vehicles: vehicles.map((v) => ({
        ...v,
        id: v.id || uuidv4(),
        isAvailable: v.isAvailable ?? true,
      })),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(rentals.id, id));

  return c.json({ success: true });
});

rentalRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload") as any;
  const id = c.req.param("id");
  const isAdmin = user.role === "admin";

  const existing = await db.query.rentals.findFirst({
    where: isAdmin ? eq(rentals.id, id) : and(eq(rentals.id, id), eq(rentals.userId, user.sub)),
  });

  if (!existing) return c.json({ error: "Data rental tidak ditemukan" }, 404);

  await db.delete(rentals).where(eq(rentals.id, id));

  return c.json({ success: true });
});
