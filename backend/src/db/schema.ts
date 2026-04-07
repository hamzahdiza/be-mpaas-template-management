import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  eventType: text("event_type").default("internal"), // internal, external
  externalUrl: text("external_url"),
  description: text("description"),
  templateId: integer("template_id").notNull().default(1), // 1-5
  templates: text("templates", { mode: 'json' }).$type<{
    index: { id: number; title?: string; bannerUrl?: string };
    bookTicket: { id: number; title?: string; bannerUrl?: string };
    visitorList: { id: number; title?: string; bannerUrl?: string };
    visitorInput: { id: number; title?: string; bannerUrl?: string };
  }>(), 
  
  // Event Details
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  price: integer("price").notNull(), // Base price or starting price
  location: text("location"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  seatingPlanUrl: text("seating_plan_url"),
  termsAndConditions: text("terms_and_conditions"),
  
  // Cosmetic / Template Config
  bannerUrl: text("banner_url"), // Legacy/Primary banner
  bannerUrls: text("banner_urls", { mode: 'json' }).$type<string[]>(), // Carousel
  themeColor: text("theme_color").default("#FFFFFF"),
  
  socials: text("socials", { mode: 'json' }).$type<{
    instagram?: { url: string; visible: boolean };
    website?: { url: string; visible: boolean };
  }>(),

  vendorConfig: text("vendor_config", { mode: 'json' }).$type<{
    purchaseMode?: 'single' | 'multiple';
  }>(),

  // Metadata
  partnerId: text("partner_id").default("0100010000060004"),
  billerCode: text("biller_code").default("01"),
  
  userId: text("user_id").references(() => users.id), // Associate event with user

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull(), // Removed unique constraint for now to fix migration issue
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("vendor"), // admin, vendor
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketCategories = sqliteTable("ticket_categories", {
  id: text("id").primaryKey(), // UUID
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // Base price for category
  maxPrice: integer("max_price"), // For price range
  status: text("status").default("available"),
  order: integer("order").default(0),
});

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(), // UUID
  categoryId: text("category_id").notNull().references(() => ticketCategories.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").default("normal"), // normal, b1g1, discount
  price: integer("price").notNull(), // Selling price
  normalPrice: integer("normal_price"), // Original price (for discount)
  stock: integer("stock").default(100),
  isAvailable: integer("is_available").default(1),
  order: integer("order").default(0),
});

// Relations
export const eventsRelations = relations(events, ({ many, one }) => ({
  ticketCategories: many(ticketCategories),
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const ticketCategoriesRelations = relations(ticketCategories, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketCategories.eventId],
    references: [events.id],
  }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  category: one(ticketCategories, {
    fields: [tickets.categoryId],
    references: [ticketCategories.id],
  }),
}));

export const hotels = sqliteTable("hotels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  
  templates: text("templates", { mode: 'json' }).$type<{
    index: { id: number; title?: string; bannerUrl?: string };
    hotelDetail: { id: number; title?: string; bannerUrl?: string };
  }>(),

  location: text("location"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  starRating: integer("star_rating").default(0),
  checkInTime: text("check_in_time").default("14:00"),
  checkOutTime: text("check_out_time").default("12:00"),
  bannerUrl: text("banner_url"),
  images: text("images", { mode: 'json' }).$type<string[]>(), 
  amenities: text("amenities", { mode: 'json' }).$type<string[]>(),
  
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const hotelCategories = sqliteTable("hotel_categories", {
  id: text("id").primaryKey(),
  hotelId: text("hotel_id").notNull().references(() => hotels.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  roomType: text("room_type"), 
  
  description: text("description"), 

  bedConfig: text("bed_config", { mode: 'json' }).$type<{
    type: string;
    count: number;
  }>(),

  roomAmenities: text("room_amenities", { mode: 'json' }).$type<string[]>(), 
  bathAmenities: text("bath_amenities", { mode: 'json' }).$type<string[]>(),
  images: text("images", { mode: 'json' }).$type<string[]>(), 
  
  pricePerNight: integer("price_per_night").notNull(),
  capacity: integer("capacity").default(2),
  stock: integer("stock").default(0),
  isAvailable: integer("is_available").default(1),

  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const cafesRestaurants = sqliteTable("cafes_restaurants", {
  id: text("id").primaryKey(),
  category: text("category").notNull().default("cafe"), // cafe | restaurant
  name: text("name").notNull(),
  description: text("description"),
  templates: text("templates", { mode: "json" }).$type<{
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  }>(),
  location: text("location"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  halalStatus: text("halal_status").default("halal-certified"),
  openTime: text("open_time").default("09:00"),
  closeTime: text("close_time").default("22:00"),
  priceRangeMin: integer("price_range_min").default(0),
  priceRangeMax: integer("price_range_max").default(0),
  bannerUrl: text("banner_url"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  amenities: text("amenities", { mode: "json" }).$type<string[]>(),
  menuItems: text("menu_items", { mode: "json" }).$type<
    {
      id: string;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      isAvailable?: boolean;
    }[]
  >(),
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const serviceOrders = sqliteTable("service_orders", {
  id: text("id").primaryKey(),
  orderType: text("order_type").notNull(), // event | hotel | cafe | restaurant
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  vendorUserId: text("vendor_user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  notes: text("notes"),
  quantity: integer("quantity").default(1),
  totalAmount: integer("total_amount").default(0),
  status: text("status").default("pending"), // pending | accepted | rejected | completed
  orderPayload: text("order_payload", { mode: "json" }).$type<Record<string, any>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const hotelsRelations = relations(hotels, ({ many, one }) => ({
  categories: many(hotelCategories),
  user: one(users, { fields: [hotels.userId], references: [users.id] }),
}));

export const hotelCategoriesRelations = relations(hotelCategories, ({ one }) => ({
  hotel: one(hotels, { fields: [hotelCategories.hotelId], references: [hotels.id] }),
}));

export const cafesRestaurantsRelations = relations(cafesRestaurants, ({ one }) => ({
  user: one(users, { fields: [cafesRestaurants.userId], references: [users.id] }),
}));

export const serviceOrdersRelations = relations(serviceOrders, ({ one }) => ({
  vendor: one(users, { fields: [serviceOrders.vendorUserId], references: [users.id] }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type TicketCategory = typeof ticketCategories.$inferSelect;
export type NewTicketCategory = typeof ticketCategories.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;
export type HotelCategory = typeof hotelCategories.$inferSelect;
export type NewHotelCategory = typeof hotelCategories.$inferInsert;
export type CafeRestaurant = typeof cafesRestaurants.$inferSelect;
export type NewCafeRestaurant = typeof cafesRestaurants.$inferInsert;
export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type NewServiceOrder = typeof serviceOrders.$inferInsert;
