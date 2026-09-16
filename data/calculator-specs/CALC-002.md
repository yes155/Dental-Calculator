# Dental Cost Estimator Specification — CALC-002

## Identity
- Tool ID: CALC-002
- Public name: Dental cleaning quote calculator
- URL: `/dental-cleaning-cost/`
- Parent procedure page: DEN-002
- Version: 1.0
- Last reviewed: 2026-09-17

## Purpose
- User task: Organize a written standard-cleaning quote and see which visit items are included, separate, absent or unclear.
- What this tool estimates: Arithmetic total from user-entered quote amounts; optional same-quote insurer estimate subtraction; quote-scope summary.
- What this tool does NOT determine: What type of cleaning the user needs; whether an exam/X-ray/fluoride service is clinically required; market price from symptoms/location; insurance eligibility or guaranteed benefits.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/Reason |
|---|---|---|---:|---:|---|---|---|
| quote_mode | enum | `one_total`, `separate_charges` | — | — | none | Yes | Written estimates may be bundled or itemized |
| written_total | money | USD | 0 | 1,000,000 | blank | Conditional | Required in `one_total` mode |
| cleaning_fee | money | USD | 0 | 1,000,000 | blank | Conditional | Required in `separate_charges` mode |
| exam_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Prevent silent bundle assumptions |
| exam_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Required only when exam is marked separate |
| xray_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | X-rays may be separate or bundled |
| xray_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Required only when X-rays are marked separate |
| fluoride_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Fluoride inclusion is often unclear |
| fluoride_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Required only when fluoride is marked separate |
| other_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve quote uncertainty |
| other_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Required only when other item marked separate |
| insurance_mode | enum | no insurance amount / entered estimate / not known | — | — | none | Yes | No hidden coverage percentage |
| insurer_estimate | money | USD | 0 | 1,000,000 | blank | Conditional | Only when user has same-quote insurer estimate |
| same_scope_confirmed | boolean | yes/no | — | — | false | Conditional | Prevent subtracting unlike insurer estimate |

All money inputs use decimal dollars in UI and integer cents internally. The $1,000,000 ceiling is a technical validation limit, not a dental price assumption.

## Cost data

| Data field | Value/range | Unit | Geography | Pricing context | Source | Data date | Refresh date |
|---|---|---|---|---|---|---|---|
| Standard cleaning reference | $85–$160 | per standard cleaning | U.S. consumer guidance; exact static-range sample not disclosed | Delta Dental wording: average cost without dental benefits | Delta Dental PREV-001 | UNKNOWN | 2027-03-17 |
| Adult cleaning corroboration | about $104 | per adult cleaning | Source presented for U.S. consumers | Cigna secondary report citing ADA HPI 2022 Survey of Dental Fees | Cigna PREV-002 | 2022 | 2027-03-17 |
| Orlando local example | $80–$109 | adult routine cleaning | Orlando, Florida | without insurance | Humana PREV-003 | proprietary tool date not established | 2027-03-17 |

Published data is **reference-only** and never initializes or changes calculator arithmetic.

## Calculation logic

1. Parse all user-entered dollar values into integer cents. Blank and zero are different states.
2. Determine base amount:
   - `one_total`: base = `written_total`.
   - `separate_charges`: base = `cleaning_fee`.
3. For each optional component (exam, X-rays, fluoride, other):
   - `included`: add $0; mark included.
   - `separate charge`: require an amount and add that amount to base.
   - `not listed`: add $0; mark absent from written quote only.
   - `not sure`: add $0; mark scope incomplete.
4. `entered_total = base + sum(valid separate amounts)`.
5. Quote-scope status:
   - `complete` when all component statuses are known (`included`, `separate charge` with valid amount, or `not listed`).
   - `incomplete` when any component is `not sure`.
   - `invalid` for missing required base amount, invalid money, missing amount for an explicitly separate charge, or impossible insurance input.
6. Insurance:
   - `no insurance amount`: insurer = 0.
   - `not known`: insurer/patient amount = unknown.
   - `entered estimate`: require valid insurer amount, `same_scope_confirmed=true`, and insurer amount <= entered total.
7. Patient amount:
   - show only when quote scope is complete and insurance mode is either no-insurance-amount or valid entered-estimate.
   - `patient_amount = entered_total - insurer_estimate` for valid entered estimate.
   - if scope is incomplete, show the entered total but label after-insurance amount as needing clearer quote details.
8. Never compare user total to the published $85–$160 range algorithmically and never flag a quote as clinically or commercially “too high/low.”

## Insurance model

This is **not** a benefit calculator.

- allowed amount assumption: none
- deductible: not calculated
- copay/coinsurance: not calculated
- annual maximum: not calculated
- network assumption: none
- waiting periods/frequency limits: not calculated
- order of operations: only subtract a user-entered insurer estimate already provided for the same written quote
- caps/floors: insurer estimate cannot exceed entered quote total
- exhausted annual max: not inferred

## Output
- Primary output: total from the written quote
- Secondary output: conditional amount after user-entered insurer estimate
- Range/point estimate: no generated market-price estimate
- Rounding: exact integer-cent arithmetic; display USD to two decimals
- Included costs: only user-entered base and separate-charge amounts
- Excluded costs: anything not entered or explicitly unknown
- Explanation text: component-by-component quote status plus published reference card
- Verification/next action: compare the result with the dentist's itemized estimate and plan documents

## Safety / YMYL boundary
- No diagnosis: tool never chooses routine vs deep cleaning
- No treatment recommendation: tool never recommends exam, X-rays, fluoride or frequency
- No candidacy determination: not applicable / prohibited
- No insurance guarantee: no universal percentage or “free preventive care” claim
- Estimator not a quote: all arithmetic is based on user-entered written quote amounts

## Error handling
- empty input: show concise field-specific error
- invalid number: reject negatives, non-numeric strings, malformed currency and values above technical ceiling
- impossible combination: separate charge selected with blank amount; insurer amount > total; insurer estimate without same-scope confirmation
- unsupported region/procedure: calculator does not localize price or convert to deep-cleaning logic
- data unavailable: reference card may be hidden if source freshness gate fails; calculator still works on user-entered quote

## Test fixtures

| Fixture ID | Inputs | Expected output | Tolerance | Edge case? |
|---|---|---|---|---|
| C002-01 | one total $120; all optional items included/not listed; no insurance amount | total $120; patient $120; complete | $0 | No |
| C002-02 | one total $120; X-rays separate $60; other known; no insurance | total $180 | $0 | No |
| C002-03 | separate charges: cleaning $100; exam $40; X-rays $60 | total $200 | $0 | No |
| C002-04 | cleaning $100; fluoride separate $0 | total $100; zero accepted | $0 | Yes |
| C002-05 | separate charge chosen with blank amount | invalid; no total result | — | Yes |
| C002-06 | one total $150; exam `not sure` | total $150 visible; scope incomplete; patient amount suppressed | $0 | Yes |
| C002-07 | total $150; complete scope; insurer estimate $50 same scope | total $150; patient $100 | $0 | No |
| C002-08 | total $150; insurer $200 | invalid insurance-over-total | — | Yes |
| C002-09 | total blank | invalid, distinct from zero | — | Yes |
| C002-10 | published reference changes/hidden | user result unchanged | $0 | Yes |
| C002-11 | all monetary inputs at technical max in a combination exceeding safe aggregate policy | reject/guard aggregate overflow according to implementation ceiling | — | Yes |
| C002-12 | keyboard-only step navigation | all controls reachable; focus moves to step/error/result targets | — | Yes |

## Accessibility
- keyboard: native radio/checkbox/select/input/button controls; logical tab order
- labels: every input has visible label; status groups use fieldset/legend
- focus: step headings and error summary are programmatically focusable; no hidden focus traps
- errors announced: error summary linked/focused; result uses polite live region
- mobile layout: single-column at narrow widths; money inputs minimum 16px font; touch targets approximately 44px
- reduced motion: smooth scrolling disabled when user prefers reduced motion

## Analytics (privacy-safe)
If analytics is later enabled, record only high-level events such as calculator started/completed/error category. Do not transmit quote amounts, insurance values, dental status choices or other potentially sensitive input.

## Change log
- 1.0 / 2026-09-17 / initial evidence-controlled specification / PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1 / implementation pending
