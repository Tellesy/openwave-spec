# AGENT CONTEXT — openwave-spec
> Auto-maintained by AI agent. Update after every significant change.
> Read this file at the start of every session before touching any spec file.

## What This Project Is
The **OpenWave Standard** — an open, bank-agnostic payment and open banking specification.
- Format: OpenAPI 3.0.3 YAML
- GitHub: https://github.com/Tellesy/openwave-spec (PUBLIC)
- Local path: `/Users/mtellesy/GitHub/openwave-spec/`
- License: Apache 2.0
- Reference implementation: Neptune Astro → https://github.com/Tellesy/neptune-astro

## Spec Files

| File | Module | Version | Status |
|---|---|---|---|
| `openwave-payments-v1.yaml` | Payments, Recurring, Alias, Webhooks | 1.0.0 | Stable |
| `openwave-open-banking-v1.0.yaml` | Open Banking (AISP + PISP) | 1.0.0 | Stable |

## Module Status

### Payments v1.0 (STABLE)
- `POST /payments/initiate` — create payment session
- `GET  /payments/{id}` — poll status
- `POST /payments/{id}/cancel`
- `GET/POST /session/{id}/*` — customer-facing webview flow
- `POST/GET /recurring/mandates` — mandate CRUD
- `POST /recurring/mandates/{id}/charge`
- `POST /webhooks/test`
- `POST /alias/enroll`, `GET/DELETE /alias/{alias}`
- `POST /banks/register`, `POST /banks/{handle}/test-connection`

### Open Banking v1.0 (STABLE)
- **TPP Registration**: `POST /ob/tpp/register`, `GET/PATCH /ob/tpp/{client_id}`
- **Consent**: `POST /ob/consents`, `GET /ob/consents/{id}`, `DELETE /ob/consents/{id}` (revoke)
- **Token**: `POST /ob/token` (authorization_code + refresh_token grants), `POST /ob/token/revoke`
- **Accounts (AISP)**: `GET /ob/accounts`, `GET /ob/accounts/{id}`
- **Balances (AISP)**: `GET /ob/accounts/{id}/balances`
- **Transactions (AISP)**: `GET /ob/accounts/{id}/transactions` (paginated, date-filtered, pending support)
- **Payment Orders (PISP)**: `POST /ob/payment-orders`, `GET /ob/payment-orders/{id}`
- **Capabilities**: `GET /banks/{handle}/capabilities`

**Key design decisions in spec:**
- PKCE S256 only (plain rejected)
- Opaque tokens stored as SHA-256 hashes; access_token 15 min, refresh_token 90 days
- `X-Consent-Id` required header on all data/payment calls
- RFC 7009 compliant token revocation
- 17 typed error codes

## Key Conventions (enforce in all spec edits)
- Amounts: **minor unit integers** always (50000 = 500.00 LYD)
- IDs: UUID format always
- Dates: ISO 8601 always (`date-time` or `date`)
- Auth: never add unauthenticated endpoints
- Versioning: MAJOR = breaking, MINOR = additive, PATCH = fix

## Security Schemes
| Scheme | Used by | Header/Mechanism |
|---|---|---|
| MerchantApiKey | Merchants | `Authorization: Bearer` |
| BankPartnerKey | Banks | `X-OpenWave-Bank-Key` |
| SessionToken | Customer SDK webview | `X-Session-Token` |
| TppOAuth | TPPs (Open Banking) | OAuth 2.0 PKCE |
| TppAdminKey | TPP registration admin | `X-OpenWave-TPP-Key` |

## Current State / Last Session (2026-04-23)
- [x] Payments v1.0.0 spec published (stable)
- [x] Open Banking v1.0.0 spec published (stable) — v0.9.0 removed
- [x] README, CONTRIBUTING, CHANGELOG, LICENSE added
- [x] Repo created and pushed: https://github.com/Tellesy/openwave-spec (public)

## Pending / Next Steps
- [ ] Neptune Astro implementation of OB v1.0 (Flyway V3 + services + controllers)
- [ ] Andalus bank internal OB endpoints (/astro/ob/*)
- [ ] Standing Orders / Variable Recurring Payments (OB v1.1)
- [ ] Refund API (Payments v1.1)
- [ ] Multi-bank cross-network NPT routing (Payments v1.1)
- [ ] Move to `openwave-standard` GitHub org when ready to go fully public
