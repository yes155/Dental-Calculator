# Dental Cost Estimator Specification — CALC-010

## Identity
- Tool ID: CALC-010
- Public name: Dental filling quote calculator
- URL: `/dental-filling-cost/`
- Parent procedure page: DEN-010
- Version: 1.0
- Last reviewed: 2026-09-17

## Purpose
- User task: Organize a written filling quote by the restoration count and descriptive labels actually shown on that quote.
- What this tool estimates: Arithmetic total from user-entered filling/restoration amounts; optional average per entered restoration; optional same-quote insurer estimate subtraction.
- What this tool does NOT determine: Whether a filling is needed; which material is appropriate; cavity depth; surface count from symptoms/images; whether an inlay/onlay/bonding/root canal is indicated; insurance eligibility or guaranteed benefits.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/Reason |
|---|---|---|---:|---:|---|---|---|
| quote_mode | enum | `one_total`, `itemized_restorations` | — | — | none | Yes | Written estimates may be bundled or itemized |
| restoration_count | integer | 1–32 | 1 | 32 | 1 | Yes | Count from written quote only |
| restoration_count_confirmed | boolean | yes/no | — | — | false | Yes | Prevent inferred treatment count |
| written_total | money | USD | 0 | 1,000,000 | blank | Conditional | Required in one-total mode |
| restoration_amounts | money[] | USD | 0 | 1,000,000 each | blank | Conditional | Required for each itemized restoration |
| material | enum | amalgam / composite resin / gold / porcelain-ceramic / glass ionomer / other / not stated | — | — | not stated | Yes | Descriptive quote label only |
| surface_count | enum | 1 / 2 / 3 / 4+ / mixed / not stated | — | — | not stated | Yes | Descriptive quote label only |
| tooth_location | enum | anterior / posterior / mixed / not stated | — | — | not stated | Yes | Descriptive quote label only |
| exam_imaging_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve quote uncertainty |
| exam_imaging_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| anesthesia_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve quote uncertainty |
| anesthesia_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| other_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Other written quote item |
| other_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| insurance_mode | enum | no insurance amount / entered estimate / not known | — | — | none | Yes | No hidden coverage percentage |
| insurer_estimate | money | USD | 0 | 1,000,000 | blank | Conditional | User-entered same-quote estimate only |
| same_scope_confirmed | boolean | yes/no | — | — | false | Conditional | Prevent unlike-scope subtraction |

All money inputs use decimal USD in UI and integer cents internally. The $1,000,000 ceiling is a technical validation limit, not a dental price assumption.

## Cost data

| Data field | Value/range | Unit | Geography | Pricing context | Source | Data date | Refresh date |
|---|---|---|---|---|---|---|---|
| Silver amalgam | $108–$256 | filling/restoration | 50 states + DC | Publisher-reported material range | CareCredit RRC-010-001 | 2024 research | 2027-03-17 |
| Composite resin | $173–$439 | filling/restoration | 50 states + DC | Publisher-reported material range | CareCredit | 2024 research | 2027-03-17 |
| Gold | $361–$817 | filling/restoration | 50 states + DC | Publisher-reported material range | CareCredit | 2024 research | 2027-03-17 |
| Porcelain/ceramic | $755–$1,774 | filling/restoration | 50 states + DC | Publisher-reported material range | CareCredit | 2024 research | 2027-03-17 |
| Glass ionomer | $116–$285 | filling/restoration | 50 states + DC | Publisher-reported material range | CareCredit | 2024 research | 2027-03-17 |
| Composite average | $226 | filling/restoration | 50 states + DC | Publisher-reported average | CareCredit | 2024 research | 2027-03-17 |
| Orlando examples | $199–$333 across named composite surface/location examples; $229 two-surface amalgam example | named local example | Orlando, Florida | Humana proprietary pricing-tool examples | Humana RRC-010-002 | current source context | 2027-03-17 |

Published ranges are display-only and never initialize, validate or change calculator arithmetic. Never create `$108–$1,774` as one generic filling range.

## Calculation logic
1. Parse all user-entered dollar values into integer cents. Blank and zero are distinct.
2. Require `restoration_count` in 1–32 and `restoration_count_confirmed=true`.
3. Base quote calculation:
   - `one_total`: base = `written_total`.
   - `itemized_restorations`: require exactly `restoration_count` entered restoration amounts and sum them.
4. Descriptive fields (`material`, `surface_count`, `tooth_location`) never change arithmetic.
5. Adjunct states:
   - `included`: add $0 and mark included.
   - `separate charge`: require amount and add it.
   - `not listed`: add $0 and mark absent from written quote only.
   - `not sure`: add $0 and mark scope incomplete.
6. `entered_total = base + separate exam/imaging + anesthesia + other amounts`.
7. `average_per_restoration` = base / confirmed restoration count. Exclude separately quoted adjuncts from this average unless the written quote itself identifies them as restoration-level charges.
8. If division leaves a remainder, display nearest-cent average with an `about` label.
9. Quote status:
   - `complete` when count is confirmed and all adjunct states are known.
   - `incomplete` when any adjunct is `not sure`.
   - `invalid` when required count/money/scope fields fail.
10. Insurance:
   - `no insurance amount`: insurer = 0.
   - `not known`: patient amount = unknown.
   - `entered estimate`: require valid amount, same-scope confirmation and insurer amount <= total.
11. Suppress patient amount when quote scope is incomplete.
12. Never compare the entered quote algorithmically with published material ranges; never label it high/low or clinically appropriate.

## Insurance model
This is not a benefit calculator.
- allowed amount assumption: none
- deductible: not calculated
- coinsurance/copay: not calculated
- annual maximum: not calculated
- network assumption: none
- waiting period/frequency: not modeled
- procedure/material category coverage: not assumed
- insurer estimate cannot exceed quote total
- only a user-entered same-scope insurer estimate may reduce the patient amount

## Output
- Primary output: total from the written quote
- Secondary output: arithmetic average per entered restoration
- Conditional output: amount after user-entered same-quote insurer estimate
- Scope summary: material, surface count/location and adjunct statuses exactly as selected from the quote
- Published reference: separate material-specific table/card; never a calculator default
- Verification prompt: compare with the provider's written estimate and plan documents

## Safety / YMYL boundary
- No diagnosis or cavity-depth logic.
- No choice or recommendation of filling material.
- No inference of surface count or tooth location.
- No conversion of porcelain/ceramic filling wording into inlay/onlay treatment.
- No insurance guarantee/default percentage.
- Estimator is user-entered quote arithmetic only.

## Error handling
- blank/invalid total or required restoration line: invalid
- invalid restoration count or unchecked confirmation: invalid
- separate adjunct selected with blank amount: invalid
- insurer > total: invalid
- entered insurer estimate without same-scope confirmation: invalid
- aggregate above technical ceiling: invalid
- material/surface/location `not stated`: valid descriptive state; never guessed

## Test fixtures

| Fixture ID | Inputs | Expected output | Edge case? |
|---|---|---|---|
| C010-01 | one total $250; 1 confirmed restoration; all adjuncts not listed; no insurance | total $250; avg $250; patient $250 | No |
| C010-02 | itemized $180 + $220; 2 restorations | total $400; avg $200 | No |
| C010-03 | total $250; exam/imaging separate $60 | total $310; average remains $250/restoration | No |
| C010-04 | total $250; anesthesia `not sure` | total visible; incomplete; patient suppressed | Yes |
| C010-05 | separate adjunct with blank amount | invalid | Yes |
| C010-06 | count 2 but only 1 itemized restoration line | invalid | Yes |
| C010-07 | count selected but confirmation unchecked | invalid | Yes |
| C010-08 | total $501; 2 restorations | average about $250.50 | Yes |
| C010-09 | material=gold vs composite with same entered amount | arithmetic unchanged; label changes only | Yes |
| C010-10 | complete total $500; insurer $150 same scope | patient $350 | No |
| C010-11 | insurer > total | invalid | Yes |
| C010-12 | published reference altered/hidden | arithmetic unchanged | Yes |
| C010-13 | blank vs explicit zero | blank invalid; zero valid | Yes |
| C010-14 | aggregate above technical ceiling | invalid | Yes |
| C010-15 | keyboard-only progression | all steps/controls usable and focus managed | Yes |

## Accessibility
- native form controls and fieldset/legend grouping
- visible labels for every money field and descriptive selector
- logical tab order
- focusable error summary and step headings
- polite live result region
- single-column narrow-screen layout and approximately 44px touch targets
- respect reduced-motion preference for scrolling

## Analytics (privacy-safe)
If analytics is later enabled, record only aggregate calculator start/complete/error events. Do not transmit quote amounts, materials, surface/location labels, insurance values or other potentially sensitive inputs.

## Change log
- 1.0 / 2026-09-17 / initial evidence-controlled specification / `RESTORATIONS_ROOT_CANAL_DIRECT_VERIFIED_EVIDENCE_v1.md` / implementation pending
