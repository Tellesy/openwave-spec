# Changelog

All notable changes to the OpenWave specification are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## Payments API

### [1.0.0] — 2026-04-23

Initial stable release of the OpenWave Payments API.

**Modules included:**
- Payments (payment session lifecycle)
- Recurring Mandates
- Alias (NPT alias enrollment and management)
- Webhooks (event schema reference)
- Bank Partner Registration

**Key design decisions:**
- Amounts in minor units (integers) throughout
- NPT alias format: `username@bank-handle`
- Three security schemes: MerchantApiKey, BankPartnerKey, SessionToken
- Idempotency via `Idempotency-Key` header (24h window)
- Webhook signature: HMAC-SHA256 in `X-OpenWave-Signature`

---

## Open Banking API

### [0.9.0] — 2026-04-23

Initial draft of the OpenWave Open Banking API.

**Modules included:**
- TPP Registration
- Consent lifecycle (create, authorise, revoke, token exchange)
- Accounts (AISP — list and get)
- Balances (AISP)
- Transactions (AISP — paginated, date-filtered)
- Payment Orders (PISP — immediate and scheduled)

**Key design decisions:**
- OAuth 2.0 Authorization Code + PKCE for all TPP access
- Scopes: `accounts:read`, `balances:read`, `transactions:read`, `payments:write`, `mandates:write`
- `X-Consent-Id` header on all data/payment requests for explicit consent binding
- SCA (Strong Customer Authentication) optional field on payment orders — bank decides
- Consent expiry configurable up to 365 days

**Status:** 🚧 Draft — schemas and endpoints may change before v1.0.

---

## Roadmap

| Feature | Target version | Notes |
|---|---|---|
| Open Banking v1.0 stable | OB 1.0.0 | After pilot feedback |
| Standing Orders (PISP) | OB 1.1.0 | Scheduled recurring payments |
| Variable Recurring Payments | OB 1.2.0 | Mandate-based PISP |
| Multi-bank payment routing | Payments 1.1.0 | Cross-bank NPT resolution |
| Refund API | Payments 1.1.0 | Merchant-initiated refunds |
| Settlement reporting API | Payments 1.1.0 | Detailed settlement breakdowns |
