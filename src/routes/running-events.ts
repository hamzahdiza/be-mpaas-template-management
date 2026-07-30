import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { runningEvents, runningCategories, runningTickets } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

export const runningEventRoutes = new Hono();
runningEventRoutes.use('*', authMiddleware);

const runningEventSchema = z.object({
  name: z.string().min(3),
  eventType: z.enum(['internal', 'external']).optional().default('internal'),
  externalUrl: z.string().optional(),
  description: z.string().optional(),
  vendorConfig: z.object({ purchaseMode: z.enum(['single', 'multiple']).optional() }).optional(),
  templateId: z.number().int().min(1).max(5).optional().default(1),
  templates: z.object({ index: z.any(), bookTicket: z.any(), visitorList: z.any(), visitorInput: z.any() }).optional(),
  startDate: z.string(),
  endDate: z.string(),
  price: z.number().min(0),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional().nullable(),
  seatingPlanUrl: z.string().optional().nullable(),
  termsAndConditions: z.string().optional().nullable(),
  bannerUrl: z.string().optional(),
  bannerUrls: z.array(z.string()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  socials: z.object({
    instagram: z.object({ url: z.string(), visible: z.boolean() }).optional(),
    website: z.object({ url: z.string(), visible: z.boolean() }).optional(),
  }).optional(),
  themeColor: z.string().default('#FFFFFF'),
  isActive: z.number().int().min(0).max(1).optional(),
  message: z.string().optional(),
  paymentMethod: z.enum(['biller', 'transfer']).optional(),
  accountNumber: z.string().optional(),
  ticketCategories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    maxPrice: z.number().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
  })).optional(),
  tickets: z.array(z.object({
    ticketId: z.string(),
    ticketName: z.string(),
    category: z.string(),
    type: z.enum(['normal', 'b1g1', 'discount']).optional().default('normal'),
    price: z.number(),
    normalPrice: z.number().optional(),
    stock: z.number().int().optional(),
    description: z.string().optional(),
    isAvailable: z.union([z.number(), z.boolean()]).optional(),
  })).optional(),
});

const statusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'requested']),
  message: z.string().optional(),
});

async function upsertRunningTickets(eventId: string, cats: any[], tix: any[]) {
  await db.delete(runningCategories).where(eq(runningCategories.runningEventId, eventId));
  const catMap = new Map<string, string>();
  if (cats?.length) {
    await db.insert(runningCategories).values(cats.map(cat => {
      const newId = crypto.randomUUID(); catMap.set(cat.id, newId);
      return { id: newId, runningEventId: eventId, name: cat.name, price: cat.price, maxPrice: cat.maxPrice || null, description: cat.description || null, status: cat.status || 'available' };
    }));
  }
  if (tix?.length) {
    await db.insert(runningTickets).values(tix.map(t => ({
      id: crypto.randomUUID(), categoryId: catMap.get(t.category) || t.category,
      name: t.ticketName, type: t.type || 'normal', price: t.price,
      normalPrice: t.normalPrice || null, stock: t.stock ?? 100, description: t.description || null,
      isAvailable: typeof t.isAvailable === 'boolean' ? (t.isAvailable ? 1 : 0) : (t.isAvailable ?? 1),
    })));
  }
}

runningEventRoutes.get('/', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const status = c.req.query('status');

  const filters: any[] = [];
  if (!isAdmin) filters.push(eq(runningEvents.userId, user.sub));
  if (status) filters.push(eq(runningEvents.approvalStatus, status as any));

  const whereClause = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters as [any, any, ...any[]]);
  const data = await db.query.runningEvents.findMany({
    where: whereClause, orderBy: [desc(runningEvents.createdAt)],
    with: { categories: { with: { tickets: true } } },
  });
  return c.json({
    data: data.map((ev: any) => {
      const base = { ...ev, vendorConfig: { ...(ev.vendorConfig || {}), purchaseMode: ev.vendorConfig?.purchaseMode || 'multiple' } };
      if (ev.pendingData && ev.isActive === 1) {
        const pending = ev.pendingData as any;
        const liveFlatTickets = ev.categories.flatMap((cat: any) =>
          cat.tickets.map((t: any) => ({ ticketId: t.id, ticketName: t.name, category: cat.id, type: t.type, price: t.price, normalPrice: t.normalPrice, description: t.description, isAvailable: t.isAvailable }))
        );
        return {
          ...base,
          ...Object.fromEntries(Object.entries(pending).filter(([k]) => k !== 'ticketCategories' && k !== 'tickets')),
          ticketCategories: pending.ticketCategories ?? ev.categories.map((cat: any) => ({ id: cat.id, name: cat.name, price: cat.price, maxPrice: cat.maxPrice || 0, description: cat.description || '', status: cat.status || 'available' })),
          tickets: pending.tickets ?? liveFlatTickets,
        };
      }
      return base;
    }),
  });
});

runningEventRoutes.get('/:id', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');

  const event = await db.query.runningEvents.findFirst({
    where: isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)),
    with: { categories: { with: { tickets: true } } },
  });
  if (!event) return c.json({ error: 'Running event not found' }, 404);

  const liveFlatTickets = event.categories.flatMap(cat =>
    cat.tickets.map(t => ({ ticketId: t.id, ticketName: t.name, category: cat.id, type: t.type as any, price: t.price, normalPrice: t.normalPrice, stock: t.stock, description: t.description, isAvailable: t.isAvailable }))
  );
  const liveCatsSummary = event.categories.map(cat => ({ id: cat.id, name: cat.name, price: cat.price, maxPrice: cat.maxPrice || 0, description: cat.description || '', status: cat.status || 'available' }));

  if (event.pendingData && event.isActive === 1) {
    const pending = event.pendingData as any;
    return c.json({
      data: {
        ...event,
        ...Object.fromEntries(Object.entries(pending).filter(([k]) => k !== 'ticketCategories' && k !== 'tickets')),
        ticketCategories: pending.ticketCategories ?? liveCatsSummary,
        tickets: pending.tickets ?? liveFlatTickets,
        pendingData: event.pendingData,
        vendorConfig: { ...(event.vendorConfig || {}), purchaseMode: event.vendorConfig?.purchaseMode || 'multiple' },
        ...(isAdmin && { liveSnapshot: { ticketCategories: liveCatsSummary, tickets: liveFlatTickets } }),
      },
    });
  }

  return c.json({ data: { ...event, ticketCategories: liveCatsSummary, tickets: liveFlatTickets, vendorConfig: { ...(event.vendorConfig || {}), purchaseMode: event.vendorConfig?.purchaseMode || 'multiple' } } });
});

runningEventRoutes.post('/', zValidator('json', runningEventSchema), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const { ticketCategories: cats, tickets: tix, ...eventData } = c.req.valid('json');
  if (!eventData.bannerUrl && eventData.bannerUrls?.length) eventData.bannerUrl = eventData.bannerUrls[0];

  if (!isAdmin && !(user.roleType ?? []).includes('running'))
    return c.json({ error: 'Access denied: running permission required' }, 403);

  const id = crypto.randomUUID();
  const price = cats?.length ? Math.min(...cats.map(c => c.price)) : (eventData.price ?? 0);
  await db.insert(runningEvents).values({
    id, ...eventData, price, userId: user.sub, isActive: 0,
    approvalStatus: isAdmin ? 'approved' : 'requested',
    comments: [],
  });
  await upsertRunningTickets(id, cats || [], tix || []);
  return c.json({ data: { id } }, 201);
});

runningEventRoutes.put('/:id', zValidator('json', runningEventSchema.partial()), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');
  const { ticketCategories: cats, tickets: tix, isActive: _isActive, message, ...eventData } = c.req.valid('json');
  if (!eventData.bannerUrl && (eventData.bannerUrls as any)?.length) eventData.bannerUrl = (eventData.bannerUrls as any)[0];

  const existing = await db.query.runningEvents.findFirst({
    where: isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)),
  });
  if (!existing) return c.json({ error: 'Running event not found' }, 404);

  let priceToSet: number | undefined;
  if (cats?.length) priceToSet = Math.min(...cats.map(c => c.price));
  else if (typeof eventData.price === 'number') priceToSet = eventData.price;

  const newComment = (!isAdmin && message)
    ? { id: crypto.randomUUID(), senderName: user.name, senderRole: user.role, message, statusSnapshot: 'requested', createdAt: new Date().toISOString() }
    : null;
  const updatedComments = newComment ? [...(existing.comments || []), newComment] : existing.comments;

  if (!isAdmin && existing.isActive === 1) {
    const pendingData: Record<string, any> = { ...eventData };
    if (priceToSet !== undefined) pendingData.price = priceToSet;
    if (cats !== undefined) pendingData.ticketCategories = cats;
    if (tix !== undefined) pendingData.tickets = tix;

    await db.update(runningEvents).set({
      pendingData,
      approvalStatus: 'requested',
      ...(newComment && { comments: updatedComments }),
      updatedAt: new Date().toISOString(),
    }).where(eq(runningEvents.id, id));
    return c.json({ success: true });
  }

  await db.update(runningEvents).set({
    ...eventData, ...(priceToSet !== undefined ? { price: priceToSet } : {}),
    ...(!isAdmin && { approvalStatus: 'requested', isActive: 0, comments: updatedComments }),
    updatedAt: new Date().toISOString(),
  }).where(eq(runningEvents.id, id));

  if (cats !== undefined) await upsertRunningTickets(id, cats, tix || []);
  return c.json({ success: true });
});

runningEventRoutes.patch('/:id/status', zValidator('json', statusSchema), async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');
  const { status, message } = c.req.valid('json');

  if (status === 'approved' && !isAdmin) return c.json({ error: 'Forbidden' }, 403);
  if (status === 'rejected' && !isAdmin) return c.json({ error: 'Forbidden' }, 403);
  if (status === 'requested' && isAdmin) return c.json({ error: 'Only vendors can resubmit' }, 403);
  if (status === 'rejected' && !message) return c.json({ error: 'Message required when rejecting' }, 400);

  const record = await db.query.runningEvents.findFirst({
    where: isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)),
  });
  if (!record) return c.json({ error: 'Running event not found' }, 404);

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
    const { ticketCategories: pendingCats, tickets: pendingTix, ...pendingFields } = record.pendingData as any;
    await db.update(runningEvents).set({
      ...(pendingFields as any),
      approvalStatus: 'approved',
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(runningEvents.id, id));
    if (pendingCats !== undefined) await upsertRunningTickets(id, pendingCats, pendingTix || []);
  } else if (status === 'rejected' && isLiveEdit) {
    await db.update(runningEvents).set({
      approvalStatus: 'rejected',
      pendingData: null,
      comments,
      updatedAt: new Date().toISOString(),
    }).where(eq(runningEvents.id, id));
  } else {
    await db.update(runningEvents).set({
      approvalStatus: status,
      comments,
      ...(status === 'requested' && { isActive: 0 }),
      updatedAt: new Date().toISOString(),
    }).where(eq(runningEvents.id, id));
  }

  return c.json({ success: true });
});

runningEventRoutes.patch('/:id/active', zValidator('json', z.object({ isActive: z.number().int().min(0).max(1) })), async (c) => {
  const user = c.get('jwtPayload') as any;
  if (user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);
  const id = c.req.param('id');
  const { isActive } = c.req.valid('json');

  const record = await db.query.runningEvents.findFirst({ where: eq(runningEvents.id, id) });
  if (!record) return c.json({ error: 'Running event not found' }, 404);
  if (isActive === 1 && record.approvalStatus !== 'approved')
    return c.json({ error: 'Cannot activate unapproved listing' }, 400);

  await db.update(runningEvents).set({ isActive, updatedAt: new Date().toISOString() }).where(eq(runningEvents.id, id));
  return c.json({ success: true, isActive });
});

runningEventRoutes.delete('/:id', async (c) => {
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';
  const id = c.req.param('id');

  const deleted = await db.delete(runningEvents)
    .where(isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)))
    .returning();
  if (!deleted.length) return c.json({ error: 'Running event not found' }, 404);
  return c.json({ success: true });
});
