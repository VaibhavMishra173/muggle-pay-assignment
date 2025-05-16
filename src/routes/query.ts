import { Router } from 'express';
import { Connection } from '@solana/web3.js';

const router = Router();
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Mocked SOL-USD price; in production, fetch from CoinGecko or CoinMarketCap
const SOL_TO_USD = 145.32; // Example value; update as needed

router.get('/:txHash', async (req: any, res: any) => {
  const { txHash } = req.params;

  try {
    const tx = await connection.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });

    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const instructions = tx.transaction.message.instructions;
    const logs: string[] = [];

    instructions.forEach((ix: any) => {
      // Handle native SOL transfers via system program
      if (ix.program === 'system' && ix.parsed?.type === 'transfer') {
        const { info } = ix.parsed;
        const lamports = Number(info.lamports);
        const sol = lamports / 1e9;
        const usd = sol * SOL_TO_USD;

        logs.push(
          `⚙️ System Program (SOL Transfer):`,
          `💰 Lamports: ${lamports}`,
          `🌕 SOL: ${sol.toFixed(6)} (~$${usd.toFixed(2)} USD)`,
          `👤 From: ${info.source}`,
          `👤 To: ${info.destination}`
        );
      }

      // Handle SPL Token transfers
      if (ix.program === 'spl-token' && ix.parsed?.type === 'transfer') {
        const { info } = ix.parsed;
        logs.push(
          `🪙 Token Transfer (SPL):`,
          `💳 Token: ${info.mint}`,
          `💰 Amount: ${info.amount}`,
          `👤 From: ${info.source}`,
          `👤 To: ${info.destination}`
        );
      }
    });

    console.log('📦 Transaction Info:');
    logs.forEach((line) => console.log(line));

    return res.status(200).json({ success: true, logs });
  } catch (err) {
    console.error('❌ Error fetching transaction:', err);
    return res.status(500).json({ success: false, message: 'Error fetching transaction' });
  }
});

export default router;
