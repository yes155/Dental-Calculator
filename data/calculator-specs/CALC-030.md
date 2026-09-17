# CALC-030 — Denture Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-030 `/dentures-cost/`
Purpose: estimate patient responsibility from a user's written denture quote. It does not generate a market quote or choose a denture design.

## Inputs
1. `quote_amount_cents` — required total written quote; blank unknown; zero explicit; technical range $0–$1,000,000.
2. `denture_type` — descriptive category only: `full_traditional`, `full_low_cost`, `full_premium`, `immediate`, `partial_flexible`, `partial_metal`, `partial_resin`, `implant_supported`, `overdenture`, `snap_on`, `other`, `unclear`.
3. `quote_unit` — `written_total`, `one_arch`, `upper_and_lower`, `per_implant`, `other`, `unclear`; descriptive only and never changes arithmetic.
4. `other_charge_status` — `included`, `separate_charge`, `not_listed`, `not_sure`.
5. `other_charge_cents` — conditional explicit amount.
6. `insurance_mode` — `none`, `user_estimate`, `unknown`.
7. `insurance_payment_cents` — conditional same-scope user estimate.
8. `insurance_scope_confirmed` — `same_scope` or `unclear`.

## Logic
Known total = written quote + explicit separate charge. Denture type and quote unit do not multiply the entered amount. If the written quote is only a per-implant amount and no total is known, the reader should obtain the provider's total rather than using a published implant count assumption. Not-listed/not-sure scope suppresses precise patient responsibility. Insurance applies only when user-entered and confirmed to cover the same scope.

## Published reference context
Display the 2026 CareCredit/Synchrony category rows separately. Never turn the $4,093 per-implant reference into a full treatment total and never prefill calculator fields.
