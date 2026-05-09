# Webhooks

Webhooks are the final notification channel for merchants, gateways, banks, and registry participants. Polling is allowed for status screens, but fulfilment should be driven by signed webhook events.

## Event principles

- Events are signed with `X-OpenWave-Signature`.
- Event IDs are globally unique and idempotent.
- Receivers must return `2xx` only after the event is safely persisted.
- Senders must retry transient failures with backoff.
- Webhook payloads include `api_version`, event type, object ID, timestamp, and final or intermediate state.

## Common payment events

| Event | Meaning |
|---|---|
| `payment.created` | Session was created. |
| `payment.auth_required` | Customer SCA is required. |
| `payment.processing` | Bank execution or settlement is underway. |
| `payment.completed` | Payment is final and successful. |
| `payment.failed` | Payment is final and failed. |
| `mandate.approved` | Customer approved a recurring mandate. |
| `mandate.cancelled` | Mandate can no longer be charged. |

## Example event

```json
{
  "id": "evt_01HX7Y0HK4D2H9PBW80KHKV221",
  "api_version": "2026-05-08",
  "type": "payment.completed",
  "created_at": "2026-05-08T22:10:00Z",
  "data": {
    "payment_id": "pay_01HX7R7J3F8H9B5K9K1V1F0A2M",
    "session_id": "ses_01HX7R7JVY5G7K2A2Y65HRJ9NQ",
    "merchant_reference": "NS-10042",
    "amount": 860000,
    "currency": "LYD",
    "status": "COMPLETED"
  }
}
```

## Signature headers

```http
X-OpenWave-Event-Id: evt_01HX7Y0HK4D2H9PBW80KHKV221
X-OpenWave-Timestamp: 1778278200
X-OpenWave-Signature: v1=8b55c2...
```

## Open Banking events

| Event | Meaning |
|---|---|
| `consent.created` | Consent request exists but is not approved. |
| `consent.authorized` | Customer approved the requested scopes. |
| `consent.revoked` | Consent was revoked by customer, bank, TPP, or policy. |
| `payment_order.completed` | PISP order reached a final successful state. |

## Receiver checklist

1. Read the raw request body before JSON parsing.
2. Verify the HMAC signature with the active webhook secret.
3. Reject stale timestamps according to your replay window.
4. Deduplicate by event ID.
5. Persist the event before triggering fulfilment.
6. Return `2xx` only after durable storage succeeds.

## Related guides

- [Webhook guide](../guide/webhooks.md)
- [Merchant integration](../guide/merchants.md)
- [Error codes](../guide/errors.md)
