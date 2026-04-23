<div align="center">

# OpenWave

### Open Payment & Open Banking Standard

**Bank-agnostic · Interoperable · Built for the Libyan Banking Ecosystem**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Spec](https://img.shields.io/badge/OpenAPI-3.0.3-green.svg)](./openwave-payments-v1.yaml)
[![Status](https://img.shields.io/badge/Payments%20API-v1.0%20Stable-brightgreen.svg)]()
[![Status](https://img.shields.io/badge/Open%20Banking%20API-v1.0%20Stable-brightgreen.svg)]()

*Developed by [Neptune Fintech](https://www.neptune.ly)*

</div>

---

## What is OpenWave?

**OpenWave** is an open standard that defines a unified API surface for payments and open banking, built specifically for the **Libyan banking ecosystem** and designed to extend across other emerging markets.

Libya's banking sector has historically lacked interoperability — customers are locked to their bank's app, merchants integrate with each bank separately, and there is no shared payment identity layer. OpenWave solves this.

It allows any Libyan bank to expose a standardised interface so that:

- **Merchants** can accept payments from any bank via IBAN or NPT alias — one integration, all banks
- **Banks** can join the network as payment partners without custom bilateral agreements
- **Third-Party Providers (TPPs)** can securely access account data and initiate payments on behalf of customers — with explicit, revocable customer consent

OpenWave is **bank-agnostic by design**. Any institution can implement it independently, and any compliant gateway can route across multiple banks without vendor lock-in.

---

## API Modules

| Module | Version | Status | Description |
|:---|:---:|:---:|:---|
| **Payments** | 1.0.0 | ✅ Stable | Online payment sessions via IBAN or NPT alias |
| **Recurring Payments** | 1.0.0 | ✅ Stable | Mandate-based recurring charges |
| **Alias (NPT)** | 1.0.0 | ✅ Stable | Universal payment alias enrollment & resolution |
| **Webhooks** | 1.0.0 | ✅ Stable | Real-time event notifications with HMAC signature |
| **Open Banking — AISP** | 1.0.0 | ✅ Stable | Account info, balances, transactions |
| **Open Banking — PISP** | 1.0.0 | ✅ Stable | TPP-initiated payment orders |

---

## Spec Files

Both files are valid **OpenAPI 3.0.3** — load them directly into Swagger UI, Postman, Redocly, or any OpenAPI-compatible tooling.

| File | Covers |
|:---|:---|
| [`openwave-payments-v1.yaml`](./openwave-payments-v1.yaml) | Payments · Recurring · Alias · Webhooks |
| [`openwave-open-banking-v1.0.yaml`](./openwave-open-banking-v1.0.yaml) | Open Banking AISP + PISP · OAuth 2.0 + PKCE |

---

## Core Concepts

### NPT Alias

A universal payment identifier in the format `username@bank-handle` — for example, `ahmed@andalus`.

Inspired by UPI (India) and PromptPay (Thailand). Customers use a single human-readable alias across all participating banks. No IBAN required at the point of payment.

### OpenWave Gateway

Any server that implements this specification is an **OpenWave Gateway**. Gateways are responsible for:

- Routing payments between merchants and bank cores
- Managing session lifecycle and authentication
- Enforcing SCA (Strong Customer Authentication)
- Delivering webhook events to merchants

### Amount Convention

> **All monetary amounts are integers in minor units (cents/fils).**

| Value | Meaning |
|:---|:---|
| `50000` | 500.00 LYD |
| `100` | 1.00 USD |
| `75050` | 750.50 EUR |

Always pair `amount` with a `currency` field (ISO 4217).

---

## Authentication

| Context | Mechanism | Header |
|:---|:---|:---|
| Merchant API | Static API key | `Authorization: Bearer <key>` |
| Bank Partner | Static bank key | `X-OpenWave-Bank-Key: <key>` |
| Customer session | Short-lived session token | `X-Session-Token: <token>` |
| TPP (Open Banking) | OAuth 2.0 + PKCE access token | `Authorization: Bearer <token>` |
| Bank core → gateway | Pre-shared internal key | `X-Astro-Key: <secret>` |

---

## Open Banking

OpenWave's Open Banking module is inspired by **PSD2** and **UK Open Banking**, adapted for emerging market banks.

### How it works

```
1.  TPP creates a consent        →  POST /ob/consents
                                     ← { consent_id, consent_url }

2.  Customer approves at bank    →  bank redirects to redirect_uri
                                     ?code=AUTH_CODE&consent_id=...

3.  TPP exchanges for tokens     →  POST /ob/token  (PKCE S256 verified)
                                     ← { access_token, refresh_token }

4.  TPP accesses data/payments   →  GET /ob/accounts
                                     GET /ob/accounts/{id}/balances
                                     GET /ob/accounts/{id}/transactions
                                     POST /ob/payment-orders
                                     Header: Authorization: Bearer <access_token>

5.  Consent revoked at any time  →  DELETE /ob/consents/{id}
                                     ← all tokens immediately invalidated
```

### Scopes

| Scope | Access granted |
|:---|:---|
| `accounts:read` | List accounts and account details |
| `balances:read` | Account balances |
| `transactions:read` | Transaction history (with date filtering) |
| `payments:write` | Initiate payment orders |

### Token Design

| Property | Value |
|:---|:---|
| Type | Opaque (never JWT) |
| Storage | SHA-256 hash only — raw token never persisted |
| `access_token` TTL | 15 minutes |
| `refresh_token` TTL | 90 days, single-use rotation |
| Revocation | Instant — `DELETE /ob/consents/{id}` invalidates all tokens |
| Token revoke | `POST /ob/token/revoke` (RFC 7009 compliant) |

### Security

- **PKCE S256 mandatory** — plain challenge method rejected
- **No client secrets in frontend or mobile** — public clients are fully supported
- **`X-Consent-Id` header required** on every data/payment call — creates an explicit audit trail beyond the token
- **SCA support** — bank advertises `sca_exemption_limit` via `/banks/{handle}/capabilities`; payments above the limit return `PENDING_SCA` status with an `sca_url`

### Bank Capabilities

Before creating a consent, check what a bank actually supports:

```http
GET /banks/{handle}/capabilities
```

```json
{
  "bank_handle": "andalus",
  "ob_enabled": true,
  "ob_scopes_supported": ["accounts:read", "balances:read", "transactions:read", "payments:write"],
  "sca_exemption_limit": 5000,
  "max_consent_expiry_days": 365
}
```

---

## Webhooks

All events share a common envelope:

```json
{
  "event": "payment.completed",
  "api_version": "1.0.0",
  "timestamp": "2026-04-23T20:00:00Z",
  "data": {}
}
```

Verify authenticity with the `X-OpenWave-Signature` header:

```
X-OpenWave-Signature: sha256=<HMAC-SHA256(raw_body, webhook_secret)>
```

### Event Reference

**Payments**

| Event | Trigger |
|:---|:---|
| `payment.completed` | Funds deducted, transfer confirmed |
| `payment.failed` | OTP failure, timeout, or CBS error |
| `payment.expired` | Session timed out before completion |

**Recurring**

| Event | Trigger |
|:---|:---|
| `mandate.activated` | Customer consented to recurring charges |
| `mandate.cancelled` | Cancelled by any party |
| `mandate.charge.completed` | Charge executed successfully |
| `mandate.charge.failed` | Charge attempt failed |

**Open Banking**

| Event | Trigger |
|:---|:---|
| `consent.granted` | Customer approved TPP access |
| `consent.revoked` | Revoked by TPP, customer, or bank |
| `consent.expired` | Consent reached its expiry date |
| `payment_order.completed` | Funds transferred successfully |
| `payment_order.failed` | Processing error |
| `payment_order.pending_sca` | Bank requires SCA before execution |
| `payment_order.rejected` | Bank declined the payment order |

---

## Versioning

OpenWave follows **Semantic Versioning**:

| Change type | Version bump | Example |
|:---|:---:|:---|
| Breaking change to existing endpoint | `MAJOR` | 1.x → 2.0 |
| New endpoint or optional field | `MINOR` | 1.0 → 1.1 |
| Clarification, fix, or example update | `PATCH` | 1.0.0 → 1.0.1 |

The `api_version` field in webhook envelopes and the `info.version` in each spec file always reflect the module version.

---

## Contributing

We welcome proposals, corrections, and discussion from the community.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

OpenWave is released under the **Apache License 2.0**.  
See [LICENSE](./LICENSE) for the full text.

---

<div align="center">

Developed and maintained by **[Neptune Fintech](https://www.neptune.ly)**

</div>
