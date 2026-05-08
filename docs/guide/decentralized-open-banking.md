# Decentralized Open Banking

OpenWave Open Banking supports more than one gateway operator. A customer may use one bank, a TPP may connect through another gateway, and a bank may expose its Open Banking callback interface through a preferred gateway or directly. The standard keeps the consent contract portable while leaving credential issuance and bank connectivity under explicit governance.

## Core Model

<section class="ow-flow-card ow-ob-demo ow-doc-demo" aria-label="Animated decentralized Open Banking consent explainer">
  <div>
    <p class="ow-flow-kicker">Decentralized consent</p>
    <h3>A consent is scoped to a customer, bank, TPP, gateway, and expiry.</h3>
  </div>
  <div class="ow-stage-row">
    <span style="--i:0"><b>1</b>TPP requests scopes</span>
    <span style="--i:1"><b>2</b>Gateway finds bank</span>
    <span style="--i:2"><b>3</b>Customer authorises</span>
    <span style="--i:3"><b>4</b>Remote gateway serves data</span>
    <span style="--i:4"><b>5</b>Revocation propagates</span>
  </div>
  <div class="ow-consent-board" aria-hidden="true">
    <div class="ow-consent-phone">
      <strong>Consent artifact</strong>
      <span>TPP client</span>
      <span>Bank + account</span>
      <span>Scopes + expiry</span>
      <button>Bank SCA required</button>
    </div>
    <div class="ow-token-panel">
      <b>Federated rule</b>
      <code>consent_id</code>
      <code>correlation_id</code>
      <small>The servicing bank remains final authority for account data and PISP execution.</small>
    </div>
  </div>
</section>

Open Banking consent is customer-specific, bank-specific, TPP-specific, and scope-specific.

A consent is not global permission to read a customer everywhere. It binds:

- the customer identity or bank customer reference
- the servicing bank
- the TPP client
- the requested scopes
- the authorizing gateway
- the expiry and revocation state

If a customer has accounts at multiple banks, the customer grants separate consent for each bank unless a future profile explicitly defines bundled multi-bank consent. A gateway may present a unified consent screen, but the underlying consents remain bank-scoped records.

## Gateway Roles

There are three possible gateway roles in a decentralized Open Banking flow:

| Role | Responsibility |
| --- | --- |
| TPP gateway | Authenticates the TPP, starts OAuth/PKCE, and receives the API call from the TPP. |
| Bank gateway | Connects to the bank callback interface and enforces bank-specific availability, policy, and SCA. |
| Directory gateway | Resolves which gateway serves a bank, customer alias, or consent authority. This may be a central registry or OW-GIP directory. |

One deployment may perform all three roles. In a federated deployment, the roles can be split across operators.

## Consent Ownership

The gateway that completes customer authorization is the consent authority for that consent. It issues the consent ID and signs or records the consent artifact.

Other gateways must treat that consent as externally issued unless they can validate it through:

- a signed consent artifact
- gateway-to-gateway introspection
- a directory lookup
- a bank-side consent reference

The servicing bank remains the final authority on whether account data or PISP execution is allowed. A bank may reject a request if consent is expired, revoked, missing required SCA, or not recognized.

## Cross-Gateway AISP

For account information:

1. The TPP obtains customer consent through its gateway.
2. The TPP gateway resolves the servicing bank and bank gateway.
3. If the bank is remote, the TPP gateway calls OW-GIP to route the Open Banking data request to the bank gateway.
4. The bank gateway calls the bank callback interface using `X-OpenWave-Internal-Key`.
5. The response is returned through the gateway chain with correlation IDs preserved.

The TPP sees the standard `/ob/accounts`, `/ob/accounts/{account_id}/balances`, and `/ob/accounts/{account_id}/transactions` resources. The routing layer is hidden from the TPP.

## Cross-Gateway PISP

For payment initiation:

1. The TPP creates a payment order under `payments:write`.
2. The gateway validates consent, idempotency, amount, debtor account, creditor account, and SCA status.
3. If debtor bank connectivity belongs to another gateway, the request is routed via OW-GIP.
4. The bank gateway executes through the bank callback interface.
5. Final status is returned to the TPP gateway and exposed through `GET /ob/payment-orders/{order_id}`.

Payment execution must be idempotent across gateway boundaries. The originating gateway creates the public `order_id`; the bank gateway may create a bank transfer reference. Both references must be returned in status responses and logs.

## Customer Presence Across Providers

A customer can exist in multiple Open Banking providers because providers are not identity owners. They are consent processors.

The customer’s durable identity is:

- the bank’s customer reference for bank-held data
- the NPT handle or registry identity for cross-bank alias resolution
- the consent records issued per bank and TPP

Gateways should avoid creating competing “global customer” truth. Instead, they should link local customer portal profiles to bank-scoped consent records and NPT registry records.

## Revocation

Revocation must work from three places:

- customer portal at the authorizing gateway
- bank portal or bank app
- TPP consent management endpoint, when supported

When a consent is revoked, the consent authority must mark the consent inactive and notify any remote gateway or bank gateway involved in active routing. If notification fails, subsequent introspection or bank callback validation must still reject the consent.

## Privacy Rules

Gateway operators must minimize customer data:

- Do not expose full IBANs in operator dashboards unless the role requires it.
- Do not share bank customer references with unrelated TPPs.
- Do not include raw OTP, SCA secrets, or bank callback keys in logs.
- Preserve correlation IDs, idempotency keys, and status codes for support and dispute handling.

## Required Protocol Hooks

The current v1 model uses:

- Open Banking APIs from `openwave-open-banking-v1.0.yaml`
- bank callback APIs from the bank integration guide
- OW-GIP for remote gateway discovery, routing, status, health, and settlement

Future Open Banking v1.1 should add explicit gateway-to-gateway endpoints for consent introspection, consent revocation notification, and delegated SCA status exchange.
