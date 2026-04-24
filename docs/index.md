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
      text: Downloads
      link: /downloads
    - theme: alt
      text: Architecture
      link: /guide/architecture

features:
  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
    title: For Merchants
    details: Integrate once. Accept payments from any participating bank via IBAN or NPT alias. No per-bank integrations, no separate agreements — one API key to rule them all.
    link: /guide/merchants
    linkText: Merchant Integration Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
    title: For Banks
    details: Join the OpenWave network. Expose a standardised callback interface and your customers can instantly pay any merchant in the ecosystem — from any bank.
    link: /guide/banks
    linkText: Bank Integration Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    title: For TPPs & Fintechs
    details: Read account data and initiate payments on behalf of customers under explicit OAuth 2.0 + PKCE consent. PSD2-inspired, built for emerging market realities.
    link: /guide/tpp
    linkText: Open Banking (TPP) Guide

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    title: NPT — National Payment Tag
    details: "`mtellesy@andalus` — one username, any bank. Pay by alias without knowing an IBAN. The universal payment identity layer for Libya and beyond."
    link: /guide/npt
    linkText: Learn about NPT

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>'
    title: Gateway-Agnostic & Federated
    details: Any operator can run a compliant gateway. Multiple gateways interoperate automatically because the standard is the contract — not the operator.
    link: /guide/operators
    linkText: Run a Gateway

  - icon:
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
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
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
  <div class="ow-module-title">Payments Module</div>
  <div class="ow-module-spec"><a href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-payments-v1.yaml">openwave-payments-v1.yaml</a></div>
  <ul>
    <li>Payment sessions (IBAN + NPT alias)</li>
    <li>OTP &amp; push notification auth</li>
    <li>Recurring mandates</li>
    <li>Same-bank &amp; LyPay cross-bank routing</li>
    <li>Settlement status &amp; webhook events</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
  <div class="ow-module-title">Open Banking Module</div>
  <div class="ow-module-spec"><a href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">openwave-open-banking-v1.0.yaml</a></div>
  <ul>
    <li>OAuth 2.0 + PKCE consent flow</li>
    <li>AISP: accounts, balances, transactions</li>
    <li>PISP: payment initiation by TPPs</li>
    <li>SCA (Strong Customer Authentication)</li>
    <li>Bank capability advertisement</li>
  </ul>
</div>

<div class="ow-module-card">
  <div class="ow-module-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M8 10h.01M8 14h.01M12 10h4M12 14h4"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="8" cy="14" r="1" fill="currentColor"/></svg></div>
  <div class="ow-module-title">Identity Registry</div>
  <div class="ow-module-spec"><a href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-identity-v1.0.yaml">openwave-identity-v1.0.yaml</a></div>
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

## Downloads

<div class="ow-download-grid">

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Payments OpenAPI</div>
  <div class="ow-dl-sub">openwave-payments-v1.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-payments-v1.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Open Banking OpenAPI</div>
  <div class="ow-dl-sub">openwave-open-banking-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">View on GitHub</a>
  </div>
</div>

<div class="ow-download-card">
  <div class="ow-dl-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
  <div class="ow-dl-title">Identity Registry OpenAPI</div>
  <div class="ow-dl-sub">openwave-identity-v1.0.yaml</div>
  <div class="ow-dl-links">
    <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
    <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-identity-v1.0.yaml">View on GitHub</a>
  </div>
</div>

</div>

<div style="text-align:center;margin-top:1.5rem">

[→ Full downloads page with Postman collections, code generation, and Swagger links](/downloads)

</div>

</div>
