# Dental Cost Estimator Specification — CALC-006

## Identity
- Tool ID: CALC-006
- Public name: Deep cleaning quote calculator
- URL: `/deep-teeth-cleaning-cost/`
- Parent procedure page: DEN-006
- Version: 1.0
- Last reviewed: 2026-09-17

## Purpose
- User task: Organize a written scaling-and-root-planing (SRP) quote by the number of quadrants explicitly stated on that quote.
- What this tool estimates: Arithmetic total from user-entered written quote amounts; average cost per quoted quadrant when mathematically valid; optional same-quote insurer estimate subtraction.
- What this tool does NOT determine: Whether SRP is needed, how many quadrants need treatment, whether anesthesia/medications are required, number of visits, insurance eligibility, or a market quote from symptoms.

## Inputs

| Input | Type | Unit/options | Min | Max | Default | Required? | Source/Reason |
|---|---|---|---:|---:|---|---|---|
| quote_mode | enum | `one_total`, `separate_quadrant_charges` | — | — | none | Yes | Written SRP estimates may be totalled or itemized |
| quadrant_count | integer | 1,2,3,4 | 1 | 4 | none | Yes | Only from written quote; never inferred clinically |
| quadrant_count_confirmed | boolean | yes/no | — | — | false | Yes | Forces explicit quote-based scope |
| written_total | money | USD | 0 | 1,000,000 | blank | Conditional | Required in `one_total` mode |
| quadrant_charge_1..4 | money | USD | 0 | 1,000,000 | blank | Conditional | Required for each stated quadrant in itemized mode |
| anesthesia_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Preserve adjunct uncertainty |
| anesthesia_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only if marked separate |
| other_status | enum | included / separate charge / not listed / not sure | — | — | not sure | Yes | Other quote adjuncts |
| other_amount | money | USD | 0 | 1,000,000 | blank | Conditional | Only if marked separate |
| insurance_mode | enum | no insurance amount / entered estimate / not known | — | — | none | Yes | No automatic benefit model |
| insurer_estimate | money | USD | 0 | 1,000,000 | blank | Conditional | Only same-quote user-provided estimate |
| same_scope_confirmed | boolean | yes/no | — | — | false | Conditional | Prevent mismatch between insurer estimate and quote |

Money inputs are decimal USD in UI and integer cents internally. The $1,000,000 bound is technical only.

## Cost data

| Data field | Value/range | Unit | Geography | Pricing context | Source | Data date | Refresh date |
|---|---|---|---|---|---|---|---|
| SRP published reference | $180–$295 | per quadrant | U.S. consumer guidance; exact static-range sample/date not stated | average cost without dental benefits | Delta Dental PREV-001 | UNKNOWN | 2027-03-17 |
| SRP local comparison | $235–$303 | per quadrant | Orlando, Florida | Humana proprietary pricing-tool example | Humana PREV-004 | UNKNOWN | 2027-03-17 |

Published references are display-only and never become user defaults.

## Calculation logic

1. Parse money as integer cents; blank and zero remain distinct.
2. Require `quadrant_count` in 1–4 and explicit `quadrant_count_confirmed=true`.
3. Base quote calculation:
   - `one_total`: base = written_total.
   - `separate_quadrant_charges`: require exactly `quadrant_count` entered quadrant charges and sum them.
4. Adjuncts:
   - included / not listed: add $0.
   - separate charge: require amount and add it.
   - not sure: add $0 and mark scope incomplete.
5. `entered_total = base + separate adjunct amounts`.
6. `average_per_quoted_quadrant`:
   - calculated from the SRP base only, not from separately quoted anesthesia/other adjuncts, unless the written quote itself identifies those adjuncts as quadrant-level charges.
   - in one-total mode, divide the SRP base by confirmed quadrant count and round for display to nearest cent; if division is not exact, label it `about` / average from this quote.
   - in separate-quadrant mode, also show the arithmetic average of the entered quadrant lines; never imply all quadrant charges are clinically equivalent.
7. Scope status: complete when quadrant count is confirmed and adjunct statuses are known; incomplete if any adjunct is `not sure`; invalid if required monetary/scope fields fail.
8. Insurance follows same-quote input only:
   - no insurance amount => insurer $0.
   - unknown => patient amount unknown.
   - entered estimate => valid amount <= total plus same-scope confirmation required.
9. Suppress after-insurance result when quote scope is incomplete.
10. Never multiply the published $180–$295 range by quadrant count. Published references do not participate in formulas.

## Insurance model

- allowed amount assumption: none
- deductible: not calculated
- coinsurance/copay: not calculated
- annual maximum: not calculated
- network: no assumption
- plan treatment-category assignment: not assumed
- waiting periods/frequency: not modeled
- order of operations: subtract only a user-entered insurer estimate confirmed to apply to this quote
- insurer estimate may not exceed quote total

## Output
- Primary output: total from user's written SRP quote
- Secondary output: average per quoted quadrant from user's quote
- Conditional output: amount after user-entered same-quote insurer estimate
- Range/point estimate: no market estimate generated
- Rounding: integer-cent totals; average-per-quadrant display nearest cent and labeled approximate if division leaves remainder
- Included costs: only user-entered quote amounts
- Excluded costs: unentered/unknown services
- Explanation: confirmed quadrant count + adjunct status summary + published reference card
- Next action: compare with provider itemization and benefit documents

## Safety / YMYL boundary
- No diagnosis: no symptom logic
- No treatment recommendation: no recommendation for SRP or quadrant count
- No candidacy determination: prohibited
- No insurance guarantee: no plan percentage/category defaults
- Estimator not a quote: user-entered arithmetic only

## Error handling
- empty input: field-specific error
- invalid number: negative/malformed/out-of-bounds rejected
- impossible combination: 0 or >4 quadrants; unconfirmed quadrant scope; itemized mode with missing quadrant lines; separate adjunct with blank amount; insurer > total; insurer estimate without same-scope confirmation
- unsupported region/procedure: no localization or alternate periodontal procedure inference
- data unavailable: hide reference card if stale; quote calculator still operates on user entries

## Test fixtures

| Fixture ID | Inputs | Expected output | Tolerance | Edge case? |
|---|---|---|---|---|
| C006-01 | total $500; 2 confirmed quadrants; adjuncts not listed; no insurance | total $500; avg $250/quadrant; patient $500 | $0 | No |
| C006-02 | total $501; 2 quadrants | total $501; avg about $250.50 | $0.01 display | Yes |
| C006-03 | quadrant lines $220 + $260; count 2 | total $480; avg $240 | $0 | No |
| C006-04 | 4 quadrant lines $200 each | total $800; avg $200 | $0 | No |
| C006-05 | count 4 but only 3 quadrant lines | invalid | — | Yes |
| C006-06 | count 0 or 5 | invalid | — | Yes |
| C006-07 | quadrant count selected but confirmation unchecked | invalid | — | Yes |
| C006-08 | total $500; anesthesia separate $50 | total $550; per-quadrant SRP average remains $250 when base is $500/2 | $0 | No |
| C006-09 | total $500; other `not sure` | total visible; scope incomplete; patient amount suppressed | $0 | Yes |
| C006-10 | complete total $500; insurer $150 same quote | patient $350 | $0 | No |
| C006-11 | insurer > total | invalid | — | Yes |
| C006-12 | published reference altered/hidden | user arithmetic unchanged | $0 | Yes |
| C006-13 | keyboard-only progression | all steps/controls usable and focus managed | — | Yes |

## Accessibility
- keyboard: native controls, logical step flow
- labels: fieldset/legend for quadrant scope and status groups
- focus: error summary and step headings focusable; result region announced politely
- errors announced: concise summary with links/focus targets
- mobile layout: single-column; 16px+ input text; 44px touch targets
- reduced motion: no forced smooth scrolling when reduced motion requested

## Analytics (privacy-safe)
No quote amounts, insurance figures, quadrant selections or health-sensitive state values in analytics. Only aggregate tool-use events if enabled later.

## Change log
- 1.0 / 2026-09-17 / initial evidence-controlled specification / PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1 / implementation pending
