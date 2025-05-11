import express from "express";
const router = express.Router();

// Your devnet wallet address
const MONITORED_ADDRESS = "HVZT7orfMe89V82S381WzQWHGGzJ4LM6J8foVwRoGkGu";
// Devnet USDC Mint (can update based on real token if needed)
const USDC_DEVNET_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC1FdKkq8Zz8f7fZk";

router.post("/", async (req: any, res: any) => {
  try {
    console.log("🔔 Webhook received.");

    const body = req.body;

    // Check if the body contains transactions
    const transactions = body?.event?.transaction;
    if (!transactions || transactions.length === 0) {
      console.log("❌ No transactions in webhook.");
      return res.status(400).json({ message: "No transactions in webhook." });
    }

    console.log(`Received ${transactions.length} transaction(s).`);

    // Loop through each transaction
    for (const tx of transactions) {
      const signature = tx.signature;
      const message = tx.transaction?.[0]?.message?.[0];
      const meta = tx.meta?.[0];

      if (!message || !meta) {
        console.log("❌ Missing message or meta in transaction.");
        continue;
      }

      console.log(`🔍 Processing transaction: ${signature}`);

      const accountKeys = message.account_keys;
      const instructions = message.instructions;

      // Loop through instructions to check for token transfers
      for (const inst of instructions) {
        const programId = accountKeys[inst.program_id_index];

        // Looking for 'spl-token' instructions (token transfers)
        if (programId === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
          const fromIndex = inst.accounts[0];
          const toIndex = inst.accounts[1];
          const source = accountKeys[fromIndex];
          const destination = accountKeys[toIndex];

          const postTokenBalances = meta.post_token_balances || [];
          console.log("🔍 Post token balances:", postTokenBalances); // Log post_token_balances to verify structure

          // If post_token_balances is empty, log this
          if (postTokenBalances.length === 0) {
            console.log("⚠️ No token balances found in this transaction.");
          }

          // Find the USDC transfer for the monitored wallet address
          const usdcTransfer = postTokenBalances.find(
            (t: any) =>
              t.mint === USDC_DEVNET_MINT &&
              t.owner === MONITORED_ADDRESS
          );

          // If the USDC transfer is found, log the details
          if (usdcTransfer) {
            console.log("✅ USDC transfer detected!");
            console.log("🔁 From:", source);
            console.log("📥 To:", destination);
            console.log("💰 Amount:", parseFloat(usdcTransfer.ui_token_amount.ui_amount_string), "USDC");
            console.log("🔗 Signature:", signature);
          } else {
            console.log("⚠️ No USDC transfer found for monitored address.");
          }
        }
      }
    }

    // Respond back to the webhook with success message
    return res.status(200).json({ message: "Webhook received successfully." });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
