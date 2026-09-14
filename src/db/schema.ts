import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export type ApprovalStatus = "DRAFT" | "WAITING" | "APPROVED" | "REJECTED" | "requested" | "approved" | "rejected";

export type DraftComment = {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  statusSnapshot: string;
  createdAt: string;
};

// ----------------------------------------------------------------------
// 1. Users / Tenant Accounts
// ----------------------------------------------------------------------
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("vendor"), // admin | vendor
  roleType: text("role_type", { mode: 'json' }).$type<string[]>(),
  tenantName: text("tenant_name"),
  tenantCode: text("tenant_code").default("CMS-111-23"),
  category: text("category").default("Lari / Sports"),
  status: text("status").default("Active"),
  picName: text("pic_name"),
  picPhone: text("pic_phone"),
  picEmail: text("pic_email"),
  accountNumberBNI: text("account_number_bni"),
  description: text("description"),
  monthlyRevenue: text("monthly_revenue").default("Rp 0 / bln"),
  joinDate: text("join_date"),
  joinDateDisplay: text("join_date_display"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 2. Events (Unified for all Event Categories: Running, Music, Sports, etc.)
// ----------------------------------------------------------------------
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").default("Lari / Sports"),
  eventType: text("event_type").default("Offline Event"), // Offline Event | Online Event | Hybrid Event | internal | external
  eventFormat: text("event_format").default("offline"), // offline | online | hybrid
  entryMode: text("entry_mode").default("manual"), // manual | external
  externalProvider: text("external_provider"),
  externalUrl: text("external_url"),
  description: text("description"),
  termsAndConditions: text("terms_and_conditions"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isOneDayEvent: integer("is_one_day_event").default(0),
  startTime: text("start_time").default("06:00"),
  timezone: text("timezone").default("WIB"),
  price: integer("price").notNull().default(0),
  location: text("location"), // Location / Venue Name
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  meetingUrl: text("meeting_url"),
  seatingPlanUrl: text("seating_plan_url"),
  bannerUrl: text("banner_url"),
  bannerUrls: text("banner_urls", { mode: 'json' }).$type<string[]>(),
  images: text("images", { mode: 'json' }).$type<string[]>(),
  themeColor: text("theme_color").default("#FFFFFF"),
  socials: text("socials", { mode: 'json' }).$type<{
    instagram?: { url: string; visible: boolean };
    website?: { url: string; visible: boolean };
  }>(),
  vendorConfig: text("vendor_config", { mode: 'json' }).$type<{
    purchaseMode?: 'single' | 'multiple';
    maxTickets?: number;
  }>(),
  isPaymentEnabled: integer("is_payment_enabled").default(1),
  paymentChannels: text("payment_channels", { mode: 'json' }).$type<string[]>(),
  feePayer: text("fee_payer").default("customer"), // customer | organizer
  paymentMethod: text("payment_method").default("VA"),
  accountNumberBNI: text("account_number_bni"),
  templateId: integer("template_id").notNull().default(1),
  templates: text("templates", { mode: 'json' }).$type<{
    index?: { id: number; title?: string; bannerUrl?: string };
    bookTicket?: { id: number; title?: string; bannerUrl?: string };
    visitorList?: { id: number; title?: string; bannerUrl?: string };
    visitorInput?: { id: number; title?: string; bannerUrl?: string };
  }>(),
  partnerId: text("partner_id").default("0100010000060004"),
  billerCode: text("biller_code").default("01"),
  userId: text("user_id").references(() => users.id),
  isActive: integer("is_active").default(0),
  approvalStatus: text("approval_status").$type<ApprovalStatus>().default("DRAFT"),
  submissionOption: text("submission_option").default("draft"), // draft | review
  submittedDate: text("submitted_date"),
  reviewedDate: text("reviewed_date"),
  savedDate: text("saved_date"),
  rejectionNote: text("rejection_note"),
  comments: text("comments", { mode: 'json' }).$type<DraftComment[]>(),
  pendingData: text("pending_data", { mode: 'json' }).$type<Record<string, any>>(),
  viewsDetail: integer("views_detail").default(0),
  viewsConfirm: integer("views_confirm").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 3. Ticket Categories / Tiers
// ----------------------------------------------------------------------
export const ticketCategories = sqliteTable("ticket_categories", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  type: text("type").default("Normal"), // Normal | VIP | Bundling | Early Bird
  description: text("description"),
  price: integer("price").notNull(),
  maxPrice: integer("max_price"),
  discountedPrice: integer("discounted_price"),
  isPromoActive: integer("is_promo_active").default(0),
  stock: integer("stock").default(100),
  ticketsSold: integer("tickets_sold").default(0),
  status: text("status").default("available"), // available | sold_out | coming_soon
  isAvailable: integer("is_available").default(1),
  order: integer("order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 4. Ticket Variants / Sub-Tickets (if needed under category)
// ----------------------------------------------------------------------
export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => ticketCategories.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").default("normal"), // normal | b1g1 | discount
  price: integer("price").notNull(),
  normalPrice: integer("normal_price"),
  discountedPrice: integer("discounted_price"),
  stock: integer("stock").default(100),
  isAvailable: integer("is_available").default(1),
  order: integer("order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 5. Orders & Transactions
// ----------------------------------------------------------------------
export const serviceOrders = sqliteTable("service_orders", {
  id: text("id").primaryKey(),
  orderType: text("order_type").notNull().default("event"), // event | hotel | culinary | rental | umkm
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  vendorUserId: text("vendor_user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  customerNik: text("customer_nik"),
  notes: text("notes"),
  quantity: integer("quantity").default(1),
  totalAmount: integer("total_amount").default(0),
  status: text("status").default("pending"), // pending | completed | canceled | refund
  paymentMethod: text("payment_type").default("va"), // va | qris | cc | transfer
  vaNumber: text("va_number"),
  invoiceNumber: text("invoice_number"),
  orderPayload: text("order_payload", { mode: "json" }).$type<Record<string, any>>(),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 6. Issued Tickets / Attendees (for CMS Attendees & Mini Program Tickets)
// ----------------------------------------------------------------------
export const issuedTickets = sqliteTable("issued_tickets", {
  id: text("id").primaryKey(), // Ticket Code / Attendee ID
  orderId: text("order_id").references(() => serviceOrders.id, { onDelete: 'cascade' }),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: 'cascade' }),
  ticketCategoryId: text("ticket_category_id").references(() => ticketCategories.id),
  ticketId: text("ticket_id"),
  participantName: text("participant_name").notNull(),
  nik: text("nik").notNull(),
  email: text("email"),
  phone: text("phone"),
  buyerName: text("buyer_name"),
  buyerPhone: text("buyer_phone"),
  buyerEmail: text("buyer_email"),
  ticketName: text("ticket_name"),
  ticketCategory: text("ticket_category"),
  ticketQuantity: integer("ticket_quantity").default(1),
  ticketIndex: integer("ticket_index").default(1),
  nominal: integer("nominal").default(0),
  status: text("status").default("COMPLETED"), // COMPLETED | PENDING | REFUND | CHECKED_IN
  qrCode: text("qr_code"),
  checkInAt: text("check_in_at"),
  purchaseDate: text("purchase_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// 7. Lifestyle Packages Support (Hotels, F&B, Rentals, UMKM)
// ----------------------------------------------------------------------
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
  isActive: integer("is_active").default(0),
  approvalStatus: text("approval_status").$type<ApprovalStatus>().default("requested"),
  comments: text("comments", { mode: 'json' }).$type<DraftComment[]>(),
  pendingData: text("pending_data", { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const hotelCategories = sqliteTable("hotel_categories", {
  id: text("id").primaryKey(),
  hotelId: text("hotel_id").notNull().references(() => hotels.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  roomType: text("room_type"),
  description: text("description"),
  bedConfig: text("bed_config", { mode: 'json' }).$type<{ type: string; count: number }>(),
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
  category: text("category").notNull().default("cafe"),
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
  menuItems: text("menu_items", { mode: "json" }).$type<{
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
  }[]>(),
  userId: text("user_id").references(() => users.id),
  isActive: integer("is_active").default(0),
  approvalStatus: text("approval_status").$type<ApprovalStatus>().default("requested"),
  comments: text("comments", { mode: 'json' }).$type<DraftComment[]>(),
  pendingData: text("pending_data", { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const rentals = sqliteTable("rentals", {
  id: text("id").primaryKey(),
  category: text("category").notNull().default("car"),
  name: text("name").notNull(),
  description: text("description"),
  templates: text("templates", { mode: "json" }).$type<{
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  }>(),
  location: text("location"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  bannerUrl: text("banner_url"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  vehicles: text("vehicles", { mode: "json" }).$type<{
    id: string;
    name: string;
    type: string;
    transmission: "manual" | "automatic";
    capacity: number;
    pricePerDay: number;
    imageUrl?: string;
    isAvailable?: boolean;
  }[]>(),
  userId: text("user_id").references(() => users.id),
  isActive: integer("is_active").default(0),
  approvalStatus: text("approval_status").$type<ApprovalStatus>().default("requested"),
  comments: text("comments", { mode: 'json' }).$type<DraftComment[]>(),
  pendingData: text("pending_data", { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const umkms = sqliteTable("umkms", {
  id: text("id").primaryKey(),
  category: text("category").notNull().default("product"),
  name: text("name").notNull(),
  description: text("description"),
  templates: text("templates", { mode: "json" }).$type<{
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  }>(),
  location: text("location"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  bannerUrl: text("banner_url"),
  images: text("images", { mode: "json" }).$type<string[]>(),
  products: text("products", { mode: "json" }).$type<{
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    stock?: number;
  }[]>(),
  userId: text("user_id").references(() => users.id),
  isActive: integer("is_active").default(0),
  approvalStatus: text("approval_status").$type<ApprovalStatus>().default("requested"),
  comments: text("comments", { mode: 'json' }).$type<DraftComment[]>(),
  pendingData: text("pending_data", { mode: 'json' }).$type<Record<string, any>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// Relations
// ----------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  orders: many(serviceOrders),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  ticketCategories: many(ticketCategories),
  issuedTickets: many(issuedTickets),
  user: one(users, { fields: [events.userId], references: [users.id] }),
}));

export const ticketCategoriesRelations = relations(ticketCategories, ({ one, many }) => ({
  event: one(events, { fields: [ticketCategories.eventId], references: [events.id] }),
  tickets: many(tickets),
  issuedTickets: many(issuedTickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  category: one(ticketCategories, { fields: [tickets.categoryId], references: [ticketCategories.id] }),
}));

export const serviceOrdersRelations = relations(serviceOrders, ({ one, many }) => ({
  vendor: one(users, { fields: [serviceOrders.vendorUserId], references: [users.id] }),
  issuedTickets: many(issuedTickets),
}));

export const issuedTicketsRelations = relations(issuedTickets, ({ one }) => ({
  order: one(serviceOrders, { fields: [issuedTickets.orderId], references: [serviceOrders.id] }),
  event: one(events, { fields: [issuedTickets.eventId], references: [events.id] }),
  ticketCategory: one(ticketCategories, { fields: [issuedTickets.ticketCategoryId], references: [ticketCategories.id] }),
}));

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

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user: one(users, { fields: [rentals.userId], references: [users.id] }),
}));

export const umkmsRelations = relations(umkms, ({ one }) => ({
  user: one(users, { fields: [umkms.userId], references: [users.id] }),
}));

// ----------------------------------------------------------------------
// 12. SDUI Templates (Dynamic Server-Driven UI Schemas for Mobile & Web)
// ----------------------------------------------------------------------
export const sduiTemplates = sqliteTable("sdui_templates", {
  id: text("id").primaryKey(), // e.g. 'template-1', 'template-2'
  templateId: text("template_id").notNull(), // 'template-1'
  templateName: text("template_name").notNull(),
  category: text("category").default("events"), // events | hotels | culinary | etc.
  schemaVersion: text("schema_version").default("1.0"),
  pageBackground: text("page_background").default("#F5F5F5"),
  headerSection: text("header_section", { mode: 'json' }).$type<any>(),
  contentSection: text("content_section", { mode: 'json' }).$type<any>(),
  ctaConfig: text("cta_config", { mode: 'json' }).$type<any>(),
  ticketDetailSection: text("ticket_detail_section", { mode: 'json' }).$type<any>(),
  isActive: integer("is_active").default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ----------------------------------------------------------------------
// Type Exports
// ----------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type TicketCategory = typeof ticketCategories.$inferSelect;
export type NewTicketCategory = typeof ticketCategories.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type NewServiceOrder = typeof serviceOrders.$inferInsert;
export type IssuedTicket = typeof issuedTickets.$inferSelect;
export type NewIssuedTicket = typeof issuedTickets.$inferInsert;
export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;
export type HotelCategory = typeof hotelCategories.$inferSelect;
export type NewHotelCategory = typeof hotelCategories.$inferInsert;
export type CafeRestaurant = typeof cafesRestaurants.$inferSelect;
export type NewCafeRestaurant = typeof cafesRestaurants.$inferInsert;
export type Rental = typeof rentals.$inferSelect;
export type NewRental = typeof rentals.$inferInsert;
export type Umkm = typeof umkms.$inferSelect;
export type NewUmkm = typeof umkms.$inferInsert;
export type SduiTemplate = typeof sduiTemplates.$inferSelect;
export type NewSduiTemplate = typeof sduiTemplates.$inferInsert;

