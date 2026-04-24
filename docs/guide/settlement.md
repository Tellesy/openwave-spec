# Settlement & CBL Infrastructure

OpenWave payments are settled over **Libya's Central Bank (CBL) National Payment Infrastructure** — a two-component system that handles alias resolution and interbank money movement.

## CBL National Payment Infrastructure

```
┌─────────────────────────────────────────────────────┐
│         CBL National Payment Infrastructure          │
│                                                       │
│  ┌──────────────────┐    ┌─────────────────────────┐ │
│  │  NAD              │    │  LyPay                  │ │
│  │  National Alias   │    │  National Interbank     │ │
│  │  Directory        │    │  Transfer Rail          │ │
│  │                   │    │                         │ │
│  │  alias → IBAN     │    │  IBAN → IBAN transfer   │ │
│  │  phone → IBAN     │    │  across any Libyan bank │ │
│  │  NID   → IBAN     │    │                         │ │
│  └──────────────────┘    └─────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

- **NAD** (National Alias Directory) — resolves any identifier (alias, phone, IBAN) to the canonical IBAN and the bank institution code. Operated by CBL.
- **LyPay** — the interbank transfer rail. Takes a source IBAN, destination IBAN, and amount, and settles between banks in real time. Operated by CBL.

Every cross-bank OpenWave payment uses both: NAD for resolution, LyPay for movement.

---

## Payment Settlement Paths

### Path A: Same-Bank Payment

Customer and merchant hold accounts at the **same bank**.

```
Customer (Bank A)          Astro Gateway          Merchant (Bank A)
      │                         │                       │
      │── tap "Pay" ──────────►│                       │
      │                         │── CBS debit ─────────►│
      │                         │   (internal transfer)  │
      │                         │◄── debit confirmed ───│
      │                         │── CBS credit ────────►│
      │                         │◄── credit confirmed ──│
      │                         │                       │
      │                         │── webhook ────────────────────► Merchant API
      │                         │   payment.completed            { session_id, reference }
```

- Single CBS book transfer — no LyPay involved
- Instant credit
- `payment.completed` fires immediately after CBS credit confirmation

---

### Path B: Cross-Bank Payment (LyPay)

Customer and merchant hold accounts at **different banks**.

```
Customer (Bank A)    Astro Gateway    CBL LyPay    Bank B (Merchant's bank)
      │                   │               │                │
      │── OTP confirm ───►│               │                │
      │                   │── debit at ──►│                │
      │                   │   Bank A CBS  │                │
      │                   │◄── debit OK  │                │
      │                   │── LyPay ─────►│                │
      │                   │   transfer    │── credit ──────►│
      │                   │               │   at Bank B CBS │
      │                   │◄── credit notice (LyPay callback)
      │                   │                                 │
      │                   │── webhook ─────────────────────────────► Merchant API
      │                   │   payment.completed
```

**Step-by-step:**

1. Customer's bank (Bank A) **debits** the customer account via CBS
2. Bank A sends a **LyPay transfer instruction** to CBL with the merchant's IBAN
3. CBL LyPay routes to Bank B and **credits the merchant's account**
4. LyPay fires a **credit confirmation callback** to the Astro gateway
5. Astro updates session status to `COMPLETED` and fires `payment.completed` webhook to the merchant

::: warning Credit confirmation, not just debit
The `payment.completed` event fires only after the **credit is confirmed** — not when the debit happens. This means the merchant webhook is reliable evidence that funds have actually arrived.
:::

---

## Who Does What

| Party | Responsibility |
|---|---|
| **Debtor's bank** | Validates customer, debits account, initiates LyPay transfer |
| **CBL LyPay** | Routes interbank transfer, notifies creditor bank, sends callback |
| **Creditor's bank** | Receives LyPay instruction, credits merchant account, confirms |
| **Astro gateway** | Receives LyPay callback, updates session status, fires merchant webhook |
| **Merchant** | Receives `payment.completed` webhook, fulfils order |

---

## Settlement Timing

| Payment Type | Typical Timing |
|---|---|
| Same-bank (internal CBS) | Instant (< 1 second) |
| Cross-bank (LyPay) | Real-time (2–10 seconds) |
| High-value / manual review | Minutes to hours (rare) |

---

## Webhook Timing

```
Debit confirmed at Bank A
        │
        ├── [SAME_BANK] → book credit instant
        │                        │
        │                 payment.completed ✅  (settlement_type: SAME_BANK)
        │
        └── [LYPAY cross-bank] → LyPay instruction submitted to CBL
                                        │
                                 payment.settlement_pending ⏳
                                 (fires immediately — credit still in transit)
                                        │
                                 CBL delivers credit to Bank B
                                        │
                                 LyPay credit callback → gateway
                                        │
                                 payment.completed ✅  (settlement_type: LYPAY)
```

::: warning Fulfil on `payment.completed` only
`payment.settlement_pending` means funds are in transit — not yet credited. Always fulfil orders on `payment.completed` only.
:::

::: tip Use `payment.settlement_pending` for UX
Show a "Payment processing..." state to the customer when you receive `payment.settlement_pending`. For LyPay this resolves in 2–10 seconds. `payment.completed` follows immediately after.
:::

---

## Payment Session Lifecycle with Settlement

```
PENDING ─────────────────────────────────────────────────────────────► EXPIRED
   │                                                              (TTL: 15 min)
   │ customer resolves payer, gateway picks auth mode
   │
OTP_SENT / PUSH_SENT
   │
   │ customer confirms (OTP code or push approval)
   │
   ├── [SAME_BANK] ──────────────────────────────────────────────────────────┐
   │   internal CBS book transfer                                             │
   │                                                                          ▼
   └── [LYPAY cross-bank]                                               CONFIRMED
       LyPay instruction submitted              ◄──── payment.completed ─────────
            │
       SETTLEMENT_PENDING ◄── payment.settlement_pending fires
            │
       CBL credit callback received
            │
       CONFIRMED ◄──── payment.completed fires
```

::: info Same-bank payments skip SETTLEMENT_PENDING
For `SAME_BANK` routes, the session moves atomically to `CONFIRMED`. The `SETTLEMENT_PENDING` status only appears for cross-bank `LYPAY` transactions.
:::

---

## For Merchants

### Minimal implementation — listen for `payment.completed`

```json
{
  "event": "payment.completed",
  "gateway": "openwave-gateway",
  "api_version": "1.0.0",
  "timestamp": "2026-04-24T05:00:00Z",
  "data": {
    "session_id": "sess_01HZGV...",
    "merchant_reference": "order_1042",
    "amount": 50000,
    "currency": "LYD",
    "transfer_reference": "TXN-20260424-001",
    "settlement_type": "LYPAY",
    "lypay_ref": "LYPAY-20260424-998877",
    "creditor_iban": "LY83002700100099900001",
    "creditor_bank_handle": "andalus",
    "gateway_fee": 750,
    "confirmed_at": "2026-04-24T05:00:07Z"
  }
}
```

### Optional — handle `payment.settlement_pending` for better UX

```json
{
  "event": "payment.settlement_pending",
  "gateway": "openwave-gateway",
  "api_version": "1.0.0",
  "timestamp": "2026-04-24T05:00:02Z",
  "data": {
    "session_id": "sess_01HZGV...",
    "merchant_reference": "order_1042",
    "amount": 50000,
    "currency": "LYD",
    "transfer_reference": "TXN-20260424-001",
    "settlement_type": "LYPAY",
    "lypay_ref": "LYPAY-20260424-998877",
    "creditor_iban": "LY83002700100099900001",
    "creditor_bank_handle": "andalus",
    "settlement_pending_at": "2026-04-24T05:00:02Z"
  }
}
```

The `settlement_type` field tells you:
- `SAME_BANK` — same-bank internal CBS transfer, instant
- `LYPAY` — cross-bank via CBL LyPay, 2–10 seconds

---

## For Banks

To be a compliant OpenWave bank, you need to:

1. **Enroll in CBL NAD** — register your customers' accounts so they can receive payments by alias
2. **Connect to CBL LyPay** — both outbound (debit + send) and inbound (receive + credit)
3. **Implement the credit callback** — when LyPay credits an account at your bank, confirm to the gateway so `payment.completed` can fire
4. **Expose the standard bank callback interface** — as defined in the [Banks guide](/guide/banks)

---

## For Gateway Operators

When implementing a compliant gateway (see [Operators guide](/guide/operators)):

- Register your LyPay callback endpoint with CBL
- On receiving a LyPay `credit_notice`: update payment session to `COMPLETED`, fire the merchant `payment.completed` webhook
- On receiving a LyPay `declined` or `timeout`: update session to `FAILED`, fire `payment.failed` webhook
- Handle the idempotency of LyPay callbacks (CBL may retry)

```kotlin
// Nexus pattern: LyPayTransactionNotificationService
fun updateTransactionStatus(request: TransactionStatusUpdateDTO) {
    val entity = findByPaymentReference(request.payment_reference)
    when (request.status_code) {
        "03" -> { // completed
            markSessionCompleted(entity)
            fireMerchantWebhook("payment.completed", entity)
        }
        "04", "05" -> { // declined / failed
            markSessionFailed(entity)
            fireMerchantWebhook("payment.failed", entity)
        }
    }
}
```
