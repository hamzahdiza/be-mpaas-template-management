import { db } from './src/db';
import { serviceOrders, issuedTickets, ticketCategories, events } from './src/db/schema';
import { desc } from 'drizzle-orm';

async function main() {
  const orders = await db.query.serviceOrders.findMany({
    orderBy: [desc(serviceOrders.createdAt)]
  });

  console.log(`Total orders in DB: ${orders.length}`);
  for (const o of orders) {
    console.log(`Order ID: ${o.id} | Service: ${o.serviceId} (${o.serviceName}) | Customer: ${o.customerName} | Qty: ${o.quantity} | Total: ${o.totalAmount} | Status: ${o.status} | CreatedAt: ${o.createdAt}`);
  }

  const tickets = await db.query.issuedTickets.findMany({
    orderBy: [desc(issuedTickets.createdAt)]
  });
  console.log(`\nTotal issued tickets in DB: ${tickets.length}`);
  for (const t of tickets) {
    console.log(`Ticket ID: ${t.id} | OrderID: ${t.orderId} | EventID: ${t.eventId} | Tier: ${t.ticketName} (${t.ticketCategoryId}) | Participant: ${t.participantName} | Status: ${t.status}`);
  }
}

main().catch(console.error);
