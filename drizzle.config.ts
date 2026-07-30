import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

console.log("Config URL:", process.env.DATABASE_URL);
console.log("Config Token Length:", process.env.DATABASE_AUTH_TOKEN?.length);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
