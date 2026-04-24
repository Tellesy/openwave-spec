# Core Concepts

## Amount Convention

::: warning All amounts are integers in minor units
`50000` means **500.00 LYD**. Never use decimals.
:::

| Integer value | Meaning |
|:---|:---|
| `50000` | 500.00 LYD |
| `100` | 1.00 USD |
| `75050` | 750.50 EUR |

Always pair `amount` with a `currency` field (ISO 4217: `LYD`, `USD`, `EUR`).

## Payment Session Lifecycle

Every payment starts as a **session** — a time-limited intent to pay.

```
CREATE SESSION          POST /payments/sessions
      ↓
   PENDING              Waiting for customer action
      ↓
   PROCESSING           Customer authenticated, bank transfer in-flight
      ↓
 COMPLETED / FAILED     Final state
      ↓
   webhook delivered    merchant notified of outcome
```

Sessions expire after a configurable TTL (default 15 minutes). Expired sessions fire a `payment.expired` webhook.

## Authentication Contexts

| Who is calling | Mechanism | Header |
|:---|:---|:---|
| Merchant | Static API key | `Authorization: Bearer mk_live_...` |
| Bank Partner | Static bank key | `X-OpenWave-Bank-Key: owbk_...` |
| Customer session | Short-lived token | `X-Session-Token: ost_...` |
| TPP (Open Banking) | OAuth 2.0 access token | `Authorization: Bearer eyJ...` |
| Bank core → gateway | Pre-shared secret | `X-OpenWave-Internal-Key: ...` |

## IBAN vs NPT Routing

When a merchant creates a payment session, they specify a destination. The gateway accepts both:

```json
{ "destination": { "type": "iban", "value": "LY83002700100099900001" } }
{ "destination": { "type": "alias", "value": "mtellesy" } }
{ "destination": { "type": "alias", "value": "mtellesy@nub" } }
```

If `type` is `alias`, the gateway resolves it to an IBAN via the Identity Registry before routing.

## Webhook Signature Verification

Every webhook delivery includes an `X-OpenWave-Signature` header:

```
X-OpenWave-Signature: sha256=<HMAC-SHA256(raw_body, webhook_secret)>
```

**Always verify this before processing.** The webhook secret is set when you register your webhook endpoint.

```js
import { createHmac } from 'crypto'

function verifyWebhook(rawBody, signature, secret) {
  const expected = 'sha256=' + createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return signature === expected
}
```

## Idempotency

For `POST` requests that create resources, include an `Idempotency-Key` header to safely retry on network errors:

```http
POST /payments/sessions
Idempotency-Key: <unique-uuid-per-request>
```

The gateway deduplicates by key for 24 hours. Safe to retry.

## Pagination

List endpoints use cursor-based pagination:

```http
GET /payments/sessions?limit=20&cursor=sess_abc123
```

Response:
```json
{
  "sessions": [...],
  "pagination": {
    "next_cursor": "sess_xyz789",
    "has_more": true
  }
}
```
