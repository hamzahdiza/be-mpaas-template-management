import { db } from './src/db';
import { events, ticketCategories, serviceOrders, issuedTickets } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';

async function main() {
  console.log("=== Testing Multi-Ticket Order (5K + 10K) ===");

  // 1. Check initial categories for run-004
  const evBefore = await db.query.events.findFirst({
    where: eq(events.id, 'run-004'),
    with: { ticketCategories: true }
  });
  console.log("\n--- Before Order ---");
  evBefore?.ticketCategories.forEach(c => {
    console.log(`Cat: ${c.name} (${c.id}) | Stock: ${c.stock} | Sold: ${c.ticketsSold} | Remaining: ${c.stock - (c.ticketsSold || 0)}`);
  });

  // 2. Simulate API Call: Create Order with 1x 5K and 1x 10K
  const orderPayload = {
    orderType: "event",
    serviceId: "run-004",
    serviceName: "BNI RUNNING 2026",
    customerName: "Hamzah Diza",
    customerPhone: "081234567890",
    customerEmail: "hamzah.diza@orbitalinc.com",
    customerNik: "3171012304850001",
    quantity: 2,
    totalAmount: 650000,
    status: "pending",
    orderPayload: {
      tickets: [
        {
          ticketId: "tier-004-1",
          categoryId: "tier-004-1",
          ticketName: "5K National",
          ticketQty: 1,
          price: 250000
        },
        {
          ticketId: "tier-004-2",
          categoryId: "tier-004-2",
          ticketName: "10K Championship",
          ticketQty: 1,
          price: 400000
        }
      ],
      attendees: [
        {
          fullName: "Hamzah Diza",
          name: "Hamzah Diza",
          nik: "3171012304850001",
          ticketName: "5K National",
          ticketId: "tier-004-1",
          categoryId: "tier-004-1",
          price: 250000
        },
        {
          fullName: "Hamzah Diza",
          name: "Hamzah Diza",
          nik: "3171096022602",
          ticketName: "10K Championship",
          ticketId: "tier-004-2",
          categoryId: "tier-004-2",
          price: 400000
        }
      ]
    }
  };

  const createRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  const created = await createRes.json();
  console.log("\nCreated order:", created.id);

  // 3. Complete payment
  const completeRes = await fetch(`http://localhost:3000/api/orders/${created.id}/complete-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod: 'VA' })
  });
  const completed = await completeRes.json();
  console.log("Completed order response:", completed.success);

  // 4. Check categories after order
  const evAfter = await db.query.events.findFirst({
    where: eq(events.id, 'run-004'),
    with: { ticketCategories: true }
  });
  console.log("\n--- After Order Stock ---");
  evAfter?.ticketCategories.forEach(c => {
    console.log(`Cat: ${c.name} (${c.id}) | Stock: ${c.stock} | Sold: ${c.ticketsSold} | Remaining: ${c.stock - (c.ticketsSold || 0)}`);
  });

  // 5. Check issued tickets for this order
  const issued = await db.query.issuedTickets.findMany({
    where: eq(issuedTickets.orderId, created.id)
  });
  console.log("\n--- Issued Tickets for Order ---");
  issued.forEach(t => {
    console.log(`Attendee: ${t.participantName} | NIK: ${t.nik} | Ticket: ${t.ticketName} (${t.ticketCategoryId}) | Nominal: Rp ${t.nominal.toLocaleString('id-ID')}`);
  });
}

main().catch(console.error);
