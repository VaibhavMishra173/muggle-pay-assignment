import express from "express";
const router = express.Router();

// Your devnet wallet address
const MONITORED_ADDRESS = "HVZT7orfMe89V82S381WzQWHGGzJ4LM6J8foVwRoGkGu";
// Devnet USDC Mint (can update based on real token if needed)
const USDC_DEVNET_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC1FdKkq8Zz8f7fZk";

router.post("/", async (req: any, res: any) => {
  try {
    const body = req.body;

    const transactions = body?.event?.transaction;
    if (!transactions || transactions.length === 0) {
      return res.status(400).json({ message: "No transactions in webhook." });
    }

    for (const tx of transactions) {
      const signature = tx.signature;
      const message = tx.transaction?.[0]?.message?.[0];
      const meta = tx.meta?.[0];

      if (!message || !meta) continue;

      const accountKeys = message.account_keys;
      const instructions = message.instructions;

      for (const inst of instructions) {
        const programId = accountKeys[inst.program_id_index];

        // Looking for 'spl-token' instructions (token transfers)
        if (programId === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
          const fromIndex = inst.accounts[0];
          const toIndex = inst.accounts[1];
          const source = accountKeys[fromIndex];
          const destination = accountKeys[toIndex];

          const postTokenBalances = meta.post_token_balances || [];

          const usdcTransfer = postTokenBalances.find(
            (t: any) =>
              t.mint === USDC_DEVNET_MINT &&
              t.owner === MONITORED_ADDRESS
          );

          if (usdcTransfer) {
            console.log("✅ USDC transfer detected!");
            console.log("🔁 From:", source);
            console.log("📥 To:", destination);
            console.log("💰 Amount:", parseFloat(usdcTransfer.ui_token_amount.ui_amount_string), "USDC");
            console.log("🔗 Signature:", signature);
          }
        }
      }
    }

    return res.status(200).json({ message: "Webhook received successfully." });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
