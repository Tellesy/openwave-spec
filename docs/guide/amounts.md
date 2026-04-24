# Amount Convention

::: warning Always use integers in minor units
OpenWave never uses decimal numbers for amounts. `50000` means **500.00 LYD**.
:::

## Why Minor Units?

Floating-point arithmetic is unreliable for money. `0.1 + 0.2 !== 0.3` in many languages. Using integers in the smallest currency unit (fils, cents, pence) eliminates rounding errors entirely.

## Currency-Specific Divisors

| Currency | Minor unit | Divisor | Example |
|:---|:---|:---:|:---|
| LYD (Libyan Dinar) | Dirham (1/1000) | 1000 | `50000` = 500.000 LYD |
| USD (US Dollar) | Cent (1/100) | 100 | `5000` = 50.00 USD |
| EUR (Euro) | Cent (1/100) | 100 | `7505` = 75.05 EUR |
| GBP (British Pound) | Penny (1/100) | 100 | `1000` = 10.00 GBP |

LYD uses **3 decimal places** (divisor = 1000), unlike most currencies which use 2.

## Quick Reference

| Integer value | Currency | Human-readable |
|:---:|:---:|:---|
| `1000` | LYD | 1.000 LYD |
| `50000` | LYD | 50.000 LYD |
| `500000` | LYD | 500.000 LYD |
| `100` | USD | 1.00 USD |
| `9999` | USD | 99.99 USD |

## Converting in Code

```js
// Display: integer → human-readable
function formatAmount(amount, currency) {
  const divisors = { LYD: 1000, USD: 100, EUR: 100, GBP: 100 }
  const divisor = divisors[currency] ?? 100
  return (amount / divisor).toFixed(currency === 'LYD' ? 3 : 2)
}

formatAmount(50000, 'LYD')  // "50.000"
formatAmount(9999, 'USD')   // "99.99"

// Input: human → integer (for API calls)
function toMinorUnits(amount, currency) {
  const divisors = { LYD: 1000, USD: 100, EUR: 100, GBP: 100 }
  return Math.round(amount * (divisors[currency] ?? 100))
}

toMinorUnits(50, 'LYD')    // 50000
toMinorUnits(9.99, 'USD')  // 999
```

```python
# Python
def format_amount(amount: int, currency: str) -> str:
    divisors = {'LYD': 1000, 'USD': 100, 'EUR': 100}
    divisor = divisors.get(currency, 100)
    decimals = 3 if currency == 'LYD' else 2
    return f"{amount / divisor:.{decimals}f} {currency}"

format_amount(50000, 'LYD')   # "50.000 LYD"
format_amount(9999, 'USD')    # "99.99 USD"
```

## Always Pair with Currency

Every `amount` field must be accompanied by a `currency` field:

```json
{
  "amount": 50000,
  "currency": "LYD"
}
```

Currency codes follow **ISO 4217** (3-letter uppercase). The gateway rejects requests where `currency` is missing or unrecognised.
