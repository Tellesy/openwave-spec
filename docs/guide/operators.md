# Gateway Operator Guide

Any organisation can run an **OpenWave-compliant gateway**. This page covers what compliance means and how to get started.

## What is a Compliant Gateway?

A gateway is compliant if it:

1. Implements all endpoints defined in [`openwave-payments-v1.yaml`](https://github.com/openwave-standard/openwave-spec/blob/main/openwave-payments-v1.yaml) and [`openwave-open-banking-v1.0.yaml`](https://github.com/openwave-standard/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml)
2. Follows the authentication model specified (API keys, OAuth 2.0 + PKCE for OB)
3. Delivers webhooks with correct `X-OpenWave-Signature` HMAC signing
4. Enforces the amount convention (integers, minor units)
5. Exposes `/banks/{handle}/capabilities` for Open Banking capability discovery
6. Integrates with the OpenWave Identity Registry for NPT alias resolution

## Reference Implementation

**Astro** (by Neptune Fintech) is the reference gateway implementation:

- Built with Kotlin + Spring Boot 3
- Source: [`neptune-fintech/neptune-astro`](https://github.com/neptune-fintech/neptune-astro) *(private during beta)*
- Runs on any JVM-compatible host

## Running Your Own Gateway

### Minimum Requirements

| Component | Requirement |
|:---|:---|
| Runtime | JVM 21+ (Kotlin/Java) or equivalent in your stack |
| Database | PostgreSQL 14+ |
| Cache | Redis (for session state and OTP TTLs) |
| TLS | All endpoints must be HTTPS in production |
| Webhooks | Async delivery with retry queue (Redis Streams or equivalent) |

### Architecture Overview

```
                    ┌─────────────────────────────┐
Merchant ──────────►│                             │
                    │     OpenWave Gateway        │──────► Bank Core A
TPP ───────────────►│                             │──────► Bank Core B
                    │  - Payment sessions         │──────► Bank Core C
Customer ──────────►│  - OB consent + tokens      │
                    │  - NPT alias resolution      │──────► Identity Registry
                    │  - Webhook delivery          │
                    │  - Settlement batching       │──────► Settlement Layer
                    └─────────────────────────────┘
```

### Connecting to the Identity Registry

To resolve NPT aliases and register bank handles, your gateway must connect to the **OpenWave Identity Registry**:

```
Production: https://registry.openwave.ly
```

Or [run your own registry](https://github.com/openwave-standard/openwave-identity).

### Settlement

OpenWave does not prescribe a settlement mechanism — this is a bilateral agreement between banks and the gateway operator. Common approaches:

- **Net settlement via RTGS** — gateway calculates net positions per bank cycle and submits to central bank
- **Gross settlement** — each payment triggers an immediate interbank transfer
- **Prefunded model** — banks maintain a balance at the gateway; depleted by outgoing payments

## Interoperability Between Gateways

Two compliant gateways can interoperate:

```
Gateway A (merchant on G-A) ──┐
                               ├──► [Identity Registry: resolve alias]
Gateway B (payer's bank)    ──┘     ──► routed to Bank B via Gateway B
```

Protocol:
1. Gateway A resolves the NPT alias → gets `{ iban, bank_handle }`
2. Gateway A looks up which gateway Bank B is connected to
3. Gateway A calls Gateway B's payment initiation endpoint using standard OpenWave API
4. Gateway B debits the customer and delivers the settlement

This requires a **cross-gateway routing table** — maintained via the Identity Registry's bank phonebook (`GET /v1/banks`).

## Compliance Checklist

- [ ] All spec endpoints implemented with correct HTTP methods and status codes
- [ ] `api_version` field included in all webhook payloads
- [ ] PKCE S256 enforced — plain method rejected
- [ ] Webhook HMAC signing with SHA-256
- [ ] `X-Consent-Id` validated on all Open Banking data/payment calls
- [ ] Token storage: SHA-256 hash only — raw access token never persisted
- [ ] Access token TTL ≤ 15 minutes
- [ ] Refresh token single-use rotation enforced
- [ ] `DELETE /ob/consents/{id}` immediately invalidates all associated tokens
- [ ] Amount convention: integers in minor units validated and enforced
- [ ] `/banks/{handle}/capabilities` endpoint publicly accessible
- [ ] Identity Registry connected for alias resolution
