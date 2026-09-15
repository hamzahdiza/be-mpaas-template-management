import { Hono } from 'hono';
import { eq, or, and, isNull } from 'drizzle-orm';
import { db } from '../db';
import { sduiTemplates } from '../db/schema';
import { allEventTemplates, eventTemplatesMap } from '../templates/event-templates';
import { getAuthUser } from './events';

export const templatesRoutes = new Hono();

// Helper to safely parse JSON or return fallback
function safeParseJson(val: any, fallback: any) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

// Helper to format DB record into SduiTemplateSchema
function formatTemplateSchema(record: any) {
  return {
    schemaVersion: record.schemaVersion || '1.0',
    templateId: record.templateId,
    templateName: record.templateName,
    description: record.description || null,
    category: record.category || 'events',
    pageBackground: record.pageBackground || '#F5F5F5',
    headerSection: safeParseJson(record.headerSection, { fields: [] }),
    contentSection: safeParseJson(record.contentSection, { fields: [] }),
    ctaConfig: safeParseJson(record.ctaConfig, { label: 'Beli Tiket', background: '#75D7D0', color: '#0E0E0E' }),
    ticketDetailSection: safeParseJson(record.ticketDetailSection, null),
    tenantId: record.tenantId || null,
    isGlobal: record.isGlobal !== undefined ? record.isGlobal : 1,
    createdBy: record.createdBy || null,
    isCustom: record.isGlobal === 0 || Boolean(record.tenantId),
  };
}

// GET /api/v1/templates - List all available templates (scoped by tenantId if provided)
templatesRoutes.get('/', async (c) => {
  const authUser = await getAuthUser(c);
  const queryTenantId = c.req.query('tenantId') || c.req.query('tenant_id');
  const tenantId = queryTenantId || authUser?.tenantCode || authUser?.id;
  const includeAll = c.req.query('all') === 'true' || c.req.query('admin') === 'true' || authUser?.role === 'admin';

  try {
    let whereCondition;
    if (includeAll) {
      whereCondition = eq(sduiTemplates.isActive, 1);
    } else if (tenantId) {
      // Return all Global templates + Custom templates owned by this tenant
      whereCondition = and(
        eq(sduiTemplates.isActive, 1),
        or(
          eq(sduiTemplates.isGlobal, 1),
          isNull(sduiTemplates.tenantId),
          eq(sduiTemplates.tenantId, tenantId)
        )
      );
    } else {
      // If no tenantId provided, return active global templates + any public active templates
      whereCondition = and(
        eq(sduiTemplates.isActive, 1),
        or(
          eq(sduiTemplates.isGlobal, 1),
          isNull(sduiTemplates.tenantId)
        )
      );
    }

    const records = await db
      .select()
      .from(sduiTemplates)
      .where(whereCondition);

    if (records && records.length > 0) {
      return c.json({
        success: true,
        source: 'database',
        data: records.map((t) => ({
          templateId: t.templateId,
          templateName: t.templateName,
          description: t.description,
          category: t.category,
          schemaVersion: t.schemaVersion,
          pageBackground: t.pageBackground,
          tenantId: t.tenantId,
          isGlobal: t.isGlobal,
          createdBy: t.createdBy,
          isCustom: t.isGlobal === 0 || Boolean(t.tenantId),
        })),
      });
    }
  } catch (error) {
    console.warn('[TemplatesRoute] Failed to query database, using fallback in-memory:', error);
  }

  // Fallback if DB is empty or unreachable
  return c.json({
    success: true,
    source: 'fallback',
    data: allEventTemplates.map((t) => ({
      templateId: t.templateId,
      templateName: t.templateName,
      category: t.category,
      schemaVersion: t.schemaVersion,
      isGlobal: 1,
      isCustom: false,
    })),
  });
});

// Helper for fetching single template
export async function getSingleTemplate(templateIdParam: any) {
  if (templateIdParam === undefined || templateIdParam === null || templateIdParam === '') {
    return null;
  }
  const strParam = String(templateIdParam);
  const normId = strParam.startsWith('template-') ? strParam : `template-${strParam}`;

  try {
    const [record] = await db
      .select()
      .from(sduiTemplates)
      .where(
        or(
          eq(sduiTemplates.id, normId),
          eq(sduiTemplates.id, strParam),
          eq(sduiTemplates.templateId, normId),
          eq(sduiTemplates.templateId, strParam)
        )
      )
      .limit(1);

    if (record) {
      return formatTemplateSchema(record);
    }
  } catch (error) {
    console.warn(`[TemplatesRoute] DB query error for template ${normId}:`, error);
  }

  // Fallback to in-memory map
  return eventTemplatesMap[normId] || eventTemplatesMap[strParam] || null;
}

// GET /api/v1/templates/events/:templateId - Get specific event template schema
templatesRoutes.get('/events/:templateId', async (c) => {
  const templateId = c.req.param('templateId');
  const template = await getSingleTemplate(templateId);

  if (!template) {
    return c.json(
      {
        success: false,
        message: `Template '${templateId}' not found. Defaulting to template-1.`,
        data: eventTemplatesMap['template-1'],
      },
      404
    );
  }

  return c.json(template);
});

// GET /api/v1/templates/:templateId - Get specific template schema by ID
templatesRoutes.get('/:templateId', async (c) => {
  const templateId = c.req.param('templateId');
  const template = await getSingleTemplate(templateId);

  if (!template) {
    return c.json(
      {
        success: false,
        message: `Template '${templateId}' not found. Defaulting to template-1.`,
        data: eventTemplatesMap['template-1'],
      },
      404
    );
  }

  return c.json(template);
});

// POST /api/v1/templates - Create new template in database (Vendor or Admin)
templatesRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const rawTemplateId = body.templateId || `template-${Date.now()}`;
    const templateId = String(rawTemplateId).startsWith('template-') ? rawTemplateId : `template-${rawTemplateId}`;
    const id = templateId;

    const tenantId = body.tenantId || body.tenant_id || null;
    const isGlobal = body.isGlobal !== undefined ? (body.isGlobal ? 1 : 0) : (tenantId ? 0 : 1);

    const newTemplate = {
      id,
      templateId,
      templateName: body.templateName || 'Custom SDUI Template',
      description: body.description || null,
      category: body.category || 'events',
      schemaVersion: body.schemaVersion || '1.0',
      pageBackground: body.pageBackground || '#F5F5F5',
      headerSection: body.headerSection || { fields: [] },
      contentSection: body.contentSection || { fields: [] },
      ctaConfig: body.ctaConfig || { label: 'Beli Tiket', background: '#FF8736', color: '#FFFFFF' },
      ticketDetailSection: body.ticketDetailSection || null,
      tenantId: tenantId,
      isGlobal: isGlobal,
      createdBy: body.createdBy || body.picName || body.vendorName || null,
      isActive: 1,
    };

    await db.insert(sduiTemplates).values(newTemplate);

    return c.json({
      success: true,
      message: `Template '${templateId}' successfully created in database`,
      data: formatTemplateSchema(newTemplate),
    }, 201);
  } catch (error: any) {
    console.error('[TemplatesRoute] Error creating template:', error);
    return c.json({
      success: false,
      message: 'Failed to create template in database',
      error: error?.message,
    }, 500);
  }
});

// PUT /api/v1/templates/:templateId - Update existing template in database
templatesRoutes.put('/:templateId', async (c) => {
  const templateIdParam = c.req.param('templateId');
  const strParam = String(templateIdParam || '');
  const normId = strParam.startsWith('template-') ? strParam : `template-${strParam}`;

  try {
    const body = await c.req.json();
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.templateName !== undefined) updateData.templateName = body.templateName;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.schemaVersion !== undefined) updateData.schemaVersion = body.schemaVersion;
    if (body.pageBackground !== undefined) updateData.pageBackground = body.pageBackground;
    if (body.headerSection !== undefined) updateData.headerSection = body.headerSection;
    if (body.contentSection !== undefined) updateData.contentSection = body.contentSection;
    if (body.ctaConfig !== undefined) updateData.ctaConfig = body.ctaConfig;
    if (body.ticketDetailSection !== undefined) updateData.ticketDetailSection = body.ticketDetailSection;
    if (body.tenantId !== undefined) updateData.tenantId = body.tenantId;
    if (body.isGlobal !== undefined) updateData.isGlobal = body.isGlobal ? 1 : 0;
    if (body.createdBy !== undefined) updateData.createdBy = body.createdBy;
    if (body.isActive !== undefined) updateData.isActive = body.isActive ? 1 : 0;

    await db
      .update(sduiTemplates)
      .set(updateData)
      .where(or(eq(sduiTemplates.id, normId), eq(sduiTemplates.templateId, normId)));

    const updated = await getSingleTemplate(normId);

    return c.json({
      success: true,
      message: `Template '${normId}' successfully updated in database`,
      data: updated,
    });
  } catch (error: any) {
    console.error(`[TemplatesRoute] Error updating template '${normId}':`, error);
    return c.json({
      success: false,
      message: `Failed to update template '${normId}' in database`,
      error: error?.message,
    }, 500);
  }
});

// DELETE /api/v1/templates/:templateId - Deactivate template in database
templatesRoutes.delete('/:templateId', async (c) => {
  const templateIdParam = c.req.param('templateId');
  const strParam = String(templateIdParam || '');
  const normId = strParam.startsWith('template-') ? strParam : `template-${strParam}`;

  try {
    await db
      .update(sduiTemplates)
      .set({ isActive: 0, updatedAt: new Date().toISOString() })
      .where(or(eq(sduiTemplates.id, normId), eq(sduiTemplates.templateId, normId)));

    return c.json({
      success: true,
      message: `Template '${normId}' deactivated successfully`,
    });
  } catch (error: any) {
    console.error(`[TemplatesRoute] Error deleting template '${normId}':`, error);
    return c.json({
      success: false,
      message: `Failed to deactivate template '${normId}'`,
      error: error?.message,
    }, 500);
  }
});

