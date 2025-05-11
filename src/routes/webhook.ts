import { Router, Request, Response } from 'express';

const router = Router();

// Solana USDC Mint Address
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

router.post('/', (req: any, res: any) => {
  const data = req.body;

  console.log('🔔 Webhook Received!');

  try {
    const { events, transaction } = data;

    // You may need to customize this depending on Alchemy's exact payload
    const transfers = events?.nativeTransfers || [];

    for (const transfer of transfers) {
      const { amount, from, to, mint, rawAmount } = transfer;

      // Check if it's USDC
      if (mint === USDC_MINT) {
        // Check if amount is exactly 0.01 USDC (raw amount is in lamports: 0.01 * 10^6)
        if (rawAmount === '10000') {
          console.log('✅ Valid USDC Payment Detected!');
          console.log(`Amount: ${amount}`);
          console.log(`Token: USDC`);
          console.log(`From: ${from}`);
          console.log(`To: ${to}`);
          console.log(`Transaction Signature: ${transaction?.signature || 'Unknown'}`);
        } else {
          console.log(`⚠️ USDC detected, but amount is not 0.01: ${amount}`);
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error parsing webhook:', err);
    return res.status(500).json({ success: false, message: 'Error processing webhook' });
  }
});

export default router;
