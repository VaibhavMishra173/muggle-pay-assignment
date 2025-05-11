import { Router, Request, Response } from 'express';
import { Connection, PublicKey } from '@solana/web3.js';

const router = Router();

// Use Solana Devnet RPC (choose one; Alchemy provides a URL too)
const connection = new Connection('https://api.mainnet-beta.solana.com');

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
    let logs: string[] = [];

    instructions.forEach((ix: any) => {
      if (ix.parsed && ix.parsed.type === 'transfer') {
        const { info } = ix.parsed;
        logs.push(
          `Token: ${ix.program}`,
          `Amount: ${info.amount}`,
          `From: ${info.source}`,
          `To: ${info.destination}`
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
