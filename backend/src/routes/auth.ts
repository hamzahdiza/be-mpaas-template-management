import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

export const authRoutes = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'vendor']).default('vendor')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/register
authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password, name, role } = c.req.valid('json');

  try {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.insert(users).values({
      id: uuidv4(),
      email,
      passwordHash,
      name,
      role
    }).returning();

    return c.json({
      message: 'User registered successfully',
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role
      }
    }, 201);
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

// POST /api/auth/login
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  try {
    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const user = userResult[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Generate JWT
    const payload = {
      sub: user.id,
      role: user.role,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
    };
    
    const token = await sign(payload, JWT_SECRET, 'HS256'); // Specify algorithm

    return c.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});
