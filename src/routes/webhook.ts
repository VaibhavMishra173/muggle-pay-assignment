import express from "express";
const router = express.Router();

// Your monitored wallet address
const MONITORED_ADDRESS = "HVZT7orfMe89V82S381WzQWHGGzJ4LM6J8foVwRoGkGu";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

router.post("/", async (req: any, res: any) => {
  try {
    console.log("🔔 Webhook received.");
    
    // Log the entire body for debugging
    // console.log("📦 Webhook payload:", JSON.stringify(req.body, null, 2));

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
      console.log(`🔍 Processing transaction: ${signature}`);
      
      // Check if the transaction has metadata
      if (!tx.meta || tx.meta.length === 0) {
        console.log("❌ No metadata in transaction.");
        continue;
      }
      
      const meta = tx.meta[0];
      
      // Compare pre and post token balances to detect transfers
      const preBalances = meta.pre_token_balances || [];
      const postBalances = meta.post_token_balances || [];
      
      console.log(`Pre token balances: ${preBalances.length}`);
      console.log(`Post token balances: ${postBalances.length}`);
      
      // Find the USDC balance for the monitored address before the transaction
      const preUsdcBalance = preBalances.find(
        (b: any) => b.mint === USDC_MINT && b.owner === MONITORED_ADDRESS
      );
      
      // Find the USDC balance for the monitored address after the transaction
      const postUsdcBalance = postBalances.find(
        (b: any) => b.mint === USDC_MINT && b.owner === MONITORED_ADDRESS
      );
      
      // Log the pre and post balances
      if (preUsdcBalance) {
        console.log(`Pre USDC balance: ${preUsdcBalance.ui_token_amount.ui_amount_string}`);
      } else {
        console.log("No pre USDC balance found for monitored address");
      }
      
      if (postUsdcBalance) {
        console.log(`Post USDC balance: ${postUsdcBalance.ui_token_amount.ui_amount_string}`);
      } else {
        console.log("No post USDC balance found for monitored address");
      }
      
      // Calculate the amount received
      let amountReceived = 0;
      let hadPreBalance = false;
      
      if (preUsdcBalance) {
        hadPreBalance = true;
        if (postUsdcBalance) {
          // Calculate difference if both pre and post balances exist
          const preBal = parseFloat(preUsdcBalance.ui_token_amount.ui_amount_string);
          const postBal = parseFloat(postUsdcBalance.ui_token_amount.ui_amount_string);
          amountReceived = postBal - preBal;
        }
      } else if (postUsdcBalance) {
        // If no pre-balance but post-balance exists, this is a new token account
        amountReceived = parseFloat(postUsdcBalance.ui_token_amount.ui_amount_string);
      }
      
      // Look for token transfer instructions
      let foundTokenTransfer = false;
      if (tx.transaction && tx.transaction.length > 0 && 
          tx.transaction[0].message && tx.transaction[0].message.length > 0) {
        
        const message = tx.transaction[0].message[0];
        const accountKeys = message.account_keys;
        
        // Check if the transaction contains the token program
        const tokenProgramIndex = accountKeys.indexOf("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        if (tokenProgramIndex !== -1) {
          foundTokenTransfer = true;
        }
      }
      
      // Check if USDC was received
      if ((amountReceived > 0 || foundTokenTransfer) && postUsdcBalance) {
        console.log("✅ USDC transaction detected!");
        console.log(`💰 Current Balance: ${postUsdcBalance.ui_token_amount.ui_amount_string} USDC`);
        
        if (amountReceived > 0) {
          console.log(`📈 Amount Received: ${amountReceived.toFixed(6)} USDC`);
        } else if (hadPreBalance) {
          console.log("ℹ️ No change in balance detected");
        } else {
          console.log("ℹ️ New token account created");
        }
        
        console.log(`🔗 Transaction Signature: ${signature}`);
        console.log(`🔗 Solscan URL: https://solscan.io/tx/${signature}`);
        
        // Check if this is a 0.01 USDC payment (with some tolerance for rounding)
        if (Math.abs(amountReceived - 0.01) < 0.001) {
          console.log("🎯 This is a 0.01 USDC payment!");
        }
      } else {
        console.log("ℹ️ No USDC received for monitored address in this transaction");
      }
    }

    // Respond back to the webhook with success message
    return res.status(200).json({ message: "Webhook processed successfully." });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;