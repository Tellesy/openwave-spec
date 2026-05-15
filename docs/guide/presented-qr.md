# QR Payloads

OpenWave QR payloads should carry a **signed OpenWave URI or presentment reference**, not bank secrets and not raw authorization data.

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
