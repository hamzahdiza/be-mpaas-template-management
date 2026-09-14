import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import * as dotenv from 'dotenv';
import { openApiSpec } from './openapi';
import { eventRoutes } from './routes/events';
import { lifestyleRoutes } from './routes/lifestyle';
import { billPaymentRoutes } from './routes/bill-payment';
import { authRoutes } from './routes/auth';
import { javajazzRoutes } from './routes/javajazz';
import { hotelRoutes } from './routes/hotels';
import { dashboardRoutes } from './routes/dashboard';
import { cafeRestaurantRoutes } from './routes/cafes-restaurants';
import { orderRoutes } from './routes/orders';
import { rentalRoutes } from './routes/rentals';
import { umkmRoutes } from './routes/umkms';
import { runningEventRoutes } from './routes/running-events';
import { tenantRoutes } from './routes/tenant';
import { adminRoutes } from './routes/admin';
import { templatesRoutes } from './routes/templates';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Add it to your .env file.');
}

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => c.redirect('/docs'));

app.get('/docs', swaggerUI({ url: '/openapi.json' }));
app.get('/openapi.json', (c) => c.json(openApiSpec));

// Auth routes (supports both /api/v1/auth and /api/auth)
app.route('/api/v1/auth', authRoutes);
app.route('/api/auth', authRoutes);

// Tenant overview, performance & profile routes
app.route('/api/v1/tenant', tenantRoutes);
app.route('/api/tenant', tenantRoutes);

// Templates routes (Server-Driven UI)
app.route('/api/v1/templates', templatesRoutes);
app.route('/api/templates', templatesRoutes);

// Events routes (supports both /api/v1/events and /api/events)
app.route('/api/v1/events', eventRoutes);
app.route('/api/events', eventRoutes);

// Admin review & moderation & tenant routes
app.route('/api/v1/admin', adminRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/v1/tenants', adminRoutes);
app.route('/api/tenants', adminRoutes);

// Lifestyle & Mini Program routes
app.route('/lifestyle', lifestyleRoutes);
app.route('/lifestyle-javajazz', javajazzRoutes);
app.route('/bill-payment', billPaymentRoutes);
app.route('/api/hotels', hotelRoutes);
app.route('/api/cafes-restaurants', cafeRestaurantRoutes);
app.route('/api/rentals', rentalRoutes);
app.route('/api/umkms', umkmRoutes);
app.route('/api/v1/orders', orderRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/running-events', runningEventRoutes);

export default app;

