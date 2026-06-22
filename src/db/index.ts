import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not defined");
}

const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
