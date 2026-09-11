import { db } from './src/db';
import { events, ticketCategories, serviceOrders } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const allEvents = await db.query.events.findMany({
    with: {
      ticketCategories: true
    }
  });

  console.log('--- ALL EVENTS IN DB ---');
  for (const ev of allEvents) {
    const orders = await db.query.serviceOrders.findMany({
      where: and => eq(serviceOrders.serviceId, ev.id)
    });
    const completedOrders = orders.filter(o => o.status === 'completed');
    const orderSold = completedOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);

    const totalStock = ev.ticketCategories.reduce((sum, c) => sum + (c.stock || 0), 0);
    const catSold = ev.ticketCategories.reduce((sum, c) => sum + (c.ticketsSold || 0), 0);

    console.log(`\nEvent: ${ev.name} (id: ${ev.id})`);
    console.log(`  Categories count: ${ev.ticketCategories.length}`);
    for (const cat of ev.ticketCategories) {
      console.log(`    - Cat: ${cat.name} | stock: ${cat.stock} | ticketsSold: ${cat.ticketsSold}`);
    }
    console.log(`  Total Stock (sum stock): ${totalStock}`);
    console.log(`  Sum cat.ticketsSold: ${catSold}`);
    console.log(`  Actual Orders count: ${orders.length} (completed: ${completedOrders.length})`);
    console.log(`  Actual Tickets Sold from completed orders: ${orderSold}`);
  }
}

main().catch(console.error);
