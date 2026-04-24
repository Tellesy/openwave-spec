---
layout: home

hero:
  name: "OpenWave"
  text: "Open Payment & Open Banking Standard"
  tagline: "Bank-agnostic. Interoperable. Built for emerging markets. One standard — any bank, any gateway, any fintech."
  image:
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="58" stroke="#7c3aed" stroke-width="3"/><circle cx="60" cy="60" r="42" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/><circle cx="60" cy="60" r="25" stroke="#06b6d4" stroke-width="1.5" opacity="0.5"/><path d="M28 72 Q44 38 60 58 Q76 78 92 44" stroke="#7c3aed" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="58" r="5" fill="#7c3aed"/><circle cx="28" cy="72" r="5" fill="#a78bfa"/><circle cx="92" cy="44" r="5" fill="#06b6d4"/><line x1="28" y1="72" x2="60" y2="58" stroke="#a78bfa" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/><line x1="60" y1="58" x2="92" y2="44" stroke="#06b6d4" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/></svg>'
    alt: OpenWave Logo
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/introduction
    - theme: alt
      text: API Reference
      link: /api/overview
    - theme: alt
      text: ⬇ Downloads
      link: /downloads
    - theme: alt
      text: Architecture
      link: /guide/architecture

features:
  - icon: 🏪
    title: For Merchants
    details: Integrate once. Accept payments from any participating bank via IBAN or NPT alias. No per-bank integrations, no separate agreements — one API key to rule them all.
    link: /guide/merchants
    linkText: Merchant Integration Guide

  - icon: 🏦
    title: For Banks
    details: Join the OpenWave network. Expose a standardised callback interface and your customers can instantly pay any merchant in the ecosystem — from any bank.
    link: /guide/banks
    linkText: Bank Integration Guide

  - icon: 🔗
    title: For TPPs & Fintechs
    details: Read account data and initiate payments on behalf of customers under explicit OAuth 2.0 + PKCE consent. PSD2-inspired, built for emerging market realities.
    link: /guide/tpp
    linkText: Open Banking (TPP) Guide

  - icon: ⚡
    title: NPT — National Payment Tag
    details: "`mtellesy@andalus` — one username, any bank. Pay by alias without knowing an IBAN. The universal payment identity layer for Libya and beyond."
    link: /guide/npt
    linkText: Learn about NPT

  - icon: 🌐
    title: Gateway-Agnostic & Federated
    details: Any operator can run a compliant gateway. Multiple gateways interoperate automatically because the standard is the contract — not the operator.
    link: /guide/operators
    linkText: Run a Gateway

  - icon: ⬇️
    title: Ready to Use
    details: Three OpenAPI 3.0 spec files, Postman collections, and code generation templates. Import to Swagger, Postman, or Redocly in seconds.
    link: /downloads
    linkText: Download Specs & Collections
---

<div class="ow-stats-bar">
  <div class="ow-stat"><span class="ow-stat-num">3</span><span class="ow-stat-label">OpenAPI Spec Files</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">60+</span><span class="ow-stat-label">API Endpoints</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">4</span><span class="ow-stat-label">Integration Roles</span></div>
  <div class="ow-stat-div"></div>
  <div class="ow-stat"><span class="ow-stat-num">Apache 2.0</span><span class="ow-stat-label">Open License</span></div>
</div>

---

<div class="ow-section">

## What is OpenWave?

OpenWave is an **open API standard** for payments and open banking. It defines a unified contract so any bank, merchant, fintech, or gateway operator can plug into a single interoperable payment network — without bilateral agreements between every participant.

**Libya's problem:** Customers are locked to their bank's app. Merchants integrate with each bank separately. There is no shared payment identity layer. Money can't move freely.

**OpenWave's solution:** One standard that every participant implements. A bank integrates once and every merchant on any compliant gateway can accept payments from its customers.

</div>

<div class="ow-modules-grid">

<div class="ow-module-card">
  <div class="ow-module-icon">💳</div>
  <div class="ow-module-title">Payments Module</div>
  <div class="ow-module-spec"><a href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-payments-v1.yaml">openwave-payments-v1.yaml</a></div>
  <ul>
    <li>Payment sessions (IBAN + NPT alias)</li>
    <li>OTP &amp; push notification auth</li>
    <li>Recurring mandates</li>
    <li>Same-bank &amp; LyPay cross-bank routing</li>
    <li>Settlement status &amp; webhook events</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon">🏛️</div>
  <div class="ow-module-title">Open Banking Module</div>
  <div class="ow-module-spec"><a href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">openwave-open-banking-v1.0.yaml</a></div>
  <ul>
    <li>OAuth 2.0 + PKCE consent flow</li>
    <li>AISP: accounts, balances, transactions</li>
    <li>PISP: payment initiation by TPPs</li>
    <li>SCA (Strong Customer Authentication)</li>
    <li>Bank capability advertisement</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon">🪪</div>
  <div class="ow-module-title">Identity Registry</div>
  <div class="ow-module-spec"><a href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-identity-v1.0.yaml">openwave-identity-v1.0.yaml</a></div>
  <ul>
    <li>NPT handle ownership &amp; governance</li>
    <li>Multi-bank account linking</li>
    <li>Public alias resolution</li>
    <li>Bank phonebook &amp; directory</li>
    <li>Cross-gateway handle federation</li>
  </ul>
</div>

</div>

---

<div class="ow-section">

## Payment Flow at a Glance

```
Merchant           OpenWave Gateway        Debtor Bank (CBS)     CBL LyPay     Merchant Bank
   │                      │                       │                  │               │
   │── POST /payments ────►│                       │                  │               │
   │   /initiate          │                       │                  │               │
   │◄── { payment_url } ──│                       │                  │               │
   │                       │                       │                  │               │
   │  [Customer opens checkout URL]                │                  │               │
   │                       │── resolve alias ─────►│                  │               │
   │                       │── send OTP ──────────►│                  │               │
   │                       │◄── OTP verified ──────│                  │               │
   │                       │                       │                  │               │
   │          ┌────────────────────────────────────────────────────────────────────┐  │
   │          │  SAME_BANK: internal CBS book transfer (instant)                   │  │
   │          │  LYPAY:  debit at debtor CBS → LyPay instruction → credit at      │  │
   │          │          merchant bank (2–10 seconds)                              │  │
   │          └────────────────────────────────────────────────────────────────────┘  │
   │                       │◄── credit confirmed ──────────────────────────────────── │
   │◄── payment.completed ─│                       │                  │               │
   │    webhook            │                       │                  │               │
```

→ [Full settlement docs](/guide/settlement) | [Architecture overview](/guide/architecture)

</div>

---

<div class="ow-downloads-section">

## ⬇ Downloads

<div class="ow-download-grid">

<div class="ow-download-card">
  <div class="ow-dl-icon">📄</div>
  <div class="ow-dl-title">Payments OpenAPI</div>
  <div class="ow-dl-sub">openwave-payments-v1.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-payments-v1.yaml" download>⬇ Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-payments-v1.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon">📄</div>
  <div class="ow-dl-title">Open Banking OpenAPI</div>
  <div class="ow-dl-sub">openwave-open-banking-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>⬇ Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon">📄</div>
  <div class="ow-dl-title">Identity Registry OpenAPI</div>
  <div class="ow-dl-sub">openwave-identity-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/openwave-standard/openwave-spec/main/openwave-identity-v1.0.yaml" download>⬇ Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/openwave-standard/openwave-spec/blob/main/openwave-identity-v1.0.yaml">View on GitHub</a>
  </div>
</div>

</div>

<div style="text-align:center;margin-top:1.5rem">

[→ Full downloads page with Postman collections, code generation, and Swagger links](/downloads)

</div>

</div>
