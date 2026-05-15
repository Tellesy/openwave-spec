# Presented Payments

Presented payments add **scan** and **tap** as payment-entry channels without weakening the existing OpenWave trust model.

## What changes

Instead of the customer always starting from a hosted checkout URL, the flow may start from:

- a merchant-displayed QR code
- an NFC tap target
- a customer-presented QR or NFC token shown from a wallet or bank app

## What does not change

- The customer still authorizes inside a trusted hosted or bank-controlled surface.
- Merchants still never handle OTPs, push-approval decisions, or bank credentials.
- Final one-time payment and recurring mandate outcomes still reuse the normal payment and mandate lifecycle.

## Supported v1 modes

| Mode | Intent | Description |
|---|---|---|
| `MERCHANT_PRESENTED` | `ONE_TIME_PAYMENT` | Merchant shows QR or NFC for immediate checkout. |
| `CUSTOMER_PRESENTED` | `ONE_TIME_PAYMENT` | Customer wallet or bank app shows a token for merchant acceptance. |
| `MERCHANT_PRESENTED` | `MANDATE_APPROVAL` | Merchant starts a recurring mandate approval flow from QR or NFC. |

## Operator-controlled channel enablement

Presented payments are part of the standard, but **not every deployment must enable every mode**.

Operators may independently enable or disable:

- QR
- NFC
- merchant-presented
- customer-presented
- one-time presented payments
- recurring mandate-presented approvals
- direct-bank implementation
- direct-wallet implementation

Availability must be exposed through the capability metadata so merchant, wallet, and bank software can adapt at runtime.

## Security boundaries

| Actor | Allowed | Not allowed |
|---|---|---|
| Merchant UI | Show QR, expose NFC target, receive final status | Collect OTP or bank secrets |
| Wallet / bank app | Scan or tap, claim presentment, continue in secure app flow | Skip SCA when the payment or mandate requires it |
| Gateway / bank / wallet operator | Create presentment, enforce expiry and replay protection, route lifecycle | Treat QR alone as final authorization |

## Typical flows

### Merchant-presented one-time payment

1. Merchant backend creates a presentment.
2. Merchant site or POS displays QR or NFC.
3. Customer scans or taps.
4. Customer lands in hosted or app-controlled secure authorization.
5. Presentment becomes a normal payment session.
6. Final merchant fulfilment still depends on webhook or final payment status.

### Merchant-presented recurring approval

1. Merchant backend creates a presentment with `intent = MANDATE_APPROVAL`.
2. Customer scans or taps.
3. Customer sees mandate amount, frequency, duration, and merchant name.
4. Customer approves through bank OTP or push.
5. Presentment becomes a normal mandate approval flow.

### Customer-presented token

1. Customer wallet or bank app generates a customer-presented token.
2. Merchant scanner or POS claims it.
3. Operator creates the underlying payment session.
4. Customer completes any required authorization in the secure app surface.

## Read next

- [QR payloads](./presented-qr.md)
- [NFC handoff](./presented-nfc.md)
- [Direct bank and wallet implementation](./presented-direct.md)
- [Channel governance](./presented-governance.md)
