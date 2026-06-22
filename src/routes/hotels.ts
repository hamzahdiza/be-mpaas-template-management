import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { hotels, hotelCategories } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { verify } from 'hono/jwt'

export const hotelRoutes = new Hono();
import { authMiddleware } from '../middleware/auth';
hotelRoutes.use('*', authMiddleware);

// --- SCHEMAS ---
const hotelCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  roomType: z.string().optional(),
  description: z.string().optional(),
  pricePerNight: z.number().min(0),
  capacity: z.number().int().default(2),
  stock: z.number().int().default(5),
  bedConfig: z.object({
    type: z.string(),
    count: z.number().int()
  }).optional(),
  roomAmenities: z.array(z.string()).optional().default([]),
  bathAmenities: z.array(z.string()).optional().default([]),
  images: z.array(z.string().url()).min(1),
  isAvailable: z.boolean().optional().default(true),
});

const hotelSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  templates: z.object({
    index: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
    hotelDetail: z.object({ id: z.number(), title: z.string().optional(), bannerUrl: z.string().optional() }),
  }).optional(),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional(),
  starRating: z.number().min(0).max(5).optional(),
  bannerUrl: z.array(z.string().url()).min(1),
  isActive: z.number().int().min(0).max(1).optional(),
  categories: z.array(hotelCategorySchema).min(1),
});

// --- ROUTES ---

// 1. GET ALL (User Specific)
hotelRoutes.get('/', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const data = await db.query.hotels.findMany({
    where: isAdmin ? undefined : eq(hotels.userId, user.sub),
    orderBy: [desc(hotels.createdAt)],
    with: { categories: true }
  });
  return c.json({ data });
});

// 2. GET DETAIL
hotelRoutes.get('/:id', async (c) => {
  const hotelId = c.req.param('id');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';

  const data = await db.query.hotels.findFirst({
    where: isAdmin ? eq(hotels.id, hotelId) : and(eq(hotels.id, hotelId), eq(hotels.userId, user.sub)),
    with: { categories: true }
  });

  if (!data) return c.json({ error: 'Hotel tidak ditemukan' }, 404);
  return c.json({ data });
});

// 3. POST (Create)
hotelRoutes.post('/', zValidator('json', hotelSchema), async (c) => {
  console.log("<<< data"); 
  const data = c.req.valid('json');
  const user = c.get('jwtPayload') as any;
  const hotelId = crypto.randomUUID();

  
  try {
    const { categories, bannerUrl, ...hotelData } = data;

    await db.insert(hotels).values({
      id: hotelId,
      ...hotelData,
      images: bannerUrl,
      bannerUrl: bannerUrl[0],
      userId: user.sub,
      isActive: 0,
    });

    if (categories.length > 0) {
      await db.insert(hotelCategories).values(
        categories.map(cat => ({
          ...cat,
          id: crypto.randomUUID(),
          hotelId,
          isAvailable: cat.isAvailable ? 1 : 0
        }))
      );
    }

    return c.json({ success: true, id: hotelId }, 201);
  } catch (error: any) {
    console.log(error, "<<< ERROR POST");
    
    return c.json({ error: error.message }, 500);
  }
});

// 4. PUT 
hotelRoutes.put('/:id', zValidator('json', hotelSchema.partial()), async (c) => {
  const hotelId = c.req.param('id');
  const data = c.req.valid('json');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';

  try {
    const { categories, bannerUrl, ...hotelData } = data;

    if (!isAdmin) delete (hotelData as any).isActive;

    const updated = await db.update(hotels)
      .set({
        ...hotelData,
        ...(bannerUrl && bannerUrl.length > 0 && { images: bannerUrl, bannerUrl: bannerUrl[0] }),
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(isAdmin ? eq(hotels.id, hotelId) : and(eq(hotels.id, hotelId), eq(hotels.userId, user.sub)))
      .returning();

    if (updated.length === 0) return c.json({ error: 'Unauthorized/Not Found' }, 403);

    // Update categories (Delete & Re-insert)
    if (categories) {
      await db.delete(hotelCategories).where(eq(hotelCategories.hotelId, hotelId));
      await db.insert(hotelCategories).values(
        categories.map(cat => ({
          ...cat,
          id: crypto.randomUUID(),
          hotelId,
          isAvailable: cat.isAvailable ? 1 : 0
        }))
      );
    }

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// 5. DELETE
hotelRoutes.delete('/:id', async (c) => {
  const hotelId = c.req.param('id');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';

  const deleted = await db.delete(hotels)
    .where(isAdmin ? eq(hotels.id, hotelId) : and(eq(hotels.id, hotelId), eq(hotels.userId, user.sub)))
    .returning();

  if (deleted.length === 0) return c.json({ error: 'Gagal menghapus' }, 404);
  return c.json({ message: 'Hotel berhasil dihapus' });
});
