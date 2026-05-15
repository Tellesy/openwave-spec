# Revolving Credit Flow

Revolving credit in OpenWave covers a drawdown from an existing approved facility. It is not a new facility-origination standard in v1.

## When to use it

Use `REVOLVING_CREDIT_DRAW` when:

- the customer already has an approved credit facility
- the provider can confirm available limit
- the customer is drawing a specific amount for a purchase or transfer
- repayment terms are disclosed before acceptance

## Flow

```mermaid
sequenceDiagram
  autonumber
  participant App as Merchant or finance app
  participant F as Facility provider
  participant C as Customer
  participant Pay as Payments API

  App->>F: Request drawdown offer
  F->>F: Check facility, available limit, and policy
  F-->>C: Show draw amount, cost, repayment rules
  C->>F: Accept drawdown in secure surface
  F->>Pay: Pay merchant or beneficiary
  Pay-->>App: payment.completed webhook
  F-->>C: Updated facility and repayment schedule
```

## Drawdown decision path

```mermaid
flowchart TD
  Request["Customer requests drawdown"] --> Facility{"Existing facility?"}
  Facility -->|No| NotV1["Out of v1 scope: facility origination"]
  Facility -->|Yes| Limit{"Enough available limit?"}
  Limit -->|No| Decline["Decline with safe reason code"]
  Limit -->|Yes| FreshOB{"Fresh affordability needed?"}
  FreshOB -->|Yes| Consent["Request credit-assessment consent"]
  FreshOB -->|No| Offer["Create drawdown offer"]
  Consent --> Assessment["Assessment completed"]
  Assessment --> Offer
  Offer --> Acceptance["Hosted / SDK customer acceptance"]
  Acceptance --> Payment["OpenWave payment to merchant or beneficiary"]
  Payment --> Schedule["Updated repayment schedule"]
```

## Boundary with facility origination

| In v1 | Outside v1 |
|---|---|
| Confirm an existing facility and available limit. | Originate a brand-new credit facility from scratch. |
| Create a drawdown offer. | Define lender underwriting policy. |
| Show cost, repayment rules, and facility impact. | Replace regulated lending disclosures. |
| Settle the drawdown through OpenWave Payments. | Become a separate settlement rail. |

## Required fields

| Field | Description |
|---|---|
| `product_type` | `REVOLVING_CREDIT_DRAW` |
| `facility_id` | Existing facility reference. |
| `amount` | Draw amount in minor units. |
| `finance_cost` | Interest, fees, total payable where determinable. |
| `repayment_schedule_preview` | Minimum payment schedule or fixed drawdown schedule. |

## Consent needs

A fresh Open Banking assessment may be optional if the lender already owns the facility and policy allows facility-only drawdown. If fresh affordability is required, use the same credit-assessment consent flow as BNPL.

## Settlement

The accepted drawdown still settles through the Payments API. The merchant or beneficiary should trust the same final payment states and webhook signatures used by regular OpenWave payments.
