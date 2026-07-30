import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function fix() {
    try {
        console.log("Checking events...");
        const rs = await client.execute("SELECT id, vendor_config FROM events");
        console.log("Current events:", rs.rows);

        for (const row of rs.rows) {
            if (row.vendor_config === "vendor_config" || !row.vendor_config) {
                console.log(`Fixing event ${row.id}...`);
                await client.execute({
                    sql: "UPDATE events SET vendor_config = ? WHERE id = ?",
                    args: [JSON.stringify({ purchaseMode: "multiple" }), row.id]
                });
            }
        }
        console.log("Fix completed!");
    } catch (e) {
        console.error("Fix failed:", e);
    }
}

fix();
