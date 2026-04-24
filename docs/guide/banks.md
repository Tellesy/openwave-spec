# Bank Integration Guide

Join the OpenWave network as a payment partner. Once registered, your customers can pay and receive payments from any merchant or user in the ecosystem.

## What a Bank Needs to Provide

OpenWave is a **routing layer** — it doesn't replace your core banking system. The gateway calls your core to:

1. Verify customer identity (OTP or SCA)
2. Debit the sending account
3. Credit the destination account (if it's your bank)
4. Query account details for Open Banking

You expose a **bank core callback API** that the gateway calls. The spec defines exactly what this interface must look like.

## Step 1 — Register with a Gateway

Contact the gateway operator (or run your own — see [Gateway Operators](/guide/operators)).

You'll need to provide:
- Bank handle (e.g. `andalus`) — globally unique short identifier
- Display name
- Country (`LY`)
- Core API base URL (your callback server)
- Settlement IBAN (where net settlements are credited/debited)
- Contact email

The gateway issues you a **Bank API Key** (`owbk_...`). Store it securely — it's shown once.

## Step 2 — Implement the Core Callback Interface

The gateway calls your core at the `core_base_url` you registered. You must implement:

### Customer Verification (OTP)
```http
POST {core_base_url}/customers/verify
X-OpenWave-Internal-Key: <shared-secret>

{ "customer_ref": "CUST-001", "otp": "123456" }
```
Return `{ "verified": true }` or a 401.

### Debit Account
```http
POST {core_base_url}/accounts/debit
X-OpenWave-Internal-Key: <shared-secret>

{
  "iban": "LY83002700100099900001",
  "amount": 50000,
  "currency": "LYD",
  "reference": "ops_01HZGV...",
  "description": "OpenWave payment — Order #1042"
}
```

### Credit Account (intra-bank or settlement)
```http
POST {core_base_url}/accounts/credit
```
Same structure as debit. The gateway calls this if the destination account is at your bank.

### Get Account Details (for Open Banking AISP)
```http
GET {core_base_url}/accounts/{iban}
```
Returns account holder info, balance, currency.

### Get Transactions (for Open Banking AISP)
```http
GET {core_base_url}/accounts/{iban}/transactions?fromDate=...&toDate=...
```

## Step 3 — Enroll Your Customers' Aliases

When a customer chooses their NPT handle in your app, your backend calls the Identity Registry:

```http
POST /v1/identity/claim
X-OpenWave-Bank-Key: owbk_andalus_...

{
  "npt_handle": "mtellesy",
  "iban": "LY83002700100099900001",
  "customer_display_name": "Mohamed T.",
  "bank_customer_ref": "CUST-001"
}
```

If the handle is taken, the registry returns `409 Conflict`.

## Step 4 — Advertise Your Capabilities

Let TPPs know what Open Banking features you support:

```http
PATCH /banks/{handle}
X-OpenWave-Bank-Key: owbk_andalus_...

{
  "ob_enabled": true,
  "ob_scopes_supported": ["accounts:read", "balances:read", "transactions:read", "payments:write"],
  "sca_exemption_limit": 5000,
  "max_consent_expiry_days": 365
}
```

## Step 5 — Handle Settlements

The gateway batches net settlement amounts and calls your core once per settlement cycle (configurable: hourly, daily, etc.).

A settlement is a **net credit or debit** to your `settlement_account_iban`. The gateway handles individual customer debits and credits — settlement reconciles the net position between banks.

## LyPay & NAD Integration

To participate in cross-bank OpenWave payments, your bank must be connected to **CBL's National Payment Infrastructure**:

### NAD — National Alias Directory

NAD is the CBL-operated alias registry. Your bank must:

1. **Enroll your customers** in NAD when they activate their alias (NPT handle) — this maps alias → IBAN + institution code
2. **Keep NAD in sync** — deactivate entries when accounts are closed or aliases are released
3. **Expose the enrollment callback** so the gateway can trigger NAD enrollment via your bank's OpenWave interface

```http
POST /openwave/callbacks/v1/alias/enroll
{
  "alias": "mtellesy",
  "account_iban": "LY83002700100099900001",
  "customer_ref": "CUST-001"
}
```

### LyPay — Outbound (Sending)

When your customer pays a merchant at another bank:

1. Gateway instructs your bank to debit the customer
2. Your bank CBS debits, then initiates a **LyPay transfer** to the creditor IBAN
3. LyPay routes to the merchant's bank
4. You receive a LyPay `debit notice` (your RRN) — store this for reconciliation

### LyPay — Inbound (Receiving)

When your merchant customer receives a payment from another bank:

1. CBL LyPay delivers a **credit instruction** to your bank
2. Your CBS credits the merchant's account
3. Your bank (or the gateway) fires the **credit confirmation** back to the Astro gateway
4. Astro updates the session to `COMPLETED` and fires `payment.completed` to the merchant

::: warning Credit confirmation is mandatory
The Astro gateway will not fire `payment.completed` to the merchant until it receives credit confirmation from your bank. Implement the credit callback promptly — delays here delay merchant fulfillment.
:::

```http
POST /openwave/callbacks/v1/payment/credit-confirmed
{
  "payment_reference": "LYPAY-REF-001",
  "session_id": "ops_01HZGV...",
  "creditor_iban": "LY83002700100099900001",
  "amount": 50000,
  "currency": "LYD",
  "rrn": "20260424-000123"
}
```

## Security Requirements

| Requirement | Detail |
|:---|:---|
| All callback endpoints must be HTTPS | TLS 1.2+ required |
| Validate `X-OpenWave-Internal-Key` on every callback | Reject requests without valid key |
| Idempotency | Use the `reference` field to deduplicate — the gateway may retry on timeout |
| Response time | Core callbacks should respond within 10 seconds |
| Retry policy | Gateway retries with exponential backoff on 5xx responses |

## Rotate Your Bank Key

If your key is compromised:

```http
POST /banks/{handle}/rotate-key
X-OpenWave-Bank-Key: owbk_andalus_...
```

New key is returned **once**. Update your systems immediately.
