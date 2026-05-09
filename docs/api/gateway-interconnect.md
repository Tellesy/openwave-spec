# Gateway Interconnect API

OW-GIP lets multiple OpenWave-compatible gateways route payments and settlement instructions between each other without forcing all banks and merchants onto one operator.

## OpenAPI

<div class="ow-dl-row">
  <a class="ow-dl-btn" href="https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml" download>Download YAML</a>
  <a class="ow-dl-btn-ghost" href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/neptune-ly/openwave-spec/main/openwave-gateway-interconnect-v1.yaml" target="_blank">Open in Swagger Editor</a>
  <a class="ow-dl-btn-ghost" href="../downloads.html">Generate a gateway client</a>
</div>

## Endpoint map

| Endpoint | Purpose |
|---|---|
| `GET /gateway-info` | Advertise gateway ID, supported rails, banks, regions, currencies, and fee rules. |
| `POST /gateway-register` | Register or refresh gateway metadata in a directory. |
| `GET /gateway-health` | Return health, capacity, maintenance, and degraded-mode information. |
| `POST /resolve-alias-remote` | Resolve an alias that belongs to a remote gateway. |
| `POST /route-payment` | Ask a peer gateway to route a cross-gateway payment. |
| `POST /route-status` | Query route status by route ID and idempotency key. |
| `POST /settlement-batch` | Submit net settlement batch details. |
| `GET /settlement-status` | Read settlement state by batch ID. |

## Example responses

### Gateway info

```json
{
  "gateway_id": "gw_neptune_astro_ly",
  "name": "Neptune. Astro",
  "country": "LY",
  "currencies": ["LYD"],
  "supported_banks": ["andalus", "nub"],
  "rails": ["SAME_BANK", "LYPAY", "OW_GIP"],
  "capabilities": ["PAYMENTS", "MANDATES", "OPEN_BANKING", "WEBHOOKS"],
  "fees": {
    "route_payment": {
      "fixed": 1000,
      "currency": "LYD"
    }
  }
}
```

### Route payment accepted

```json
{
  "route_id": "rte_01HX7X5WE94P2KNV6RSGMBVR1T",
  "status": "ACCEPTED",
  "debtor_gateway_id": "gw_bank_b",
  "creditor_gateway_id": "gw_gateway_a",
  "amount": 860000,
  "currency": "LYD",
  "fee_breakdown": {
    "origin_gateway_fee": 500,
    "destination_gateway_fee": 500,
    "settlement_fee": 0
  },
  "settlement_batch_id": "set_2026_05_08_001"
}
```

### Health degraded

```json
{
  "gateway_id": "gw_bank_b",
  "status": "DEGRADED",
  "available": true,
  "degraded_components": ["settlement-status"],
  "retry_after_seconds": 30
}
```

## Security model

- Gateway-to-gateway calls use `X-OpenWave-Gateway-Key: owgw_...`.
- Production gateway interconnect requires mTLS.
- Every mutating request must include an idempotency key.
- Settlement files must include batch IDs, participant IDs, net positions, and retry-safe error responses.
- Fee breakdown must be transparent before a route is committed.

## Related guides

- [Gateway Interconnect guide](../guide/gateway-interconnect.md)
- [Gateway Operators](../guide/operators.md)
- [Settlement](../guide/settlement.md)
