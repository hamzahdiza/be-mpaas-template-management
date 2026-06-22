import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as dotenv from "dotenv";
import * as schema from "./src/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

dotenv.config();

// Force HTTPS for client connection to avoid protocol issues
const url = process.env.DATABASE_URL!.replace("libsql://", "https://");
const authToken = process.env.DATABASE_AUTH_TOKEN!;

const client = createClient({
  url,
  authToken,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("Cleaning up old data...");
  await db.delete(schema.tickets);
  await db.delete(schema.ticketCategories);
  await db.delete(schema.events);
  await db.delete(schema.users);

  // Create Admin User
  console.log("Creating admin user...");
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);
  
  await db.insert(schema.users).values({
    id: uuidv4(),
    email: "admin@wondr.id",
    passwordHash: passwordHash,
    name: "Super Admin",
    role: "admin"
  });
  console.log("✅ Admin user created: admin@wondr.id / admin123");

  const eventsData = [
    {
      id: uuidv4(),
      name: "Coldplay: Music of the Spheres World Tour",
      description: "Coldplay returns to Jakarta for an unforgettable night at GBK.",
      templateId: 1,
      startDate: "2026-11-15T19:00:00Z",
      endDate: "2026-11-15T23:00:00Z",
      price: 1500000,
      location: "Gelora Bung Karno Stadium",
      locationAddress: "Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10270",
      locationUrl: "https://goo.gl/maps/1",
      bannerUrl: "https://images.unsplash.com/photo-1470229722913-7ea0510d9f38",
      bannerUrls: ["https://images.unsplash.com/photo-1470229722913-7ea0510d9f38", "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"],
      socials: { instagram: { url: "https://instagram.com/coldplay", visible: true }, website: { url: "https://coldplay.com", visible: true } },
      ticketCategories: [
        { name: "Festival", price: 1500000, description: "Standing area", stock: 5000 },
        { name: "VIP", price: 3500000, description: "Seated with best view", stock: 1000 },
        { name: "Tribune", price: 800000, description: "Seated upper deck", stock: 3000 }
      ]
    },
    {
      id: uuidv4(),
      name: "Java Jazz Festival 2026",
      description: "The biggest jazz festival in the Southern Hemisphere returns.",
      templateId: 3,
      startDate: "2026-05-29T15:00:00Z",
      endDate: "2026-05-31T23:59:00Z",
      price: 850000,
      location: "JIExpo Kemayoran",
      locationAddress: "Gedung Pusat Niaga Lt. 1 Arena PRJ Kemayoran, Jl. Benyamin Suaeb, RW.10, Gn. Sahari Sel., Kec. Kemayoran, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10610",
      locationUrl: "https://goo.gl/maps/2",
      bannerUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
      bannerUrls: ["https://images.unsplash.com/photo-1511192336575-5a79af67a629", "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f"],
      socials: { instagram: { url: "https://instagram.com/javajazzfest", visible: true }, website: { url: "https://javajazzfestival.com", visible: true } },
      ticketCategories: [
        { name: "Daily Pass", price: 850000, description: "Access for one day", stock: 10000 },
        { name: "3-Day Pass", price: 1950000, description: "Access for all 3 days", stock: 5000 },
        { name: "Special Show", price: 250000, description: "Add-on for headliner", stock: 2000 }
      ]
    },
    {
      id: uuidv4(),
      name: "Head In The Clouds Jakarta 2026",
      description: "88rising brings the heat back to Jakarta.",
      templateId: 5,
      startDate: "2026-12-05T14:00:00Z",
      endDate: "2026-12-06T23:00:00Z",
      price: 2800000,
      location: "PIK 2 Community Park",
      locationAddress: "PIK 2, Tangerang, Banten",
      locationUrl: "https://goo.gl/maps/3",
      bannerUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9",
      bannerUrls: ["https://images.unsplash.com/photo-1493225255756-d9584f8606e9", "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9"],
      socials: { instagram: { url: "https://instagram.com/hitcjakarta", visible: true }, website: { url: "https://jkt.hitcfestival.com", visible: true } },
      ticketCategories: [
        { name: "GA 2-Day", price: 2800000, description: "General Admission for 2 days", stock: 8000 },
        { name: "VIP 2-Day", price: 5600000, description: "VIP access with perks", stock: 2000 }
      ]
    }
  ];

  for (const event of eventsData) {
    console.log(`Creating event: ${event.name}`);
    
    // Insert Event
    await db.insert(schema.events).values({
      id: event.id,
      name: event.name,
      description: event.description,
      templateId: event.templateId,
      startDate: event.startDate,
      endDate: event.endDate,
      price: event.price,
      location: event.location,
      locationAddress: event.locationAddress,
      locationUrl: event.locationUrl,
      bannerUrl: event.bannerUrl,
      bannerUrls: event.bannerUrls,
      socials: event.socials,
      themeColor: "#FFFFFF"
    });

    // Insert Categories and Tickets
    for (const cat of event.ticketCategories) {
      const catId = uuidv4();
      
      // Insert Category
      await db.insert(schema.ticketCategories).values({
        id: catId,
        eventId: event.id,
        name: cat.name,
        price: cat.price,
        description: cat.description
      });

      // Create a ticket for this category
      await db.insert(schema.tickets).values({
        id: uuidv4(),
        categoryId: catId,
        name: cat.name + " Ticket",
        price: cat.price,
        normalPrice: cat.price, // No discount by default
        stock: cat.stock,
        description: `Standard ticket for ${cat.name}`
      });
      
      // Add a discounted ticket for VIP or 3-Day Pass as example
      if (cat.name.includes("VIP") || cat.name.includes("3-Day")) {
         await db.insert(schema.tickets).values({
            id: uuidv4(),
            categoryId: catId,
            name: "Early Bird " + cat.name,
            price: Math.floor(cat.price * 0.8), // 20% discount
            normalPrice: cat.price,
            type: 'discount',
            stock: 100,
            description: `Early bird price for ${cat.name}`
          });
      }
    }
  }

  console.log("✅ Seeding completed!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
