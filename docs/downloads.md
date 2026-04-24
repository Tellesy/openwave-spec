# Downloads

All OpenWave spec files are OpenAPI 3.0.3 and fully machine-readable. Import them into any compatible tool in seconds.

---

## OpenAPI Spec Files

### Payments API — `openwave-payments-v1.yaml`

Covers payment sessions, NPT alias routing, recurring mandates, webhooks, and bank partner callbacks.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-payments-v1.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/payments/initiate` | Create a payment session |
| `GET` | `/payments/{id}/status` | Poll payment status |
| `POST` | `/session/{id}/resolve-payer` | Resolve payer alias or IBAN |
| `POST` | `/session/{id}/confirm-otp` | Confirm OTP auth |
| `POST` | `/aliases/register` | Register an NPT alias |
| `GET` | `/aliases/{alias}` | Look up an alias |
| `POST` | `/mandates/create` | Create recurring mandate |
| `POST` | `/bank/callback/execute-transaction` | Bank executes unified debit+route |
| `POST` | `/bank/callback/notify-credit` | Bank confirms credit to merchant |

---

### Open Banking API — `openwave-open-banking-v1.0.yaml`

Covers OAuth 2.0 + PKCE consent, AISP (account data), PISP (payment initiation), and SCA.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-open-banking-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-open-banking-v1.0.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-open-banking-v1.0.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/ob/consent` | Create an account access consent |
| `GET` | `/ob/accounts` | List customer accounts (AISP) |
| `GET` | `/ob/accounts/{id}/balances` | Get account balances |
| `GET` | `/ob/accounts/{id}/transactions` | Get transaction history |
| `POST` | `/ob/payment-orders` | Initiate a PISP payment |
| `GET` | `/ob/payment-orders/{id}` | Poll payment order status |

---

### Identity Registry API — `openwave-identity-v1.0.yaml`

Covers NPT handle ownership, multi-bank account linking, public alias resolution, and bank directory.

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-identity-v1.0.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://github.com/Tellesy/openwave-spec/blob/main/openwave-identity-v1.0.yaml">View on GitHub</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-identity-v1.0.yaml" target="_blank">Open in Swagger Editor ↗</a>
</div>

**Key endpoints:**

| Method | Path | Description |
|---|---|---|
| `POST` | `/identity/handles` | Register an NPT handle |
| `GET` | `/identity/resolve/{alias}` | Resolve alias → IBAN + bank |
| `GET` | `/identity/banks` | List all registered banks |
| `POST` | `/identity/banks/{handle}/accounts` | Link an account to a handle |
| `DELETE` | `/identity/handles/{alias}` | Deactivate a handle |

---

## Postman Collections

Import any spec file directly into Postman to get a pre-built collection with all endpoints, example payloads, and environment variables.

### Method 1 — Import by URL (recommended)

1. Open **Postman**
2. Click **Import** → **Link**
3. Paste one of these raw URLs:

```
# Payments
https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml

# Open Banking
https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-open-banking-v1.0.yaml

# Identity Registry
https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-identity-v1.0.yaml
```

4. Postman generates the full collection automatically. Set your environment variables:

```
GATEWAY_URL    = https://your-gateway.example.com
MERCHANT_KEY   = your-merchant-api-key
BANK_KEY       = your-bank-api-key
ADMIN_KEY      = your-admin-api-key
```

### Method 2 — Download YAML then import as file

Download the YAML above → in Postman click **Import** → **File** → select the downloaded file.

---

## Swagger / OpenAPI Tools

### Swagger UI (online)

Click any "Open in Swagger Editor" button above, or paste a raw URL into [editor.swagger.io](https://editor.swagger.io).

### Run Swagger UI locally

```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  swaggerapi/swagger-ui
```

Open `http://localhost:8080` — full interactive docs with live try-it-out (point it at your gateway).

### Redocly

```bash
npx @redocly/cli preview-docs openwave-payments-v1.yaml
```

---

## Code Generation

Generate a type-safe client in any language using [openapi-generator](https://openapi-generator.tech):

::: code-group

```bash [TypeScript (fetch)]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g typescript-fetch \
  -o ./openwave-client-ts
```

```bash [TypeScript (axios)]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g typescript-axios \
  -o ./openwave-client-ts-axios
```

```bash [Kotlin]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g kotlin \
  -o ./openwave-client-kotlin
```

```bash [Python]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g python \
  -o ./openwave-client-python
```

```bash [Go]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g go \
  -o ./openwave-client-go
```

```bash [Java]
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/Tellesy/openwave-spec/main/openwave-payments-v1.yaml \
  -g java \
  -o ./openwave-client-java
```

:::

::: tip Native SDKs
For production use, the **Neptune Astro** gateway ships hand-crafted SDKs for TypeScript, React, Flutter, Kotlin, and Swift. See the [Astro SDK docs](https://neptune-astro.github.io/neptune-astro/) for packages that are ready to drop into your project.
:::

---

## Direct GitHub Access

Clone the full spec repository for offline use or CI/CD validation:

```bash
git clone https://github.com/Tellesy/openwave-spec.git
cd openwave-spec

# Validate specs with Redocly CLI
npx @redocly/cli lint openwave-payments-v1.yaml
npx @redocly/cli lint openwave-open-banking-v1.0.yaml
npx @redocly/cli lint openwave-identity-v1.0.yaml
```

---

## Versioning

OpenWave follows **Semantic Versioning**:

| Change | Version bump |
|:---|:---:|
| Breaking change to an existing endpoint | `MAJOR` (1.x → 2.0) |
| New endpoint or optional field | `MINOR` (1.0 → 1.1) |
| Clarification, fix, or example update | `PATCH` (1.0.0 → 1.0.1) |

The `api_version` field in every webhook envelope and the `info.version` in each spec always reflect the current module version. All changes are logged in [CHANGELOG.md](https://github.com/Tellesy/openwave-spec/blob/main/CHANGELOG.md).
