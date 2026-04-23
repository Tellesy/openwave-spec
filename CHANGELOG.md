# Changelog

All notable changes to the OpenWave specification are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## Identity Registry API

### [1.0.0] — 2026-04-24

Initial stable release of the OpenWave Identity Registry API.

**Modules included:**
- NPT handle claiming (bank-initiated, bank-vouched)
- Multi-bank account linking per identity
- Default account management
- Public alias resolution (`mtellesy` → IBAN, `mtellesy@nub` → IBAN)
- Bank handle registry (phonebook of `bank-handle → core URL`)
- Registry metadata and governance info endpoint

**Key design decisions:**
- **Global username, multi-bank** — one handle spans multiple banks; `@bank-handle` suffix routes to a specific account, omitting it uses the default
- **Banks vouch, registry routes** — no KYC data stored; registry only holds `username → { bank, iban, is_default }`
- **Resolution is public** — `GET /identity/resolve` requires no auth; designed for gateway caching (60s TTL)
- **IBANs never in public profile** — `GET /identity/{handle}` returns masked data; full IBAN only via resolution endpoint
- **Governance-first** — registry publishes open source code, open governance charter, and explicit stewardship transfer plan to Central Bank of Libya or bank consortium
- **First-come, first-served** — handles are globally unique; bank-mediated dispute resolution documented in GOVERNANCE.md
- **11 typed error codes** — covering all failure modes

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

### [1.0.0] — 2026-04-23

Stable release of the OpenWave Open Banking API. Supersedes draft v0.9.0.

**Modules included:**
- TPP Registration (`POST /ob/tpp/register`, `GET/PATCH /ob/tpp/{client_id}`)
- Consent lifecycle — create, get, revoke (`POST/GET/DELETE /ob/consents/{id}`)
- OAuth 2.0 token operations — exchange, refresh, revoke (`POST /ob/token`, `POST /ob/token/revoke`)
- Accounts AISP — list and detail (`GET /ob/accounts`, `GET /ob/accounts/{id}`)
- Balances AISP (`GET /ob/accounts/{id}/balances`)
- Transactions AISP — paginated, date-filtered, pending support (`GET /ob/accounts/{id}/transactions`)
- Payment Orders PISP — immediate and scheduled (`POST/GET /ob/payment-orders`)
- Bank Capabilities — OB scope discovery (`GET /banks/{handle}/capabilities`)

**Key design decisions:**
- **OAuth 2.0 Authorization Code + PKCE (S256 only)** — no client secrets in frontend/mobile; plain challenge rejected
- **Opaque tokens (not JWT)** — stored as SHA-256 hashes; instantly revocable; access_token 15 min, refresh_token 90 days, rotated on use
- **`X-Consent-Id` header** on all data/payment calls — explicit audit trail per consent, not just per token
- **SCA** — bank declares `sca_exemption_limit` in capabilities; `PENDING_SCA` status + `sca_url` returned when required
- **State machine** — consent transitions: `AWAITING_AUTHORISATION` → `AUTHORISED` → `REVOKED|EXPIRED`; all invalid transitions return typed error codes
- **Token revocation** — `DELETE /ob/consents/{id}` invalidates all tokens for that consent instantly; individual token revoke also supported (RFC 7009 compliant)
- **Full error code table** — 17 typed OB error codes covering all failure modes
- **Webhook events** — 7 OB event types with same HMAC-SHA256 envelope as Payments module
- **Bank-agnostic** — `BankCoreClient` interface extended with AISP/PISP methods; any bank adapter can implement; bank declares capabilities
- Scopes: `accounts:read`, `balances:read`, `transactions:read`, `payments:write`, `mandates:write` (mandates:write reserved for future)

---

## Roadmap

| Feature | Target version | Notes |
|---|---|---|
| ~~Open Banking v1.0 stable~~ | ~~OB 1.0.0~~ | ✅ Done |
| ~~Identity Registry v1.0 stable~~ | ~~Identity 1.0.0~~ | ✅ Done |
| GOVERNANCE.md — dispute resolution & stewardship charter | Identity 1.0.1 | Governance document |
| Standing Orders (PISP) | OB 1.1.0 | Scheduled recurring payments |
| Variable Recurring Payments | OB 1.2.0 | Mandate-based PISP (`mandates:write` scope) |
| Cross-gateway identity federation | Identity 1.1.0 | Gateway-to-gateway handle discovery without central registry |
| Refund API | Payments 1.1.0 | Merchant-initiated refunds |
| Settlement reporting API | Payments 1.1.0 | Detailed settlement breakdowns |
| Handle transfer / dispute API | Identity 1.1.0 | Formal bank-mediated dispute mechanism |
