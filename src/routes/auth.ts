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

const ALL_ROLE_TYPES = ['event', 'running', 'hotel', 'cafe', 'restaurant', 'rental', 'umkm'];

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, name } = c.req.valid('json');

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await db.insert(users).values({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name,
      role: 'vendor',
      roleType: [],
    }).returning();

    return c.json({
      message: 'User registered successfully',
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role,
        roleType: newUser[0].roleType,
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
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const user = userResult[0];

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const payload = {
      sub: user.id,
      role: user.role,
      name: user.name,
      roleType: user.roleType ?? [],
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    };

    const token = await sign(payload, JWT_SECRET, 'HS256');

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        roleType: user.roleType ?? [],
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
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
