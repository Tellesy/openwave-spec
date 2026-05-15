# NFC Handoff

OpenWave NFC uses the same conceptual model as QR: NFC starts a presentment claim, then hands the customer into a secure authorization flow.

## v1 model

- Recommended payload: `NDEF_URI`
- URI value: signed OpenWave presentment URI
- Target uses: merchant-presented or customer-presented handoff

## Security expectations

- NFC tap alone is not payment authorization
- Replay protection still applies
- Device-local OTP or PIN collection outside the secure bank or hosted surface is out of scope
- Production deployments should bind NFC-presented flows to device and session telemetry where available

## Typical NFC uses

| Use case | Pattern |
|---|---|
| Merchant countertop tap | `MERCHANT_PRESENTED` + `ONE_TIME_PAYMENT` |
| Subscription kiosk signup | `MERCHANT_PRESENTED` + `MANDATE_APPROVAL` |
| Wallet tap-to-pay start | `CUSTOMER_PRESENTED` + `ONE_TIME_PAYMENT` |
