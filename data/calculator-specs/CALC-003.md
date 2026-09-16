# CALC-003 — Full-Mouth / Full-Arch Quote Normalizer Spec

Status: FROZEN FOR IMPLEMENTATION  
Page: DEN-003 `/full-mouth-dental-implants-cost/`  
Updated: 2026-09-16

## 1. Purpose

Normalize a user's written full-arch/full-mouth implant quote by explicit arch count and package scope.

This is a quote-normalization calculator, not a treatment planner and not a national-price estimator.

## 2. Evidence constraint

A secondary Forbes Advisor source reports an ADA-attributed $20,000–$45,000 figure for a “mouthful of implants,” but the source does not define exact arch count, implant count, restoration type or package inclusions. Therefore:
- no national per-arch default is authorized;
- the $20,000–$45,000 figure may appear as page context only, not as a hidden/default calculator value;
- the tool may only calculate from user-entered quote amounts.

## 3. Inputs

- `quoted_total`: currency $0–$1,000,000.
- `arch_count`: required enum `1` or `2`, defined as the number of arches explicitly covered by the written quote.
- `restoration_label`: optional enum `fixed`, `removable`, `not_stated`; descriptive only, never a recommendation.
- Package status fields:
  - implant placement
  - abutments
  - temporary/provisional prosthesis
  - final prosthesis
  - extractions
  - bone grafting
  - imaging/exam
  - sedation/anesthesia
  - follow-up/adjustment visits
  - other quoted component
- Status enum: `included`, `separately_quoted`, `not_on_quote`, `unknown`.
- For `separately_quoted`, optional amount can be entered and added.

Insurance:
- `none`
- `entered_estimate`
- `unknown`

If `entered_estimate`:
- insurer estimate amount
- same-scope confirmation

## 4. Logic

Currency is parsed in integer cents.

`entered_total = quoted_total + sum(entered separately_quoted amounts)`

`normalized_per_arch = entered_total / arch_count`

If division creates a fractional cent, display “approx.” and round to nearest cent for UI only while retaining exact arithmetic internally where possible.

Insurance:
- none → patient estimate = entered_total
- entered_estimate + same-scope confirmed + amount <= entered_total → subtract insurer estimate
- unknown or scope not confirmed → patient estimate UNKNOWN

No automatic deductible, annual maximum, coinsurance or waiting-period logic.

## 5. Outputs

- Entered quote total.
- Number of arches covered.
- Approximate per-arch normalized amount.
- Restoration label exactly as entered (fixed/removable/not stated).
- Package inclusion matrix.
- Scope-completeness warning if any status is unknown or separate without amount.
- Conditional insurer contribution and patient estimate.
- Link to DEN-012 when user indicates the written quote is specifically All-on-4; the tool must not automatically switch price models.

## 6. What the tool must not do

- infer arch count from price;
- infer number of implants;
- infer fixed/removable suitability;
- use All-on-4 price data as generic full-arch data;
- halve or double a national range to invent an arch price;
- determine graft/extraction need;
- generate clinical recommendations;
- call output an actual quote or coverage guarantee.

## 7. Scope status behavior

Unknown package items do not block display of the entered total; they block language implying the quote is all-inclusive.

A quote with both final prosthesis and temporary prosthesis marked unknown should show a prominent prosthesis-scope warning.

A quote with graft/extraction marked `not_on_quote` must not imply those services are unnecessary—only that they are not listed on the quote.

## 8. Insurance evidence / method

General plan mechanics are supported by Cigna/Delta/CMS source register entries. Exact user benefits remain plan-specific.

The calculator accepts only an insurer estimate already supplied to the user for the same scope. It does not calculate plan benefits from a percentage.

## 9. Privacy / accessibility

Same standards as CALC-001:
- no storage/network/URL serialization of entered amounts;
- labeled controls, fieldsets, error summary, live result region;
- keyboard-only use;
- widths: 320/390/768/1280/1920.

## 10. Test matrix

1. Blank → invalid.
2. $20,000 quote, 1 arch → $20,000 per arch.
3. $40,000 quote, 2 arches → $20,000 per arch.
4. $30,001.01 quote, 2 arches → approximate normalized value with correct rounding label.
5. Unknown final prosthesis → total allowed + warning.
6. Separate graft $2,000 added to $25,000 quote → $27,000 entered total.
7. Separate graft with no amount → incomplete warning; no guessed value.
8. Insurance none → patient estimate = total.
9. Insurance unknown → patient estimate UNKNOWN.
10. Same-scope insurer estimate $5,000 on $30,000 → $25,000 patient estimate.
11. Insurer estimate > total → invalid.
12. `restoration_label=not_stated` → no inferred category.
13. All-on-4 label/link does not alter entered values.
14. No national reference range changes calculation.
15. Reset clears values.
16. No persistence/network/URL serialization.

## 11. Implementation dependency

Prefer a shared quote-normalization core with CALC-003-A04, parameterized by page-specific reference content and scope labels. Formula logic must remain source-independent and quote-input driven.
