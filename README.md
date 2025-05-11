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
  "webhookId": "wh_example",
  "id": "whevt_example",
  "createdAt": "2024-09-19T16:03:51.396Z",
  "type": "ADDRESS_ACTIVITY",
  "event": {
    "transaction": [
      {
        "signature": "demo_hash_123",
        "transaction": [
          {
            "signatures": ["demo_hash_123"],
            "message": [
              {
                "header": [
                  {
                    "num_required_signatures": 1,
                    "num_readonly_signed_accounts": 0,
                    "num_readonly_unsigned_accounts": 2
                  }
                ],
                "instructions": [
                  {
                    "accounts": [0, 1],
                    "data": "sampleData",
                    "program_id_index": 1
                  }
                ],
                "account_keys": [
                  "SenderAddressHere",
                  "YourWalletHere",
                  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                ],
                "recent_blockhash": "exampleBlockhash"
              }
            ]
          }
        ],
        "meta": [
          {
            "post_token_balances": [
              {
                "account_index": 1,
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC1FdKkq8Zz8f7fZk",
                "owner": "YourWalletHere",
                "ui_token_amount": {
                  "ui_amount_string": "0.01"
                }
              }
            ]
          }
        ]
      }
    ],
    "slot": 290766538,
    "network": "SOLANA_DEVNET"
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
