import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/db/schema";
import { allEventTemplates } from "./src/templates/event-templates";
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

async function seedTemplates() {
  console.log("🎨 Memulai seeding SDUI Templates ke database Turso...");

  try {
    // 1. Bersihkan tabel sdui_templates
    console.log("🧹 Membersihkan template lama...");
    await db.delete(schema.sduiTemplates);

    // 2. Insert setiap template dari event-templates.ts
    for (const t of allEventTemplates) {
      console.log(`✨ Menginput ${t.templateId} (${t.templateName})...`);
      await db.insert(schema.sduiTemplates).values({
        id: t.templateId,
        templateId: t.templateId,
        templateName: t.templateName,
        category: t.category || "events",
        schemaVersion: t.schemaVersion || "1.0",
        pageBackground: t.pageBackground || "#F5F5F5",
        headerSection: t.headerSection,
        contentSection: t.contentSection,
        ctaConfig: t.ctaConfig,
        ticketDetailSection: t.ticketDetailSection || null,
        isActive: 1,
      });
    }

    console.log("✅ Berhasil men-seed seluruh SDUI Templates ke database!");
  } catch (error) {
    console.error("❌ Gagal men-seed SDUI Templates:", error);
    process.exit(1);
  }
}

seedTemplates().then(() => {
  process.exit(0);
});
