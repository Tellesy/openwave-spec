# What is OpenWave?

**OpenWave** is an open standard that defines a unified API surface for payments and open banking, built specifically for the **Libyan banking ecosystem** and designed to extend across other emerging markets.

## The Problem

Libya's banking sector has historically lacked interoperability:

- Customers are **locked to their bank's app** — paying someone at a different bank is painful or impossible
- Merchants must **integrate with each bank separately** — ten banks means ten integrations
- There is **no shared payment identity layer** — you need someone's full IBAN to send them money
- TPPs and fintechs **cannot safely access account data** — no open banking framework exists

## The Solution

OpenWave solves this with three coordinated specifications:

| Module | What it does |
|:---|:---|
| **Payments API** | Standard payment sessions, IBAN/NPT alias routing, recurring mandates, webhooks |
| **Open Banking API** | Consent-based account access (AISP) and payment initiation (PISP) for TPPs |
| **Identity Registry** | Global NPT handle ownership, multi-bank linking, public alias resolution |

## Who Runs a Gateway?

Any server that **implements this specification** is an **OpenWave Gateway**. A gateway:

- Routes payments between merchants and bank cores
- Manages session lifecycle and customer authentication
- Enforces Strong Customer Authentication (SCA)
- Delivers webhook events to merchants
- Issues and validates NPT aliases

Neptune Fintech operates **Astro**, the reference implementation. Any bank or fintech can run their own compliant gateway.

## Deployment Models

### Centralised (shared gateway)
A single gateway connects multiple banks. Simplest model for a national payment network.

```
Merchant ──→ [ OpenWave Gateway ] ──→ Bank A
                                  └──→ Bank B
                                  └──→ Bank C
```

### Federated (multiple gateways)
Each operator runs its own gateway. They interoperate because the protocol is the same.

```
Merchant A ──→ [ Gateway 1 ] ──┐
                                ├──→ [ Settlement Layer ]
Merchant B ──→ [ Gateway 2 ] ──┘
```

**No single operator controls the network.** The standard is the contract.

## Status

| Module | Version | Status |
|:---|:---:|:---:|
| Payments | 1.0.0 | ✅ Stable |
| Recurring Payments | 1.0.0 | ✅ Stable |
| Alias (NPT) | 1.0.0 | ✅ Stable |
| Webhooks | 1.0.0 | ✅ Stable |
| Open Banking — AISP | 1.0.0 | ✅ Stable |
| Open Banking — PISP | 1.0.0 | ✅ Stable |
| Identity Registry | 1.0.0 | ✅ Stable |

## Next Steps

- [Core Concepts →](/guide/concepts)
- [NPT explained →](/guide/npt)
- [Merchant integration guide →](/guide/merchants)
