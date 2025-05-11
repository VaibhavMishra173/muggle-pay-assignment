# muggle-pay-assignment

# 🪙 MugglePay USDC Solana Webhook Listener

This is a TypeScript-based backend API that:

1. Logs Solana USDC transactions via webhook (Alchemy webhook support).
2. Verifies if a transaction is a **0.01 USDC** payment to a monitored wallet.
3. Provides an API to **query any transaction** on the Solana blockchain and print relevant details.

---

## 🚀 Setup

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/mugglepay-usdc-listener.git
cd mugglepay-usdc-listener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔔 `POST /webhook`

Handle webhook from Alchemy monitoring service.

**Trigger:**
Send a USDC SPL token transaction of 0.01 USDC to your Solana wallet.

**Simulate Webhook:**

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "transaction": [
        {
          "signature": "test-tx-hash-123",
          "transaction": [
            {
              "message": [
                {
                  "account_keys": [
                    "SenderWalletAddress",
                    "HVZT7orfMe89V82S381WzQWHGGzJ4LM6J8foVwRoGkGu",
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                  ],
                  "instructions": [
                    {
                      "program_id_index": 2,
                      "accounts": [0, 1]
                    }
                  ]
                }
              ]
            }
          ],
          "meta": [
            {
              "post_token_balances": [
                {
                  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC1FdKkq8Zz8f7fZk",
                  "owner": "HVZT7orfMe89V82S381WzQWHGGzJ4LM6J8foVwRoGkGu",
                  "ui_token_amount": {
                    "ui_amount_string": "0.01"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }'
```

---

### 🔍 `GET /query/:txHash`

Check any transaction on Solana blockchain and print:

* Token type
* Sender & receiver
* Amount

**Example:**

```bash
curl http://localhost:3000/query/3MHu...your_tx_hash
```

---

## 🔗 Alchemy Webhook Setup

* Go to [Alchemy Webhooks](https://dashboard.alchemy.com/webhooks)
* Set a webhook on your Solana address
* Forward POST to: `http://your-server.com/webhook`

---

## 🔪 Test Token Faucet

To get test USDC tokens:

1. Deploy using **Devnet**
2. Request USDC from MugglePay team: [http://t.me/shawnmuggle](http://t.me/shawnmuggle)

---

## 📄 License

MIT
