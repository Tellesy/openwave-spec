# Merchant Integration Guide

Accept payments from any participating bank with a single integration. No per-bank setup.

## Overview

```
1. Your backend creates a payment session
2. You redirect the customer (or embed the widget)
3. Customer authenticates with their bank via OTP
4. Gateway deducts funds and delivers a webhook to your endpoint
5. You fulfil the order
```

## Step 1 — Get Your API Key

Contact your gateway operator (or your bank) to receive a **Merchant API Key** (`mk_live_...`).

All requests are authenticated with:
```http
Authorization: Bearer mk_live_...
```

::: tip Test Keys
Use `mk_test_...` keys during development. Test mode payments never touch real funds.
:::

## Step 2 — Create a Payment Session

From your **backend** (never from the browser — your API key stays server-side):

```http
POST /payments/sessions
Authorization: Bearer mk_live_...
Content-Type: application/json

{
  "amount": 50000,
  "currency": "LYD",
  "destination": {
    "type": "alias",
    "value": "mtellesy"
  },
  "description": "Order #1042",
  "reference": "order_1042",
  "redirect_url": "https://mystore.com/orders/1042/result",
  "webhook_url": "https://mystore.com/webhooks/openwave"
}
```

::: info Amount is in minor units
`50000` = **500.00 LYD**. See [Amount Convention](/guide/concepts#amount-convention).
:::

Response:
```json
{
  "session_id": "ops_01HZGV...",
  "status": "PENDING",
  "checkout_url": "https://gateway.example.com/pay/ops_01HZGV...",
  "expires_at": "2026-04-24T05:00:00Z"
}
```

## Step 3 — Redirect the Customer

Send the customer to `checkout_url`. The gateway handles:
- Alias/IBAN entry
- Bank selection
- OTP authentication
- Redirect back to your `redirect_url` with `?session_id=...&status=completed`

**Or embed the widget** (coming with the Web SDK):
```html
<script src="https://js.openwave.ly/v1/openwave.js"></script>
<script>
  openwave.checkout({
    sessionId: 'ops_01HZGV...',
    onSuccess: (e) => window.location.href = e.receipt_url,
    onFailed: (e) => showError(e.message),
  })
</script>
```

## Step 4 — Receive Webhooks

Configure a public HTTPS endpoint to receive events. **Always verify the signature:**

```js
// Express.js example
app.post('/webhooks/openwave', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-openwave-signature']
  const secret = process.env.WEBHOOK_SECRET

  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(req.body)
    .digest('hex')

  if (sig !== expected) return res.status(401).send('Invalid signature')

  const event = JSON.parse(req.body)

  if (event.event === 'payment.completed') {
    const { session_id, reference } = event.data
    // fulfil order using reference
    await fulfillOrder(reference)
  }

  res.json({ received: true })
})
```

### Payment Events

| Event | When |
|:---|:---|
| `payment.completed` | Funds deducted, transfer confirmed ✅ |
| `payment.failed` | OTP failure, timeout, or CBS error ❌ |
| `payment.expired` | Session timed out before completion ⏱️ |

## Step 5 — Verify (Optional Double-Check)

After receiving the webhook, you can verify the session status directly:

```http
GET /payments/sessions/{session_id}
Authorization: Bearer mk_live_...
```

## Destination Types

| Type | Example | Notes |
|:---|:---|:---|
| `alias` | `mtellesy` | NPT username, resolved to IBAN |
| `alias` with bank | `mtellesy@andalus` | Specific bank routing |
| `iban` | `LY83002700100099900001` | Direct IBAN |

## How Your Account Gets Credited

When a customer pays you, the money flows differently depending on whether you and the customer bank with the same institution:

| Scenario | What happens | Timing |
|---|---|---|
| **Same bank** | Internal CBS book transfer — instant debit and credit | < 1 second |
| **Different banks** | Customer's bank debits, sends via **CBL LyPay** to your bank, your bank credits | 2–10 seconds |

**You only need to act on `payment.completed`** — this webhook fires only after the credit at your bank is confirmed. Never fulfil an order on `payment.initiated` or `payment.processing` alone.

```json
{
  "event": "payment.completed",
  "data": {
    "session_id": "ops_01HZGV...",
    "reference": "order_1042",
    "settlement_type": "lypay",
    "creditor_bank": "andalus"
  }
}
```

The `settlement_type` field is `internal` for same-bank payments and `lypay` for cross-bank. Your bank handles the actual credit — the gateway simply confirms it happened and fires this webhook.

::: tip Cross-bank payments are still real-time
LyPay is a real-time settlement rail. Cross-bank payments typically complete in under 10 seconds — you don't need to poll or wait.
:::

## Recurring Payments

Set up a mandate for recurring charges (subscriptions, instalments):

```http
POST /recurring/mandates
{
  "customer_alias": "mtellesy",
  "amount": 5000,
  "currency": "LYD",
  "interval": "monthly",
  "description": "Monthly subscription",
  "start_date": "2026-05-01"
}
```

Customer receives an OTP to confirm the mandate. Once active, you charge via:

```http
POST /recurring/mandates/{mandate_id}/charge
{ "amount": 5000, "reference": "sub_may_2026" }
```

## API Key Security

- **Never expose your API key in frontend code or mobile apps**
- Store it as an environment variable: `OPENWAVE_API_KEY`
- Rotate your key immediately if you suspect it's compromised
- Use `mk_test_...` keys in development and CI
