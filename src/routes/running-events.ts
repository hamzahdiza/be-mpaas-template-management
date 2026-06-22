import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { runningEvents, runningCategories, runningTickets } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verify(token, JWT_SECRET, 'HS256');
    c.set('jwtPayload', payload);
    await next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const runningEventRoutes = new Hono();


const runningEventSchema = z.object({
  name: z.string().min(3),
  eventType: z.enum(['internal', 'external']).optional().default('internal'),
  externalUrl: z.string().optional(),
  description: z.string().optional(),
  vendorConfig: z.object({
    purchaseMode: z.enum(['single', 'multiple']).optional()
  }).optional(),
  templateId: z.number().int().min(1).max(5).optional().default(1),
  templates: z.object({
    index: z.any(),
    bookTicket: z.any(),
    visitorList: z.any(),
    visitorInput: z.any()
  }).optional(),
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
  themeColor: z.string().default("#FFFFFF"),
  isActive: z.number().int().min(0).max(1).optional(),
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

runningEventRoutes.get('/', async (c) => {
  const user = c.get('jwtPayload') as any;

  try {
    const whereClause = (user && user.role !== 'admin') ? eq(runningEvents.userId, user.sub) : undefined;

    const allEvents = await db.query.runningEvents.findMany({
      where: whereClause,
      orderBy: [desc(runningEvents.createdAt)],
      with: {
        categories: {
          with: { tickets: true }
        }
      }
    });

    const withVendorConfig = allEvents.map((ev: any) => ({
      ...ev,
      vendorConfig: {
        ...(ev.vendorConfig || {}),
        purchaseMode: ev.vendorConfig?.purchaseMode || 'multiple'
      }
    }));

    return c.json({ data: withVendorConfig });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch running events' }, 500);
  }
});

runningEventRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user?.role === 'admin';

  try {
    const event = await db.query.runningEvents.findFirst({
      where: (user && !isAdmin) ? and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)) : eq(runningEvents.id, id),
      with: {
        categories: {
          with: { tickets: true }
        }
      }
    });

    if (!event) {
      return c.json({ error: 'Running event not found' }, 404);
    }

    const flatTickets = event.categories.flatMap(cat =>
      cat.tickets.map(t => ({
        ticketId: t.id,
        ticketName: t.name,
        category: cat.id,
        type: t.type as 'normal' | 'b1g1' | 'discount',
        price: t.price,
        normalPrice: t.normalPrice,
        stock: t.stock,
        description: t.description,
        isAvailable: t.isAvailable
      }))
    );

    const responseData = {
      ...event,
      ticketCategories: event.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        price: cat.price,
        maxPrice: cat.maxPrice || 0,
        description: cat.description || '',
        status: cat.status || 'available',
      })),
      tickets: flatTickets,
      vendorConfig: {
        ...((event as any).vendorConfig || {}),
        purchaseMode: ((event as any).vendorConfig?.purchaseMode) || 'multiple'
      }
    };

    return c.json({ data: responseData });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch running event' }, 500);
  }
});

runningEventRoutes.post('/', authMiddleware, zValidator('json', runningEventSchema), async (c) => {
  const data = c.req.valid('json');
  const user = c.get('jwtPayload') as any;
  const id = crypto.randomUUID();

  try {
    const { ticketCategories: cats, tickets: tix, ...eventData } = data;

    if (!eventData.bannerUrl && eventData.bannerUrls && eventData.bannerUrls.length > 0) {
      eventData.bannerUrl = eventData.bannerUrls[0];
    }

    const computedBasePrice = ((): number => {
      if (cats && cats.length > 0) {
        return Math.min(...cats.map((c) => c.price));
      }
      return eventData.price ?? 0;
    })();

    const newEvent = await db.insert(runningEvents).values({
      id,
      ...eventData,
      price: computedBasePrice,
      userId: user.sub,
      isActive: 0,
    }).returning();

    const categoryIdMap = new Map<string, string>();

    if (cats && cats.length > 0) {
      await db.insert(runningCategories).values(
        cats.map(cat => {
          const newId = crypto.randomUUID();
          if (cat.id) categoryIdMap.set(cat.id, newId);
          return {
            id: newId,
            runningEventId: id,
            name: cat.name,
            price: cat.price,
            maxPrice: cat.maxPrice || null,
            description: cat.description || null,
            status: cat.status || 'available'
          };
        })
      );
    }

    if (tix && tix.length > 0) {
      await db.insert(runningTickets).values(
        tix.map(t => ({
          id: crypto.randomUUID(),
          categoryId: categoryIdMap.get(t.category) || t.category,
          name: t.ticketName,
          type: t.type || 'normal',
          price: t.price,
          normalPrice: t.normalPrice || null,
          stock: t.stock ?? 100,
          description: t.description || null,
          isAvailable: typeof t.isAvailable === 'boolean' ? (t.isAvailable ? 1 : 0) : (t.isAvailable ?? 1)
        }))
      );
    }

    return c.json({ data: newEvent[0] }, 201);
  } catch (error: any) {
    console.error('Error creating running event:', error);
    if (error.issues) return c.json({ error: 'Validation failed', details: error.issues }, 400);
    return c.json({ error: 'Failed to create running event', details: error.message }, 500);
  }
});

runningEventRoutes.put('/:id', authMiddleware, zValidator('json', runningEventSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';

  try {
    const { ticketCategories: cats, tickets: tix, ...eventData } = data;

    if (!isAdmin) delete (eventData as any).isActive;

    if (!eventData.bannerUrl && eventData.bannerUrls && eventData.bannerUrls.length > 0) {
      eventData.bannerUrl = eventData.bannerUrls[0];
    }

    let priceToSet: number | undefined = undefined;
    if (cats && cats.length > 0) {
      priceToSet = Math.min(...cats.map((c) => c.price));
    } else if (typeof eventData.price === 'number') {
      priceToSet = eventData.price;
    }

    const updatedEvent = await db.update(runningEvents)
      .set({
        ...eventData,
        ...(priceToSet !== undefined ? { price: priceToSet } : {}),
        updatedAt: new Date().toISOString()
      })
      .where(isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)))
      .returning();

    if (!updatedEvent.length) {
      return c.json({ error: 'Running event not found' }, 404);
    }

    // Only replace categories/tickets if they were explicitly sent
    if (cats !== undefined) {
      await db.delete(runningCategories).where(eq(runningCategories.runningEventId, id));
      if (cats.length > 0) {
        await db.insert(runningCategories).values(
          cats.map(cat => ({
            id: cat.id || crypto.randomUUID(),
            runningEventId: id,
            name: cat.name,
            price: cat.price,
            maxPrice: cat.maxPrice || null,
            description: cat.description || null,
            status: cat.status || 'available'
          }))
        );
      }
      if (tix && tix.length > 0) {
        await db.insert(runningTickets).values(
          tix.map(t => ({
            id: t.ticketId || crypto.randomUUID(),
            categoryId: t.category,
            name: t.ticketName,
            type: t.type || 'normal',
            price: t.price,
            normalPrice: t.normalPrice || null,
            stock: t.stock ?? 100,
            description: t.description || null,
            isAvailable: typeof t.isAvailable === 'boolean' ? (t.isAvailable ? 1 : 0) : (t.isAvailable ?? 1)
          }))
        );
      }
    }

    return c.json({ data: updatedEvent[0] });
  } catch (error: any) {
    console.error('Error updating running event:', error);
    if (error.issues) return c.json({ error: 'Validation failed', details: error.issues }, 400);
    return c.json({ error: 'Failed to update running event', details: error.message }, 500);
  }
});

runningEventRoutes.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload') as any;
  const isAdmin = user.role === 'admin';

  try {
    const deleted = await db.delete(runningEvents)
      .where(isAdmin ? eq(runningEvents.id, id) : and(eq(runningEvents.id, id), eq(runningEvents.userId, user.sub)))
      .returning();

    if (!deleted.length) {
      return c.json({ error: 'Running event not found' }, 404);
    }

    return c.json({ message: 'Running event deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete running event' }, 500);
  }
});
