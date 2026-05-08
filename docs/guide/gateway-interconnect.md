# Gateway Interconnect Protocol

OpenWave Gateway Interconnect Protocol (OW-GIP) defines how independent OpenWave-compatible gateways discover each other, resolve aliases remotely, route payments, exchange status, and reconcile gateway-to-gateway settlement.

OW-GIP is for multi-operator networks. It lets banks and merchants connect to different gateways while still reaching customers, aliases, and payment rails across the wider OpenWave ecosystem.

## Scope

OW-GIP v1 covers:

- Gateway discovery and registration
- Capability and fee advertisement
- Remote NPT alias resolution
- Cross-gateway payment routing
- Route status polling
- Gateway-to-gateway settlement batches
- Health checks and retry-safe errors

The normative OpenAPI file is [`openwave-gateway-interconnect-v1.yaml`](https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml).

## Gateway Identity

Every interconnect participant has a stable `gateway_id`, for example:

```text
owgw-neptune-ly
owgw-cbl-switch
owgw-bank-consortium-west
```

Gateway IDs must be unique within the directory or trust domain. They are used in routing requests, settlement batches, audit logs, and dispute evidence.

## Authentication

Gateway-to-gateway calls use:

- `X-OpenWave-Gateway-Key: owgw_...`
- mandatory mTLS in production
- idempotency keys on mutation endpoints

Gateway keys identify the sending gateway. mTLS binds the transport channel to an approved certificate. Operators should rotate keys and certificates independently.

## Discovery

<section class="ow-flow-card ow-gip-demo ow-doc-demo" aria-label="Animated OW-GIP discovery and routing explainer">
  <div>
    <p class="ow-flow-kicker">OW-GIP lifecycle</p>
    <h3>Interconnect is a protocol between operators, not a hidden central gateway.</h3>
  </div>
  <div class="ow-stage-row">
    <span style="--i:0"><b>1</b>Advertise banks</span>
    <span style="--i:1"><b>2</b>Resolve remote alias</span>
    <span style="--i:2"><b>3</b>Route payment</span>
    <span style="--i:3"><b>4</b>Poll status</span>
    <span style="--i:4"><b>5</b>Reconcile batch</span>
  </div>
  <div class="ow-switch-board" aria-hidden="true">
    <div class="ow-gateway-pill">Gateway A<br><small>merchant + TPPs</small></div>
    <div class="ow-switch-line"><span></span></div>
    <div class="ow-gateway-pill">Gateway B<br><small>banks + identity hints</small></div>
    <div class="ow-switch-foot">Route IDs, idempotency keys, gateway IDs, fees, and settlement batch IDs survive every retry.</div>
  </div>
</section>

Gateways expose `GET /gateway-info` to advertise:

- supported countries and currencies
- supported banks and rails
- routing capabilities
- settlement models
- fee rules
- health and version metadata

Directories or switch operators can call `POST /gateway-register` to register or update a gateway profile.

## Remote Alias Resolution

When Gateway A receives a payment for an alias that belongs to Gateway B, it calls:

```http
POST /resolve-alias-remote
```

Gateway B returns the owning bank, masked account metadata, supported auth modes, and routing hints. Raw customer secrets and CBS customer IDs must not cross the gateway boundary.

## Cross-Gateway Routing

Gateway A calls:

```http
POST /route-payment
```

The request includes sender/receiver gateway IDs, debtor and creditor details, amount in minor units, currency, route type, and an idempotency key. Gateway B responds with a `route_id`, initial status, fees, and next settlement instructions.

Route state is checked through:

```http
POST /route-status
```

Final states are `COMPLETED`, `FAILED`, `EXPIRED`, or `REVERSED`. Intermediate states include `ACCEPTED`, `AUTH_REQUIRED`, `PROCESSING`, and `SETTLEMENT_PENDING`.

## Settlement

Interconnect settlement is reported through:

```http
POST /settlement-batch
GET /settlement-status
```

Batches contain the gateway pair, settlement cycle, net positions, underlying route IDs, total debit/credit amounts, fees, and reconciliation references. OW-GIP supports gross, net, and prefunded models as long as the route-level status remains accurate.

## Health And Failover

Gateways expose:

```http
GET /gateway-health
```

Health responses distinguish full outage, degraded routing, bank-specific unavailability, and settlement-only degradation. Implementations should use this endpoint for circuit breaking and alternate routing, but must avoid duplicate payment execution by preserving idempotency keys.

## Relationship To Other OpenWave Specs

OW-GIP complements, but does not replace:

- Payments v1 for merchant-to-gateway sessions
- Bank callback APIs for gateway-to-bank execution
- Identity v1 for NPT handle ownership
- Open Banking v1 for consented AISP/PISP access

The public customer and merchant APIs remain the same. OW-GIP is the operator-to-operator layer underneath them.
