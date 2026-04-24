# TPP — Open Banking Guide

Build apps that access customer bank data or initiate payments on their behalf, with **explicit, revocable consent**. No scraping. No shared passwords.

## Overview

```
TPP creates consent     →  bank redirects customer to approve
Customer approves       →  you exchange code for tokens
Access data or pay      →  all calls carry the access token + consent ID
Customer revokes        →  all tokens instantly invalidated
```

This is the **Authorization Code + PKCE** flow — same as OAuth 2.0 / PSD2, adapted for OpenWave.

## Step 1 — Check Bank Capabilities

Before building a consent flow, check what the target bank actually supports:

```http
GET /banks/{handle}/capabilities
```

```json
{
  "bank_handle": "andalus",
  "ob_enabled": true,
  "ob_scopes_supported": ["accounts:read", "balances:read", "transactions:read", "payments:write"],
  "sca_exemption_limit": 5000,
  "max_consent_expiry_days": 365
}
```

## Step 2 — Create a Consent

```http
POST /ob/consents
Authorization: Bearer <tpp_access_token>
Content-Type: application/json

{
  "bank_handle": "andalus",
  "scopes": ["accounts:read", "balances:read", "transactions:read"],
  "redirect_uri": "https://myapp.com/callback",
  "state": "random_csrf_string",
  "code_challenge": "<S256_code_challenge>",
  "code_challenge_method": "S256",
  "expiry_days": 90
}
```

Response:
```json
{
  "consent_id": "con_01HZGV...",
  "consent_url": "https://gateway.example.com/ob/auth/con_01HZGV...",
  "expires_at": "2026-07-24T00:00:00Z"
}
```

::: warning PKCE is mandatory
`code_challenge_method: "plain"` is rejected. Always use `S256`.
:::

## Step 3 — Redirect Customer to Consent URL

Send the customer to `consent_url`. The gateway shows them what access they're granting (the bank handles authentication).

On approval, the bank redirects to your `redirect_uri`:
```
https://myapp.com/callback
  ?code=AUTH_CODE_HERE
  &consent_id=con_01HZGV...
  &state=random_csrf_string
```

Verify `state` matches what you sent. Never skip this — it prevents CSRF.

## Step 4 — Exchange Code for Tokens

```http
POST /ob/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE_HERE
&redirect_uri=https://myapp.com/callback
&consent_id=con_01HZGV...
&code_verifier=<original_verifier>
```

Response:
```json
{
  "access_token": "at_01HZGV...",
  "refresh_token": "rt_01HZGV...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "accounts:read balances:read transactions:read"
}
```

| Token | TTL | Notes |
|:---|:---|:---|
| `access_token` | 15 minutes | Short-lived, never persisted raw |
| `refresh_token` | 90 days | Single-use — rotation on every use |

## Step 5 — Access Data

Every data call requires both the access token **and** the `X-Consent-Id` header:

```http
GET /ob/accounts
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
```

```json
{
  "accounts": [
    {
      "account_id": "acc_01...",
      "iban": "LY83002700100099900001",
      "currency": "LYD",
      "account_type": "CURRENT",
      "display_name": "Mohamed T. — Current Account"
    }
  ]
}
```

**Get balances:**
```http
GET /ob/accounts/{account_id}/balances
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
```

**Get transactions:**
```http
GET /ob/accounts/{account_id}/transactions?fromDate=2026-01-01&toDate=2026-04-24&count=50
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
```

## Initiate a Payment (PISP)

Requires the `payments:write` scope in the consent.

```http
POST /ob/payment-orders
Authorization: Bearer <access_token>
X-Consent-Id: con_01HZGV...
Content-Type: application/json

{
  "source_account_id": "acc_01...",
  "destination": {
    "type": "iban",
    "value": "LY83002700100099900002"
  },
  "amount": 10000,
  "currency": "LYD",
  "description": "Rent payment April 2026"
}
```

If the bank requires SCA (amount > `sca_exemption_limit`), the response will be:
```json
{
  "status": "PENDING_SCA",
  "sca_url": "https://gateway.example.com/ob/sca/po_01..."
}
```

Redirect the customer to `sca_url`. They complete SCA at their bank.

## Refresh a Token

```http
POST /ob/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=rt_01HZGV...
&consent_id=con_01HZGV...
```

::: info Single-use rotation
Each refresh issues a **new** refresh token. The old one is immediately invalidated.
:::

## Revoke a Consent

```http
DELETE /ob/consents/{consent_id}
Authorization: Bearer <access_token>
```

This **instantly invalidates all tokens** associated with the consent. The customer loses access to the TPP's data access immediately.

Customers can also revoke directly at their bank app.

## Scopes Reference

| Scope | Access granted |
|:---|:---|
| `accounts:read` | List accounts and account details |
| `balances:read` | Account balances |
| `transactions:read` | Transaction history (with date filtering) |
| `payments:write` | Initiate payment orders |

## Webhook Events

| Event | Trigger |
|:---|:---|
| `consent.granted` | Customer approved your consent request |
| `consent.revoked` | Revoked by TPP, customer, or bank |
| `consent.expired` | Consent reached its expiry date |
| `payment_order.completed` | Payment executed successfully |
| `payment_order.failed` | Bank declined or processing error |
| `payment_order.pending_sca` | SCA required before execution |
| `payment_order.rejected` | Payment order rejected by bank |
