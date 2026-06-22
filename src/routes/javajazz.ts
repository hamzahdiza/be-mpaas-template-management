import { Hono } from 'hono';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { ticketCategories, tickets, events as eventsTable, runningEvents, runningCategories, runningTickets } from '../db/schema';

export const javajazzRoutes = new Hono();

javajazzRoutes.get('/v1/category-ticket', async (c) => {
    const eventId = c.req.query('id');

    if (!eventId) {
        return c.json({ error: 'Event ID is required' }, 400);
    }

    try {
        const event = await db.query.events.findFirst({
            where: eq(eventsTable.id, eventId)
        });

        if (event) {
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
                        bannerUrls: event.bannerUrls || [event.bannerUrl],
                        seatingPlanUrl: event.seatingPlanUrl,
                        termsAndConditions: event.termsAndConditions,
                        templateId: event.templateId,
                        templates: event.templates,
                        socials: event.socials,
                        instagram: event.socials?.instagram?.url || "",
                        website: event.socials?.website?.url || "",
                        locationUrl: event.locationUrl,
                        vendorConfig: event.vendorConfig || { purchaseMode: "single" }
                    },
                    ticketCategories: categories.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        price: cat.price,
                        startFrom: cat.price,
                        description: cat.description,
                        status: cat.status || "available"
                    }))
                }
            });
        }

        const runningEvent = await db.query.runningEvents.findFirst({
            where: eq(runningEvents.id, eventId)
        });

        if (!runningEvent) {
            return c.json({ error: 'Event not found' }, 404);
        }

        const categories = await db.query.runningCategories.findMany({
            where: eq(runningCategories.runningEventId, eventId),
            orderBy: (runningCategories, { asc }) => [asc(runningCategories.order)]
        });

        return c.json({
            dataProtected: {
                detailEvent: {
                    id: runningEvent.id,
                    eventName: runningEvent.name,
                    eventDate: runningEvent.startDate,
                    location: runningEvent.location,
                    locationAddress: runningEvent.locationAddress,
                    description: runningEvent.description,
                    banner: runningEvent.bannerUrls || [runningEvent.bannerUrl],
                    bannerUrls: runningEvent.bannerUrls || [runningEvent.bannerUrl],
                    seatingPlanUrl: runningEvent.seatingPlanUrl,
                    termsAndConditions: runningEvent.termsAndConditions,
                    templateId: runningEvent.templateId,
                    templates: runningEvent.templates,
                    socials: runningEvent.socials,
                    instagram: runningEvent.socials?.instagram?.url || "",
                    website: runningEvent.socials?.website?.url || "",
                    locationUrl: runningEvent.locationUrl,
                    vendorConfig: runningEvent.vendorConfig || { purchaseMode: "single" },
                    paymentMethod: runningEvent.paymentMethod || null,
                    accountNumber: runningEvent.accountNumber || null
                },
                ticketCategories: categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    price: cat.price,
                    startFrom: cat.price,
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

javajazzRoutes.get('/v1/tickets', async (c) => {
    const categoryId = c.req.query('category');

    if (!categoryId) {
        return c.json({ error: 'Category ID is required' }, 400);
    }

    try {
        const runningCategory = await db.query.runningCategories.findFirst({
            where: eq(runningCategories.id, categoryId)
        });

        if (runningCategory) {
            const runningTicketList = await db.query.runningTickets.findMany({
                where: eq(runningTickets.categoryId, categoryId),
                orderBy: (t, { asc }) => [asc(t.order)]
            });

            const parentRunningEvent = await db.query.runningEvents.findFirst({
                where: eq(runningEvents.id, runningCategory.runningEventId)
            });
            const eventTicketDate = parentRunningEvent?.startDate || "";

            const effectiveTickets = runningTicketList.length > 0 ? runningTicketList : [{
                id: runningCategory.id,
                name: runningCategory.name,
                type: 'normal' as const,
                price: runningCategory.price,
                normalPrice: null as number | null,
                stock: 0,
                isAvailable: 1,
                description: runningCategory.description,
            }];

            const promoList = effectiveTickets
                .filter(t => t.type === 'discount' || t.type === 'b1g1')
                .map(t => ({
                    ticketDate: eventTicketDate,
                    category2: categoryId,
                    category3: t.id + "_promo",
                    priceTaxService: t.price,
                    oldPrice: t.normalPrice || t.price,
                    ticketName: t.name,
                    countAdd: 1,
                    isAvailable: t.isAvailable,
                    category: categoryId,
                    ticketId: t.id,
                    description: t.description ? [t.description] : [],
                    type: "promo",
                    price: t.price,
                    stock: t.stock ?? 0
                }));

            const regulerList = effectiveTickets
                .filter(t => t.type === 'normal' || !t.type)
                .map(t => ({
                    ticketDate: eventTicketDate,
                    category2: categoryId,
                    category3: t.id + "_regular",
                    priceTaxService: t.price,
                    oldPrice: 0,
                    ticketName: t.name,
                    countAdd: 1,
                    isAvailable: t.isAvailable,
                    category: categoryId,
                    ticketId: t.id,
                    description: t.description ? [t.description] : [],
                    type: "regular",
                    price: t.price,
                    stock: t.stock ?? 0
                }));

            return c.json({
                dataProtected: {
                    promoList,
                    regulerList,
                    validation: [{
                        maxOrder: 4,
                        category3List: regulerList.concat(promoList).map(t => t.category3),
                        ticketIdList: regulerList.concat(promoList).map(t => t.ticketId)
                    }]
                }
            });
        }

        const category = await db.query.ticketCategories.findFirst({
            where: eq(ticketCategories.id, categoryId)
        });

        if (!category) {
            return c.json({ error: 'Category not found' }, 404);
        }

        const ticketList = await db.query.tickets.findMany({
            where: eq(tickets.categoryId, categoryId),
            orderBy: (t, { asc }) => [asc(t.order)]
        });

        const parentEvent = await db.query.events.findFirst({
            where: eq(eventsTable.id, category.eventId)
        });
        const eventTicketDate = parentEvent?.startDate || "";

        const promoList = ticketList
            .filter(t => t.type === 'discount' || t.type === 'b1g1')
            .map(t => ({
                ticketDate: eventTicketDate,
                category2: categoryId,
                category3: t.id + "_promo",
                priceTaxService: t.price,
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
            .filter(t => t.type === 'normal' || !t.type)
            .map(t => ({
                ticketDate: eventTicketDate,
                category2: categoryId,
                category3: t.id + "_regular",
                priceTaxService: t.price,
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
                promoList,
                regulerList,
                validation: [{
                    maxOrder: 4,
                    category3List: regulerList.concat(promoList).map(t => t.category3),
                    ticketIdList: regulerList.concat(promoList).map(t => t.ticketId)
                }]
            }
        });
    } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to fetch tickets' }, 500);
    }
});

javajazzRoutes.get('/v1/personal-data', (c) => {
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
