# API Overview

OpenWave is defined by three OpenAPI 3.0.3 specification files. All are ready to load into Swagger UI, Postman, Redocly, or any OpenAPI-compatible tool.

## Spec Files

| File | Covers | Download |
|:---|:---|:---|
| `openwave-payments-v1.yaml` | Payments · Recurring · Alias · Webhooks | [View](https://github.com/Tellesy/openwave-spec/blob/main/openwave-payments-v1.yaml) |
| `openwave-open-banking-v1.0.yaml` | AISP · PISP · OAuth 2.0 + PKCE Consent | [View](https://github.com/Tellesy/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml) |
| `openwave-identity-v1.0.yaml` | NPT Identity · Multi-bank Alias · Bank Phonebook | [View](https://github.com/Tellesy/openwave-spec/blob/main/openwave-identity-v1.0.yaml) |

## Interactive Explorer

[▶ Open API Explorer →](/api/explorer)

Browse and test the full API surface in your browser.

## API Modules

### Payments (`openwave-payments-v1.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/payments/sessions` | Create a payment session |
| `GET` | `/payments/sessions/{id}` | Get session status |
| `GET` | `/payments/sessions` | List sessions |
| `POST` | `/payments/sessions/{id}/cancel` | Cancel a pending session |

### Recurring Payments

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/recurring/mandates` | Create a recurring mandate |
| `GET` | `/recurring/mandates/{id}` | Get mandate details |
| `DELETE` | `/recurring/mandates/{id}` | Cancel a mandate |
| `POST` | `/recurring/mandates/{id}/charge` | Execute a charge |

### Alias (NPT)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/alias/{username}` | Get alias details |
| `GET` | `/alias/{username}/accounts` | List linked accounts |
| `DELETE` | `/alias/{username}` | Deactivate alias |

### Webhooks

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/merchants/{id}/webhooks` | Register webhook endpoint |
| `GET` | `/merchants/{id}/webhooks` | List webhook endpoints |
| `DELETE` | `/merchants/{id}/webhooks/{wid}` | Remove endpoint |
| `GET` | `/admin/webhooks` | List all deliveries (admin) |
| `POST` | `/admin/webhooks/{id}/retry` | Retry failed delivery |

### Open Banking (`openwave-open-banking-v1.0.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `POST` | `/ob/consents` | Create a consent request |
| `GET` | `/ob/consents/{id}` | Get consent status |
| `DELETE` | `/ob/consents/{id}` | Revoke consent |
| `POST` | `/ob/token` | Exchange code or refresh token |
| `POST` | `/ob/token/revoke` | Revoke a token (RFC 7009) |
| `GET` | `/ob/accounts` | List consented accounts |
| `GET` | `/ob/accounts/{id}/balances` | Get account balances |
| `GET` | `/ob/accounts/{id}/transactions` | Get transactions |
| `POST` | `/ob/payment-orders` | Initiate a payment order |
| `GET` | `/ob/payment-orders/{id}` | Get payment order status |
| `GET` | `/banks/{handle}/capabilities` | Bank OB capabilities |

### Identity Registry (`openwave-identity-v1.0.yaml`)

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/v1/identity/resolve` | Resolve alias → IBAN (public) |
| `POST` | `/v1/identity/claim` | Claim an NPT handle |
| `GET` | `/v1/identity/{handle}` | Get public profile |
| `GET` | `/v1/identity/{handle}/accounts` | List linked accounts |
| `POST` | `/v1/identity/{handle}/accounts` | Link additional bank |
| `PATCH` | `/v1/identity/{handle}/default` | Set default account |
| `DELETE` | `/v1/identity/{handle}` | Delete identity |
| `GET` | `/v1/banks` | Bank phonebook (public) |
| `POST` | `/v1/banks` | Register bank (admin) |
| `GET` | `/v1/registry/info` | Registry metadata (public) |

## Base URL

```
https://<your-gateway-host>/api/v1
```

The exact base URL depends on your gateway operator. Neptune Fintech's Astro gateway:

```
https://astro.neptune.ly/api/v1
```
