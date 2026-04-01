import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import * as dotenv from 'dotenv';
import { eventRoutes } from './routes/events';
import { lifestyleRoutes } from './routes/lifestyle';
import { billPaymentRoutes } from './routes/bill-payment';
import { authRoutes } from './routes/auth';
import { javajazzRoutes } from './routes/javajazz';
import { hotelRoutes } from './routes/hotels';
import { dashboardRoutes } from './routes/dashboard';

dotenv.config();

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => {
  return c.json({ message: 'Wondr Event Template API is running' });
});

// Register routes
app.route('/api/auth', authRoutes);
app.route('/api/events', eventRoutes);
app.route('/lifestyle', lifestyleRoutes);
app.route('/lifestyle-javajazz', javajazzRoutes);
app.route('/bill-payment', billPaymentRoutes);
app.route('/api/hotels', hotelRoutes);
app.route('/api/dashboard', dashboardRoutes);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
