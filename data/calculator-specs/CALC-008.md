# CALC-008 — Tooth-extraction quote total

Version: 1.0-prelaunch  
Last reviewed: 2026-09-16  
Parent page: DEN-008 `/tooth-extraction-cost/`

## Purpose

**User task:** total amounts already present on a written non-wisdom tooth-extraction quote and, when the user has a same-scope insurer-payment estimate, show the arithmetic patient-share estimate.

**This tool estimates:** the sum of user-entered quote lines and explicitly separately billed adjuncts; optionally the arithmetic remainder after a user-entered same-scope insurer-payment estimate.

**This tool does NOT:** supply dental prices, choose simple versus surgical extraction, infer a tooth count, determine whether extraction is needed, determine candidacy or urgency, calculate plan benefits from percentages/deductibles/annual maximums, or provide an actual dental quote.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/reason |
|---|---|---|---:|---:|---|---|---|
| Quote basis | Radio | `bundle` / `itemized` | — | — | none | Yes | Prevents bundle + line-item double counting |
| Bundle provider label | Text | Provider's exact category/service wording | — | — | blank | Bundle only | Preserves quote classification; tool does not classify treatment |
| Bundle scope | Text | Tooth identifier or explicitly grouped scope | — | — | blank | Bundle only | Prevents inferred tooth count |
| Bundle line total | Money | USD | $0.00 | $1,000,000.00 technical ceiling | blank | Bundle only | User-entered written quote amount |
| Itemized provider label | Text | Provider's exact service/category wording | — | — | blank | Each itemized line | Duplicate and wisdom-label guard |
| Itemized scope | Text | Tooth identifier or explicitly grouped scope | — | — | blank | Each itemized line | Duplicate and inferred-count guard |
| Itemized line total | Money | USD | $0.00 | $1,000,000.00 technical ceiling | blank | Each itemized line | User-entered written quote amount |
| Examination or imaging | Status + optional money | separately billed / included / not on quote / unknown | $0.00 | $1,000,000.00 | none | Yes status | Inclusion-boundary control |
| Sedation or anesthesia | Status + optional money | separately billed / included / not on quote / unknown | $0.00 | $1,000,000.00 | none | Yes status | Inclusion-boundary control; no sedation advice |
| Bone graft | Status + optional money | separately billed / included / not on quote / unknown | $0.00 | $1,000,000.00 | none | Yes status | Inclusion-boundary control; graft pricing depth belongs DEN-007 |
| Other quoted adjunct | Status + optional money | separately billed / included / not on quote / unknown | $0.00 | $1,000,000.00 | none | Yes status | Captures other explicit quote lines without inventing categories |
| Insurance mode | Select | none / entered same-scope estimate / unknown | — | — | none | Yes | Avoids assuming coverage |
| Insurer-payment estimate | Money | USD | $0.00 | $1,000,000.00 | blank | When entered-estimate mode selected | User-supplied insurer estimate only |
| Same-scope confirmation | Checkbox | confirmed / not confirmed | — | — | false | When entered-estimate mode selected | Ensures quote and insurer estimate refer to same lines/scope |

### Money parsing

- Accept digits with an optional decimal point and one or two decimal places.
- Commas, currency symbols inside the input, negatives, exponent notation and more than two decimal places are invalid.
- Blank is invalid and is explicitly different from `0`.
- Arithmetic is performed in integer cents.
- Any individual amount or combined quote total above $1,000,000.00 is rejected as outside the technical ceiling. The ceiling is not a dental price assumption.

## Calculation logic

1. Require exactly one quote basis: one complete named bundle **or** itemized quote lines.
2. For a bundle, require provider label, quoted tooth/group scope and line total.
3. For itemized mode, require at least one line. Each line requires provider label, scope and amount.
4. Normalize label/scope text only for duplicate detection. If two itemized lines have the same normalized service label and scope, reject the duplicate rather than risk double counting.
5. If a provider label or scope contains a wisdom-tooth/third-molar label, stop that line with a routing error to `/wisdom-teeth-removal-cost/`. CALC-008 does not own wisdom-tooth quotes.
6. Start the subtotal with the valid bundle or itemized extraction-line amounts.
7. For each adjunct component:
   - `separately_billed`: require a valid amount and add it once;
   - `included`: add $0;
   - `not_on_quote`: add $0;
   - `unknown`: add no amount but mark scope incomplete.
8. Reject a combined quote subtotal above the $1,000,000.00 technical ceiling.
9. Require an insurance mode:
   - `none`: insurer amount = $0;
   - `entered_estimate`: require a valid insurer-payment estimate and explicit same-scope confirmation;
   - `unknown`: do not calculate a patient-share amount.
10. When scope is complete, reject a user-entered insurer estimate greater than the entered quote subtotal.
11. If any validation error exists, return `invalid` and do not show totals as a valid result.
12. If any adjunct status is `unknown`, return `incomplete`: the entered subtotal may be shown, but complete total/patient share is suppressed.
13. Otherwise return `valid`:
   - `total = subtotal`;
   - if insurance mode is `none`, `patient share = total`;
   - if a same-scope insurer estimate is entered, `patient share = total - insurer estimate`;
   - if insurance mode is `unknown`, patient share remains suppressed.

## Insurance model

CALC-008 deliberately does **not** implement a benefit model. It does not calculate an allowed amount, deductible, coinsurance/copay, annual maximum, waiting period, network adjustment or exclusion.

The only insurance arithmetic is subtraction of a **user-entered, same-scope insurer-payment estimate** from a complete entered quote total. This is not a coverage guarantee and does not recalculate benefits.

## Outputs

### `valid`
- Entered quote total in USD.
- User-entered insurer-payment estimate when applicable.
- Arithmetic patient-share estimate when insurance is `none` or a valid same-scope insurer estimate is entered.
- Component scope/status summary.

### `incomplete`
- Entered subtotal may be shown.
- Complete total/patient-share result is suppressed because at least one quote component is marked `unknown`.

### `invalid`
- No valid total/patient-share result.
- Field-level and summary validation messages explain what must be corrected.

### Rounding
No percentage or statistical rounding is performed. User-entered money is parsed to integer cents and formatted as USD with two decimal places.

## Safety / YMYL boundary

- No diagnosis.
- No treatment recommendation.
- No candidacy or urgency determination.
- No extraction-type selection.
- No inferred tooth count.
- No supplied/default procedure prices.
- No insurance coverage guarantee or benefit recalculation.
- Result is an estimate from entered quote amounts, not an actual dental quote.
- Users should verify the complete quote with the dental office and plan-specific benefits with the insurer/plan administrator.

## Error handling

- Empty monetary input: invalid; blank is not treated as zero.
- Invalid money syntax: invalid.
- Negative value: invalid.
- Amount above technical ceiling: invalid.
- Missing quote basis: invalid.
- Missing itemized lines: invalid.
- Missing provider label/scope: invalid.
- Duplicate normalized service + scope: invalid.
- Wisdom-tooth/third-molar wording: route to `/wisdom-teeth-removal-cost/`.
- Missing adjunct status: invalid.
- Unknown adjunct status: incomplete result rather than assumed zero.
- Missing insurance mode: invalid.
- Entered insurer estimate without same-scope confirmation: invalid.
- Complete-scope insurer estimate greater than subtotal: invalid.
- Unknown insurance amount/scope: suppress patient share.

## Accessibility / interaction contract

- Every input must have a programmatically associated label.
- Quote-basis and component groups use semantic fieldsets/legends where appropriate.
- Error summary uses an alert region and must receive focus after failed submission.
- Result uses a polite live region.
- Full calculator must be operable by keyboard.
- Visible focus must be preserved.
- Tables/controls/results must not cause horizontal page scrolling at supported mobile widths.
- Reduced-motion preference must be respected.
- Required rendered widths: 320, 390, 768, 1280 and 1920 px.

## Privacy

The current implementation performs calculations locally in the browser tab. It does not persist inputs to browser storage, serialize them into the URL, send them to analytics, or make calculator-originated external requests. Re-audit this statement if any analytics, form handling or third-party services are added.

## Test fixtures / verification

Current automated status: **22/22 PASS**.

- 13/13 shared quote-input fixtures.
- 9/9 CALC-008-specific validation and formatting tests.
- Coverage includes bundle/itemized mutual contribution guard, integer-cent arithmetic, explicit zero, technical ceilings, malformed values, unknown component handling, insurance branches, insurer-over-total guard, duplicate service/scope and wisdom-label routing.

Rendered QA remains **NOT TESTED**. Required rendered/browser verification covers 320/390/768/1280/1920 px, label association, visible focus, live-result behavior, valid and incomplete calculations, wisdom routing, reset behavior, no storage, URL stability and console errors.

## Implementation source

- Core logic: `src/assets/calc008-core.mjs`
- UI binding: `src/assets/calc008-ui.mjs`
- Parent page: `src/tooth-extraction-cost/index.html`
- Automated tests: `tests/calc008-core.test.mjs`
- Shared fixtures: `tests/quote-input-fixtures.json`

## Change log

- 2026-09-16 — v1.0-prelaunch: frozen CALC-008 quote-input logic documented from the tested implementation; 22/22 automated tests passing; rendered QA still open.
