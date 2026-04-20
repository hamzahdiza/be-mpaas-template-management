import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as dotenv from "dotenv";
import * as schema from "./src/db/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

dotenv.config();

const url = process.env.DATABASE_URL!.replace("libsql://", "https://");
const authToken = process.env.DATABASE_AUTH_TOKEN!;

const client = createClient({
  url,
  authToken,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding Real Life Data (All Templates)...");

  // Clear existing data
  console.log("Cleaning up old data...");
  await db.delete(schema.serviceOrders);
  await db.delete(schema.tickets);
  await db.delete(schema.ticketCategories);
  await db.delete(schema.events);
  await db.delete(schema.hotelCategories);
  await db.delete(schema.hotels);
  await db.delete(schema.cafesRestaurants);
  await db.delete(schema.rentals);
  await db.delete(schema.umkms);
  await db.delete(schema.users);

  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash("password123", salt);

  // 1. Create Users
  console.log("Creating users...");
  const adminId = uuidv4();
  const vendorEventId = uuidv4();
  const vendorHotelId = uuidv4();
  const vendorFoodId = uuidv4();
  const vendorRentalId = uuidv4();
  const vendorUmkmId = uuidv4();

  await db.insert(schema.users).values([
    { id: adminId, email: "admin@mail.id", passwordHash: commonPassword, name: "Super Admin", role: "admin" },
    { id: vendorEventId, email: "ismaya@event.id", passwordHash: commonPassword, name: "Ismaya Live", role: "vendor" },
    { id: vendorHotelId, email: "marriott@hotel.id", passwordHash: commonPassword, name: "Marriott Group", role: "vendor" },
    { id: vendorFoodId, email: "union@group.id", passwordHash: commonPassword, name: "Union Group", role: "vendor" },
    { id: vendorRentalId, email: "trac@astra.id", passwordHash: commonPassword, name: "TRAC Astra", role: "vendor" },
    { id: vendorUmkmId, email: "lokal@brand.id", passwordHash: commonPassword, name: "Lokal Brand Collective", role: "vendor" },
  ]);

  // 2. Create Events (5 Templates)
  console.log("Creating 5 realistic events...");
  const events = [
    {
      id: uuidv4(),
      userId: vendorEventId,
      name: "Djakarta Warehouse Project 2026",
      description: "Asia's biggest electronic dance music festival returns to Jakarta for its 18th edition, featuring world-class DJs and spectacular production.",
      startDate: "2026-12-11T16:00:00Z",
      endDate: "2026-12-13T04:00:00Z",
      price: 1250000,
      location: "JIExpo Kemayoran",
      locationAddress: "Jl. Benyamin Suaeb No.1, Kemayoran, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/JIExpo",
      bannerUrl: "https://images.unsplash.com/photo-1459749411177-042180ce673c",
      bannerUrls: ["https://images.unsplash.com/photo-1459749411177-042180ce673c", "https://images.unsplash.com/photo-1514525253361-bee8718a74a2", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"],
      templateId: 1,
      templates: { 
        index: { id: 1, title: "DWP 2026 - Main Stage", bannerUrl: "https://images.unsplash.com/photo-1459749411177-042180ce673c" }, 
        bookTicket: { id: 1, title: "Reserve Your Spot", bannerUrl: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2" }, 
        visitorList: { id: 1 }, 
        visitorInput: { id: 1 } 
      },
      categories: [
        { name: "GA Early Bird", price: 1250000, stock: 2000 }, 
        { name: "GA Presale 1", price: 1500000, stock: 5000 },
        { name: "GA Presale 2", price: 1750000, stock: 5000 },
        { name: "VIP Royal Presale", price: 3500000, stock: 500 },
        { name: "VIP Royal Daily", price: 4000000, stock: 1000 },
        { name: "VVIP Group Sofa", price: 15000000, stock: 20 },
        { name: "VVIP Diamond Table", price: 25000000, stock: 10 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorEventId,
      name: "We The Fest 2026",
      description: "A summer festival of music, arts, fashion and food in the heart of Jakarta, showcasing a diverse lineup of international and local talent.",
      startDate: "2026-07-17T14:00:00Z",
      endDate: "2026-07-19T23:59:00Z",
      price: 950000,
      location: "GBK Sports Complex",
      locationAddress: "Gelora Bung Karno, Senayan, Jakarta",
      locationUrl: "https://maps.app.goo.gl/GBK",
      bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
      bannerUrls: ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745", "https://images.unsplash.com/photo-1459749411177-042180ce673c"],
      templateId: 2,
      templates: { 
        index: { id: 2, title: "Summer Vibes 2026", bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" }, 
        bookTicket: { id: 2 }, 
        visitorList: { id: 2 }, 
        visitorInput: { id: 2 } 
      },
      categories: [
        { name: "Daily Pass - Day 1", price: 950000, stock: 3000 },
        { name: "Daily Pass - Day 2", price: 950000, stock: 3000 },
        { name: "Daily Pass - Day 3", price: 950000, stock: 3000 },
        { name: "3-Day Pass GA", price: 2500000, stock: 1000 },
        { name: "3-Day Pass VIB", price: 5500000, stock: 500 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorEventId,
      name: "Java Jazz Festival 2026",
      description: "One of the largest jazz festivals in the world, featuring legendary international artists and the best of Indonesia's jazz scene.",
      startDate: "2026-05-22T15:00:00Z",
      endDate: "2026-05-24T23:59:00Z",
      price: 850000,
      location: "JIExpo Kemayoran",
      locationAddress: "JIExpo, Kemayoran, Jakarta",
      locationUrl: "https://maps.app.goo.gl/JavaJazz",
      bannerUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
      bannerUrls: ["https://images.unsplash.com/photo-1511192336575-5a79af67a629", "https://images.unsplash.com/photo-1514525253361-bee8718a74a2"],
      templateId: 3,
      templates: { 
        index: { id: 3, title: "Smooth Jazz Night", bannerUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629" }, 
        bookTicket: { id: 3 }, 
        visitorList: { id: 3 }, 
        visitorInput: { id: 3 } 
      },
      categories: [
        { name: "Special Show", price: 850000, stock: 1500 },
        { name: "Daily Pass", price: 650000, stock: 2000 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorEventId,
      name: "Hammersonic 2026",
      description: "The biggest heavy metal festival in Southeast Asia, bringing the loudest and heaviest acts to the shores of Jakarta.",
      startDate: "2026-03-18T10:00:00Z",
      endDate: "2026-03-19T23:00:00Z",
      price: 750000,
      location: "Carnival Beach Ancol",
      locationAddress: "Ancol, North Jakarta",
      locationUrl: "https://maps.app.goo.gl/Hammersonic",
      bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
      bannerUrls: ["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"],
      templateId: 4,
      templates: { 
        index: { id: 4, title: "Loud & Proud", bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7" }, 
        bookTicket: { id: 4 }, 
        visitorList: { id: 4 }, 
        visitorInput: { id: 4 } 
      },
      categories: [
        { name: "Metalhead Pass", price: 750000, stock: 10000 },
        { name: "Pit Pass", price: 1200000, stock: 500 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorEventId,
      name: "Head in the Clouds Jakarta",
      description: "88rising's music and arts festival making its way back to Jakarta with an unforgettable Asian-centric celebration.",
      startDate: "2026-09-05T12:00:00Z",
      endDate: "2026-09-06T23:00:00Z",
      price: 1500000,
      location: "PIK 2 Community Park",
      locationAddress: "Pantai Indah Kapuk 2, Tangerang",
      locationUrl: "https://maps.app.goo.gl/HITC",
      bannerUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      bannerUrls: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"],
      templateId: 5,
      templates: { 
        index: { id: 5, title: "HITC Jakarta 2026", bannerUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3" }, 
        bookTicket: { id: 5 }, 
        visitorList: { id: 5 }, 
        visitorInput: { id: 5 } 
      },
      categories: [
        { name: "Cloud Pass", price: 1500000, stock: 8000 },
        { name: "VIP Cloud", price: 3000000, stock: 1000 }
      ]
    }
  ];

  for (const ev of events) {
    await db.insert(schema.events).values({
      id: ev.id,
      userId: ev.userId,
      name: ev.name,
      description: ev.description,
      startDate: ev.startDate,
      endDate: ev.endDate,
      price: ev.price,
      location: ev.location,
      locationAddress: ev.locationAddress,
      locationUrl: ev.locationUrl,
      bannerUrl: ev.bannerUrl,
      bannerUrls: ev.bannerUrls,
      templateId: ev.templateId,
      templates: ev.templates,
      themeColor: "#FF5733"
    });

    for (const cat of ev.categories) {
      const catId = uuidv4();
      await db.insert(schema.ticketCategories).values({
        id: catId,
        eventId: ev.id,
        name: cat.name,
        price: cat.price,
        description: `Access for ${cat.name}`
      });
      await db.insert(schema.tickets).values({
        id: uuidv4(),
        categoryId: catId,
        name: `${cat.name} Ticket`,
        price: cat.price,
        stock: cat.stock,
        isAvailable: 1
      });
    }
  }

  // 3. Create Hotels (5 Templates)
  console.log("Creating 5 realistic hotels...");
  const hotels = [
    {
      id: uuidv4(),
      userId: vendorHotelId,
      name: "The Ritz-Carlton Bali",
      description: "Experience the ultimate luxury beachfront resort in Nusa Dua, Bali, where traditional Balinese architecture meets modern elegance.",
      location: "Nusa Dua, Bali",
      locationAddress: "Jalan Raya Nusa Dua Selatan Lot III, Bali 80361",
      locationUrl: "https://maps.app.goo.gl/RitzBali",
      starRating: 5,
      bannerUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", "https://images.unsplash.com/photo-1566073771259-6a8506099945"],
      amenities: ["Beach Access", "Infinity Pool", "Spa", "Kids Club", "Butler Service", "Gourmet Dining"],
      templates: { index: { id: 1 }, hotelDetail: { id: 1 } },
      categories: [
        { name: "Sawangan Junior Suite", type: "Suite", price: 4500000, stock: 20 },
        { name: "The Ritz-Carlton Suite", type: "Suite", price: 8500000, stock: 5 },
        { name: "One Bedroom Sky Villa", type: "Villa", price: 12000000, stock: 3 },
        { name: "Cliff Edge Villa", type: "Villa", price: 15000000, stock: 2 },
        { name: "Presidential Villa", type: "Villa", price: 25000000, stock: 1 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorHotelId,
      name: "St. Regis Jakarta",
      description: "The finest address in Jakarta, located in the heart of the Golden Triangle, offering unparalleled luxury and world-class service.",
      location: "Kuningan, Jakarta",
      locationAddress: "Jl. HR Rasuna Said Kav. B-4, Jakarta 12910",
      locationUrl: "https://maps.app.goo.gl/StRegisJKT",
      starRating: 5,
      bannerUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
      amenities: ["Butler Service", "Afternoon Tea", "Outdoor Pool", "Jazz Bar", "Luxury Spa"],
      templates: { index: { id: 2 }, hotelDetail: { id: 2 } },
      categories: [
        { name: "Deluxe King Room", type: "Room", price: 3800000, stock: 50 },
        { name: "Grand Deluxe Room", type: "Room", price: 4200000, stock: 30 },
        { name: "Caroline Astor Suite", type: "Suite", price: 7200000, stock: 10 },
        { name: "Metropolitan Suite", type: "Suite", price: 9500000, stock: 5 },
        { name: "Presidential Suite", type: "Suite", price: 45000000, stock: 1 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorHotelId,
      name: "Amanjiwo",
      description: "A sanctuary of spirit and peace overlooking Borobudur, designed to harmonize with the majestic landscape of Central Java.",
      location: "Magelang, Central Java",
      locationAddress: "Ds. Majaksingi, Borobudur, Magelang",
      locationUrl: "https://maps.app.goo.gl/Amanjiwo",
      starRating: 5,
      bannerUrl: "https://images.unsplash.com/photo-1544124499-58912cbddaad",
      images: ["https://images.unsplash.com/photo-1544124499-58912cbddaad", "https://images.unsplash.com/photo-1590073844006-33379778ae09"],
      amenities: ["Cultural Tours", "Yoga Pavilion", "Library", "Art Gallery", "Temple Picnic"],
      templates: { index: { id: 3 }, hotelDetail: { id: 3 } },
      categories: [
        { name: "Garden Pool Suite", type: "Suite", price: 12000000, stock: 10 },
        { name: "Borobudur Pool Suite", type: "Suite", price: 15000000, stock: 5 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorHotelId,
      name: "Alila Villas Uluwatu",
      description: "Eco-friendly luxury villas perched on limestone cliffs, offering spectacular views of the Indian Ocean.",
      location: "Uluwatu, Bali",
      locationAddress: "Jl. Belimbing Sari, Pecatu, Bali",
      locationUrl: "https://maps.app.goo.gl/AlilaUluwatu",
      starRating: 5,
      bannerUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7"],
      amenities: ["Clifftop Pool", "Personal Butler", "Eco-friendly", "Sunset Cabana", "Wellness Center"],
      templates: { index: { id: 4 }, hotelDetail: { id: 4 } },
      categories: [
        { name: "One-Bedroom Villa", type: "Villa", price: 18000000, stock: 15 },
        { name: "Three-Bedroom Cliff Villa", type: "Villa", price: 45000000, stock: 2 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorHotelId,
      name: "Plataran Borobudur",
      description: "Authentic Javanese luxury with views of the great temple, nestled in the Menoreh Hills.",
      location: "Borobudur, Central Java",
      locationAddress: "Jl. Dusun Tanjungan, Borobudur, Magelang",
      locationUrl: "https://maps.app.goo.gl/Plataran",
      starRating: 5,
      bannerUrl: "https://images.unsplash.com/photo-1580977259146-63448a3008a3",
      images: ["https://images.unsplash.com/photo-1580977259146-63448a3008a3", "https://images.unsplash.com/photo-1601918774946-25832a4be0d6"],
      amenities: ["Temple Views", "Royal Dining", "Organic Farm", "Traditional Spa", "Horse Riding"],
      templates: { index: { id: 5 }, hotelDetail: { id: 5 } },
      categories: [
        { name: "Executive Suite", type: "Suite", price: 5500000, stock: 8 },
        { name: "Grand Spa Pool Villa", type: "Villa", price: 9500000, stock: 3 }
      ]
    }
  ];

  for (const h of hotels) {
    await db.insert(schema.hotels).values({
      id: h.id,
      userId: h.userId,
      name: h.name,
      description: h.description,
      location: h.location,
      locationAddress: h.locationAddress,
      locationUrl: h.locationUrl,
      starRating: h.starRating,
      bannerUrl: h.bannerUrl,
      images: h.images,
      amenities: h.amenities,
      templates: h.templates
    });

    for (const cat of h.categories) {
      await db.insert(schema.hotelCategories).values({
        id: uuidv4(),
        hotelId: h.id,
        name: cat.name,
        roomType: cat.type,
        pricePerNight: cat.price,
        stock: cat.stock,
        isAvailable: 1,
        description: `Luxurious ${cat.name} with premium facilities.`
      });
    }
  }

  // 4. Create Cafes/Restaurants (5 Cafes + 5 Restaurants = 10 Total)
  console.log("Creating 10 realistic cafes and restaurants...");
  const foodPlaces = [
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "restaurant",
      name: "Union PIK",
      description: "Jakarta's most beloved brasserie and bakery, famous for its Red Velvet Cake and artisanal cocktails.",
      location: "PIK Ave, Jakarta",
      locationAddress: "PIK Avenue Mall, Ground Floor, Jakarta Utara",
      locationUrl: "https://maps.app.goo.gl/UnionPIK",
      halalStatus: "muslim-friendly",
      openTime: "10:00",
      closeTime: "22:00",
      priceRangeMin: 150000,
      priceRangeMax: 500000,
      bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", "https://images.unsplash.com/photo-1552566626-52f8b828add9"],
      amenities: ["WiFi", "Outdoor Seating", "Live Music", "Valet Parking"],
      templates: { index: { id: 1 }, detail: { id: 1 } },
      menuItems: [
        { id: uuidv4(), name: "Red Velvet Cake", description: "The legendary cake that started it all.", price: 75000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f" },
        { id: uuidv4(), name: "Truffle Fries", description: "Crispy fries with real truffle oil and parmesan.", price: 85000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1573082833947-d87179f7113c" },
        { id: uuidv4(), name: "Classic Benedict", description: "Poached eggs with hollandaise.", price: 110000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1600335895229-6e75511892c8" },
        { id: uuidv4(), name: "Union Burger", description: "Signature dry-aged beef patty.", price: 145000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
        { id: uuidv4(), name: "Nasi Bebek Garing", description: "Crispy duck with traditional sambal.", price: 125000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1516100882582-76c9a58b35cb" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "cafe",
      name: "Common Grounds",
      description: "Champion roastery and artisanal coffee house focusing on high-quality beans and precision brewing.",
      location: "Senopati, Jakarta",
      locationAddress: "Jl. Senopati No.12, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/CommonGrounds",
      halalStatus: "halal-certified",
      openTime: "07:00",
      closeTime: "20:00",
      priceRangeMin: 50000,
      priceRangeMax: 200000,
      bannerUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"],
      amenities: ["WiFi", "Power Outlets", "AC", "Coffee Roastery"],
      templates: { index: { id: 2 }, detail: { id: 2 } },
      menuItems: [
        { id: uuidv4(), name: "Cappuccino", description: "Perfectly balanced double shot with silky milk.", price: 45000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213" },
        { id: uuidv4(), name: "Avocado on Toast", description: "Fresh avocado with poached eggs on sourdough.", price: 95000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8" },
        { id: uuidv4(), name: "Iced Dirty Matcha", description: "Matcha with a shot of espresso.", price: 55000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002" },
        { id: uuidv4(), name: "Philly Cheesesteak", description: "Shredded beef with melted cheese.", price: 115000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1521305916504-4a1121188589" },
        { id: uuidv4(), name: "Classic Pancake", description: "Fluffy pancakes with maple syrup.", price: 75000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1528207776546-365bb710ee93" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "restaurant",
      name: "Monsieur Spoon",
      description: "Authentic French bakery and cafe serving the most famous croissants in Indonesia.",
      location: "Canggu, Bali",
      locationAddress: "Jl. Pantai Batu Bolong, Canggu, Bali",
      locationUrl: "https://maps.app.goo.gl/MonsieurSpoon",
      halalStatus: "muslim-friendly",
      openTime: "08:00",
      closeTime: "21:00",
      priceRangeMin: 30000,
      priceRangeMax: 250000,
      bannerUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
      images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24", "https://images.unsplash.com/photo-1559339352-11d035aa65de"],
      amenities: ["Garden View", "WiFi", "Freshly Baked", "Pet Friendly"],
      templates: { index: { id: 3 }, detail: { id: 3 } },
      menuItems: [
        { id: uuidv4(), name: "Butter Croissant", description: "Flaky, buttery, and golden brown.", price: 25000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
        { id: uuidv4(), name: "Shakshuka", description: "Eggs poached in a spicy tomato sauce.", price: 85000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1590412200988-a436bb7050a8" },
        { id: uuidv4(), name: "Almond Croissant", description: "Sweet almond filling and flakes.", price: 38000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a" },
        { id: uuidv4(), name: "Eclair Chocolate", description: "Classic French pastry with dark chocolate.", price: 42000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1621236304195-06bb1d5fbf87" },
        { id: uuidv4(), name: "Quiche Lorraine", description: "Savory tart with smoked beef and cheese.", price: 65000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1608039755401-742111d01694" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "restaurant",
      name: "Bakmi GM",
      description: "Iconic Indonesian noodle house since 1959, serving the best fried wontons in town.",
      location: "Thamrin, Jakarta",
      locationAddress: "Jl. M.H. Thamrin No.59, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/BakmiGM",
      halalStatus: "halal-certified",
      openTime: "10:00",
      closeTime: "21:30",
      priceRangeMin: 40000,
      priceRangeMax: 150000,
      bannerUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
      images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624"],
      amenities: ["AC", "Family Friendly", "Takeaway", "Halal"],
      templates: { index: { id: 4 }, detail: { id: 4 } },
      menuItems: [
        { id: uuidv4(), name: "Bakmi Special GM", description: "Our signature chicken noodles.", price: 45000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be" },
        { id: uuidv4(), name: "Pangsit Goreng", description: "World famous crispy fried wontons.", price: 35000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1614594805323-e5a73277e499" },
        { id: uuidv4(), name: "Nasi Goreng Smoked Chicken", description: "Indonesian fried rice with a twist.", price: 55000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b" },
        { id: uuidv4(), name: "Yi Fu Mie Ni", description: "Crispy noodles with thick savory sauce.", price: 48000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246" },
        { id: uuidv4(), name: "Cap Cay", description: "Stir-fried mixed vegetables.", price: 42000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "restaurant",
      name: "Sederhana SA",
      description: "Premium Minang cuisine (Nasi Padang) experience with high hygiene standards and authentic taste.",
      location: "Sudirman, Jakarta",
      locationAddress: "Jl. Jend. Sudirman Kav. 52-53, Jakarta",
      locationUrl: "https://maps.app.goo.gl/Sederhana",
      halalStatus: "halal-certified",
      openTime: "09:00",
      closeTime: "22:00",
      priceRangeMin: 50000,
      priceRangeMax: 300000,
      bannerUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
      images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc", "https://images.unsplash.com/photo-1541529086526-db283c563270"],
      amenities: ["AC", "VIP Room", "Parking", "Halal"],
      templates: { index: { id: 5 }, detail: { id: 5 } },
      menuItems: [
        { id: uuidv4(), name: "Rendang Daging", description: "Slow cooked beef in coconut milk and spices.", price: 25000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26" },
        { id: uuidv4(), name: "Ayam Pop", description: "Signature pale-colored savory fried chicken.", price: 22000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1582650800021-38379659050d" },
        { id: uuidv4(), name: "Gulai Tambusu", description: "Cow intestine stuffed with eggs.", price: 28000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc" },
        { id: uuidv4(), name: "Sate Padang", description: "Ox tongue with spicy thick sauce.", price: 45000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6e9481bfa" },
        { id: uuidv4(), name: "Dendeng Balado", description: "Crispy beef with red chili.", price: 30000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26" }
      ]
    },
    // New additions to reach 5 Cafes and 5 Restaurants
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "cafe",
      name: "Arabica Jakarta",
      description: "Minimalist specialty coffee roastery from Kyoto, now in the heart of Jakarta.",
      location: "SCBD, Jakarta",
      locationAddress: "District 8, SCBD, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/ArabicaSCBD",
      halalStatus: "halal-certified",
      openTime: "08:00",
      closeTime: "22:00",
      priceRangeMin: 50000,
      priceRangeMax: 150000,
      bannerUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf",
      images: ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf", "https://images.unsplash.com/photo-1442512595331-e89e73853f31"],
      amenities: ["Minimalist Design", "Specialty Coffee", "AC"],
      templates: { index: { id: 1 }, detail: { id: 1 } },
      menuItems: [
        { id: uuidv4(), name: "Spanish Latte", description: "Sweet and creamy signature latte.", price: 65000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "cafe",
      name: "Anomali Coffee",
      description: "Proudly serving Indonesian specialty coffee from Sabang to Merauke.",
      location: "Kemang, Jakarta",
      locationAddress: "Jl. Kemang Raya No.72, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/AnomaliKemang",
      halalStatus: "halal-certified",
      openTime: "07:00",
      closeTime: "23:00",
      priceRangeMin: 40000,
      priceRangeMax: 150000,
      bannerUrl: "https://images.unsplash.com/photo-1453614512568-c4024d13c247",
      images: ["https://images.unsplash.com/photo-1453614512568-c4024d13c247"],
      amenities: ["WiFi", "Outdoor area", "Coffee Workshop"],
      templates: { index: { id: 2 }, detail: { id: 2 } },
      menuItems: [
        { id: uuidv4(), name: "Aceh Gayo", description: "Single origin coffee from Aceh.", price: 40000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "cafe",
      name: "Tanamera Coffee",
      description: "Award-winning Indonesian specialty coffee roaster and cafe.",
      location: "Thamrin, Jakarta",
      locationAddress: "Thamrin City, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/Tanamera",
      halalStatus: "halal-certified",
      openTime: "07:00",
      closeTime: "21:00",
      priceRangeMin: 45000,
      priceRangeMax: 180000,
      bannerUrl: "https://images.unsplash.com/photo-1461023233307-59f75e6f3d9d",
      images: ["https://images.unsplash.com/photo-1461023233307-59f75e6f3d9d"],
      amenities: ["AC", "Expert Baristas", "Takeaway"],
      templates: { index: { id: 3 }, detail: { id: 3 } },
      menuItems: [
        { id: uuidv4(), name: "Cold Brew", description: "Smooth 12-hour steeped coffee.", price: 55000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1461023233307-59f75e6f3d9d" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "cafe",
      name: "Starbucks Reserve",
      description: "A premium coffee experience featuring rare small-lot coffees from around the world.",
      location: "Senayan Park, Jakarta",
      locationAddress: "Senayan Park Mall, Ground Floor, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/StarbucksReserve",
      halalStatus: "halal-certified",
      openTime: "08:00",
      closeTime: "23:00",
      priceRangeMin: 60000,
      priceRangeMax: 250000,
      bannerUrl: "https://images.unsplash.com/photo-1507133750040-4a8f5700e35f",
      images: ["https://images.unsplash.com/photo-1507133750040-4a8f5700e35f"],
      amenities: ["Lounge Seating", "WiFi", "Barista Bar"],
      templates: { index: { id: 4 }, detail: { id: 4 } },
      menuItems: [
        { id: uuidv4(), name: "Reserve Pour Over", description: "Manual brew of seasonal beans.", price: 75000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorFoodId,
      category: "restaurant",
      name: "Din Tai Fung",
      description: "World famous dumpling house known for its signature Xiao Long Bao.",
      location: "Senayan City, Jakarta",
      locationAddress: "Senayan City Mall, Level 3, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/DinTaiFung",
      halalStatus: "muslim-friendly",
      openTime: "11:00",
      closeTime: "22:00",
      priceRangeMin: 100000,
      priceRangeMax: 400000,
      bannerUrl: "https://images.unsplash.com/photo-1563245332-692e1af62121",
      images: ["https://images.unsplash.com/photo-1563245332-692e1af62121"],
      amenities: ["Family Friendly", "Open Kitchen", "AC"],
      templates: { index: { id: 5 }, detail: { id: 5 } },
      menuItems: [
        { id: uuidv4(), name: "Chicken Xiao Long Bao", description: "Handcrafted soup dumplings.", price: 85000, isAvailable: true, imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c170db0a" }
      ]
    }
  ];

  for (const f of foodPlaces) {
    await db.insert(schema.cafesRestaurants).values({
      id: f.id,
      userId: f.userId,
      category: f.category as any,
      name: f.name,
      description: f.description,
      location: f.location,
      locationAddress: f.locationAddress,
      locationUrl: f.locationUrl,
      halalStatus: f.halalStatus,
      bannerUrl: f.bannerUrl,
      menuItems: f.menuItems,
      templates: f.templates
    });
  }

  // 5. Create Rentals (3 Cars + 2 Motors = 5 Total)
  console.log("Creating 5 realistic rentals (3 Cars, 2 Motors)...");
  const rentals = [
    {
      id: uuidv4(),
      userId: vendorRentalId,
      category: "car",
      name: "TRAC Astra Rental",
      description: "Professional car rental and corporate mobility solutions by Astra, providing the best fleet and service.",
      location: "Sudirman, Jakarta",
      locationAddress: "Jl. Jend Sudirman Kav 21, Jakarta",
      locationUrl: "https://maps.app.goo.gl/TRAC",
      bannerUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d",
      images: ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d", "https://images.unsplash.com/photo-1503376780353-7e6692767b70"],
      templates: { index: { id: 1 }, detail: { id: 1 } },
      vehicles: [
        { id: uuidv4(), name: "Toyota Innova Zenix", type: "MPV", transmission: "automatic", capacity: 7, pricePerDay: 850000, imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888", isAvailable: true },
        { id: uuidv4(), name: "Toyota Fortuner", type: "SUV", transmission: "automatic", capacity: 7, pricePerDay: 1200000, imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", isAvailable: true },
        { id: uuidv4(), name: "Toyota Avanza", type: "MPV", transmission: "automatic", capacity: 7, pricePerDay: 450000, imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588", isAvailable: true },
        { id: uuidv4(), name: "Toyota Veloz", type: "MPV", transmission: "automatic", capacity: 7, pricePerDay: 500000, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", isAvailable: true },
        { id: uuidv4(), name: "Toyota Alphard", type: "Luxury MPV", transmission: "automatic", capacity: 6, pricePerDay: 3500000, imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", isAvailable: true }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorRentalId,
      category: "car",
      name: "Blue Bird Rental",
      description: "Premium limousine and car rental service offering the highest standards of safety and comfort.",
      location: "Mampang, Jakarta",
      locationAddress: "Jl. Mampang Prapatan Raya No. 60, Jakarta",
      locationUrl: "https://maps.app.goo.gl/BlueBird",
      bannerUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2", "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"],
      templates: { index: { id: 2 }, detail: { id: 2 } },
      vehicles: [
        { id: uuidv4(), name: "Mercedes-Benz E-Class", type: "Sedan", transmission: "automatic", capacity: 4, pricePerDay: 2500000, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", isAvailable: true },
        { id: uuidv4(), name: "Toyota Camry", type: "Sedan", transmission: "automatic", capacity: 4, pricePerDay: 1500000, imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", isAvailable: true },
        { id: uuidv4(), name: "BMW 5 Series", type: "Sedan", transmission: "automatic", capacity: 4, pricePerDay: 2800000, imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e", isAvailable: true },
        { id: uuidv4(), name: "Alphard Transformer", type: "Luxury MPV", transmission: "automatic", capacity: 6, pricePerDay: 3800000, imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", isAvailable: true },
        { id: uuidv4(), name: "Hiace Premio", type: "Van", transmission: "manual", capacity: 12, pricePerDay: 1800000, imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf", isAvailable: true }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorRentalId,
      category: "car",
      name: "Traveloka Car Rental",
      description: "Easy and reliable car rental for your travel needs with various partners across Indonesia.",
      location: "BSD City, Tangerang",
      locationAddress: "Green Office Park, BSD City, Tangerang",
      locationUrl: "https://maps.app.goo.gl/Traveloka",
      bannerUrl: "https://images.unsplash.com/photo-1494905998402-395d579af36f",
      images: ["https://images.unsplash.com/photo-1494905998402-395d579af36f", "https://images.unsplash.com/photo-1590362891991-f776e747a588"],
      templates: { index: { id: 3 }, detail: { id: 3 } },
      vehicles: [
        { id: uuidv4(), name: "Toyota Avanza", type: "MPV", transmission: "automatic", capacity: 7, pricePerDay: 450000, imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588", isAvailable: true },
        { id: uuidv4(), name: "Honda HR-V", type: "SUV", transmission: "automatic", capacity: 5, pricePerDay: 750000, imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888", isAvailable: true },
        { id: uuidv4(), name: "Mitsubishi Xpander", type: "MPV", transmission: "automatic", capacity: 7, pricePerDay: 550000, imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", isAvailable: true },
        { id: uuidv4(), name: "Suzuki Ertiga", type: "MPV", transmission: "manual", capacity: 7, pricePerDay: 400000, imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588", isAvailable: true },
        { id: uuidv4(), name: "Daihatsu Xenia", type: "MPV", transmission: "manual", capacity: 7, pricePerDay: 380000, imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588", isAvailable: true }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorRentalId,
      category: "motor",
      name: "GrabRent Motor",
      description: "Hourly and daily motorcycle rental for city explore, flexible and affordable.",
      location: "Kuningan, Jakarta",
      locationAddress: "Gama Tower, Kuningan, Jakarta",
      locationUrl: "https://maps.app.goo.gl/GrabRent",
      bannerUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527",
      images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"],
      templates: { index: { id: 4 }, detail: { id: 4 } },
      vehicles: [
        { id: uuidv4(), name: "Honda Vario 160", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 150000, imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", isAvailable: true },
        { id: uuidv4(), name: "Yamaha NMAX", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 200000, imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527", isAvailable: true },
        { id: uuidv4(), name: "Honda Beat", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 80000, imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", isAvailable: true },
        { id: uuidv4(), name: "Yamaha Lexi", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 120000, imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527", isAvailable: true },
        { id: uuidv4(), name: "Honda PCX 160", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 220000, imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527", isAvailable: true }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorRentalId,
      category: "motor",
      name: "Bali Bike Rental",
      description: "The most reliable motorcycle rental in Bali with premium fleet and road assistance.",
      location: "Seminyak, Bali",
      locationAddress: "Jl. Raya Seminyak No. 17, Bali",
      locationUrl: "https://maps.app.goo.gl/BaliBike",
      bannerUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527",
      images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"],
      templates: { index: { id: 5 }, detail: { id: 5 } },
      vehicles: [
        { id: uuidv4(), name: "Vespa Sprint", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 350000, imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea", isAvailable: true },
        { id: uuidv4(), name: "Kawasaki Ninja 250", type: "Sport", transmission: "manual", capacity: 2, pricePerDay: 750000, imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", isAvailable: true },
        { id: uuidv4(), name: "Honda Scoopy", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 100000, imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527", isAvailable: true },
        { id: uuidv4(), name: "Yamaha XMAX", type: "Scooter", transmission: "automatic", capacity: 2, pricePerDay: 450000, imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87", isAvailable: true },
        { id: uuidv4(), name: "Honda CRF 150", type: "Offroad", transmission: "manual", capacity: 2, pricePerDay: 250000, imageUrl: "https://images.unsplash.com/photo-1558981403-c5f91cbba527", isAvailable: true }
      ]
    }
  ];

  for (const r of rentals) {
    await db.insert(schema.rentals).values({
      id: r.id,
      userId: r.userId,
      category: r.category as any,
      name: r.name,
      description: r.description,
      location: r.location,
      locationAddress: r.locationAddress,
      locationUrl: r.locationUrl,
      bannerUrl: r.bannerUrl,
      vehicles: r.vehicles,
      templates: r.templates
    });
  }

  // 6. Create UMKM (5 Templates)
  console.log("Creating 5 realistic UMKM brands...");
  const umkms = [
    {
      id: uuidv4(),
      userId: vendorUmkmId,
      category: "food",
      name: "Toko Kopi Tuku",
      description: "The pioneer of Es Kopi Susu Tetangga, bringing affordable high-quality coffee to everyone.",
      location: "Cipete, Jakarta",
      locationAddress: "Jl. Cipete Raya No.7, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/KopiTuku",
      bannerUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
      images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", "https://images.unsplash.com/photo-1541167760496-162955ed8a9f"],
      templates: { index: { id: 1 }, detail: { id: 1 } },
      products: [
        { id: uuidv4(), name: "Es Kopi Susu Tetangga", price: 20000, description: "Signature coffee with palm sugar and creamer.", imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f", isAvailable: true, stock: 100 },
        { id: uuidv4(), name: "Donat Kampoeng", price: 10000, description: "Classic sugar-coated donut.", imageUrl: "https://images.unsplash.com/photo-1527515545081-5db817172677", isAvailable: true, stock: 50 },
        { id: uuidv4(), name: "Kopi Hitam Tetangga", price: 15000, description: "Strong black coffee.", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", isAvailable: true, stock: 100 },
        { id: uuidv4(), name: "Earl Grey Milk Tea", price: 25000, description: "Fragrant tea with milk.", imageUrl: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002", isAvailable: true, stock: 50 },
        { id: uuidv4(), name: "Roti Cokelat", price: 12000, description: "Sweet bread with chocolate filling.", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a", isAvailable: true, stock: 30 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorUmkmId,
      category: "product",
      name: "Erigo Store",
      description: "Indonesian leading lifestyle and streetwear brand, representing the spirit of the young generation.",
      location: "Senayan, Jakarta",
      locationAddress: "Senayan City, Jakarta Pusat",
      locationUrl: "https://maps.app.goo.gl/Erigo",
      bannerUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea"],
      templates: { index: { id: 2 }, detail: { id: 2 } },
      products: [
        { id: uuidv4(), name: "Erigo Coach Jacket", price: 350000, description: "Classic coach jacket for daily wear, water resistant.", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea", isAvailable: true, stock: 50 },
        { id: uuidv4(), name: "Erigo T-Shirt Classic", price: 150000, description: "100% Cotton combed 30s.", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", isAvailable: true, stock: 100 },
        { id: uuidv4(), name: "Erigo Hoodie Forest", price: 450000, description: "Warm hoodie for outdoor activities.", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7", isAvailable: true, stock: 30 },
        { id: uuidv4(), name: "Erigo Chino Pants", price: 250000, description: "Comfortable slim fit chinos.", imageUrl: "https://images.unsplash.com/photo-1473964195305-ee2fe21a0071", isAvailable: true, stock: 40 },
        { id: uuidv4(), name: "Erigo Trucker Hat", price: 100000, description: "Stylish hat for sunny days.", imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b", isAvailable: true, stock: 100 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorUmkmId,
      category: "product",
      name: "Dear Me Beauty",
      description: "Local cosmetics brand focused on inclusivity and high-performance beauty products.",
      location: "Kemang, Jakarta",
      locationAddress: "Kemang Raya No. 45, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/DearMe",
      bannerUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", "https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f"],
      templates: { index: { id: 3 }, detail: { id: 3 } },
      products: [
        { id: uuidv4(), name: "Velvet Lip Coat", price: 109000, description: "Smooth and creamy lip coat with long-lasting finish.", imageUrl: "https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f", isAvailable: true, stock: 200 },
        { id: uuidv4(), name: "Face Primer", price: 129000, description: "Blurring primer for a flawless look.", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfad45f1f6", isAvailable: true, stock: 150 },
        { id: uuidv4(), name: "Serum Sunscreen", price: 149000, description: "Protects and hydrates your skin.", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03", isAvailable: true, stock: 100 },
        { id: uuidv4(), name: "Loose Powder", price: 99000, description: "Fine powder for oil control.", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfad45f1f6", isAvailable: true, stock: 80 },
        { id: uuidv4(), name: "Cleansing Balm", price: 159000, description: "Melts away makeup easily.", imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571", isAvailable: true, stock: 60 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorUmkmId,
      category: "product",
      name: "Buttonscarves",
      description: "Premium lifestyle brand specializing in hijabs and luxury accessories for the modern woman.",
      location: "Pondok Indah, Jakarta",
      locationAddress: "Pondok Indah Mall 2, Jakarta Selatan",
      locationUrl: "https://maps.app.goo.gl/Buttonscarves",
      bannerUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
      images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90", "https://images.unsplash.com/photo-1601924994987-69e26d50dc26"],
      templates: { index: { id: 4 }, detail: { id: 4 } },
      products: [
        { id: uuidv4(), name: "Signature Scarf", price: 395000, description: "The iconic printed scarf in premium voile.", imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26", isAvailable: true, stock: 30 },
        { id: uuidv4(), name: "Alma Bag", price: 1250000, description: "Elegant leather bag for special occasions.", imageUrl: "https://images.unsplash.com/photo-1584917765829-683e536f8bb5", isAvailable: true, stock: 10 },
        { id: uuidv4(), name: "Tweed Blazer", price: 850000, description: "Classic blazer for a professional look.", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea", isAvailable: true, stock: 5 },
        { id: uuidv4(), name: "Brooch Gold", price: 450000, description: "Luxury accessory for your scarf.", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908", isAvailable: true, stock: 20 },
        { id: uuidv4(), name: "Prayer Robe", price: 950000, description: "Beautifully designed prayer set.", imageUrl: "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63", isAvailable: true, stock: 15 }
      ]
    },
    {
      id: uuidv4(),
      userId: vendorUmkmId,
      category: "product",
      name: "HMNS Perfume",
      description: "The best local perfume house in Indonesia, creating scents that tell a story.",
      location: "Tangerang, Banten",
      locationAddress: "The Breeze BSD, Tangerang",
      locationUrl: "https://maps.app.goo.gl/HMNS",
      bannerUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601", "https://images.unsplash.com/photo-1594035910387-fea47794261f"],
      templates: { index: { id: 5 }, detail: { id: 5 } },
      products: [
        { id: uuidv4(), name: "Orgasm Eau de Parfum", price: 323000, description: "Top selling feminine fragrance with floral notes.", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f", isAvailable: true, stock: 40 },
        { id: uuidv4(), name: "Farina Eau de Parfum", price: 349000, description: "Fresh and clean unisex scent.", imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539", isAvailable: true, stock: 25 },
        { id: uuidv4(), name: "Alpha Eau de Parfum", price: 315000, description: "Strong and bold masculine fragrance.", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f", isAvailable: true, stock: 50 },
        { id: uuidv4(), name: "The Perfection", price: 385000, description: "Sophisticated and elegant scent.", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601", isAvailable: true, stock: 20 },
        { id: uuidv4(), name: "Essence of the Sun", price: 365000, description: "Warm and radiant summer scent.", imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f", isAvailable: true, stock: 30 }
      ]
    }
  ];

  for (const u of umkms) {
    await db.insert(schema.umkms).values({
      id: u.id,
      userId: u.userId,
      category: u.category as any,
      name: u.name,
      description: u.description,
      location: u.location,
      locationAddress: u.locationAddress,
      locationUrl: u.locationUrl,
      bannerUrl: u.bannerUrl,
      products: u.products,
      templates: u.templates
    });
  }

  // 7. Historical Orders
  console.log("Creating historical orders...");
  const orders = [
    { type: "event", serviceName: "DWP 2026", customer: "Budi Santoso", amount: 2500000, vendor: vendorEventId, status: "completed", date: "2026-04-10T10:00:00Z" },
    { type: "hotel", serviceName: "Ritz-Carlton Bali", customer: "John Doe", amount: 9000000, vendor: vendorHotelId, status: "completed", date: "2026-04-12T09:00:00Z" },
    { type: "restaurant", serviceName: "Union PIK", customer: "Rizky Fauzi", amount: 450000, vendor: vendorFoodId, status: "completed", date: "2026-04-15T19:00:00Z" },
    { type: "rental", serviceName: "TRAC Astra", customer: "Maya Putri", amount: 850000, vendor: vendorRentalId, status: "completed", date: "2026-04-14T16:00:00Z" },
    { type: "umkm", serviceName: "Toko Kopi Tuku", customer: "Andi Wijaya", amount: 40000, vendor: vendorUmkmId, status: "completed", date: "2026-04-16T08:15:00Z" },
  ];

  for (const o of orders) {
    await db.insert(schema.serviceOrders).values({
      id: uuidv4(),
      orderType: o.type as any,
      serviceId: "HISTORICAL",
      serviceName: o.serviceName,
      vendorUserId: o.vendor,
      customerName: o.customer,
      customerPhone: "08123456789",
      totalAmount: o.amount,
      status: o.status as any,
      paymentMethod: "VA",
      invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: o.date,
      completedAt: o.status === "completed" ? o.date : null
    });
  }

  console.log("✅ All Templates Real Life Seeding completed!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
