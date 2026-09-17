# CALC-019 — Dental Veneer Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-019 `/dental-veneers-cost/`
Purpose: interpret a written veneer quote and estimate a patient amount from user-entered same-scope financial inputs. It does not generate a market quote or decide treatment suitability.

## Inputs
1. `quote_basis` — `total_quote` or `per_veneer`.
2. `quote_amount_cents` — required; blank is unknown; zero is explicit; technical range $0–$1,000,000.
3. `veneer_count` — required only for `per_veneer`; integer 1–32.
4. `other_charge_status` — `included`, `separate_charge`, `not_listed`, `not_sure`.
5. `other_charge_cents` — required only for `separate_charge`; $0–$1,000,000.
6. `insurance_mode` — `none`, `user_estimate`, `unknown`.
7. `insurance_payment_cents` — required only for `user_estimate`.
8. `insurance_scope_confirmed` — `same_scope` or `unclear` for a user-entered insurance estimate.

## Logic
Base quoted total = entered total quote, or entered per-veneer quote × entered veneer count. The count multiplication is allowed only because both values come from the user's written quote/plan, never from a published national reference.
Known scope total = base total + explicit separate other charge when entered.
`not_listed` and `not_sure` never become $0 and suppress a precise patient-responsibility result.
If scope is complete and insurance mode is none, patient amount = known scope total.
If scope is complete and a same-scope user insurance estimate is entered, patient amount = max(known total − insurance estimate, 0).
If insurance is unknown/unclear or quote scope is unresolved, suppress precise patient responsibility.

## Published reference context
Display separately from arithmetic: type-specific CareCredit/Synchrony veneer rows from the cosmetic evidence packet. Never prefill calculator fields.

## Insurance assumptions
No default percentage, deductible, annual maximum, exclusion or cosmetic-benefit assumption.

## Required tests
Blank vs zero; invalid/negative/ceiling; total quote; per-veneer × count; count 1/32 and invalid; included/separate/not-listed/not-sure; insurance none/same-scope/unclear/greater-than-total; published prices absent from default values; mobile and keyboard QA.
