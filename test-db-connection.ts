import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

console.log("URL:", process.env.DATABASE_URL);
console.log("Token Length:", process.env.DATABASE_AUTH_TOKEN?.length);

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function test() {
  try {
    const rs = await client.execute("SELECT 1");
    console.log("Connection successful!", rs);
  } catch (e) {
    console.error("Connection failed:", e);
  }
}

test();
