# OpenWave Standard

**OpenWave** is an open, bank-agnostic payment and open banking standard designed for interoperability across banking networks in emerging and developing markets.

It enables merchants to accept payments via IBAN or NPT alias, banks to participate as payment partners, and third-party applications (TPPs) to access customer financial data — all through a single, standardised API surface.

---

## Modules

| Module | Version | Status | Description |
|---|---|---|---|
| **Payments** | 1.0.0 | ✅ Stable | Online payment sessions via IBAN or NPT alias |
| **Recurring** | 1.0.0 | ✅ Stable | Mandate-based recurring payments |
| **Alias** | 1.0.0 | ✅ Stable | NPT alias enrollment and management |
| **Webhooks** | 1.0.0 | ✅ Stable | Event-driven merchant notifications |
| **Open Banking** | 0.9.0 | 🚧 Draft | Account data, balances, transactions (PSD2-inspired) |
| **Open Banking — Payments** | 0.9.0 | 🚧 Draft | TPP-initiated payment orders |

---

## Core Concepts

### NPT Alias
A universal payment identifier in the format `username@bank-handle` (e.g. `mtellesy@andalus`).  
Inspired by UPI (India) and PromptPay (Thailand). Bank-agnostic by design.

### OpenWave Gateway
Any server implementing this standard. The reference implementation is **Neptune Astro** (Kotlin + Spring Boot).  
→ https://github.com/Tellesy/neptune-astro

### Open Banking (Phase 2)
Inspired by PSD2/UK Open Banking. Allows regulated Third-Party Providers (TPPs) to:
- Read account information (balances, transactions, account details)
- Initiate payments on behalf of customers
- All with explicit, revocable customer consent

---

## Spec Files

| File | Description |
|---|---|
| [`openwave-payments-v1.yaml`](./openwave-payments-v1.yaml) | Payments, Recurring, Alias, Webhooks — stable |
| [`openwave-open-banking-v0.9.yaml`](./openwave-open-banking-v0.9.yaml) | Open Banking (Account Info + Payment Initiation) — draft |

Both files are valid **OpenAPI 3.0.3** and can be loaded into Swagger UI, Postman, or any OpenAPI tooling.

---

## Authentication Summary

| API | Mechanism | Used by |
|---|---|---|
| Merchant Payments | `Authorization: Bearer <merchant_api_key>` | Merchants |
| Bank Partner | `X-OpenWave-Bank-Key: <bank_api_key>` | Banks registering/enrolling |
| Session (SDK) | `X-Session-Token: <token>` | Customer-facing webview |
| Open Banking (TPP) | OAuth 2.0 + PKCE (`Authorization: Bearer <access_token>`) | Third-party apps |
| Internal (Core BE) | `X-Astro-Key: <shared_secret>` | Bank's core backend → gateway |

---

## Amount Convention

All monetary amounts are in **minor units** (integers):
- `50000` = `500.00 LYD` (2 decimal places)
- `100` = `1.00 USD`
- Always include `currency` (ISO 4217) alongside any `amount` field.

---

## Webhook Events

All webhook bodies share this envelope:
```json
{
  "event": "payment.completed",
  "gateway": "neptune-astro",
  "api_version": "1.0.0",
  "timestamp": "2026-04-23T20:00:00Z",
  "data": { }
}
```

Signature verification: `X-OpenWave-Signature: sha256={HMAC-SHA256(raw_body, webhook_secret)}`

### Event Types
**Payments**
- `payment.completed` — session confirmed, funds deducted
- `payment.failed` — OTP wrong, timeout, or CBS error
- `payment.expired` — session timed out

**Recurring**
- `mandate.activated` — customer consented
- `mandate.cancelled` — cancelled by any party
- `mandate.charge.completed`
- `mandate.charge.failed`

**Open Banking**
- `consent.granted` — customer approved TPP access
- `consent.revoked` — customer revoked TPP access
- `payment_order.completed`
- `payment_order.failed`

---

## Implementations

| Name | Language | Status | Link |
|---|---|---|---|
| Neptune Astro | Kotlin / Spring Boot 3 | Reference implementation | https://github.com/Tellesy/neptune-astro |

---

## Versioning

This spec follows **Semantic Versioning**:
- `MAJOR` — breaking changes to existing endpoints
- `MINOR` — new endpoints or optional fields (backward compatible)
- `PATCH` — fixes, clarifications, example corrections

The `api_version` field in webhook envelopes and the `info.version` in each spec file reflect the module version.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).
