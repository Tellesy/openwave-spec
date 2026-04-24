# OpenWave Spec — Agent Context & Continuation Guide

> **For AI agents:** Read this before editing any spec or docs in this project.
> Master ecosystem map: `/Users/mtellesy/GitHub/nexus.mw/AGENT_CONTEXT.md`
> Last updated: April 2026

---

## What is this project?

**openwave-spec** is the open standard that defines the unified API surface for payments and open banking across the Libyan banking ecosystem. It contains:

1. **OpenAPI 3.0.3 spec files** — machine-readable, used by all implementations
2. **VitePress docs site** — published to GitHub Pages

**Path:** `/Users/mtellesy/GitHub/openwave-spec`  
**GitHub Pages:** `https://openwave-standard.github.io/openwave-spec/`  
**Build:** `npm run docs:build` (must pass before every commit)  
**Dev server:** `npm run docs:dev`  
**Deploy:** Push to `main` → GitHub Actions → GitHub Pages (`.github/workflows/deploy-docs.yml`)

---

## Related Projects

| Project | Path | Relationship |
|---|---|---|
| **neptune-astro** | `/Users/mtellesy/GitHub/neptune-astro` | Commercial gateway implementing this standard |
| **openwave-identity** | `/Users/mtellesy/GitHub/openwave-identity` | Identity Registry implementing `openwave-identity-v1.0.yaml` |
| **nexus.mw** | `/Users/mtellesy/GitHub/nexus.mw` | Bank middleware (banks implement the bank callback interface) |
| **andalus** | `/Users/mtellesy/GitHub/ethaq/andalus` | Andalus Bank backend (implements bank core callbacks) |

---

## Spec Files

| File | Covers | Version |
|---|---|---|
| `openwave-payments-v1.yaml` | Payments, mandates, NPT alias, webhooks, bank callbacks, settlement | 1.0.0 |
| `openwave-open-banking-v1.0.yaml` | OAuth 2.0 + PKCE consent, AISP, PISP, SCA | 1.0.0 |
| `openwave-identity-v1.0.yaml` | NPT handle ownership, multi-bank accounts, governance, bank directory | 1.0.0 |

---

## Docs Site Structure

```
docs/
├── .vitepress/
│   ├── config.ts         # Nav, sidebar, outline, lastUpdated, search
│   └── theme/
│       ├── index.ts      # Theme entry
│       └── custom.css    # Brand tokens, stats bar, module/download card styles
├── index.md              # Home page — hero (4 actions), stats bar, module cards, flow diagram, download section
├── downloads.md          # Full downloads hub (YAML downloads, Postman, Swagger, code gen in 6 languages)
├── spec.md               # Raw spec file links + versioning table
├── guide/
│   ├── introduction.md   # What is OpenWave?
│   ├── concepts.md       # Core concepts
│   ├── npt.md            # National Payment Tag
│   ├── architecture.md   # System architecture + topology diagrams ← NEW
│   ├── merchants.md      # Merchant integration guide
│   ├── banks.md          # Bank integration guide
│   ├── tpp.md            # TPP / Open Banking guide
│   ├── operators.md      # Gateway operator guide
│   ├── authentication.md # Auth mechanisms
│   ├── webhooks.md       # Webhook events + verification
│   ├── errors.md         # Error codes
│   ├── amounts.md        # Minor unit convention
│   └── settlement.md     # CBL infrastructure, settlement paths, SETTLEMENT_PENDING
└── api/
    ├── overview.md       # API overview
    └── explorer.md       # Interactive Swagger UI embed
```

---

## Key Schema Changes (April 2026)

The following were added to `openwave-payments-v1.yaml` to align with neptune-astro's unified routing implementation:

### New enum: `SettlementType`
```yaml
SettlementType:
  enum: [SAME_BANK, LYPAY]
```

### Updated enum: `PaymentStatus`
Added `SETTLEMENT_PENDING` — debit confirmed at debtor bank; LyPay transfer in-flight.

### Updated schema: `PaymentStatusResponse`
Added fields: `settlement_type`, `lypay_ref`, `creditor_bank_handle`, `settlement_pending_at`

### Updated schema: `RegisterBankRequest`
Added field: `lypay_participant_code` — CBL LyPay participant code, required for creditor banks in cross-bank settlement.

### New webhook event: `payment.settlement_pending`
Cross-bank (LYPAY) only. Fires when debit confirmed + LyPay instruction submitted. Precedes `payment.completed`.

---

## CSS Custom Classes (custom.css)

The docs site uses these utility classes in markdown via raw HTML:

| Class | Usage |
|---|---|
| `.ow-stats-bar` | Full-width stats strip on home page |
| `.ow-stat`, `.ow-stat-num`, `.ow-stat-label`, `.ow-stat-div` | Individual stat items |
| `.ow-section` | Content section wrapper (max-width: 860px centered) |
| `.ow-modules-grid`, `.ow-module-card` | 3-column feature module cards |
| `.ow-module-icon`, `.ow-module-title`, `.ow-module-spec` | Card sub-elements |
| `.ow-downloads-section`, `.ow-download-grid`, `.ow-download-card` | Download cards section |
| `.ow-dl-icon`, `.ow-dl-title`, `.ow-dl-sub`, `.ow-dl-links` | Download card sub-elements |
| `.ow-dl-btn` | Solid purple download button |
| `.ow-dl-btn-ghost` | Ghost outlined button |
| `.ow-dl-row` | Inline flex row of download buttons (used in downloads.md) |

---

## Critical Rules for Agents

1. **Never mention `ASTRO_INTERNAL_SETTLEMENT`** in the spec or docs — it is Astro's internal option, not part of the OpenWave standard
2. **Settlement types exposed in spec:** `SAME_BANK` and `LYPAY` only
3. **Routing options exposed in spec:** `SAME_BANK` (internal CBS) and `LYPAY` (CBL LyPay) only
4. **Always run `npm run docs:build` before committing** — build must be clean
5. **`lastUpdated: true` is set** — requires `fetch-depth: 0` in GitHub Actions (already configured)
6. **Versioning:** Breaking endpoint changes = MAJOR; new optional fields = MINOR; fixes = PATCH

---

## Pending / Next Steps

- Add Postman Collection JSON files to the repo for one-click import (currently import-by-URL only)
- Add an OG preview image (`public/og-preview.png`) for social media cards (referenced in `config.ts` meta)
- Expand `api/payments.md`, `api/alias.md`, `api/open-banking.md`, `api/identity.md`, `api/webhooks.md` with inline schema docs
- Consider adding a Redocly-based interactive reference page
