# CALC-024 — Dental Bridge Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-024 `/dental-bridge-cost/`
Purpose: estimate patient responsibility from a user's written bridge quote. It does not generate a market quote or decide bridge type/treatment suitability.

## Inputs
1. `quote_amount_cents` — required total written bridge quote; blank unknown; zero explicit; technical range $0–$1,000,000.
2. `quote_type` — `traditional`, `cantilever`, `maryland`, `implant_supported`, `removable`, `other`, `unclear`; descriptive only.
3. `other_charge_status` — `included`, `separate_charge`, `not_listed`, `not_sure`.
4. `other_charge_cents` — required only when separate charge is selected.
5. `insurance_mode` — `none`, `user_estimate`, `unknown`.
6. `insurance_payment_cents` — conditional user-entered same-scope estimate.
7. `insurance_scope_confirmed` — `same_scope` or `unclear`.

## Logic
Known total = written quote + explicit separate charge. Bridge type never changes arithmetic. Not-listed/not-sure charges remain unresolved and suppress a precise patient amount. With complete scope and no insurance, patient amount = known total. With complete scope and same-scope user insurance estimate, patient amount = max(known total − insurance estimate, 0). Unknown/unclear insurance suppresses a precise result.

## Published reference context
Keep type-specific bridge rows outside arithmetic. Never prefill calculator fields or multiply a published type benchmark.
