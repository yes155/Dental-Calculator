# Dental Cost Estimator Specification — CALC-022

## Identity
- Tool ID: CALC-022
- Public name: Dental crown quote calculator
- URL: `/dental-crown-cost/`
- Parent procedure page: DEN-022
- Version: 1.0
- Last reviewed: 2026-09-17

## Purpose
- User task: Organize a written new-crown quote by confirmed crown count and the material/type stated on the estimate.
- What this tool estimates: Arithmetic total from user-entered crown and separately quoted add-on amounts; optional average per crown; optional same-quote insurer estimate subtraction.
- What this tool does NOT determine: Whether a crown is needed; which material is appropriate; whether a build-up is clinically required; whether repair/recement is appropriate instead; implant-supported crown pricing; insurance eligibility or guaranteed benefits.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/Reason |
|---|---|---|---:|---:|---|---|---|
| quote_mode | enum | `one_total`, `itemized_crowns` | — | — | none | Yes | Written estimates may be bundled or itemized |
| crown_count | integer | 1–32 | 1 | 32 | 1 | Yes | Count from written quote only |
| crown_count_confirmed | boolean | yes/no | — | — | false | Yes | Prevent inferred treatment count |
| written_total | money | USD | 0 | 1,000,000 | blank | Conditional | Required in one-total mode |
| crown_amounts | money[] | USD | 0 | 1,000,000 each | blank | Conditional | Required for each itemized crown |
| crown_material | enum | porcelain / porcelain-fused-to-metal / metallic / resin-temporary / other / not stated | — | — | not stated | Yes | Descriptive quote label only |
| buildup_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Build-up/foundation scope |
| buildup_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| exam_imaging_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve quote uncertainty |
| exam_imaging_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| other_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Other written quote item |
| other_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| insurance_mode | enum | no insurance amount / entered estimate / not known | — | — | none | Yes | No hidden coverage percentage |
| insurer_estimate | money | USD | 0 | 1,000,000 | blank | Conditional | User-entered same-quote estimate only |
| same_scope_confirmed | boolean | yes/no | — | — | false | Conditional | Prevent unlike-scope subtraction |

All money inputs use decimal USD in UI and integer cents internally. The $1,000,000 ceiling is a technical validation limit, not a dental price assumption.

## Cost data

| Data field | Value/range | Unit | Geography | Pricing context | Source | Data date | Refresh date |
|---|---|---|---|---|---|---|---|
| Porcelain crown | $1,399 average; $915–$3,254 | crown | 50 states + DC | Publisher-reported material estimate | CareCredit RRC-022-001 | 2024 research | 2027-03-17 |
| Porcelain fused to metal | $1,114 average; $770–$2,454 | crown | 50 states + DC | Publisher-reported material estimate | CareCredit | 2024 research | 2027-03-17 |
| Metallic crown | $1,211 average; $821–$2,861 | crown | 50 states + DC | Publisher-reported material estimate | CareCredit | 2024 research | 2027-03-17 |
| Resin/temporary crown | $697 average; $488–$1,593 | crown | 50 states + DC | Publisher-reported material estimate | CareCredit | 2024 research | 2027-03-17 |
| Orlando examples | porcelain/ceramic $1,387; PFM high noble $1,192; full cast high noble $1,440; PFM noble $1,248; PFM base metal $1,091 | named local example | Orlando, Florida | Humana proprietary pricing-tool examples | Humana RRC-022-002 | current source context | 2027-03-17 |
| Broken crown repair | $765 average | repair service | broad CareCredit procedure list | distinct repair category | CareCredit RRC-022-004 | 2023–2024 lineage | 2027-03-17 |
| Recement dislodged crown | $126 average | recement service | broad CareCredit procedure list | distinct recement category | CareCredit RRC-022-004 | 2023–2024 lineage | 2027-03-17 |

Published data is reference-only and never initializes, validates or changes calculator arithmetic. Repair and recement data never becomes a new-crown or replacement-crown default.

## Calculation logic
1. Parse all user-entered dollar values into integer cents. Blank and zero are distinct.
2. Require `crown_count` in 1–32 and `crown_count_confirmed=true`.
3. Base quote calculation:
   - `one_total`: base = `written_total`.
   - `itemized_crowns`: require exactly `crown_count` entered crown amounts and sum them.
4. `crown_material` is descriptive only and never changes arithmetic.
5. Add-on states:
   - `included`: add $0 and mark included.
   - `separate charge`: require amount and add it.
   - `not listed`: add $0 and mark absent from written quote only.
   - `not sure`: add $0 and mark scope incomplete.
6. `entered_total = base + separate build-up/foundation + exam/imaging + other amounts`.
7. `average_per_crown = base / confirmed crown count`; separately quoted add-ons are excluded from this average.
8. If division leaves a remainder, show nearest-cent average with an `about` label.
9. Quote status:
   - `complete` when crown count is confirmed and all add-on states are known.
   - `incomplete` when any add-on is `not sure`.
   - `invalid` when required monetary/scope fields fail.
10. Insurance:
   - `no insurance amount`: insurer = 0.
   - `not known`: patient amount = unknown.
   - `entered estimate`: require valid amount, same-scope confirmation and insurer amount <= total.
11. Suppress patient amount when quote scope is incomplete.
12. Never compare entered values algorithmically with published material ranges and never label a quote high/low or clinically appropriate.
13. Never use repair $765 or recement $126 in new-crown arithmetic or as a replacement-crown benchmark.

## Insurance model
This is not a benefit calculator.
- allowed amount assumption: none
- deductible: not calculated
- coinsurance/copay: not calculated
- annual maximum: not calculated
- network assumption: none
- waiting period/frequency: not modeled
- service/material category coverage: not assumed
- insurer estimate cannot exceed quote total
- only a user-entered same-scope insurer estimate may reduce the patient amount

## Output
- Primary output: total from the written crown quote
- Secondary output: arithmetic average per confirmed crown
- Conditional output: amount after user-entered same-quote insurer estimate
- Scope summary: crown material/type and add-on states exactly as selected from the quote
- Published reference: separate material-specific table/card; repair/recement shown only as clearly different categories if editorially useful
- Verification prompt: compare with the provider's written estimate and plan documents

## Safety / YMYL boundary
- No diagnosis or treatment need.
- No crown-material recommendation.
- No decision that build-up/foundation is required.
- No treatment substitution between new crown, repair or recement.
- No implant-supported crown pricing on DEN-022.
- No insurance guarantee/default percentage.
- Estimator is user-entered quote arithmetic only.

## Error handling
- blank/invalid total or required crown line: invalid
- invalid crown count or unchecked confirmation: invalid
- separate add-on selected with blank amount: invalid
- insurer > total: invalid
- entered insurer estimate without same-scope confirmation: invalid
- aggregate above technical ceiling: invalid
- material `not stated`: valid descriptive state; never guessed

## Test fixtures

| Fixture ID | Inputs | Expected output | Edge case? |
|---|---|---|---|
| C022-01 | one total $1,400; 1 confirmed crown; all add-ons not listed; no insurance | total $1,400; avg $1,400; patient $1,400 | No |
| C022-02 | itemized $1,200 + $1,500; 2 crowns | total $2,700; avg $1,350 | No |
| C022-03 | total $1,400; build-up separate $250 | total $1,650; average remains $1,400/crown | No |
| C022-04 | total $1,400; build-up `not sure` | total visible; incomplete; patient suppressed | Yes |
| C022-05 | separate build-up with blank amount | invalid | Yes |
| C022-06 | count 2 but one itemized crown line | invalid | Yes |
| C022-07 | count selected but confirmation unchecked | invalid | Yes |
| C022-08 | total $2,801; 2 crowns | average about $1,400.50 | Yes |
| C022-09 | porcelain vs metallic with same entered amount | arithmetic unchanged; label changes only | Yes |
| C022-10 | total $1,500; insurer $500 same scope | patient $1,000 | No |
| C022-11 | insurer > total | invalid | Yes |
| C022-12 | repair/recement references hidden or changed | new-crown arithmetic unchanged | Yes |
| C022-13 | blank vs explicit zero | blank invalid; zero valid | Yes |
| C022-14 | aggregate above technical ceiling | invalid | Yes |
| C022-15 | keyboard-only progression | all steps/controls usable and focus managed | Yes |

## Accessibility
- native controls and fieldset/legend grouping
- visible labels for every money field and material selector
- logical tab order
- focusable error summary and step headings
- polite live result region
- narrow-screen single-column layout and approximately 44px touch targets
- respect reduced-motion preference for scrolling

## Analytics (privacy-safe)
If analytics is later enabled, record only aggregate calculator start/complete/error events. Do not transmit quote amounts, crown material labels, insurance values or other potentially sensitive inputs.

## Change log
- 1.0 / 2026-09-17 / initial evidence-controlled specification / `RESTORATIONS_ROOT_CANAL_DIRECT_VERIFIED_EVIDENCE_v1.md` / implementation pending
