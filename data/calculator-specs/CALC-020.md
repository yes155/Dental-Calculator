# CALC-020 — Braces Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-020 `/braces-cost/`
Purpose: interpret a written fixed-braces quote and estimate a patient amount from user-entered same-scope financial inputs. It does not decide brace type, treatment need or treatment eligibility.

## Inputs
1. `treatment_quote_cents` — required money input; blank is unknown, zero is entered; technical range $0–$1,000,000.
2. `brace_type` — `metal`, `ceramic`, `lingual`, `other`, `unclear`; descriptive/comparison only; never changes arithmetic.
3. `retainer_status` — `included`, `separate_charge`, `not_listed`, `not_sure`.
4. `retainer_charge_cents` — conditional on `separate_charge`; technical range $0–$1,000,000; blank means incomplete scope.
5. `insurance_mode` — `none`, `user_estimate`, `unknown`.
6. `insurance_payment_cents` — conditional user-entered estimate; $0–$1,000,000.
7. `insurance_scope_confirmed` — `same_scope` or `unclear` when an insurance estimate is entered.

## Logic
Known quoted scope total = treatment quote + explicit separate retainer charge.
Brace type does not multiply, discount or otherwise alter the user's written quote.
`not_listed` and `not_sure` retainer states remain unresolved and receive no automatic dollar value.
Precise patient responsibility requires a complete quote scope and either no insurance or a user-entered insurance payment confirmed to cover the same scope.
Estimated patient amount = max(known quoted scope total − same-scope entered insurance payment, 0), or known quoted scope total when insurance mode is none.
Suppress a precise patient amount when insurance is unknown/unclear or retainer scope is unresolved.

## Published reference context
Keep outside arithmetic and show rows separately:
- Metal braces: $6,343 average; $2,500–$10,000 range.
- Ceramic braces: $5,834 average; $4,480–$11,312 range.
- Lingual braces: $9,221 average; $7,321–$17,411 range.
Source: CareCredit/Synchrony U.S. cost research. Do not combine the rows into one universal range and do not prefill calculator values.

## Insurance assumptions
No universal orthodontic coverage percentage, lifetime maximum, age rule, deductible or network assumption. Use only user-entered same-scope insurance estimates.

## Outputs
- Known written quote total.
- Brace-type label if supplied.
- Retainer scope state.
- Entered insurance estimate when applicable.
- Estimated patient amount only when scope is complete.
- Warning/limitations when unresolved.

## Privacy
No quote values intentionally sent, stored or serialized externally by calculator logic.

## Required tests
Blank vs zero; min/max/invalid; each brace-type label with identical arithmetic; retainer included/separate/not-listed/not-sure; separate blank/zero/amount; no insurance; same-scope user insurance; unclear insurance; insurance greater than total; keyboard; mobile; reader-visible internal IDs absent.
