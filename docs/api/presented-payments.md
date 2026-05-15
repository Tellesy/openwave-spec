# Presented Payments API

The Presented Payments API standardizes QR and NFC payment initiation without moving customer authentication into merchant UI. It covers merchant-presented and customer-presented flows for one-time payments and recurring mandate approval.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-presented-payments-v1.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Client tools</a>
</div>

## Deployment model

Presented payments are a **channel capability**, not a gateway-only product feature. The spec can be implemented by:

- OpenWave gateways
- banks directly
- wallets or payment apps directly

Operators decide which channels and modes are enabled in each deployment.

## Main flow

| Step | Endpoint | Caller | Purpose |
|---:|---|---|---|
| 1 | `GET /capabilities` | Merchant, wallet, bank app, gateway | Discover whether QR, NFC, merchant-presented, customer-presented, or mandate approval flows are enabled. |
| 2 | `POST /presentments` | Merchant backend or wallet backend | Create a presentment with amount rules, expiry, mode, intent, and auth requirements. |
| 3 | `POST /presentments/{id}/claim` | Hosted checkout, bank app, secure SDK sheet | Claim the presentment after scan or tap and create the underlying payment or mandate session. |
| 4 | `GET /presentments/{id}/status` | Merchant backend, wallet backend | Poll state when needed until the flow transitions into payment or mandate lifecycle. |
| 5 | existing payment / mandate APIs | Gateway, bank, wallet | Reuse the existing session, SCA, settlement, and webhook model. |

## Example responses

### Read channel capabilities

```json
{
  "operator_id": "andalus-direct",
  "deployment_role": "BANK",
  "presented_payments": {
    "enabled": true,
    "channels_supported": ["QR", "NFC"],
    "modes_supported": ["MERCHANT_PRESENTED", "CUSTOMER_PRESENTED"],
    "intents_supported": ["ONE_TIME_PAYMENT", "MANDATE_APPROVAL"],
    "enablement": {
      "merchant_presented_qr": true,
      "merchant_presented_nfc": true,
      "customer_presented_qr": false,
      "customer_presented_nfc": true,
      "direct_bank_presentment": true,
      "direct_wallet_presentment": false,
      "mandate_approval_presentment": true
    }
  }
}
```

### Create presentment

```json
{
  "presentment_id": "prs_01J15B6A1N2QZ5YP4V4P4FJW40",
  "status": "PENDING_CLAIM",
  "mode": "MERCHANT_PRESENTED",
  "intent": "ONE_TIME_PAYMENT",
  "expires_at": "2026-05-15T19:30:00Z",
  "presentment_payload": {
    "uri": "openwave://present/prs_01J15B6A1N2QZ5YP4V4P4FJW40?sig=abc123",
    "reference": "owp_38d6f0f3cf",
    "channel": "QR"
  },
  "qr_payload": {
    "format": "OPENWAVE_URI",
    "render_hint": "SVG_OR_PNG",
    "value": "openwave://present/prs_01J15B6A1N2QZ5YP4V4P4FJW40?sig=abc123"
  },
  "nfc_payload": {
    "format": "NDEF_URI",
    "value": "openwave://present/prs_01J15B6A1N2QZ5YP4V4P4FJW40?sig=abc123"
  }
}
```

### Claim presentment

```json
{
  "presentment_id": "prs_01J15B6A1N2QZ5YP4V4P4FJW40",
  "status": "CLAIMED",
  "payment_id": "pay_01J15B7M2E95N4ZJ5V7CFK7Y64",
  "session_id": "ses_01J15B7MAB0QSM1VCV2WCH9Y3Q",
  "auth_required": true,
  "auth_surface": {
    "type": "HOSTED_CHECKOUT",
    "url": "https://gateway.example.com/pay/ses_01J15B7MAB0QSM1VCV2WCH9Y3Q"
  }
}
```

### Retry-safe capability-disabled error

```json
{
  "error": {
    "code": "PRESENTED_CHANNEL_DISABLED",
    "message": "Merchant-presented NFC is disabled for this operator.",
    "retryable": false,
    "correlation_id": "corr_01J15B8TCM9DXMZE0M4J3AHF3C"
  }
}
```

## Security model

- QR or NFC only starts the flow. It does not authorize the payment by itself.
- Merchants must not collect OTP, PIN, passcode, or push-approval results.
- Wallet and bank apps may initiate the scan or tap flow, but final authorization must remain in a bank-controlled or OpenWave-controlled secure surface.
- Each presentment must be time-bound, replay-protected, and idempotent.

## Related guides

- [Presented payments overview](../guide/presented-payments.md)
- [QR payloads](../guide/presented-qr.md)
- [NFC handoff](../guide/presented-nfc.md)
- [Direct bank and wallet implementation](../guide/presented-direct.md)
