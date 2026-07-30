import { Hono } from 'hono';

export const billPaymentRoutes = new Hono();

// Mimic: bill-payment/v1/biller/preparation
billPaymentRoutes.post('/v1/biller/preparation', async (c) => {
  const body = await c.req.json();

  // Logic to process preparation request
  // Usually this returns a transaction ID and biller info

  return c.json({
    data: {
      billerCode: "01",
      billKey1Label: "Kode pembayaran",
      billAmount: body.amount || 0,
      completionTime: new Date().toISOString(),
      billerName: "Wondr Event",
      transactionId: "TRX-" + Date.now(),
      referenceId: "REF-" + Date.now()
    },
    statusCode: 200
  });
});
