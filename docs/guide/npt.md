# NPT — National Payment Tag

**NPT (National Payment Tag)** is the payment identity layer of OpenWave. It lets you send money to a person using only their username — no IBAN required.

## The Concept

Inspired by how email works. You know someone's email address; the `@domain` part routes the message to the right provider. NPT works the same way for payments.

```
mtellesy             →  routes to default bank account
mtellesy@andalus     →  routes to Andalus Bank specifically
mtellesy@nub         →  routes to NUB specifically
```

A person **owns** a username and can **link accounts from multiple banks** to it. The `@bank-handle` suffix is optional — if omitted, the payment goes to their default account regardless of which bank that is.

## Key Properties

| Property | Detail |
|:---|:---|
| **Globally unique** | One username per person across the entire ecosystem |
| **Multi-bank** | Link accounts from any participating bank |
| **Portable** | Change your default without sharing a new IBAN |
| **Bank-vouched** | Claimed through your bank's existing KYC process |
| **Routing-only** | The registry stores only routing data — no balances, no history |
| **First-come, first-served** | A handle is yours once claimed, until voluntarily released |

## How Claiming Works

1. Customer visits their bank's app and chooses a username (e.g. `mtellesy`)
2. Bank verifies the customer is KYC-approved (already done at onboarding)
3. Bank calls the **Identity Registry**: `POST /v1/identity/claim`
4. Registry checks uniqueness and registers `mtellesy → { bank: "andalus", iban: "LY..." }`
5. Customer now receives payments at `mtellesy` from anywhere in the ecosystem

## How Resolution Works

Sending money to an NPT alias:

```
Sender types: mtellesy

1. Gateway calls: GET /v1/identity/resolve?alias=mtellesy
   ← { iban: "LY83002700100099900001", bank_handle: "andalus" }

2. Gateway routes payment to Andalus Bank with that IBAN
```

Resolution is **public** — no authentication required. The endpoint is designed to be fast and heavily cached (60-second TTL).

## Adding Multiple Banks

Once you have a handle, you can link additional bank accounts:

```
mtellesy           →  andalus (default)
mtellesy@nub       →  nub
mtellesy@wahda     →  wahda
```

Merchants or senders don't need to know which bank you use. They just use `mtellesy`.

## Format Rules

| Rule | Example |
|:---|:---|
| 3–30 characters | ✅ `mtellesy`, ✅ `ahmed` |
| Lowercase letters, numbers, underscores, hyphens | ✅ `ahmed_123`, ✅ `my-store` |
| Must start with a letter or number | ✅ `ahmed`, ❌ `_ahmed` |
| No spaces | ❌ `ahmed ali` |

## Bank Handle Format

Bank handles follow the same rules and are issued when a bank registers with the gateway.

```
@andalus    →  Andalus Bank
@nub        →  National Union Bank
@wahda      →  Wahda Bank
```

## Compared to Other Systems

| System | What you share | Portable? | Multi-bank? |
|:---|:---|:---:|:---:|
| **IBAN transfer** | Full IBAN (24 chars) | ✗ | ✗ |
| **Phone-based transfer** | Phone number | ✗ | ✗ |
| **NPT (OpenWave)** | Short username | ✅ | ✅ |
| **Email (for reference)** | Email address | ✅ | N/A |
