import { Hono } from 'hono';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { ticketCategories, tickets, events as eventsTable } from '../db/schema';

export const javajazzRoutes = new Hono();

javajazzRoutes.get('/v1/personal-data', async (c) => {
  return c.json({
    dataProtected: {
      fullName: 'Marcus Holt',
      email: 'marcus.holt@orbitalinc.com',
      phone: '081234567890',
      gender: 'M',
      dateBirth: '15',
      monthBirth: '10',
      yearBirth: '1995',
      nationality: 'ID',
      nik: '3171012304850001',
      subdistrict: 'KEBAYORAN BARU',
      postalCode: '12160',
    }
  });
});

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

    return c.json({ error: 'Event not found' }, 404);
  } catch (error) {
    console.error("Error in javajazz /v1/category-ticket:", error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

javajazzRoutes.get('/v1/landing-data', async (c) => {
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
  } catch (error) {
    console.error("Error in javajazz /v1/landing-data:", error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

javajazzRoutes.get('/v1/list-ticket', async (c) => {
  const categoryId = c.req.query('categoryId');
  const eventId = c.req.query('eventId');

  try {
    if (categoryId) {
      const category = await db.query.ticketCategories.findFirst({
        where: eq(ticketCategories.id, categoryId),
        with: { tickets: true }
      });

      if (category) {
        const parentEvent = await db.query.events.findFirst({
          where: eq(eventsTable.id, category.eventId)
        });

        return c.json({
          dataProtected: {
            detailEvent: {
              id: parentEvent?.id,
              eventName: parentEvent?.name,
              eventDate: parentEvent?.startDate,
              location: parentEvent?.location,
              vendorConfig: parentEvent?.vendorConfig || { purchaseMode: "single" }
            },
            ticketCategory: {
              id: category.id,
              name: category.name,
              price: category.price,
              description: category.description,
            },
            tickets: category.tickets.map(t => ({
              ticketId: t.id,
              ticketName: t.name,
              price: t.price,
              normalPrice: t.normalPrice || t.price,
              type: t.type,
              isAvailable: t.isAvailable === 1,
              description: t.description
            }))
          }
        });
      }
    }

    if (eventId) {
      const categories = await db.query.ticketCategories.findMany({
        where: eq(ticketCategories.eventId, eventId),
        with: { tickets: true }
      });

      const parentEvent = await db.query.events.findFirst({
        where: eq(eventsTable.id, eventId)
      });

      return c.json({
        dataProtected: {
          detailEvent: {
            id: parentEvent?.id,
            eventName: parentEvent?.name,
            eventDate: parentEvent?.startDate,
            location: parentEvent?.location,
            vendorConfig: parentEvent?.vendorConfig || { purchaseMode: "single" }
          },
          ticketCategories: categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            price: cat.price,
            description: cat.description,
            tickets: cat.tickets.map(t => ({
              ticketId: t.id,
              ticketName: t.name,
              price: t.price,
              normalPrice: t.normalPrice || t.price,
              type: t.type,
              isAvailable: t.isAvailable === 1,
              description: t.description
            }))
          }))
        }
      });
    }

    return c.json({ error: 'categoryId or eventId is required' }, 400);
  } catch (error) {
    console.error("Error in javajazz /v1/list-ticket:", error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

javajazzRoutes.get('/v1/tickets', async (c) => {
  const categoryParam = c.req.query('category') || c.req.query('categoryId') || c.req.query('eventId') || c.req.query('id');

  try {
    let targetEvent: any = null;
    let categories: any[] = [];

    if (categoryParam) {
      // 1. Try finding by ticketCategory ID
      const cat = await db.query.ticketCategories.findFirst({
        where: eq(ticketCategories.id, categoryParam),
        with: { tickets: true }
      });
      if (cat) {
        targetEvent = await db.query.events.findFirst({
          where: eq(eventsTable.id, cat.eventId),
          with: { ticketCategories: true }
        });
        categories = targetEvent?.ticketCategories || [cat];
      } else {
        // 2. Try finding by Event ID
        targetEvent = await db.query.events.findFirst({
          where: eq(eventsTable.id, categoryParam),
          with: { ticketCategories: true }
        });
        if (targetEvent) {
          categories = targetEvent.ticketCategories || [];
        }
      }
    }

    // If still not found, get first active event as fallback
    if (!targetEvent) {
      targetEvent = await db.query.events.findFirst({
        where: eq(eventsTable.isActive, 1),
        with: { ticketCategories: true }
      });
      categories = targetEvent?.ticketCategories || [];
    }

    if (!targetEvent) {
      return c.json({
        dataProtected: {
          validation: [],
          promoList: [],
          regulerList: []
        }
      });
    }

    const promoList: any[] = [];
    const regulerList: any[] = [];
    const validation: any[] = [];

    for (const cat of categories) {
      const remainingStock = Math.max(0, (cat.stock || 0) - (cat.ticketsSold || 0));
      const isAvailable = remainingStock > 0 ? 1 : 0;
      const maxOrder = Math.min(10, remainingStock > 0 ? remainingStock : 10);

      validation.push({
        ticketIdList: [cat.id],
        maxOrder: isAvailable ? maxOrder : 0
      });

      const isPromo = Boolean(cat.isPromoActive || (cat.discountedPrice && cat.discountedPrice < cat.price));
      const effectivePrice = isPromo && cat.discountedPrice ? cat.discountedPrice : cat.price;
      const oldPrice = isPromo ? (cat.normalPrice || cat.price) : 0;

      const ticketItem = {
        ticketId: cat.id,
        ticketName: cat.name,
        category: cat.name,
        type: isPromo ? (cat.type || 'disc25') : 'regular',
        price: effectivePrice,
        priceTaxService: effectivePrice,
        oldPrice: oldPrice,
        isAvailable,
        stock: remainingStock,
        description: [cat.description || 'Akses masuk event'],
        ticketDate: targetEvent.startDate || '',
      };

      if (isPromo) {
        promoList.push(ticketItem);
      } else {
        regulerList.push(ticketItem);
      }
    }

    // If all are regular, put all in regulerList
    if (promoList.length === 0 && regulerList.length === 0 && categories.length > 0) {
      for (const cat of categories) {
        regulerList.push({
          ticketId: cat.id,
          ticketName: cat.name,
          category: cat.name,
          type: 'regular',
          price: cat.price,
          priceTaxService: cat.price,
          oldPrice: 0,
          isAvailable: 1,
          stock: cat.stock || 10,
          description: [cat.description || ''],
          ticketDate: targetEvent.startDate || '',
        });
      }
    }

    return c.json({
      dataProtected: {
        validation,
        promoList,
        regulerList,
        detailEvent: {
          id: targetEvent.id,
          eventName: targetEvent.name,
          eventDate: targetEvent.startDate,
          location: targetEvent.location,
          vendorConfig: targetEvent.vendorConfig || { purchaseMode: 'multiple' }
        }
      }
    });
  } catch (error) {
    console.error("Error in javajazz /v1/tickets:", error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

