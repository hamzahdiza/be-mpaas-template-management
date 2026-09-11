async function verifyAll() {
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vendor@orbitalinc.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('✅ Logged in as:', loginData.user.name, `(Token length: ${token?.length})`);

  const headers = { 'Authorization': `Bearer ${token}` };

  // 1. GET /api/v1/events
  const eventsRes = await fetch('http://localhost:3000/api/v1/events', { headers });
  const events = await eventsRes.json();
  console.log('\n--- 1. GET /api/v1/events (Content Management Table) ---');
  for (const ev of events) {
    console.log(`Event [${ev.id}] "${ev.name}": Total Kuota=${ev.totalTickets} | Terjual=${ev.ticketsSold} | Sisa=${ev.remainingStock}`);
  }

  // 2. GET /api/v1/events/run-004/sales-summary
  const salesRes = await fetch('http://localhost:3000/api/v1/events/run-004/sales-summary', { headers });
  const sales = await salesRes.json();
  console.log('\n--- 2. GET /api/v1/events/run-004/sales-summary (Detail Penjualan) ---');
  console.log(`BNI RUNNING 2026: Total Kuota=${sales.totalStock} | Terjual=${sales.ticketsSold} | Sisa=${sales.remainingStock} | Total Revenue=Rp ${sales.totalRevenue.toLocaleString('id-ID')} | Transaksi=${sales.transactionsCount}`);

  // 3. GET /api/v1/tenant/products-performance
  const perfRes = await fetch('http://localhost:3000/api/v1/tenant/products-performance', { headers });
  const perfs = await perfRes.json();
  console.log('\n--- 3. GET /api/v1/tenant/products-performance (Overview Products Table) ---');
  for (const p of perfs) {
    console.log(`Event [${p.id}] "${p.name}": Total Kuota=${p.totalTickets} | Terjual=${p.ticketsSold} | Sisa=${p.remainingStock}`);
  }

  // 4. Miniprogram /lifestyle-javajazz/v1/tickets?eventId=run-004
  const miniRes = await fetch('http://localhost:3000/lifestyle-javajazz/v1/tickets?eventId=run-004');
  const mini = await miniRes.json();
  console.log('\n--- 4. Miniprogram /lifestyle-javajazz/v1/tickets?eventId=run-004 ---');
  const items = [...(mini.dataProtected?.promoList || []), ...(mini.dataProtected?.regulerList || [])];
  for (const it of items) {
    console.log(`Tier "${it.ticketName}": Sisa Tiket=${it.stock} | isAvailable=${it.isAvailable}`);
  }
}

verifyAll().catch(console.error);
