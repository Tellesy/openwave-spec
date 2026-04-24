# Architecture & Infrastructure

This page covers the full OpenWave system topology — the participants, how they connect, and how money and data flow.

---

## System Overview

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         OPENWAVE ECOSYSTEM                                    ║
╠══════════════╦═══════════════════════════╦══════════════════════════════════╣
║  MERCHANTS   ║    OPENWAVE GATEWAY        ║  BANKS & CUSTOMERS               ║
║              ║                           ║                                  ║
║  E-commerce  ║  ┌─────────────────────┐  ║  Bank A CBS ◄─── Bank A App      ║
║  POS         ║  │  Payment Engine     │  ║  (Andalus, NUB,                  ║
║  Billing     ║  │  Alias Registry     │◄─╫──FCUBS, ...)                     ║
║  Apps        ║  │  Open Banking       │  ║                                  ║
║              ║  │  Webhook Dispatcher │  ║  Bank B CBS ◄─── Bank B App      ║
║  ──────────► ║  │  Settlement Engine  │  ║                                  ║
║  REST API    ║  └──────────┬──────────┘  ║  Bank C CBS ◄─── Bank C App      ║
║  + Webhooks  ║             │             ║                                  ║
╚══════════════╬═════════════╪═════════════╬══════════════════════════════════╝
               ║    CBL NATIONAL INFRASTRUCTURE                                ║
               ╠═════════════╪═════════════╗                                  ║
               ║    NAD       │    LyPay    ║                                  ║
               ║   (Alias)    │  (Transfer) ║                                  ║
               ╚═════════════╧═════════════╝                                  ║
```

---

## Participant Roles

### Merchants
Merchants integrate the gateway **once** and accept payments from customers at any participating bank.

- Authenticate with a **merchant API key** (`Authorization: Bearer <key>`)
- Create payment sessions via `POST /payments/initiate`
- Receive outcomes via **signed webhooks** (`X-OpenWave-Signature`)
- Never talk to banks directly — the gateway handles all bank routing

### Banks
Banks expose a **standardised callback interface** to the gateway. The gateway calls the bank's core banking system (CBS) to verify identities, trigger debits, and receive credits.

- Authenticate inbound gateway calls with a **bank API key** (`X-OpenWave-Bank-Key`)
- Implement endpoints: `resolve-alias`, `send-otp`, `verify-otp`, `send-push`, `execute-transaction`, `notify-credit`
- Enroll in **CBL NAD** so customers can receive payments by alias
- Connect to **CBL LyPay** for cross-bank outbound transfers and inbound credit callbacks

### Customers
Customers authenticate using their bank's existing credentials (OTP or push notification). They never create a separate gateway account.

### Third-Party Providers (TPPs)
Fintechs and apps that use **Open Banking** to read account data or initiate payments on behalf of customers, under explicit OAuth 2.0 + PKCE consent.

### Gateway Operators
Any entity running a compliant OpenWave gateway instance. Operators register banks and merchants, configure settlement strategies, and maintain the CBL connections.

---

## Component Architecture

```
┌────────────────────────────── OpenWave Gateway ─────────────────────────────┐
│                                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ Payment Session │  │  Alias Registry  │  │   Open Banking Engine      │  │
│  │ Service         │  │  Service         │  │                            │  │
│  │                 │  │                  │  │  Consent → AISP/PISP       │  │
│  │ initiate()      │  │  register()      │  │  OAuth 2.0 + PKCE          │  │
│  │ resolvePayer()  │  │  resolve()       │  │  SCA challenge             │  │
│  │ selectAuth()    │  │  deactivate()    │  └────────────────────────────┘  │
│  │ confirmOtp()    │  └──────────────────┘                                  │
│  │ confirmPush()   │                        ┌────────────────────────────┐  │
│  │ executeDeduct() │  ┌──────────────────┐  │  Webhook Dispatcher        │  │
│  └────────┬────────┘  │ Settlement       │  │                            │  │
│           │           │ Strategy Service │  │  payment.completed         │  │
│           │           │                  │  │  payment.settlement_pending│  │
│           │           │  SAME_BANK_OR_   │  │  payment.failed            │  │
│  ┌────────▼────────┐  │  LYPAY (default) │  │  mandate.activated         │  │
│  │ Bank Core       │  │                  │  │  settlement.completed      │  │
│  │ Client Factory  │  │  resolve_route() │  │                            │  │
│  │                 │  └──────────────────┘  │  HMAC-SHA256 signature     │  │
│  │  Andalus ───────┤                        │  Retry with backoff        │  │
│  │  NUB     ───────┤  ┌──────────────────┐  └────────────────────────────┘  │
│  │  FCUBS   ───────┤  │  Bank Routing    │                                  │
│  │  (custom)───────┤  │  Service         │  ┌────────────────────────────┐  │
│  └─────────────────┘  │                  │  │  Admin API                 │  │
│                        │  IBAN → bank     │  │                            │  │
│                        │  alias → bank    │  │  Bank CRUD + key rotation  │  │
│                        │  handle lookup   │  │  Merchant CRUD             │  │
│                        └──────────────────┘  │  Settlement strategy config│  │
│                                               │  Webhook retry monitor    │  │
└───────────────────────────────────────────────┴────────────────────────────┘
```

---

## Payment Transaction Routing

The gateway resolves how to settle funds based on a configurable **settlement strategy**. The OpenWave standard defines two routing paths:

### SAME_BANK — Internal Book Transfer

```
Customer (Bank A)                  Bank A CBS                  Merchant (Bank A)
       │                                │                              │
       │── tap Pay ─────────────────────►│                              │
       │                                │                              │
       │                    executeTransaction(route=SAME_BANK)        │
       │                                │── debit + credit ───────────►│
       │                                │   (atomic book transfer)     │
       │                                │◄── confirmed ────────────────│
       │◄── payment.completed ──────────┤                              │
            (webhook)                  │
```

- **Used when:** debtor and merchant are at the same bank
- **Timing:** instant (< 1 second)
- `payment.completed` fires immediately

---

### LYPAY — Cross-Bank via CBL

```
Customer (Bank A)    Gateway       Bank A CBS      CBL LyPay     Bank B CBS    Merchant (Bank B)
       │               │               │               │               │               │
       │─OTP confirm──►│               │               │               │               │
       │               │──executeTransaction            │               │               │
       │               │   (route=LYPAY_INITIATE)──────►│               │               │
       │               │               │──LyPay send──►│               │               │
       │               │               │               │──credit───────►│               │
       │               │               │               │               │──credit───────►│
       │               │◄──credit callback(LyPay)──────────────────────│               │
       │               │                               │               │               │
       │◄──payment.settlement_pending (webhook)                                        │
       │◄──payment.completed (webhook, on credit confirm)                              │
```

- **Used when:** debtor and merchant are at different banks
- **Timing:** 2–10 seconds (CBL LyPay real-time rail)
- **Status flow:** `CONFIRMED_AUTH` → `SETTLEMENT_PENDING` → `CONFIRMED`
- `payment.settlement_pending` fires when debit is confirmed + LyPay instruction submitted
- `payment.completed` fires when CBL confirms credit at the merchant's bank

---

## Payment Session State Machine

```
                      ┌─────────────────────────────────────────┐
                      │           Payment Session                │
                      └─────────────────────────────────────────┘

     [merchant calls POST /payments/initiate]
                      │
                      ▼
                  PENDING ──────────────────────────────────► EXPIRED
                      │              (TTL: 15 min)
     [customer resolves payer, gateway picks auth mode]
                      │
               ┌──────┴──────┐
               ▼             ▼
           OTP_SENT      PUSH_SENT
               │             │
               └──────┬──────┘
     [customer enters OTP / approves push]
                      │
                      ▼
           [executeTransaction called]
                      │
               ┌──────┴──────────────┐
               ▼                     ▼
           CONFIRMED          SETTLEMENT_PENDING   ◄── LYPAY cross-bank only
           (SAME_BANK)             │
               │          [CBL LyPay credit callback]
               │                   │
               └──────┬────────────┘
                      ▼
                  CONFIRMED ──────────────────────► FAILED
              (payment.completed)            (payment.failed)
```

---

## CBL Infrastructure

OpenWave relies on two CBL-operated national systems for cross-bank payments:

### NAD — National Alias Directory

- Operated by: **Central Bank of Libya (CBL)**
- Purpose: Resolve any identifier (NPT alias, phone number, national ID) to a canonical **IBAN + institution code**
- Used by: gateway before any cross-bank LyPay instruction to identify the destination bank
- Banks enroll their customers via the NAD enrollment API

```
Gateway                              CBL NAD
   │                                    │
   │── resolve("mtellesy@andalus") ────►│
   │◄── { iban: "LY83002700...", bank: "andalus" }
```

### LyPay — National Interbank Transfer Rail

- Operated by: **Central Bank of Libya (CBL)**
- Purpose: Move funds from any Libyan bank to any other Libyan bank in real time
- Banks are assigned a **LyPay participant code** by CBL
- Supports: fund transfer initiation, credit callback (webhook to gateway), status query
- Debtor bank is the LyPay originator — not the gateway

```
Bank A (debtor)                       CBL LyPay                 Bank B (creditor)
      │                                    │                            │
      │── LyPay fund transfer ────────────►│                            │
      │   { from: LY83..., to: LY92...,   │                            │
      │     amount, lypay_participant }    │── credit notice ──────────►│
      │                                   │   (credits merchant IBAN)   │
      │                                   │◄── credit confirmed ────────│
      │                                   │── callback to gateway ──────────────►
```

---

## Deployment Topology

### Single-Operator (Centralised)

```
                    ┌──────────────────────────────┐
                    │     OpenWave Gateway          │
                    │     (Neptune Astro)           │
                    │                              │
               ┌────┤  Spring Boot + MySQL + Redis │────┐
               │    └──────────────────────────────┘    │
               │                                        │
        ┌──────▼──────┐                         ┌──────▼──────┐
        │  Bank A CBS │                         │  Bank B CBS │
        │  (Andalus)  │                         │  (NUB, etc) │
        └─────────────┘                         └─────────────┘
               │                                        │
               └────────────────────────────────────────┘
                                    │
                             CBL (NAD + LyPay)
```

All banks and merchants connect to **one shared gateway**. The gateway holds bank API keys, routes all payments, and dispatches webhooks.

---

### Multi-Operator (Federated)

```
  ┌─────────────────────┐          ┌──────────────────────┐
  │  Gateway A (Libya)   │◄────────►│  Gateway B (Regional) │
  │  Banks: Andalus, NUB │  OpenWave│  Banks: Bank X, Y    │
  │  Merchants: A, B, C  │  Standard│  Merchants: D, E     │
  └──────────┬──────────┘          └──────────────────────┘
             │
         CBL NAD + LyPay
```

Multiple independent gateways can **interoperate** because the standard defines the contract. A merchant on Gateway A can accept payments from a customer whose bank is connected to Gateway B — as long as both gateways implement OpenWave.

---

## Technology Reference

| Layer | Technology |
|---|---|
| **Gateway Runtime** | Spring Boot 3, Kotlin, JPA/Hibernate |
| **Database** | MySQL 8 (payment sessions, banks, merchants, aliases) |
| **Cache / Jobs** | Redis (session cache, webhook retry queue) |
| **Bank Comms** | HTTP (WebClient) with bank-specific API keys |
| **CBL Comms** | LyPay REST API, NAD REST API |
| **Webhooks** | HTTPS POST + HMAC-SHA256 signature, exponential backoff |
| **Auth (Merchant)** | `Authorization: Bearer <api_key>` |
| **Auth (Bank)** | `X-OpenWave-Bank-Key: <key>` |
| **Auth (Admin)** | `X-OpenWave-Admin-Key: <key>` |
| **Spec Format** | OpenAPI 3.0.3 YAML |

---

## Security Model

| Concern | Mechanism |
|---|---|
| Merchant API keys | Bcrypt-hashed in DB, bearer token on every request |
| Bank API keys | Rotatable, scoped per bank |
| Webhook authenticity | HMAC-SHA256 over raw body with per-merchant secret |
| Session tokens | Short-lived (15 min TTL), scoped to one payment session |
| OTP delivery | Via bank CBS (not gateway) — gateway never sees OTPs |
| Push auth | Bank-side push notification — gateway only polls confirmation |
| Admin access | Separate admin key; never exposed in OpenWave standard |

---

## How to Implement

→ [Merchant Integration Guide](/guide/merchants)  
→ [Bank Integration Guide](/guide/banks)  
→ [TPP / Open Banking Guide](/guide/tpp)  
→ [Gateway Operators Guide](/guide/operators)  
→ [Settlement & CBL Infrastructure](/guide/settlement)  
→ [Downloads — Spec files, Postman, code gen](/downloads)
