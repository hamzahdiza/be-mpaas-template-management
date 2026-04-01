import { verify } from 'hono/jwt';

export const authMiddleware = async (c: any, next: any) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = await verify(token, JWT_SECRET, 'HS256');
    c.set('jwtPayload', payload);
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};