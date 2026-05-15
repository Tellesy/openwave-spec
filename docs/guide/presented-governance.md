# Channel Governance

Presented payments are part of the OpenWave standard, but operators retain control over which channels are active.

## Why governance matters

QR and NFC have different operational, fraud, and product implications across banks, wallets, and merchants. The standard therefore separates:

- **protocol compliance**
- **channel enablement**

An operator can be compliant without enabling every presented mode.

## Required capability flags

At minimum, capability metadata should state:

- supported channels
- supported modes
- supported intents
- deployment role
- enablement flags for merchant-presented, customer-presented, direct-bank, direct-wallet, and mandate-approval presentments

## Merchant and wallet expectation

Merchant and wallet software must check capabilities before assuming:

- NFC is available
- customer-presented tokens are accepted
- recurring mandate approval can start from presentment
- a direct bank or wallet endpoint can replace a gateway endpoint
