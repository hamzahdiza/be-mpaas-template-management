import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { authMiddleware } from '../middleware/auth';

export const authRoutes = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  tenantName: z.string().optional(),
  category: z.string().optional(),
  picName: z.string().optional(),
  picPhone: z.string().optional(),
  picEmail: z.string().optional(),
  accountNumberBNI: z.string().optional(),
  description: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const body = c.req.valid('json');
  const email = body.email.toLowerCase().trim();
  const password = body.password;
  const tName = body.tenantName || body.name || 'Tenant Partner';
  const picName = body.picName || tName;
  const picPhone = body.picPhone || '';
  const picEmail = body.picEmail || email;
  const category = body.category || 'Lari / Sports';
  const accountNumberBNI = body.accountNumberBNI || '988 0145 2026 0001';
  const description = body.description || 'Tenant mitra resmi ekosistem Lifestyle CMS.';

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return c.json({ error: 'Email already registered', message: 'Email sudah terdaftar di sistem.' }, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const tenantId = `CMS-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`;
    const initials = tName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'OI';

    const newUser = await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name: tName,
      tenantName: tName,
      tenantCode: tenantId,
      category,
      status: 'Active',
      picName,
      picPhone,
      picEmail,
      accountNumberBNI,
      description,
      monthlyRevenue: 'Rp 63 jt / bln',
      joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      joinDateDisplay: `Bergabung ${new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`,
      role: 'vendor',
      roleType: ['event', 'running'],
    }).returning();

    const created = newUser[0];

    const payload = {
      sub: created.id,
      role: created.role,
      name: created.name,
      tenantName: created.tenantName,
      tenantCode: created.tenantCode,
      roleType: created.roleType ?? [],
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    };

    const token = await sign(payload, JWT_SECRET, 'HS256');

    return c.json({
      success: true,
      message: 'User and tenant registered successfully',
      token,
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
        role: created.role,
        tenantCode: created.tenantCode,
        roleType: created.roleType,
      },
      tenant: {
        id: created.tenantCode || created.id,
        name: created.tenantName || created.name,
        tenant_name: created.tenantName || created.name,
        initials,
        status: 'Active',
        category: created.category,
        picName: created.picName,
        pic_name: created.picName,
        picPhone: created.picPhone,
        pic_phone: created.picPhone,
        picEmail: created.picEmail,
        pic_email: created.picEmail,
        joinDate: created.joinDate,
        joinDateDisplay: created.joinDateDisplay,
        accountNumberBNI: created.accountNumberBNI,
        description: created.description,
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
    if (userResult.length === 0) {
      return c.json({ error: 'Invalid email or password', message: 'Email atau password yang Anda masukkan tidak sesuai.' }, 401);
    }

    const user = userResult[0];

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return c.json({ error: 'Invalid email or password', message: 'Email atau password yang Anda masukkan tidak sesuai.' }, 401);
    }

    const initials = (user.tenantName || user.name).split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'OI';

    const payload = {
      sub: user.id,
      role: user.role,
      name: user.name,
      tenantName: user.tenantName,
      tenantCode: user.tenantCode,
      roleType: user.roleType ?? [],
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    };

    const token = await sign(payload, JWT_SECRET, 'HS256');

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantCode: user.tenantCode,
        roleType: user.roleType ?? [],
      },
      tenant: {
        id: user.tenantCode || user.id,
        name: user.tenantName || user.name,
        tenant_name: user.tenantName || user.name,
        initials,
        status: user.status || 'Active',
        category: user.category || 'Lari / Sports',
        picName: user.picName,
        pic_name: user.picName,
        picPhone: user.picPhone,
        pic_phone: user.picPhone,
        picEmail: user.picEmail,
        pic_email: user.picEmail,
        joinDate: user.joinDate,
        joinDateDisplay: user.joinDateDisplay,
        accountNumberBNI: user.accountNumberBNI,
        description: user.description,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

authRoutes.get('/me', authMiddleware, async (c) => {
  const requester = c.get('jwtPayload') as any;
  const userResult = await db.select().from(users).where(eq(users.id, requester.sub));
  if (!userResult.length) return c.json({ error: 'User not found' }, 404);

  const user = userResult[0];
  const initials = (user.tenantName || user.name).split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'OI';

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantCode: user.tenantCode,
      roleType: user.roleType ?? [],
      tenant: {
        id: user.tenantCode || user.id,
        name: user.tenantName || user.name,
        tenant_name: user.tenantName || user.name,
        initials,
        status: user.status || 'Active',
        category: user.category,
        picName: user.picName,
        pic_name: user.picName,
        picPhone: user.picPhone,
        pic_phone: user.picPhone,
        picEmail: user.picEmail,
        pic_email: user.picEmail,
        joinDate: user.joinDate,
        joinDateDisplay: user.joinDateDisplay,
        accountNumberBNI: user.accountNumberBNI,
        description: user.description,
      }
    }
  });
});

authRoutes.post('/logout', async (c) => {
  return c.json({ success: true, message: 'Logged out successfully' });
});

authRoutes.patch('/users/:id/role-type', authMiddleware, zValidator('json', z.object({
  roleType: z.array(z.enum(['event', 'running', 'hotel', 'cafe', 'restaurant', 'rental', 'umkm']))
})), async (c) => {
  const requester = c.get('jwtPayload') as any;
  if (requester.role !== 'admin') return c.json({ error: 'Forbidden' }, 403);

  const targetId = c.req.param('id');
  const { roleType } = c.req.valid('json');

  const updated = await db.update(users)
    .set({ roleType, updatedAt: new Date().toISOString() })
    .where(eq(users.id, targetId))
    .returning();

  if (!updated.length) return c.json({ error: 'User not found' }, 404);

  return c.json({
    message: 'Role type updated',
    user: {
      id: updated[0].id,
      email: updated[0].email,
      name: updated[0].name,
      role: updated[0].role,
      roleType: updated[0].roleType,
    }
  });
});

authRoutes.get('/users', authMiddleware, async (c) => {
  const requester = c.get('jwtPayload') as any;
  if (requester.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403);
  }

  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    role: users.role,
    roleType: users.roleType,
    createdAt: users.createdAt,
  }).from(users);

  return c.json({ data: allUsers });
});
