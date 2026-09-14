import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/db/schema";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Memulai proses seeding database...");

  // 1. Bersihkan data tabel yang terkait (urutan menjaga foreign key)
  console.log("🧹 Membersihkan tabel lama...");
  try {
    await db.delete(schema.issuedTickets);
    await db.delete(schema.serviceOrders);
    await db.delete(schema.tickets);
    await db.delete(schema.ticketCategories);
    await db.delete(schema.events);
    await db.delete(schema.users);
    console.log("✅ Tabel berhasil dibersihkan");
  } catch (err) {
    console.log("⚠️ Catatan saat membersihkan tabel:", err);
  }

  // 2. Hash password default
  const defaultPassword = "password123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 3. Buat Akun Admin
  const adminId = "usr-admin-001";
  console.log("👤 Membuat Akun Admin...");
  await db.insert(schema.users).values({
    id: adminId,
    email: "admin@lifestyle.com",
    passwordHash,
    name: "Super Admin Lifestyle",
    role: "admin",
    roleType: ["event", "hotel", "culinary", "rental", "umkm"],
    tenantName: "BNI Lifestyle Management",
    tenantCode: "ADMIN-001",
    category: "Super Admin",
    status: "Active",
    picName: "Admin Pusat",
    picPhone: "+62 811-0000-1111",
    picEmail: "admin@lifestyle.com",
    accountNumberBNI: "0000000001",
    description: "Akun Super Administrator BNI Lifestyle Platform",
    monthlyRevenue: "Rp 0 / bln",
    joinDate: "1 Januari 2025",
    joinDateDisplay: "Bergabung Jan 2025",
  });
  console.log("✅ Akun Admin berhasil dibuat: admin@lifestyle.com / password123");

  // 4. Buat Akun Tenant / Vendor (Akun Utama: Orbital Inc. & Tenant Direktori Lainnya)
  console.log("🏢 Membuat Akun Tenant / Vendor...");

  const tenantsData = [
    {
      id: "usr-tenant-001",
      email: "vendor@orbitalinc.com",
      passwordHash,
      name: "Hamzah Diza",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Orbital Inc.",
      tenantCode: "CMS-111-23",
      category: "Lari / Sports",
      status: "Active",
      picName: "Hamzah Diza",
      picPhone: "+62 812-3456-7890",
      picEmail: "hamzah.diza@orbitalinc.com",
      accountNumberBNI: "2132134142342",
      description: "Penyelenggara acara olahraga marathon, festival musik, dan ekshibisi terkemuka di Indonesia.",
      monthlyRevenue: "Rp 63 jt / bln",
      joinDate: "1 Agustus 2026",
      joinDateDisplay: "Bergabung Jan 2025",
    },
    {
      id: "usr-tenant-002",
      email: "vendor@tamansantika.com",
      passwordHash,
      name: "Santika Admin",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Taman Santika",
      tenantCode: "CMS-001",
      category: "Musik / Konser",
      status: "Active",
      picName: "Santika Admin",
      picPhone: "+62 812-1111-2222",
      picEmail: "admin@tamansantika.com",
      accountNumberBNI: "0123456781",
      description: "Promotor konser musik dan festival seni.",
      monthlyRevenue: "Rp 0 / bln",
      joinDate: "1 September 2025",
      joinDateDisplay: "Bergabung Sep 2025",
    },
    {
      id: "usr-tenant-003",
      email: "vendor@buburcinta.com",
      passwordHash,
      name: "Andi Cinta",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Bubur Ayam Cinta",
      tenantCode: "CMS-002",
      category: "Lari / Sports",
      status: "Active",
      picName: "Andi Cinta",
      picPhone: "+62 812-9876-5432",
      picEmail: "contact@buburcinta.com",
      accountNumberBNI: "0123456782",
      description: "Komunitas dan organizer event olahraga lari santai.",
      monthlyRevenue: "Rp 0 / bln",
      joinDate: "1 Oktober 2025",
      joinDateDisplay: "Bergabung Okt 2025",
    },
    {
      id: "usr-tenant-004",
      email: "vendor@kedaikopikita.com",
      passwordHash,
      name: "Budi Kopi",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Kedai Kopi Kita",
      tenantCode: "CMS-003",
      category: "Lari / Sports",
      status: "Active",
      picName: "Budi Kopi",
      picPhone: "+62 813-8877-6655",
      picEmail: "halo@kedaikopikita.com",
      accountNumberBNI: "0123456783",
      description: "Event organizer hybrid running festival.",
      monthlyRevenue: "Rp 0 / bln",
      joinDate: "1 November 2025",
      joinDateDisplay: "Bergabung Nov 2025",
    },
    {
      id: "usr-tenant-005",
      email: "vendor@warungsederhana.com",
      passwordHash,
      name: "Siti Sederhana",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Warung Sederhana",
      tenantCode: "CMS-004",
      category: "Lari / Sports",
      status: "Active",
      picName: "Siti Sederhana",
      picPhone: "+62 856-1122-3344",
      picEmail: "info@warungsederhana.com",
      accountNumberBNI: "0123456784",
      description: "Penyelenggara online race dan virtual sports.",
      monthlyRevenue: "Rp 0 / bln",
      joinDate: "1 Desember 2025",
      joinDateDisplay: "Bergabung Des 2025",
    },
    {
      id: "usr-tenant-006",
      email: "vendor@sariroti.com",
      passwordHash,
      name: "Dewi Roti",
      role: "vendor" as const,
      roleType: ["event"],
      tenantName: "Sari Roti Bakery",
      tenantCode: "CMS-005",
      category: "Lari / Sports",
      status: "Active",
      picName: "Dewi Roti",
      picPhone: "+62 818-9900-1122",
      picEmail: "pic@sariroti.com",
      accountNumberBNI: "0123456785",
      description: "Penyelenggara race tahunan Wondr Running.",
      monthlyRevenue: "Rp 0 / bln",
      joinDate: "1 Januari 2026",
      joinDateDisplay: "Bergabung Jan 2026",
    }
  ];

  for (const t of tenantsData) {
    await db.insert(schema.users).values(t);
  }
  console.log(`✅ ${tenantsData.length} Akun Tenant berhasil dibuat.`);

  // 5. Buat Data Event HANYA untuk Akun Orbital Inc. (usr-tenant-001)
  // Menjamin tenant lain tidak memiliki event data
  console.log("🎪 Membuat data event khusus akun Orbital Inc. (vendor@orbitalinc.com)...");

  const orbitalEvents = [
    // 1. ACTIVE & LIVE EVENT (Approved + IsActive = 1)
    {
      id: "run-001",
      name: "BNI RUNNING 2026",
      category: "Lari / Sports",
      eventType: "Hybrid Event",
      eventFormat: "hybrid",
      entryMode: "manual",
      description: "Flagship running event BNI dengan rute bersertifikasi internasional AIMS melintasi jalan protokol Sudirman-Thamrin.",
      termsAndConditions: "1. Syarat dan ketentuan umum BNI Running berlaku.\n2. Peserta terdaftar otomatis mendapatkan asuransi perlindungan.\n3. Wajib membawa e-voucher saat race pack collection.",
      startDate: "2026-10-15",
      endDate: "2026-10-15",
      isOneDayEvent: 1,
      startTime: "05:00",
      timezone: "WIB",
      price: 250000,
      location: "Stadion Utama Gelora Bung Karno, Jakarta Pusat",
      locationAddress: "Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat",
      locationUrl: "https://maps.google.com/?q=GBK+Senayan+Jakarta",
      meetingUrl: "https://meet.google.com/bni-run-2026",
      bannerUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#0D9488",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris", "cc"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 1, // ACTIVE
      approvalStatus: "APPROVED" as const,
      submissionOption: "review",
      submittedDate: "2023-10-02T14:20:00Z",
      reviewedDate: "2023-10-02T16:00:00Z",
      viewsDetail: 18450,
      viewsConfirm: 16200,
      tiers: [
        { id: "tier-001-1", name: "5K National", price: 250000, maxPrice: 300000, stock: 6000, sold: 2400, desc: "Race kit eksklusif BNI, medali finisher, hydration station tiap 1.5 km" },
        { id: "tier-001-2", name: "10K Championship", price: 400000, maxPrice: 450000, stock: 6000, sold: 1800, desc: "Kategori kejuaraan dengan total hadiah ratusan juta rupiah" },
        { id: "tier-001-3", name: "Half Marathon 21K", price: 550000, maxPrice: 650000, stock: 4000, sold: 1200, desc: "Tantangan 21K dengan cut-off time 3.5 jam dan medali putar emas" },
      ]
    },

    // 2. ACTIVE & LIVE EVENT (Approved + IsActive = 1)
    {
      id: "run-002",
      name: "Melawai Running 2026",
      category: "Lari / Sports",
      eventType: "Offline Event",
      eventFormat: "offline",
      entryMode: "manual",
      description: "Ajang lari santai 5K dan 10K melintasi kawasan bersejarah Blok M dan Melawai dengan suasana pagi yang sejuk dan rute yang ramah pelari pemula.",
      termsAndConditions: "1. Peserta wajib berusia minimal 12 tahun.\n2. Wajib mengenakan race jersey resmi.\n3. Pengambilan race pack H-2 di Blok M Hub.",
      startDate: "2026-11-20",
      endDate: "2026-11-20",
      isOneDayEvent: 1,
      startTime: "05:30",
      timezone: "WIB",
      price: 150000,
      location: "Kawasan Blok M & Melawai, Jakarta Selatan",
      locationAddress: "Jl. Melawai Raya No. 21, Kebayoran Baru, Jakarta Selatan",
      locationUrl: "https://maps.google.com/?q=Melawai+Jakarta",
      bannerUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#0D9488",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 1, // ACTIVE
      approvalStatus: "APPROVED" as const,
      submissionOption: "review",
      submittedDate: "2023-10-04T10:00:00Z",
      reviewedDate: "2023-10-04T10:30:00Z",
      viewsDetail: 8500,
      viewsConfirm: 6400,
      tiers: [
        { id: "tier-002-1", name: "5K Fun Run", price: 150000, maxPrice: 175000, stock: 5000, sold: 2100, desc: "Jersey, Medali Finisher, Refreshment, Bib & Timing Chip" },
        { id: "tier-002-2", name: "10K Challenge", price: 250000, maxPrice: 300000, stock: 3000, sold: 1500, desc: "Jersey, Medali Finisher Eksklusif, E-Certificate, Refreshment" },
      ]
    },

    // 3. MENUNGGU REVIEW (WAITING / Review Submission)
    {
      id: "run-003",
      name: "Wondr Running 2026",
      category: "Lari / Sports",
      eventType: "Offline Event",
      eventFormat: "offline",
      entryMode: "manual",
      description: "Kompetisi lari tahunan BNI Wondr dengan 3 kategori perlombaan di pusat kota Jakarta mengelilingi Monumen Nasional.",
      termsAndConditions: "1. Peserta dalam kondisi sehat jasmani.\n2. Tidak dapat dialihkan kepemilikannya.\n3. Medali hanya untuk finisher cut-off time.",
      startDate: "2026-12-05",
      endDate: "2026-12-05",
      isOneDayEvent: 1,
      startTime: "05:00",
      timezone: "WIB",
      price: 175000,
      location: "Monumen Nasional (Monas), Jakarta Pusat",
      locationAddress: "Jl. Medan Merdeka Barat, Gambir, Jakarta Pusat",
      locationUrl: "https://maps.google.com/?q=Monas+Jakarta",
      bannerUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#005E6A",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris", "cc"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 0,
      approvalStatus: "WAITING" as const, // MENUNGGU REVIEW
      submissionOption: "review",
      submittedDate: "2023-10-05T08:30:00Z",
      viewsDetail: 2140,
      viewsConfirm: 1980,
      tiers: [
        { id: "tier-003-1", name: "5K Early Bird", price: 175000, maxPrice: 200000, stock: 2000, sold: 0, desc: "Paket lari 5K lengkap dengan slot start gelombang 1" },
        { id: "tier-003-2", name: "10K Regular", price: 300000, maxPrice: 350000, stock: 4000, sold: 0, desc: "Paket lari 10K kompetisi podium berhadiah" },
        { id: "tier-003-3", name: "Half Marathon 21K", price: 450000, maxPrice: 500000, stock: 2000, sold: 0, desc: "Paket lari 21K Finisher Jacket + Medali Logam Berat" },
      ]
    },

    // 4. MENUNGGU REVIEW (WAITING / Review Submission)
    {
      id: "run-004",
      name: "Sound of Soul Jakarta Festival",
      category: "Musik / Konser",
      eventType: "Hybrid Event",
      eventFormat: "hybrid",
      entryMode: "manual",
      description: "Festival musik dan seni persembahan musisi tanah air dengan kolaborasi visual art dan workshop interaktif di ruang terbuka hijau.",
      termsAndConditions: "1. Acara terbuka untuk semua umur (anak di bawah 5 tahun gratis).\n2. Dilarang membawa makanan dan minuman dari luar.",
      startDate: "2026-11-30",
      endDate: "2026-11-30",
      isOneDayEvent: 1,
      startTime: "16:00",
      timezone: "WIB",
      price: 250000,
      location: "Allianz Ecopark Ancol, Jakarta Utara",
      locationAddress: "Jl. Lodan Timur No.7, Ancol, Pademangan, Jakarta Utara",
      locationUrl: "https://maps.google.com/?q=Allianz+Ecopark+Ancol",
      meetingUrl: "https://meet.example.com/sos-festival",
      bannerUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#E11D48",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris", "cc"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 0,
      approvalStatus: "WAITING" as const, // MENUNGGU REVIEW
      submissionOption: "review",
      submittedDate: "2023-10-06T11:00:00Z",
      viewsDetail: 3100,
      viewsConfirm: 2750,
      tiers: [
        { id: "tier-004-1", name: "Daily Pass Festival", price: 250000, maxPrice: 300000, stock: 3000, sold: 0, desc: "Akses 1 hari semua panggung dan area kuliner festival" },
        { id: "tier-004-2", name: "2-Days All Stage Pass", price: 450000, maxPrice: 500000, stock: 2000, sold: 0, desc: "Akses penuh 2 hari festival + merchandise pack" },
        { id: "tier-004-3", name: "VIP Lounge Experience", price: 800000, maxPrice: 950000, stock: 500, sold: 0, desc: "Akses panggung depan VIP, lounge ber-AC, meet & greet slot" },
      ]
    },

    // 5. REJECTED / DITOLAK (REJECTED + Catatan Revisi)
    {
      id: "run-005",
      name: "Run & Rave Jakarta",
      category: "Lari / Sports",
      eventType: "Online Event",
      eventFormat: "online",
      entryMode: "manual",
      description: "Kombinasi unik lari 5K senja di pinggir pantai disusul konser musik elektronik dan pertunjukan kembang api megah.",
      termsAndConditions: "1. Acara terbuka untuk usia 18+.\n2. Wajib membawa KTP/Paspor asli saat verifikasi tiket.",
      startDate: "2026-10-25",
      endDate: "2026-10-25",
      isOneDayEvent: 1,
      startTime: "16:00",
      timezone: "WIB",
      price: 200000,
      location: "Pantai Indah Kapuk 2, Jakarta Utara",
      locationAddress: "Kawasan Pasir Putih PIK 2, Tangerang / Jakarta Utara",
      locationUrl: "https://maps.google.com/?q=PIK+2+Jakarta",
      meetingUrl: "https://meet.example.com/event123",
      bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#8B5CF6",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 0,
      approvalStatus: "REJECTED" as const, // DITOLAK
      submissionOption: "review",
      submittedDate: "2023-10-03T11:00:00Z",
      reviewedDate: "2023-10-03T15:00:00Z",
      rejectionNote: "Harga tidak sesuai dengan ketentuan platform.", // Alasan penolakan sesuai mockup
      viewsDetail: 1890,
      viewsConfirm: 1200,
      tiers: [
        { id: "tier-005-1", name: "5K Glow Run + Party Pass", price: 200000, maxPrice: 250000, stock: 3000, sold: 0, desc: "Glow sticks, jersey neon, dan akses ke panggung utama rave" },
        { id: "tier-005-2", name: "VIP Rave Pass", price: 400000, maxPrice: 500000, stock: 1000, sold: 0, desc: "Akses lounge VIP ber-AC, free flow drink, elevated viewing deck" },
      ]
    },

    // 6. NON ACTIVE EVENT (Approved + IsActive = 0)
    {
      id: "run-006",
      name: "Hindia - Tur Menari Dalam Bayangan 2026",
      category: "Workshop",
      eventType: "Offline Event",
      eventFormat: "hybrid",
      entryMode: "manual",
      description: "Get ready for the Rhythm & Beats Concert! This exciting event will feature local bands and DJs, showcasing their unique sounds. Enjoy a night filled with great music, food, and fun activities for all ages. Bring your friends and let the music move you!",
      termsAndConditions: "Terms and Conditions for Music Event\n• Event Details: The music event will take place on Sabtu, 10 Oktober 2026 at Coworking Space Menteng, Jakarta Pusat.\n• Tickets: Tickets are non-refundable and must be presented at the entrance.\n• Age Restrictions: Attendees must be 18 years old or older.\n• Conduct: Attendees are expected to behave respectfully. Disruptive behavior may result in removal from the event.\n• Liability: The organizers are not liable for any personal injury or loss of property during the event.\n• Photography: By attending, you consent to being photographed or recorded for promotional purposes.\n• Changes: The organizers reserve the right to change the lineup or schedule without prior notice.\n• Contact: For inquiries, contact us at organizer support.\n\nBy purchasing a ticket, you agree to these terms.",
      startDate: "2026-10-10",
      endDate: "2026-10-11",
      isOneDayEvent: 0,
      startTime: "09:00",
      timezone: "WIB",
      price: 350000,
      location: "Coworking Space Menteng, Jakarta Pusat",
      locationAddress: "Jl. Menteng Raya No. 45, Menteng, Jakarta Pusat",
      locationUrl: "https://maps.example.com/venue123",
      meetingUrl: "https://meet.example.com/event123",
      bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80"
      ],
      images: [],
      themeColor: "#014558",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris", "cc"],
      feePayer: "customer",
      paymentMethod: "Transfer",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 0, // NON ACTIVE
      approvalStatus: "APPROVED" as const,
      submissionOption: "review",
      submittedDate: "2023-10-01T09:14:00Z",
      reviewedDate: "2023-10-01T09:14:00Z",
      viewsDetail: 24500,
      viewsConfirm: 22000,
      tiers: [
        { id: "tier-006-1", name: "5K Run Early Bird", price: 400000, maxPrice: 500000, stock: 200, sold: 0, desc: "Get ready for the Rhythm & Beats Concert! This exciting event will feature local bands and DJs." },
        { id: "tier-006-2", name: "Ticket #2 Regular Pass", price: 400000, maxPrice: 500000, stock: 200, sold: 0, desc: "Get ready for the Rhythm & Beats Concert! This exciting event will feature local bands and DJs." },
        { id: "tier-006-3", name: "Ticket #3 VIP Access", price: 400000, maxPrice: 500000, stock: 200, sold: 0, desc: "Get ready for the Rhythm & Beats Concert! This exciting event will feature local bands and DJs." },
        { id: "tier-006-4", name: "Ticket #4 Platinum Seat", price: 400000, maxPrice: 500000, stock: 200, sold: 0, desc: "Get ready for the Rhythm & Beats Concert! This exciting event will feature local bands and DJs." },
      ]
    },

    // 7. DRAFT EVENT (Saved as draft)
    {
      id: "run-007",
      name: "Jakarta Night Marathon 2026",
      category: "Lari / Sports",
      eventType: "Offline Event",
      eventFormat: "offline",
      entryMode: "manual",
      description: "Draft event maraton malam hari menyusuri landmark kota Jakarta dengan gemerlap lampu malam dan cuaca yang sejuk.",
      termsAndConditions: "1. Syarat dan ketentuan masih dalam proses finalisasi manajemen.",
      startDate: "2026-12-19",
      endDate: "2026-12-19",
      isOneDayEvent: 1,
      startTime: "20:00",
      timezone: "WIB",
      price: 300000,
      location: "Kawasan SCBD Sudirman, Jakarta Selatan",
      locationAddress: "Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan",
      locationUrl: "https://maps.google.com/?q=SCBD+Jakarta",
      bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#1E293B",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 0,
      approvalStatus: "DRAFT" as const, // DRAFT
      submissionOption: "draft",
      savedDate: "2023-10-07T10:00:00Z",
      viewsDetail: 120,
      viewsConfirm: 0,
      tiers: [
        { id: "tier-007-1", name: "10K Night Run", price: 300000, maxPrice: 350000, stock: 2000, sold: 0, desc: "Headlamp, reflective jersey, glow bib, finisher medal" },
        { id: "tier-007-2", name: "Full Marathon 42K", price: 600000, maxPrice: 700000, stock: 1000, sold: 0, desc: "Full race pack, finisher windbreaker jacket, gold medal" },
      ]
    },

    // 8. SOLD OUT CONDITION EVENT (Approved + IsActive = 1 + Quota Habis)
    {
      id: "run-008",
      name: "Tech & Lifestyle Expo 2026",
      category: "Ekshibisi / Expo",
      eventType: "Offline Event",
      eventFormat: "offline",
      entryMode: "manual",
      description: "Pameran teknologi gaya hidup, wearable gadget olahraga, dan produk nutrisi kesehatan terbesar se-Asia Tenggara.",
      termsAndConditions: "1. Tiket tidak dapat direfund.\n2. Wajib scan QR barcode di pintu masuk utama.",
      startDate: "2026-10-28",
      endDate: "2026-10-28",
      isOneDayEvent: 1,
      startTime: "10:00",
      timezone: "WIB",
      price: 100000,
      location: "Jakarta Convention Center (JCC) Senayan",
      locationAddress: "Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat",
      locationUrl: "https://maps.google.com/?q=JCC+Senayan",
      bannerUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
      bannerUrls: [
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"
      ],
      images: [],
      themeColor: "#2563EB",
      templateId: 1,
      isPaymentEnabled: 1,
      paymentChannels: ["bni_va", "qris", "cc"],
      feePayer: "customer",
      paymentMethod: "VA",
      accountNumberBNI: "2132134142342",
      userId: "usr-tenant-001", // Orbital Inc.
      isActive: 1,
      approvalStatus: "APPROVED" as const,
      submissionOption: "review",
      submittedDate: "2023-09-20T08:00:00Z",
      reviewedDate: "2023-09-20T10:00:00Z",
      viewsDetail: 14200,
      viewsConfirm: 12800,
      tiers: [
        { id: "tier-008-1", name: "All-Access Pass (Sold Out)", price: 100000, maxPrice: 150000, stock: 500, sold: 500, desc: "Tiket akses penuh seluruh ekshibisi & workshop (Habis Terjual)" }
      ]
    }
  ];

  for (const ev of orbitalEvents) {
    const { tiers, ...evData } = ev;
    await db.insert(schema.events).values(evData);

    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      const isSoldOut = t.sold >= t.stock;
      await db.insert(schema.ticketCategories).values({
        id: t.id,
        eventId: ev.id,
        name: t.name,
        type: t.name.includes("VIP") ? "VIP" : t.name.includes("Early") ? "Early Bird" : "Normal",
        description: t.desc,
        price: t.price,
        maxPrice: t.maxPrice,
        stock: t.stock,
        ticketsSold: t.sold,
        status: isSoldOut ? "sold_out" : "available",
        isAvailable: isSoldOut ? 0 : 1,
        order: i,
      });

      // Insert default ticket item under category
      await db.insert(schema.tickets).values({
        id: `tix-${t.id}`,
        categoryId: t.id,
        name: t.name,
        description: t.desc,
        type: "normal",
        price: t.price,
        normalPrice: t.maxPrice,
        stock: t.stock,
        isAvailable: isSoldOut ? 0 : 1,
        order: i,
      });
    }
  }
  console.log(`✅ ${orbitalEvents.length} Event Orbital Inc. berhasil dibuat beserta tier tiketnya.`);

  // 6. Buat Sample Orders & Attendees untuk event Orbital Inc.
  console.log("🎟️ Membuat data sample orders dan issued tickets / attendees...");

  const attendeesData = [
    { name: "Hamzah Diza", nik: "3171012304850001", phone: "+62 812-3456-7890", email: "hamzah.diza@orbitalinc.com", eventId: "run-001", tierId: "tier-001-1", ticketName: "5K National", nominal: 250000, status: "COMPLETED" },
    { name: "Budi Santoso", nik: "3271021508920003", phone: "+62 813-8877-6655", email: "budi.santoso@gmail.com", eventId: "run-001", tierId: "tier-001-1", ticketName: "5K National", nominal: 250000, status: "COMPLETED" },
    { name: "Siti Rahmawati", nik: "3174095406950002", phone: "+62 856-1122-3344", email: "siti.rahma@yahoo.com", eventId: "run-001", tierId: "tier-001-2", ticketName: "10K Championship", nominal: 400000, status: "COMPLETED" },
    { name: "Ahmad Fauzi", nik: "3671041211900004", phone: "+62 818-9900-1122", email: "ahmad.fauzi@outlook.com", eventId: "run-001", tierId: "tier-001-3", ticketName: "Half Marathon 21K", nominal: 550000, status: "COMPLETED" },
    { name: "Dewi Lestari", nik: "3172086703960005", phone: "+62 812-9876-5432", email: "dewi.lestari@gmail.com", eventId: "run-001", tierId: "tier-001-1", ticketName: "5K National", nominal: 250000, status: "PENDING" },
    { name: "Rizky Pratama", nik: "3273012207940006", phone: "+62 878-3344-5566", email: "rizky.pratama@gmail.com", eventId: "run-001", tierId: "tier-001-2", ticketName: "10K Championship", nominal: 400000, status: "REFUND" },
    { name: "Jessica Tan", nik: "3175054301970007", phone: "+62 811-2233-4455", email: "jessica.tan@gmail.com", eventId: "run-002", tierId: "tier-002-1", ticketName: "5K Fun Run", nominal: 150000, status: "COMPLETED" },
    { name: "Kevin Sanjaya", nik: "3374021908950008", phone: "+62 813-4455-6677", email: "kevin.sanjaya@gmail.com", eventId: "run-002", tierId: "tier-002-2", ticketName: "10K Challenge", nominal: 250000, status: "COMPLETED" },
    { name: "Nadia Amanda", nik: "3171096504980009", phone: "+62 857-7788-9900", email: "nadia.amanda@gmail.com", eventId: "run-008", tierId: "tier-008-1", ticketName: "All-Access Pass (Sold Out)", nominal: 100000, status: "COMPLETED" },
  ];

  for (let i = 0; i < attendeesData.length; i++) {
    const att = attendeesData[i];
    const orderId = `ORD-2026-${(1001 + i)}`;
    const ticketId = `TIX-2026-${(101 + i)}`;

    await db.insert(schema.serviceOrders).values({
      id: orderId,
      orderType: "event",
      serviceId: att.eventId,
      serviceName: att.eventId === "run-001" ? "BNI RUNNING 2026" : att.eventId === "run-002" ? "Melawai Running 2026" : "Tech & Lifestyle Expo 2026",
      vendorUserId: "usr-tenant-001", // Orbital Inc.
      customerName: att.name,
      customerPhone: att.phone,
      customerEmail: att.email,
      customerNik: att.nik,
      quantity: 1,
      totalAmount: att.nominal,
      status: att.status.toLowerCase(),
      paymentMethod: "va",
      vaNumber: `8808${att.phone.replace(/[^0-9]/g, '').slice(-10)}`,
      invoiceNumber: `INV-2026-${orderId.slice(-4)}`,
      completedAt: att.status === "COMPLETED" ? "2026-10-01T12:00:00Z" : null,
    });

    await db.insert(schema.issuedTickets).values({
      id: ticketId,
      orderId,
      eventId: att.eventId,
      ticketCategoryId: att.tierId,
      participantName: att.name,
      nik: att.nik,
      email: att.email,
      phone: att.phone,
      buyerName: att.name,
      buyerPhone: att.phone,
      buyerEmail: att.email,
      ticketName: att.ticketName,
      ticketCategory: att.ticketName,
      ticketQuantity: 1,
      ticketIndex: 1,
      nominal: att.nominal,
      status: att.status as any,
      qrCode: `QR-CODE-${ticketId}`,
      checkInAt: att.status === "COMPLETED" && i < 3 ? "2026-10-15T05:45:00Z" : null,
      purchaseDate: "15 Oct 2026",
    });
  }

  console.log(`✅ ${attendeesData.length} Sample orders & attendees berhasil dibuat.`);
  console.log("\n========================================================");
  console.log("🎉 DATABASE SETUP & SEEDING BERHASIL 100%!");
  console.log("========================================================");
  console.log("📌 Kredensial Login CMS:");
  console.log("   1. Akun Admin :");
  console.log("      Email    : admin@lifestyle.com");
  console.log("      Password : password123");
  console.log("   2. Akun Tenant Utama (Orbital Inc.) :");
  console.log("      Email    : vendor@orbitalinc.com");
  console.log("      Password : password123");
  console.log("      Semua event (Active, Waiting, Rejected, Non Active, Draft) hanya dimiliki akun ini.");
  console.log("========================================================\n");
}

seed().catch((err) => {
  console.error("❌ Gagal melakukan seeding database:", err);
  process.exit(1);
});
