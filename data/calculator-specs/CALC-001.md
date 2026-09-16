# CALC-001 — Dental Implant Quote Calculator Spec

Status: FROZEN FOR IMPLEMENTATION  
Page: DEN-001 `/dental-implant-cost-calculator/`  
Updated: 2026-09-16

## 1. Purpose

Help a user total and normalize a **written single-tooth or multi-tooth implant quote** while keeping implant body/post, abutment, crown and adjunct scope visible.

The calculator is cost education only. It does not generate a dentist's quote, determine candidacy, choose treatment or predict insurance coverage.

## 2. Evidence inputs

Primary reference dataset:
- `SRC-DEN001-001` CareCredit Dental Implants Cost and Procedure Guide.
- Published 2025-03-14; 2023–2024 Synchrony procedural-cost research across 50 states + DC.
- Single-tooth implant artificial-root process/material: average $2,143; range $1,646–$4,157.
- Crown excluded; state values also exclude crown, extraction and office-related fees.
- Immediate-load implant average: $3,255.

Local contrast only:
- `SRC-DEN001-003` Humana Orlando, Florida example: $856–$2,122 for one dental implant; scope not complete enough for a default.

No reference value is auto-inserted into the user's quote.

## 3. Calculator modes

### Mode A — Total quote
User enters one written quote total and identifies what that quote says is included.

### Mode B — Itemized quote
User enters individual quoted amounts for known components. Calculator adds only entered line items.

No treatment-mode selector may infer what the user needs.

## 4. Inputs

### Shared
- `tooth_count`: integer 1–32. Label: number of teeth covered by this quote. User-entered only.
- `quote_mode`: `bundle` or `itemized`.

### Bundle mode
- `bundle_amount`: currency, $0–$1,000,000.
- Component status for each:
  - implant body/process
  - abutment
  - final crown/prosthesis
  - extraction
  - bone graft
  - imaging/exam
  - sedation/anesthesia
  - other adjunct
- Status enum: `included`, `separately_quoted`, `not_on_quote`, `unknown`.
- If `separately_quoted`, optional amount field is allowed and added only if user enters it.

### Itemized mode
For each line item:
- label
- scope (`per_tooth`, `case_total`, `other_explicit_scope`)
- amount
- optional quantity if explicitly present in quote

Suggested named rows:
- implant body/process
- abutment
- crown/prosthesis
- extraction
- bone graft
- imaging/exam
- sedation/anesthesia
- other

Custom rows allowed, but duplicate normalized label+scope pairs are rejected.

### Insurance
- `insurance_mode`: `none`, `entered_estimate`, `unknown`.
- If `entered_estimate`:
  - `insurer_estimate_amount`
  - checkbox/confirmation that insurer amount applies to the same quote scope entered above.
- No default coinsurance, deductible, annual maximum or waiting period.

## 5. Calculation logic

Currency parsing uses integer cents. Reject malformed currency, negatives and values above $1,000,000.

### Bundle subtotal
`subtotal = bundle_amount + sum(entered separately_quoted adjunct amounts)`

If any component status is `unknown`, subtotal may still be displayed as **entered quote total**, but output must state that scope completeness is unknown.

### Itemized subtotal
For each line item:
- `per_tooth`: `amount * explicit_quantity`; if quantity omitted, use `tooth_count` only when user confirms the quoted amount is per tooth.
- `case_total`: amount once.
- `other_explicit_scope`: include only when quantity/multiplier is explicit.

`subtotal = sum(valid line totals)`

### Per-tooth normalization
If `tooth_count >= 1`:
`per_tooth_entered_quote = subtotal / tooth_count`

Display as approximate if division produces a fractional cent.

### Insurance
- `none`: insurer contribution = $0; patient estimate = subtotal.
- `entered_estimate`: only subtract when same-scope confirmation is true and estimate <= subtotal.
- `unknown`: patient estimate = UNKNOWN.

`patient_estimate = subtotal - insurer_estimate` only for valid same-scope entered estimate.

Never apply a plan percentage automatically.

## 6. Outputs

- Entered quote subtotal.
- Approximate per-tooth entered quote amount.
- Component scope table: included / separate / not on quote / unknown.
- Missing/unknown-scope warning.
- Conditional insurer contribution, if explicitly entered.
- Conditional patient estimate.
- Non-computational reference card:
  - CareCredit single-tooth implant artificial-root process/material: $2,143 average; $1,646–$4,157 range.
  - Explicitly state crown excluded and state data also exclude extraction/office fees.
  - Data vintage/methodology label.

## 7. Reference-card rules

Reference values are informational only and never become hidden calculator inputs.

Do not:
- add crown costs to the CareCredit implant figure automatically;
- merge the Humana Orlando example into a national range;
- use Forbes $3,000–$4,500 as a default package price;
- extrapolate single-tooth values into full-mouth totals.

## 8. Error / incomplete states

Invalid:
- blank required monetary field for active mode
- negative/malformed currency
- tooth_count outside 1–32
- insurer estimate > same-scope subtotal
- duplicate itemized label+scope
- multiplier without explicit scope confirmation

Incomplete warning:
- any component marked `unknown`
- separately quoted component without entered amount
- insurance mode unknown

Incomplete scope does not erase the entered quote subtotal; it prevents language implying the subtotal is all-inclusive.

## 9. YMYL / clinical guardrails

The calculator must never:
- decide whether an implant is needed;
- decide implant material/system;
- infer graft/extraction/sedation need;
- determine candidacy or prognosis;
- label a quote clinically correct/incorrect;
- call its output an actual quote.

Required disclaimer: “This tool organizes amounts from a written dental quote and published cost references. It is not a diagnosis, treatment recommendation, coverage guarantee or dental quote.”

## 10. Privacy

No account data required. No storage, analytics event payload containing quote values, external requests or URL serialization for entered amounts unless separately approved through privacy review.

## 11. Accessibility

- Programmatic labels for all fields.
- Fieldsets/legends for component statuses and insurance mode.
- Error summary receives focus on invalid submit.
- Result region uses appropriate live-region behavior without repeated announcements.
- Keyboard-only operation.
- Test at 320, 390, 768, 1280 and 1920 px.

## 12. Test matrix

1. Blank form → invalid.
2. Bundle $0 → valid zero entered quote, clearly labeled.
3. Bundle $4,000, tooth_count 1, no insurance → patient estimate $4,000.
4. Bundle $8,000, tooth_count 2 → approx per tooth $4,000.
5. Itemized post $2,000 + abutment $500 + crown $1,200 → subtotal $3,700.
6. Per-tooth item $2,000 × 2 confirmed teeth → $4,000.
7. Unknown graft status → subtotal shown but scope warning.
8. Separate graft status without amount → incomplete warning; do not guess.
9. Insurance unknown → patient estimate UNKNOWN.
10. Entered insurer $1,000 on $4,000 same-scope quote → patient estimate $3,000.
11. Insurer estimate > subtotal → invalid.
12. Duplicate itemized label+scope → invalid.
13. Malformed/negative/over-ceiling money → invalid.
14. Reference panel never changes subtotal.
15. Reset clears entered values and result state.
16. No values written to URL/storage/network.

## 13. Implementation dependencies

- Reuse the tested integer-cent and same-scope insurance patterns from CALC-008 where appropriate.
- Keep reference data in a versioned data/config layer, not hard-coded across multiple UI files.
- Any future reference-data update requires source-register update + fixture regression.
