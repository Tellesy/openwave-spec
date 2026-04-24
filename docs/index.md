---
layout: home

hero:
  name: "OpenWave"
  text: "Open Payment & Open Banking Standard"
  tagline: "Bank-agnostic. Interoperable. Built for emerging markets."
  image:
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="58" stroke="#7c3aed" stroke-width="4"/><path d="M30 75 Q45 40 60 60 Q75 80 90 45" stroke="#7c3aed" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="60" cy="60" r="6" fill="#7c3aed"/><circle cx="30" cy="75" r="4" fill="#a78bfa"/><circle cx="90" cy="45" r="4" fill="#a78bfa"/></svg>'
    alt: OpenWave Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/introduction
    - theme: alt
      text: API Reference
      link: /api/overview
    - theme: alt
      text: View on GitHub
      link: https://github.com/openwave-standard/openwave-spec

features:
  - icon: 🏪
    title: For Merchants
    details: Integrate once. Accept payments from any participating bank via IBAN or NPT alias. No per-bank integrations needed.
    link: /guide/merchants
    linkText: Merchant Guide

  - icon: 🏦
    title: For Banks
    details: Join the network as a payment partner. Expose a standardised interface and let your customers pay anywhere in the ecosystem.
    link: /guide/banks
    linkText: Bank Integration Guide

  - icon: 🔗
    title: For TPPs
    details: Access account data and initiate payments on behalf of customers, with explicit consent. PSD2-inspired, emerging-market ready.
    link: /guide/tpp
    linkText: Open Banking Guide

  - icon: ⚡
    title: NPT — National Payment Tag
    details: One username, any bank. Send money to `mtellesy` without knowing their IBAN. The payment identity layer for Libya and beyond.
    link: /guide/npt
    linkText: Learn about NPT

  - icon: 🌐
    title: Gateway-Agnostic
    details: Any operator can run a compliant gateway. Multiple gateways interoperate because the standard is the contract, not the operator.
    link: /guide/operators
    linkText: Run Your Own Gateway

  - icon: 📖
    title: Open Spec
    details: Three OpenAPI 3.0 spec files cover Payments, Open Banking, and Identity. Load them in Swagger, Postman, or Redocly instantly.
    link: /spec
    linkText: Browse Spec Files
---

<div style="text-align:center;padding:3rem 1rem 2rem;max-width:680px;margin:0 auto">

## What is OpenWave?

OpenWave is an **open standard** that defines a unified API surface for payments and open banking.

Libya's banking sector has historically lacked interoperability — customers are locked to their bank's app, merchants integrate with each bank separately, and there is no shared payment identity layer. **OpenWave solves this.**

Any bank, any fintech, any gateway — one standard.

</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem;max-width:900px;margin:0 auto 3rem;padding:0 1rem">

<div style="background:var(--vp-c-bg-soft);border-radius:12px;padding:1.5rem;border:1px solid var(--vp-c-border)">

**Payments Module**
- Online payment sessions
- IBAN and NPT alias routing
- Recurring mandates
- Webhook events

</div>

<div style="background:var(--vp-c-bg-soft);border-radius:12px;padding:1.5rem;border:1px solid var(--vp-c-border)">

**Open Banking Module**
- OAuth 2.0 + PKCE consent
- AISP: accounts, balances, transactions
- PISP: payment initiation
- SCA support

</div>

<div style="background:var(--vp-c-bg-soft);border-radius:12px;padding:1.5rem;border:1px solid var(--vp-c-border)">

**Identity Registry**
- Global NPT handle ownership
- Multi-bank account linking
- Public alias resolution
- Bank phonebook

</div>

</div>
