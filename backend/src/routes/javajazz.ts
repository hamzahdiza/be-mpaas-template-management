import { Hono } from 'hono';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { ticketCategories, tickets, events as eventsTable } from '../db/schema';

export const javajazzRoutes = new Hono();

// GET /v1/category-ticket?id=<eventId>
javajazzRoutes.get('/v1/category-ticket', async (c) => {
    const eventId = c.req.query('id');

    if (!eventId) {
        return c.json({ error: 'Event ID is required' }, 400);
    }

    try {
        const event = await db.query.events.findFirst({
            where: eq(eventsTable.id, eventId)
        });

        if (!event) {
            return c.json({ error: 'Event not found' }, 404);
        }

        const categories = await db.query.ticketCategories.findMany({
            where: eq(ticketCategories.eventId, eventId),
            orderBy: (ticketCategories, { asc }) => [asc(ticketCategories.order)]
        });

        return c.json({
            dataProtected: {
                detailEvent: {
                    id: event.id,
                    eventName: event.name,
                    eventDate: event.startDate,
                    location: event.location,
                    locationAddress: event.locationAddress,
                    description: event.description,
                    banner: event.bannerUrls || [event.bannerUrl],
                    seatingPlanUrl: event.seatingPlanUrl,
                    termsAndConditions: event.termsAndConditions,
                    templateId: event.templateId,
                    instagram: event.socials?.instagram?.url || "",
                    website: event.socials?.website?.url || "",
                    locationUrl: event.locationUrl,
                    vendorConfig: event.vendorConfig || { purchaseMode: "single" }
                },
                ticketCategories: categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    price: cat.price,
                    startFrom: cat.price, // Assuming startFrom is base price
                    description: cat.description,
                    status: cat.status || "available"
                }))
            }
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to fetch categories' }, 500);
    }
});

// GET /v1/tickets?category=<categoryId>
javajazzRoutes.get('/v1/tickets', async (c) => {
    const categoryId = c.req.query('category');
    // Also support id or other common filters if needed, but miniprogram usually sends category

    if (!categoryId) {
        // Fallback for debugging if needed, or return 400
        return c.json({ error: 'Category ID is required' }, 400);
    }

    try {
        const ticketList = await db.query.tickets.findMany({
            where: eq(tickets.categoryId, categoryId),
            orderBy: (tickets, { asc }) => [asc(tickets.order)]
        });

        const category = await db.query.ticketCategories.findFirst({
            where: eq(ticketCategories.id, categoryId)
        });
        if (!category) {
            return c.json({ error: 'Category not found' }, 404);
        }
        const parentEvent = await db.query.events.findFirst({
            where: eq(eventsTable.id, category.eventId)
        });
        const eventTicketDate = parentEvent?.startDate || "";

        const promoList = ticketList
            .filter(t => t.type === 'promo' || t.type === 'discount')
            .map(t => ({
                ticketDate: eventTicketDate,
                category2: categoryId,
                category3: t.id + "_promo",
                priceTaxService: t.price, // Example tax
                // priceTaxService: t.price + (t.price * 0.1), // Example tax
                oldPrice: t.normalPrice || t.price,
                ticketName: t.name,
                countAdd: 1,
                isAvailable: t.isAvailable,
                category: categoryId,
                ticketId: t.id,
                description: t.description ? [t.description] : [],
                type: "promo",
                price: t.price
            }));

        const regulerList = ticketList
            .filter(t => t.type === 'normal' || t.type === 'regular' || !t.type)
            .map(t => ({
                ticketDate: eventTicketDate,
                category2: categoryId,
                category3: t.id + "_regular",
                priceTaxService: t.price ,
                // priceTaxService: t.price + (t.price * 0.1),
                oldPrice: 0,
                ticketName: t.name,
                countAdd: 1,
                isAvailable: t.isAvailable,
                category: categoryId,
                ticketId: t.id,
                description: t.description ? [t.description] : [],
                type: "regular",
                price: t.price
            }));

        return c.json({
            dataProtected: {
                promoList: promoList,
                regulerList: regulerList,
                validation: [
                    {
                        maxOrder: 4,
                        category3List: regulerList.concat(promoList).map(t => t.category3),
                        ticketIdList: regulerList.concat(promoList).map(t => t.ticketId)
                    }
                ]
            }
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to fetch tickets' }, 500);
    }
});

// GET /v1/personal-data
javajazzRoutes.get('/v1/personal-data', (c) => {
    // Keep this as a static mock for now as requested for standard profile data
    return c.json({
        "dataProtected": {
            "phone": "89681430435",
            "subdistrict": "CENGKARENG BARAT",
            "fullName": "SYAMSUL BAHRI",
            "nationality": "ID",
            "dateBirth": "08",
            "nik": "3671060808950005",
            "postalCode": "11730",
            "email": "ai.syamsulbahri@gmail.com",
            "gender": "M",
            "monthBirth": "08",
            "yearBirth": "1995"
        }
    });
});
