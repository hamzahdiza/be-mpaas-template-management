import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { hotels, hotelCategories } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const hotelRoutes = new Hono();
hotelRoutes.use('*', authMiddleware);

const hotelCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  roomType: z.string().optional(),
  description: z.string().optional(),
  pricePerNight: z.number().min(0),
  capacity: z.number().int().default(2),
  stock: z.number().int().default(5),
  bedConfig: z.object({ type: z.string(), count: z.number().int() }).optional(),
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
  locationUrl: z.string().optional().nullable(),
  starRating: z.number().min(0).max(5).optional(),
  bannerUrl: z.array(z.string().url()).min(1),
  isActive: z.number().int().min(0).max(1).optional(),
  message: z.string().optional(),
  categories: z.array(hotelCategorySchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'requested']),
  message: z.string().optional(),
});

hotelRoutes.get('/', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const status = c.req.query('status');

  const filters: any[] = [];
  if (!isAdmin) filters.push(eq(hotels.userId, user.sub));
  if (status) filters.push(eq(hotels.approvalStatus, status as any));

  const whereClause = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters as [any, any, ...any[]]);
  const data = await db.query.hotels.findMany({ where: whereClause, orderBy: [desc(hotels.createdAt)], with: { categories: true } });
  return c.json({
    data: data.map((item: any) => {
      if (item.pendingData && item.isActive === 1) {
        const { categories: pendingCategories, ...pendingRest } = item.pendingData as any;
        return { ...item, ...pendingRest, categories: pendingCategories ?? item.categories };
      }
      return item;
    }),
  });
});

hotelRoutes.get('/:id', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');

  const data = await db.query.hotels.findFirst({
    where: isAdmin ? eq(hotels.id, id) : and(eq(hotels.id, id), eq(hotels.userId, user.sub)),
    with: { categories: true },
  });
  if (!data) return c.json({ error: 'Hotel tidak ditemukan' }, 404);

  if (data.pendingData && data.isActive === 1) {
    const pending = data.pendingData as any;
    const liveCategories = data.categories;
    const displayCategories = pending.categories ?? liveCategories;
    return c.json({
      data: {
        ...data,
        ...Object.fromEntries(Object.entries(pending).filter(([k]) => k !== 'categories')),
        categories: displayCategories,
        pendingData: data.pendingData,
        ...(isAdmin && { liveSnapshot: { categories: liveCategories, bannerUrl: data.bannerUrl } }),
      },
    });
  }

  return c.json({ data });
});

hotelRoutes.post('/', zValidator('json', hotelSchema), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const { categories, bannerUrl, ...hotelData } = c.req.valid('json');

  if (!isAdmin && !(user.roleType ?? []).includes('hotel'))
    return c.json({ error: 'Access denied: hotel permission required' }, 403);

  const hotelId = crypto.randomUUID();
  await db.insert(hotels).values({
    id: hotelId, ...hotelData, images: bannerUrl, bannerUrl: bannerUrl[0],
    userId: user.sub, isActive: 0,
    approvalStatus: isAdmin ? 'approved' : 'requested',
    comments: [],
  });
  if (categories.length > 0) {
    await db.insert(hotelCategories).values(categories.map(cat => ({
      ...cat, id: crypto.randomUUID(), hotelId, isAvailable: cat.isAvailable ? 1 : 0,
    })));
  }
  return c.json({ success: true, id: hotelId }, 201);
});

hotelRoutes.put('/:id', zValidator('json', hotelSchema.partial()), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const hotelId = c.req.param('id');
  const { categories, bannerUrl, isActive: _isActive, message, ...hotelData } = c.req.valid('json');

  const existing = await db.query.hotels.findFirst({
    where: isAdmin ? eq(hotels.id, hotelId) : and(eq(hotels.id, hotelId), eq(hotels.userId, user.sub)),
  });
  if (!existing) return c.json({ error: 'Hotel tidak ditemukan' }, 404);

  const newComment = (!isAdmin && message)
    ? { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: 'requested', createdAt: new Date().toISOString() }
    : null;
  const updatedComments = newComment ? [...(existing.comments || []), newComment] : existing.comments;

  if (!isAdmin && existing.isActive === 1) {
    const pendingData: Record<string, any> = { ...hotelData };
    if (bannerUrl?.length) { pendingData.bannerUrl = bannerUrl[0]; pendingData.images = bannerUrl; }
    if (categories !== undefined) pendingData.categories = categories;

    await db.update(hotels).set({
      pendingData,
      approvalStatus: 'requested',
      ...(newComment && { comments: updatedComments }),
      updatedAt: sql`CURRENT_TIMESTAMP`,
    }).where(eq(hotels.id, hotelId));
    return c.json({ success: true });
  }

  await db.update(hotels).set({
    ...hotelData,
    ...(bannerUrl?.length && { images: bannerUrl, bannerUrl: bannerUrl[0] }),
    ...(!isAdmin && { approvalStatus: 'requested', isActive: 0, comments: updatedComments }),
    updatedAt: sql`CURRENT_TIMESTAMP`,
  }).where(eq(hotels.id, hotelId));

  if (categories !== undefined) {
    await db.delete(hotelCategories).where(eq(hotelCategories.hotelId, hotelId));
    if (categories.length > 0) {
      await db.insert(hotelCategories).values(categories.map(cat => ({
        ...cat, id: crypto.randomUUID(), hotelId, isAvailable: cat.isAvailable ? 1 : 0,
      })));
    }
  }
  return c.json({ success: true });
});

hotelRoutes.patch('/:id/status', zValidator('json', statusSchema), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');
  const { status, message } = c.req.valid('json');

  if (status === 'approved' && !isAdmin) return c.json({ error: 'Forbidden' }, 403);
  if (status === 'rejected' && !isAdmin) return c.json({ error: 'Forbidden' }, 403);
  if (status === 'requested' && isAdmin) return c.json({ error: 'Only vendors can resubmit' }, 403);
  if (status === 'rejected' && !message) return c.json({ error: 'Message required when rejecting' }, 400);

  const record = await db.query.hotels.findFirst({
    where: isAdmin ? eq(hotels.id, id) : and(eq(hotels.id, id), eq(hotels.userId, user.sub)),
  });
  if (!record) return c.json({ error: 'Hotel tidak ditemukan' }, 404);

  if (status === 'approved' && record.approvalStatus !== 'requested')
    return c.json({ error: 'Only requested items can be approved' }, 400);
  if (status === 'rejected' && record.approvalStatus !== 'requested')
    return c.json({ error: 'Only requested items can be rejected' }, 400);
  if (status === 'requested' && record.approvalStatus !== 'rejected')
    return c.json({ error: 'Only rejected items can be resubmitted' }, 400);

  const comments = message
    ? [...(record.comments || []), { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: status, createdAt: new Date().toISOString() }]
    : record.comments;

  const isLiveEdit = record.isActive === 1 && record.pendingData != null;

  if (status === 'approved' && isLiveEdit) {
    const { categories: pendingCategories, ...pendingFields } = record.pendingData as any;
    await db.update(hotels).set({
      ...(pendingFields as any),
      approvalStatus: 'approved',
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(hotels.id, id));
    if (pendingCategories !== undefined) {
      await db.delete(hotelCategories).where(eq(hotelCategories.hotelId, id));
      if (pendingCategories.length > 0) {
        await db.insert(hotelCategories).values(pendingCategories.map((cat: any) => ({
          ...cat, id: crypto.randomUUID(), hotelId: id, isAvailable: cat.isAvailable ? 1 : 0,
        })));
      }
    }
  } else if (status === 'rejected' && isLiveEdit) {
    await db.update(hotels).set({
      approvalStatus: 'rejected',
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(hotels.id, id));
  } else {
    await db.update(hotels).set({
      approvalStatus: status,
      comments,
      ...(status === 'requested' && { isActive: 0 }),
      updatedAt: new Date().toISOString(),
    }).where(eq(hotels.id, id));
  }

  return c.json({ success: true });
});

hotelRoutes.patch('/:id/active', zValidator('json', z.object({ isActive: z.number().int().min(0).max(1) })), async (c) => {
  const user = c.get('jwtPayload') as any;
  if (user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
  const id = c.req.param('id');
  const { isActive } = c.req.valid('json');

  const record = await db.query.hotels.findFirst({ where: eq(hotels.id, id) });
  if (!record) return c.json({ error: 'Hotel tidak ditemukan' }, 404);
  if (isActive === 1 && record.approvalStatus !== 'approved')
    return c.json({ error: 'Cannot activate unapproved listing' }, 400);

  await db.update(hotels).set({ isActive, updatedAt: new Date().toISOString() }).where(eq(hotels.id, id));
  return c.json({ success: true, isActive });
});

hotelRoutes.delete('/:id', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const hotelId = c.req.param('id');

  const deleted = await db.delete(hotels)
    .where(isAdmin ? eq(hotels.id, hotelId) : and(eq(hotels.id, hotelId), eq(hotels.userId, user.sub)))
    .returning();
  if (!deleted.length) return c.json({ error: 'Hotel tidak ditemukan' }, 404);
  return c.json({ success: true });
});
