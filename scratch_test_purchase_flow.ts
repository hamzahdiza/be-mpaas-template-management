async function testPurchaseFlow() {
  console.log('=== TEST SIMULASI PEMBELIAN TIKET MINIPROGRAM (1 TIKET) ===');

  // 1. Cek State Awal
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vendor@orbitalinc.com', password: 'password123' })
  });
  const { token } = await loginRes.json();
  const headers = { 'Authorization': `Bearer ${token}` };

  const initialSummaryRes = await fetch('http://localhost:3000/api/v1/events/run-004/sales-summary', { headers });
  const initialSummary = await initialSummaryRes.json();
  console.log('\n[STATE AWAL]');
  console.log(`- Tiket Terjual: ${initialSummary.ticketsSold}`);
  console.log(`- Sisa Kuota: ${initialSummary.remainingStock}`);
  console.log(`- Total Pendapatan: Rp ${initialSummary.totalRevenue.toLocaleString('id-ID')}`);
  console.log(`- Transaksi Masuk: ${initialSummary.transactionsCount}`);

  // 2. Simulasi Alur Miniprogram:
  // Step A: Pengunjung konfirmasi & klik Lanjut -> Buat pending order di POS
  console.log('\n[STEP A] Miniprogram create pending order (visitor screen)...');
  const createRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderType: 'event',
      serviceId: 'run-004',
      serviceName: 'BNI RUNNING 2026',
      customerName: 'Asep Saepuloh',
      customerPhone: '081299887766',
      customerEmail: 'asep@gmail.com',
      quantity: 1,
      totalAmount: 250000,
      status: 'pending',
      orderPayload: {
        tickets: [{
          name: '5K National',
          ticketId: 'tier-004-1',
          categoryId: 'tier-004-1',
          price: 250000,
          qty: 1
        }]
      }
    })
  });
  const orderData = await createRes.json();
  const orderId = orderData.id || orderData.data.id;
  console.log(`Pending Order created: ID = ${orderId}`);

  // Step B: User input PIN & bayar sukses -> complete payment
  console.log('\n[STEP B] User input PIN valid -> complete payment...');
  const payRes = await fetch(`http://localhost:3000/api/orders/${orderId}/complete-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod: 'VA' })
  });
  const payData = await payRes.json();
  console.log(`Payment completed: status = ${payData.data?.status}`);

  // Step C: Result screen onLoad memanggil processPOSOrder
  console.log('\n[STEP C] Result screen onLoad trigger processPOSOrder (idempotent call)...');
  const resultScreenRes = await fetch(`http://localhost:3000/api/orders/${orderId}/complete-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod: 'VA' })
  });
  const resultScreenData = await resultScreenRes.json();
  console.log(`Result screen call result:`, resultScreenData.message);

  // 3. Cek State Akhir
  const finalSummaryRes = await fetch('http://localhost:3000/api/v1/events/run-004/sales-summary', { headers });
  const finalSummary = await finalSummaryRes.json();
  console.log('\n[STATE AKHIR]');
  console.log(`- Tiket Terjual: ${finalSummary.ticketsSold} (sebelumnya: ${initialSummary.ticketsSold}) -> Naik +${finalSummary.ticketsSold - initialSummary.ticketsSold}`);
  console.log(`- Sisa Kuota: ${finalSummary.remainingStock} (sebelumnya: ${initialSummary.remainingStock}) -> Berkurang -${initialSummary.remainingStock - finalSummary.remainingStock}`);
  console.log(`- Total Pendapatan: Rp ${finalSummary.totalRevenue.toLocaleString('id-ID')} (sebelumnya: Rp ${initialSummary.totalRevenue.toLocaleString('id-ID')}) -> Naik +Rp ${(finalSummary.totalRevenue - initialSummary.totalRevenue).toLocaleString('id-ID')}`);
  console.log(`- Transaksi Masuk: ${finalSummary.transactionsCount} (sebelumnya: ${initialSummary.transactionsCount}) -> Naik +${finalSummary.transactionsCount - initialSummary.transactionsCount}`);

  // 4. Verifikasi di Tabel CMS Events
  const eventsRes = await fetch('http://localhost:3000/api/v1/events', { headers });
  const events = await eventsRes.json();
  const bniEvent = events.find((e: any) => e.id === 'run-004');
  console.log('\n[TABEL LIST EVENT CMS]');
  console.log(`BNI RUNNING 2026: Total Kuota=${bniEvent.totalTickets} | Terjual=${bniEvent.ticketsSold} | Sisa=${bniEvent.remainingStock}`);
}

testPurchaseFlow().catch(console.error);
