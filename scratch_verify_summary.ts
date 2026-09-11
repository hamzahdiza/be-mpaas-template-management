import * as dotenv from 'dotenv';
dotenv.config();

async function check() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@lifestyle.com', password: 'password123' })
  });
  const login = await loginRes.json();
  const token = login.data?.token || login.token;

  const headers = { 'Authorization': `Bearer ${token}` };

  const summaryRes = await fetch('http://localhost:3000/api/v1/events/run-004/sales-summary', { headers });
  const summary = await summaryRes.json();
  console.log("=== Sales Summary ===");
  console.log({
    eventName: summary.eventName,
    totalStock: summary.totalStock,
    ticketsSold: summary.ticketsSold,
    remainingStock: summary.remainingStock,
    totalRevenue: summary.totalRevenue,
    transactionsCount: summary.transactionsCount
  });

  const attendeesRes = await fetch('http://localhost:3000/api/v1/events/run-004/attendees', { headers });
  const attendeesData = await attendeesRes.json();
  console.log("\n=== Latest Attendees ===");
  attendeesData.attendees.slice(0, 4).forEach((a: any) => {
    console.log(`[${a.ticketName}] ${a.participantName} - NIK: ${a.nik} - Nominal: Rp ${a.nominal.toLocaleString('id-ID')} - Status: ${a.status}`);
  });
}

check().catch(console.error);
