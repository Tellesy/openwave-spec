# QR Payloads

OpenWave QR payloads should carry a **signed OpenWave URI or presentment reference**, not bank secrets and not raw authorization data.

## QR design goal

The QR must be portable across operators and easy for banks or wallets to understand, while still forcing the real authorization to happen later in a secure surface.

## Payload rules

- Must identify the presentment
- Must identify the operator or issuer
- Must carry expiry
- Must be replay-protected
- Must indicate whether the amount is fixed or open
- Must indicate whether the flow is `ONE_TIME_PAYMENT` or `MANDATE_APPROVAL`

## Recommended QR contents

```text
openwave://present/prs_01J15B6A1N2QZ5YP4V4P4FJW40?sig=abc123
```

The scanner resolves the URI to a presentment resource and continues from there.

## Recommended payload fields

| Field | Why it exists |
|---|---|
| `presentment_id` or signed reference | Uniquely identifies the presentment |
| `operator_id` | Tells the scanner where the presentment belongs |
| `intent` | Distinguishes one-time payment from mandate approval |
| `mode` | Distinguishes merchant-presented from customer-presented |
| `amount_mode` | Tells the scanner whether amount is fixed or open |
| `expires_at` | Prevents stale QR reuse |
| `sig` | Protects integrity and replay safety |

## Example merchant-presented QR object

```json
{
  "format": "OPENWAVE_URI",
  "value": "openwave://present/prs_01J15B6A1N2QZ5YP4V4P4FJW40?sig=abc123",
  "intent": "ONE_TIME_PAYMENT",
  "mode": "MERCHANT_PRESENTED",
  "amount_mode": "FIXED",
  "amount": 860000,
  "currency": "LYD",
  "expires_at": "2026-05-15T19:30:00Z"
}
```

## Example recurring mandate approval QR object

```json
{
  "format": "OPENWAVE_URI",
  "value": "openwave://present/prs_01J15MANDATE94T7?sig=def456",
  "intent": "MANDATE_APPROVAL",
  "mode": "MERCHANT_PRESENTED",
  "amount_mode": "FIXED",
  "amount": 10000,
  "currency": "LYD",
  "recurrence": {
    "frequency": "MONTHLY",
    "end_date": "2027-05-15"
  },
  "expires_at": "2026-05-15T19:30:00Z"
}
```

## Merchant-presented QR

Merchant-presented QR is appropriate for:

- online bill pages
- in-store screens
- printed invoices
- subscription signup flows that lead into hosted mandate approval

## Customer-presented QR

Customer-presented QR is appropriate for:

- wallet or bank app “pay merchant” tokens
- low-friction merchant acceptance where the customer starts from their own app

## Interoperability note

The QR payload format is **OpenWave-native**. Gateways, banks, and wallets can all implement it directly as long as they honor capability discovery and security requirements.

## Validation checklist for scanners

1. Parse the URI format.
2. Check expiry.
3. Check operator or issuer trust.
4. Refuse presentments that require unsupported modes or intents.
5. Claim the presentment over the network before showing success to the customer.

## Security notes

- A QR code must never embed customer OTP or approval proof.
- Operators should sign or tokenize the payload so tampering is detectable.
- Printed or cached QR codes should expire quickly when tied to a fixed amount.
