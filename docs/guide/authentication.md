# Authentication

OpenWave uses different authentication mechanisms depending on who is making the call.

## Summary

| Caller | Mechanism | Header |
|:---|:---|:---|
| Merchant | Static API key | `Authorization: Bearer mk_live_...` |
| Bank Partner | Static bank key | `X-OpenWave-Bank-Key: owbk_...` |
| Customer (session) | Short-lived session token | `X-Session-Token: ost_...` |
| TPP (Open Banking) | OAuth 2.0 access token | `Authorization: Bearer <token>` |
| Bank core → gateway | Pre-shared internal secret | `X-OpenWave-Internal-Key: <secret>` |
| Gateway admin | Admin key | `X-OpenWave-Admin-Key: <key>` |

## Merchant API Keys

Format: `mk_live_` (production) or `mk_test_` (test mode)

```http
Authorization: Bearer mk_live_abc123...
```

- Issued when a merchant is registered with a gateway
- Scoped to that merchant — cannot access other merchants' data
- **Never use in frontend code or mobile apps**
- Test keys (`mk_test_...`) never affect real funds

## Bank Partner Keys

Format: `owbk_<bank_handle>_...`

```http
X-OpenWave-Bank-Key: owbk_andalus_abc123...
```

- Issued when a bank registers with the gateway
- Used for alias enrollment, account linking, and bank management
- Rotate immediately if compromised: `POST /banks/{handle}/rotate-key`

## Open Banking (OAuth 2.0 + PKCE)

TPPs authenticate via the Authorization Code Flow with PKCE.

```http
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
```

Both headers are required on every Open Banking data/payment call.

### Token Properties

| Property | Value |
|:---|:---|
| Type | Opaque (random string, never JWT) |
| Storage | **SHA-256 hash only** — raw token never persisted by the gateway |
| `access_token` TTL | 15 minutes |
| `refresh_token` TTL | 90 days, single-use rotation |
| Revocation | Instant — `DELETE /ob/consents/{id}` invalidates all tokens |

### PKCE Requirements

- `code_challenge_method` must be `S256`
- `plain` method is rejected with `400 Bad Request`
- Public clients (mobile, SPA) fully supported — no client secret required

## Session Tokens

When a customer authenticates during a payment flow, they receive a short-lived session token:

```http
X-Session-Token: ost_01HZGV...
```

These are managed by the gateway internally. Merchants don't handle session tokens directly — the checkout flow manages this transparently.

## Internal Key (Bank Core ↔ Gateway)

When the gateway calls a bank's core API (for debits, credits, OTP verification), it includes:

```http
X-OpenWave-Internal-Key: <shared-secret>
```

This is a pre-shared secret configured when the bank registers. The bank's core must validate this header on all incoming gateway calls.

## Key Rotation

| Key type | How to rotate |
|:---|:---|
| Merchant API key | `POST /merchants/{id}/rotate-key` (admin) |
| Bank key | `POST /banks/{handle}/rotate-key` (bank) |
| Open Banking tokens | `POST /ob/token` with `refresh_token` grant |

All rotation endpoints return the new key **once**. The old key is immediately invalidated.
