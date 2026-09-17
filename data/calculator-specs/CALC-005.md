# Dental Cost Estimator Specification — CALC-005

## Identity
- Tool ID: CALC-005
- Public name: Root canal quote calculator
- URL: `/root-canal-cost/`
- Parent procedure page: DEN-005
- Version: 1.0
- Last reviewed: 2026-09-17

## Purpose
- User task: Organize a written root-canal quote and keep the root-canal treatment amount separate from final restoration and other separately quoted items.
- What this tool estimates: Arithmetic total from user-entered quote amounts; optional average/per-treated-tooth normalization when the user confirms tooth count; optional same-quote insurer estimate subtraction.
- What this tool does NOT determine: Whether a root canal is needed; which tooth category applies unless the written quote states it; whether a crown, post, build-up or specialist is needed; retreatment need; market price from symptoms/location; insurance eligibility or guaranteed benefits.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/Reason |
|---|---|---|---:|---:|---|---|---|
| quote_mode | enum | `one_total`, `itemized` | — | — | none | Yes | Written estimates may be bundled or itemized |
| tooth_count | integer | 1–32 | 1 | 32 | 1 | Yes | Quote normalization only; not clinical inference |
| tooth_count_confirmed | boolean | yes/no | — | — | false | Yes | Forces count to come from written quote |
| tooth_category | enum | front/anterior; bicuspid/premolar; molar; mixed/multiple; not stated | — | — | not stated | Yes | Descriptive quote label only |
| root_canal_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Root-canal fee or bundle amount from quote |
| restoration_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Crown/filling/restoration scope |
| restoration_label | enum | crown / filling / other restoration / not stated | — | — | not stated | Conditional | Descriptive only |
| restoration_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when restoration is separate |
| buildup_post_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Quote-scope uncertainty |
| buildup_post_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| imaging_exam_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve quote uncertainty |
| imaging_exam_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| other_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Other written quote item |
| other_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only when separately quoted |
| retreatment_flag | enum | initial treatment / retreatment / not stated | — | — | not stated | Yes | Descriptive boundary only; never supplies price |
| insurance_mode | enum | no insurance amount / entered estimate / not known | — | — | none | Yes | No hidden coverage percentage |
| insurer_estimate | money | USD | 0 | 1,000,000 | blank | Conditional | User-entered same-quote estimate only |
| same_scope_confirmed | boolean | yes/no | — | — | false | Conditional | Prevent unlike-scope subtraction |

All money inputs use decimal USD in UI and integer cents internally. The $1,000,000 ceiling is a technical validation limit, not a dental price assumption.

## Cost data

| Data field | Value/range | Unit | Geography | Pricing context | Source | Data date | Refresh date |
|---|---|---|---|---|---|---|---|
| Root canal broad reference | $1,165 average; $500–$1,800 reported range | treatment | 50 states + DC | Publisher-reported procedural estimate | CareCredit RRC-005-001 | 2023–2024 research | 2027-03-17 |
| Front tooth | $776–$1,911 | treatment | 50 states + DC | Publisher-reported range | CareCredit | 2023–2024 research | 2027-03-17 |
| Bicuspid | $757–$1,798 | treatment | 50 states + DC | Publisher-reported range | CareCredit | 2023–2024 research | 2027-03-17 |
| Molar | $1,030–$2,471 | treatment | 50 states + DC | Publisher-reported range | CareCredit | 2023–2024 research | 2027-03-17 |
| Orlando examples | anterior $900; premolar $1,017; molar $1,175 | treatment, excluding final restoration | Orlando, Florida | Humana proprietary pricing-tool examples | Humana RRC-005-002 | tool access 2026-05-13 | 2027-03-17 |

Published data is reference-only and never initializes, validates or changes calculator arithmetic.

## Calculation logic
1. Parse all entered dollar values into integer cents. Blank and zero are distinct.
2. Require `tooth_count` in 1–32 and `tooth_count_confirmed=true`.
3. Base amount:
   - `one_total`: use the entered written total/root-canal amount as the base quote amount.
   - `itemized`: use the entered root-canal treatment amount as the base and add only components explicitly marked `separate charge`.
4. Component states:
   - `included`: add $0 and mark included.
   - `separate charge`: require amount and add it.
   - `not listed`: add $0 and mark absent from written quote only.
   - `not sure`: add $0 and mark scope incomplete.
5. `entered_total = base + separately quoted restoration + build-up/post + imaging/exam + other amounts`.
6. `average_per_treated_tooth` = entered total / confirmed tooth count only as arithmetic normalization of the user quote. If division leaves a remainder, label the displayed value `about`.
7. Quote status:
   - `complete` when tooth count is confirmed and all component states are known.
   - `incomplete` when any component is `not sure`.
   - `invalid` when required monetary/scope fields fail.
8. Retreatment:
   - If `retreatment_flag=retreatment`, show a scope note that the quote is for retreatment.
   - Do not compare it to or auto-fill any retreatment benchmark because none is approved.
9. Insurance:
   - `no insurance amount`: insurer = 0.
   - `not known`: patient amount = unknown.
   - `entered estimate`: require valid amount, same-scope confirmation and insurer amount <= entered total.
10. Suppress patient amount when quote scope is incomplete.
11. Never compare entered values algorithmically to published ranges and never flag a quote as high/low or clinically appropriate.

## Insurance model
This is not a benefit calculator.
- allowed amount assumption: none
- deductible: not calculated
- coinsurance/copay: not calculated
- annual maximum: not calculated
- network assumption: none
- waiting periods/frequency: not modeled
- procedure-category assignment: not assumed
- insurer amount may not exceed quote total
- only user-entered same-scope insurer estimate may reduce patient amount

## Output
- Primary output: total from the written quote
- Secondary output: arithmetic average per confirmed treated tooth when count > 0
- Conditional output: amount after user-entered same-quote insurer estimate
- Quote-scope summary: root-canal amount + restoration/build-up/imaging/other states
- Retreatment label: displayed when user says the written quote is for retreatment; no benchmark attached
- Published-reference card: broad and tooth-category CareCredit context plus local Orlando examples, clearly non-computational
- Verification prompt: compare with the provider's written estimate and plan documents

## Safety / YMYL boundary
- No diagnosis or symptom logic.
- No decision that a root canal, crown, filling, post, build-up, retreatment or specialist is needed.
- No treatment recommendation or material choice.
- No universal specialist premium.
- No insurance guarantee or default percentage.
- Estimator is user-entered quote arithmetic only.

## Error handling
- blank/invalid base amount: invalid
- negative/malformed/out-of-limit amount: invalid
- unconfirmed tooth count: invalid
- separate component selected with blank amount: invalid
- insurer > total: invalid
- entered insurer estimate without same-scope confirmation: invalid
- aggregate above technical ceiling: invalid
- unsupported retreatment price: no generated value; keep informational scope note only

## Test fixtures

| Fixture ID | Inputs | Expected output | Edge case? |
|---|---|---|---|
| C005-01 | root canal $1,100; 1 confirmed tooth; all add-ons not listed; no insurance amount | total $1,100; patient $1,100; complete | No |
| C005-02 | root canal $1,100; crown separate $1,300 | total $2,400 | No |
| C005-03 | root canal $1,100; filling included | total $1,100; restoration included | No |
| C005-04 | root canal $1,100; crown `not sure` | total $1,100 visible; incomplete; patient suppressed | Yes |
| C005-05 | separate crown selected with blank amount | invalid | Yes |
| C005-06 | total $2,200; 2 confirmed teeth | avg $1,100/tooth | No |
| C005-07 | total $2,201; 2 teeth | average about $1,100.50 | Yes |
| C005-08 | quote marked retreatment; $1,500 entered | calculate entered quote only; show retreatment label; no market comparison | Yes |
| C005-09 | total $1,500; insurer $500 same scope | patient $1,000 | No |
| C005-10 | insurer > total | invalid | Yes |
| C005-11 | published reference hidden/changed | arithmetic unchanged | Yes |
| C005-12 | blank base vs explicit zero | blank invalid; explicit zero valid | Yes |
| C005-13 | aggregate > technical ceiling | invalid | Yes |
| C005-14 | keyboard-only step flow | controls reachable and focus managed | Yes |

## Accessibility
- native form controls, fieldset/legend grouping and logical tab order
- visible labels for every monetary input
- error summary focus target with field-level invalid state
- polite result live region
- mobile single-column layout and 44px touch targets
- respect reduced-motion preference for result scrolling

## Analytics (privacy-safe)
If analytics is later enabled, record only aggregate start/complete/error events. Do not transmit quote amounts, tooth labels, retreatment state, insurance values or other potentially sensitive inputs.

## Change log
- 1.0 / 2026-09-17 / initial evidence-controlled specification / `RESTORATIONS_ROOT_CANAL_DIRECT_VERIFIED_EVIDENCE_v1.md` / implementation pending
