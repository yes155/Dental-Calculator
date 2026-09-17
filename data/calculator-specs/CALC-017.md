# CALC-017 — Invisalign / Clear Aligner Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-017 `/invisalign-cost-calculator/`
Purpose: interpret a written clear-aligner/Invisalign quote and estimate a patient amount from user-entered same-scope financial inputs. It does not generate a market quote or determine treatment suitability.

## Inputs
1. `treatment_quote_cents` — required money input; blank is unknown, zero is an entered value; technical range $0–$1,000,000.
2. `quote_brand_scope` — `invisalign`, `other_clear_aligner`, `unclear`; descriptive only; never changes arithmetic.
3. `retainer_status` — `included`, `separate_charge`, `not_listed`, `not_sure`.
4. `retainer_charge_cents` — shown only when `retainer_status=separate_charge`; blank means incomplete scope; technical range $0–$1,000,000.
5. `insurance_mode` — `none`, `user_estimate`, `unknown`.
6. `insurance_payment_cents` — required only for `user_estimate`; technical range $0–$1,000,000.
7. `insurance_scope_confirmed` — required for `user_estimate`; `same_scope` or `unclear`.

## Logic
Known quoted scope total = treatment quote + separate retainer charge only when a separate retainer amount is explicitly entered.
Never add a price for `not_listed` or `not_sure`.
Scope is complete for patient-responsibility output only when treatment quote is entered and retainer status is `included`, or `separate_charge` with a entered amount. `not_listed`/`not_sure` remain visibly unresolved.
If insurance mode is `none` and scope is complete: estimated patient amount = known quoted scope total.
If insurance mode is `user_estimate`, scope is complete and insurance scope is confirmed `same_scope`: estimated patient amount = max(known quoted scope total − entered insurance payment, 0).
If insurance mode is `unknown`, insurance scope is unclear, or quote scope is incomplete: suppress the precise patient-responsibility result and show the known quoted amount plus unresolved items.
If entered insurance payment exceeds quoted scope, do not display a negative amount; clamp to $0 and show a warning to verify scope.

## Published reference context
Display separately from arithmetic: clear aligners $5,108 average; $1,800–$8,100 range; CareCredit/Synchrony/ASQ360° U.S. evidence. Label clearly: category is clear aligners, not an Invisalign-only benchmark. Never prefill any calculator field from these figures.

## Insurance assumptions
No default percentage, deductible, annual/lifetime maximum, age rule or covered-service assumption. Insurance payment is user-entered and must be confirmed to match the quote scope.

## Outputs
- Known written quote total.
- Retainer scope state.
- Entered insurance estimate when applicable.
- Estimated patient amount only when scope rules permit.
- Plain-language limitations: educational estimate, not a dental quote, treatment recommendation or coverage guarantee.

## Privacy
No quote values intentionally sent, stored or serialized externally by calculator logic.

## Required tests
Blank vs zero; max ceiling; invalid/negative values; included retainer; separate retainer with blank/zero/amount; not-listed and not-sure suppression; no insurance; user insurance same-scope; insurance unclear; insurance greater than quote; keyboard operation; mobile layout; internal calculator ID not visible to readers.
