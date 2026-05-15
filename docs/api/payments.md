# Payments API

The Payments API is the merchant-facing payment contract. It covers one-time checkout, NPT or IBAN payer resolution, customer authorization, bank execution, recurring mandates, and merchant webhooks.

If your flow starts with a QR code, NFC handoff, or customer-presented token, read [Presented Payments](./presented-payments.md) first. That spec creates or claims the session, then hands control back to the same payment and mandate lifecycle described on this page.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-payments-v1.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Client tools</a>
</div>

## Main payment flow

| Step | Endpoint | Caller | Purpose |
|---:|---|---|---|
| 1 | `POST /payments/initiate` | Merchant backend | Create a payment session with amount, currency, merchant order reference, callback URL, and return URL. |
| 2 | `POST /session/{id}/resolve-payer` | Hosted checkout / SDK | Resolve an NPT alias or IBAN to the debtor bank and masked customer details. |
| 3 | `POST /session/{id}/select-auth` | Hosted checkout / SDK | Choose OTP or push authorization when multiple methods are available. |
| 4 | `POST /session/{id}/confirm-otp` | Hosted checkout / SDK | Confirm the customer OTP collected by the secure gateway surface. |
| 5 | `GET /payments/{id}/status` | Merchant backend | Poll status when needed. Webhooks remain the final source for fulfilment. |

## Example responses

### Create payment session

```json
{
  "payment_id": "pay_01HX7R7J3F8H9B5K9K1V1F0A2M",
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "status": "PENDING",
  "amount": 860000,
  "currency": "LYD",
  "checkout_url": "https://gateway.example.com/pay/ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "expires_at": "2026-05-08T22:30:00Z",
  "idempotency_key": "order-NS-10042"
}
```

### Resolve payer

```json
{
  "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
  "payer": {
    "alias": "tellesy@andalus",
    "bank_id": "andalus",
    "bank_name": "Andalus Bank",
    "display_name": "M*** T******",
    "masked_iban": "LY83*****************2345",
    "available_auth_methods": ["OTP", "PUSH"]
  },
  "status": "AUTH_REQUIRED"
}
```

### Completed status

```json
{
  "payment_id": "pay_01HX7R7J3F8H9B5K9K1V1F0A2M",
  "status": "COMPLETED",
  "amount": 860000,
  "currency": "LYD",
  "route": {
    "type": "INTERBANK",
    "rail": "LYPAY",
    "debtor_bank": "andalus",
    "creditor_bank": "merchant-bank"
  },
  "fees": {
    "gateway_fee": 1200,
    "bank_fee": 0,
    "settlement_fee": 0
  },
  "completed_at": "2026-05-08T22:04:13Z"
}
```

### Retry-safe error

```json
{
  "error": {
    "code": "PAYER_ACCOUNT_DEBIT_BLOCKED",
    "message": "The selected account cannot be used for debit.",
    "retryable": false,
    "correlation_id": "corr_01HX7R91M3QX5R7N3P5W6YB0YA"
  }
}
```

## Standard statuses

| Status | Meaning | Merchant action |
|---|---|---|
| `PENDING` | Session created, customer has not completed authorization. | Keep order open. |
| `AUTH_REQUIRED` | Gateway is waiting for OTP or push approval. | Show hosted authorization state only. |
| `PROCESSING` | Bank execution or settlement is in progress. | Do not fulfil yet. |
| `COMPLETED` | Final successful payment state. | Fulfil after webhook signature verification. |
| `FAILED` | Final failed state. | Show a recoverable message when possible. |
| `CANCELLED` | Customer or merchant cancelled the session. | Close order gracefully. |

## Bank callback endpoints

Gateway-to-bank calls use `X-OpenWave-Internal-Key: ow_cbk_...`. These endpoints are implemented by bank middleware, not by merchants:

| Endpoint | Purpose |
|---|---|
| `POST /bank/callback/send-otp` | Ask the bank to send OTP to the customer. |
| `POST /bank/callback/verify-otp` | Verify the OTP with the bank. |
| `POST /bank/callback/send-push` | Start bank push authorization when supported. |
| `POST /bank/callback/execute-transaction` | Execute debit and route credit through the configured rail. |
| `POST /bank/callback/notify-credit` | Notify receiving bank or merchant bank that credit has arrived. |

## Recurring mandates

Recurring mandates use the same security model as payments: the customer must approve the mandate in a hosted, scoped consent screen before recurring charges can be made.

| Endpoint | Purpose |
|---|---|
| `POST /mandates/create` | Create a mandate request with amount rules, frequency, expiry, and merchant reference. |
| `GET /mandates/{id}` | Read mandate state. |
| `POST /mandates/{id}/charge` | Charge an active mandate within its approved limits. |
| `POST /mandates/{id}/cancel` | Cancel the mandate and stop future charges. |

### Mandate approval response

```json
{
  "mandate_id": "mnd_01HX7V10K3QVYRW9P9Z1SK5P8B",
  "status": "AWAITING_CUSTOMER_AUTH",
  "approval_url": "https://gateway.example.com/mandate/mnd_01HX7V10K3QVYRW9P9Z1SK5P8B/consent",
  "amount": 10000,
  "currency": "LYD",
  "frequency": "MONTHLY",
  "merchant_reference": "care-plus-monthly",
  "expires_at": "2027-05-08T00:00:00Z"
}
```

## Related guides

- [Merchant integration](../guide/merchants.md)
- [Presented payments](../guide/presented-payments.md)
- [Authentication](../guide/authentication.md)
- [Webhooks](../guide/webhooks.md)
- [Settlement](../guide/settlement.md)
