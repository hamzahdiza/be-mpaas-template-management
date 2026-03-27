import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { events, ticketCategories, tickets } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { verify } from 'hono/jwt';

// Middleware to extract user from JWT
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    if (c.req.method !== 'GET') {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    // Allow public GET for now if needed, but for CMS we enforce auth
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verify(token, JWT_SECRET, 'HS256'); // Specify algorithm
    c.set('jwtPayload', payload); // Hono standard key
    await next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const eventRoutes = new Hono();

// Apply auth middleware to all routes
eventRoutes.use('*', authMiddleware);

// Schema Validation
const eventSchema = z.object({
  name: z.string().min(3),
  eventType: z.enum(['internal', 'external']).optional().default('internal'),
  externalUrl: z.string().optional(),
  description: z.string().optional(),
  vendorConfig: z.object({
    purchaseMode: z.enum(['single', 'multiple']).optional()
  }).optional(),
  templateId: z.number().int().min(1).max(5).optional().default(1),
  templates: z.object({
    index: z.any(), // Flexible to handle number or object structure
    bookTicket: z.any(),
    visitorList: z.any(),
    visitorInput: z.any()
  }).optional(),
  startDate: z.string(), // ISO Date
  endDate: z.string(),   // ISO Date
  price: z.number().min(0),
  location: z.string().optional(),
  locationAddress: z.string().optional(),
  locationUrl: z.string().optional().nullable(),
  seatingPlanUrl: z.string().optional().nullable(),
  termsAndConditions: z.string().optional().nullable(),
  bannerUrl: z.string().optional(),
  bannerUrls: z.array(z.string()).optional(),
  socials: z.object({
    instagram: z.object({ url: z.string(), visible: z.boolean() }).optional(),
    website: z.object({ url: z.string(), visible: z.boolean() }).optional(),
  }).optional(),
  themeColor: z.string().default("#FFFFFF"),
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
    category: z.string(), // Category ID
    type: z.enum(['normal', 'b1g1', 'discount']).optional().default('normal'),
    price: z.number(),
    normalPrice: z.number().optional(),
    description: z.string().optional(),
    isAvailable: z.union([z.number(), z.boolean()]).optional(), // Handle 0/1 or true/false
  })).optional(),
});

// GET /api/events - List all events (Filtered by User)
eventRoutes.get('/', async (c) => {
  const user = c.get('jwtPayload') as any;
  
  try {
    let whereClause = undefined;
    
    // If user is vendor, only show their events
    // If user is admin, show all (optional, assuming role exists in payload)
    if (user.role !== 'admin') {
        whereClause = eq(events.userId, user.sub);
    }

    const allEvents = await db.query.events.findMany({
      where: whereClause,
      orderBy: [desc(events.createdAt)],
      with: {
        ticketCategories: {
          with: {
            tickets: true
          }
        }
      }
    });
    // Attach default vendorConfig.purchaseMode = 'multiple' to each event for client compatibility
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
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// GET /api/events/:id - Get single event
eventRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const event = await db.query.events.findFirst({
      where: eq(events.id, id),
      with: {
        ticketCategories: {
          with: {
            tickets: true
          }
        }
      }
    });
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    // Transform response to match frontend expectation if needed
    // The frontend expects tickets to be a flat list in the main object for editing, 
    // or nested. Based on create.tsx, it uses formData.tickets (flat).
    // We can reconstruct the flat tickets list from categories.
    
    const flatTickets = event.ticketCategories.flatMap(cat => 
      cat.tickets.map(t => ({
        ticketId: t.id,
        ticketName: t.name,
        category: cat.id,
        type: t.type as 'normal' | 'b1g1' | 'discount',
        price: t.price,
        normalPrice: t.normalPrice,
        description: t.description,
        isAvailable: t.isAvailable
      }))
    );

    const responseData = {
      ...event,
      tickets: flatTickets,
      vendorConfig: {
        ...(event as any).vendorConfig || {},
        purchaseMode: ((event as any).vendorConfig && (event as any).vendorConfig.purchaseMode) || 'multiple'
      }
    };
    
    return c.json({ data: responseData });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

// POST /api/events - Create event
eventRoutes.post('/', zValidator('json', eventSchema), async (c) => {
  const data = c.req.valid('json');
  const user = c.get('jwtPayload') as any;
  const id = uuidv4();
  
  try {
    // 1. Create Event
    const { ticketCategories: cats, tickets: tix, ...eventData } = data;
    
    // Fallback for bannerUrl if not provided but bannerUrls exists
    if (!eventData.bannerUrl && eventData.bannerUrls && eventData.bannerUrls.length > 0) {
      eventData.bannerUrl = eventData.bannerUrls[0];
    }
    
    // Ensure events.price terisi: gunakan min price dari categories, jika tidak ada baru gunakan request.price
    const computedBasePrice = ((): number => {
      if (cats && cats.length > 0) {
        return Math.min(...cats.map((c) => c.price));
      }
      return eventData.price ?? 0; // Fallback to eventData.price if provided, otherwise 0
    })();
    
    const newEvent = await db.insert(events).values({
      id,
      ...eventData,
      price: computedBasePrice,
      userId: user.sub, // Attach user ID
    }).returning();
    
    // 2. Create Categories with ID Remapping (to avoid 'cat1' collision)
    const categoryIdMap = new Map<string, string>();
    
    if (cats && cats.length > 0) {
      await db.insert(ticketCategories).values(
        cats.map(cat => {
          const newId = uuidv4();
          if (cat.id) {
            categoryIdMap.set(cat.id, newId);
          }
          return {
            id: newId,
            eventId: id,
            name: cat.name,
            price: cat.price,
            maxPrice: cat.maxPrice || null,
            description: cat.description || null,
            status: cat.status || 'available'
          };
        })
      );
    }

    // 3. Create Tickets with mapped Category IDs
    if (tix && tix.length > 0) {
      await db.insert(tickets).values(
        tix.map(t => {
            // Resolve new category ID, fallback to original if not found (should not happen if consistent)
            const mappedCategoryId = categoryIdMap.get(t.category) || t.category;
            
            return {
              id: uuidv4(), // Always generate new ID for tickets to be safe
              categoryId: mappedCategoryId,
              name: t.ticketName,
              type: t.type || 'normal',
              price: t.price,
              normalPrice: t.normalPrice || null,
              description: t.description || null,
              stock: 100,
              isAvailable: typeof t.isAvailable === 'boolean' ? (t.isAvailable ? 1 : 0) : (t.isAvailable ?? 1)
            };
        })
      );
    }
    
    return c.json({ data: newEvent[0] }, 201);
  } catch (error: any) {
    console.error('Error creating event:', error);
    if (error.issues) { // Zod validation error
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    return c.json({ error: 'Failed to create event', details: error.message }, 500);
  }
});

// PUT /api/events/:id - Update event
eventRoutes.put('/:id', zValidator('json', eventSchema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  
  try {
    // 1. Update Event
    const { ticketCategories: cats, tickets: tix, ...eventData } = data;

    // Fallback for bannerUrl if not provided but bannerUrls exists
    if (!eventData.bannerUrl && eventData.bannerUrls && eventData.bannerUrls.length > 0) {
      eventData.bannerUrl = eventData.bannerUrls[0];
    }

    // Hitung base price jika price tidak diberikan saat update
    let priceToSet: number | undefined = undefined;
    if (cats && cats.length > 0) {
      priceToSet = Math.min(...cats.map((c) => c.price));
    } else if (typeof eventData.price === 'number') {
      priceToSet = eventData.price;
    }

    const updatedEvent = await db.update(events)
      .set({ 
        ...eventData, 
        ...(priceToSet !== undefined ? { price: priceToSet } : {}), 
        updatedAt: new Date().toISOString() 
      })
      .where(eq(events.id, id))
      .returning();
      
    if (!updatedEvent.length) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // 2. Update Categories & Tickets (Full Replace Strategy)
    // Delete existing
    await db.delete(ticketCategories).where(eq(ticketCategories.eventId, id));
    // Note: Tickets should be deleted via cascade if DB supports it, 
    // but Drizzle/SQLite setup might need explicit delete or we rely on foreign key constraint.
    // To be safe, we can rely on cascade if configured in DB, but for now assuming cascade works or we handle it.
    // If we defined `references(() => ..., { onDelete: 'cascade' })` in schema, Drizzle generates DDL for it.
    
    // Re-insert Categories
    if (cats && cats.length > 0) {
      await db.insert(ticketCategories).values(
        cats.map(cat => ({
          id: cat.id || uuidv4(),
          eventId: id,
          name: cat.name,
          price: cat.price,
          maxPrice: cat.maxPrice || null,
          description: cat.description || null,
          status: cat.status || 'available'
        }))
      );
    }

    // Re-insert Tickets
    if (tix && tix.length > 0) {
      await db.insert(tickets).values(
        tix.map(t => ({
          id: t.ticketId || uuidv4(),
          categoryId: t.category,
          name: t.ticketName,
          type: t.type || 'normal',
          price: t.price,
          normalPrice: t.normalPrice || null,
          description: t.description || null,
          stock: 100,
          isAvailable: typeof t.isAvailable === 'boolean' ? (t.isAvailable ? 1 : 0) : (t.isAvailable ?? 1)
        }))
      );
    }
    
    return c.json({ data: updatedEvent[0] });
  } catch (error: any) {
    console.error('Error updating event:', error);
    if (error.issues) { // Zod validation error
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    return c.json({ error: 'Failed to update event', details: error.message }, 500);
  }
});

// DELETE /api/events/:id - Delete event
eventRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const deleted = await db.delete(events)
      .where(eq(events.id, id))
      .returning();
      
    if (!deleted.length) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    return c.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});
