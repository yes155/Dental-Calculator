# Dental Calculator UX Research v1

Date reviewed: 2026-09-16  
Scope: representative CALC-001 interaction and plain-language decisions  
Purpose: design evidence only; this file does not authorize dental price or clinical claims.

## Comparable consumer tools

### Delta Dental — Dental Procedure Cost Estimator
Source: https://www.deltadental.com/member/cost-estimator/

Observed patterns:
- Opens with direct consumer language: “Cost matters” and “How much is it going to cost?”
- Moves quickly into the estimator instead of placing a long educational article before the tool.
- Uses a small number of recognizable fields such as treatment type, treatment specification and ZIP code.
- Keeps the estimate disclaimer explicit: results are estimates and do not guarantee exact fees, plan coverage or out-of-pocket cost.

Useful principle for this project:
- Give the direct answer first, then put a calculator-intent tool near the top.
- Ask one clear consumer question at a time.
- Keep limitations visible without making them the main interaction language.

### CareCredit — Dental procedure costs / Cost Calculator
Sources:
- https://www.carecredit.com/dentistry/costs/
- https://www.carecredit.com/well-u/financial-health/procedure-cost-calculator/

Observed patterns:
- Uses action-oriented headings such as “Explore costs in your area.”
- Core lookup uses a small set of obvious fields: category/service and ZIP code.
- “How to use” instructions describe the workflow in short everyday steps.
- Published cost references remain clearly described as estimates/averages that may vary by geography, provider and other factors.

Useful principle for this project:
- Prefer `One total`, `Separate charges`, `Amount`, `What's included`, and similar words over internal terminology such as bundle normalization, pricing scope or line-item schema.
- Keep published reference data visibly separate from user-entered calculator arithmetic.

### FAIR Health Consumer
Sources:
- https://www.fairhealth.org/consumer-resources
- https://www.fairhealth.org/article/now-its-easier-to-see-full-range-of-healthcare-costs-on-fair-health-consumer

Observed patterns:
- Consumer tools are explicitly designed to help people understand costs and health benefits.
- Technical concepts such as charge amount and allowed amount are explained in context rather than presented as unexplained jargon.
- Current cost-range enhancements expose ranges visually on the results experience.

Useful principle for this project:
- Technical insurance or dental terms may appear when necessary, but define them at the point of use.
- Results should carry context about what the number represents, not just display a dollar figure.

## Plain-language authority

### CDC — Everyday Words / Plain Language resources
Sources:
- https://www.cdc.gov/ccindex/everydaywords/about.html
- https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html

CDC guidance emphasizes reducing jargon, using common everyday alternatives, and defining technical terms when a plain substitute is not enough.

Applied rule for this project:
- Prefer everyday words first: `connector (abutment)`, `tooth removal (extraction)`, `separate charge`, `amount`, `what does this amount cover?`.
- Do not remove a technical term when doing so would make the dental meaning less precise; pair it with a plain-language explanation instead.

## CALC-001 decisions from rendered review

1. Keep the evidence-backed cost answer before the calculator, but place the calculator immediately after that answer because calculator intent is dominant.
2. Use a concise H1: `Dental implant cost calculator`. Put single-tooth scope in the supporting copy rather than appending a long technical second phrase to the H1.
3. Use three guided stages: `Your quote` → `What's included` → `Insurance & result`.
4. Prefer `One total` and `Separate charges` over `bundle` and `itemized quote` in the visible UI.
5. Prefer `Name of charge`, `Amount`, and `What does this amount cover?` over provider line-item label, quoted amount and pricing scope.
6. Keep the three core implant parts visible; keep less-common items collapsed and initially `Not sure` rather than forcing assumptions.
7. Define unavoidable dental terms in plain language: `Connector (abutment)` and `Tooth removal (extraction)`.
8. Use result labels such as `Total from your quote` and `Cost per tooth from this quote`; avoid `normalization`, `scope incomplete` and `patient responsibility` in the primary interface.
9. Keep published price references separate from calculator arithmetic and label them as references, not defaults.
10. Treat a prefixed money field as one visual control. Validation styling must wrap the `$` prefix and input together rather than outlining only the numeric input.
11. Preserve uncertainty. `Not sure` must remain a valid visible state; the tool must never silently convert unknown quote details into `Not listed` or `Included`.
12. Preserve the frozen calculator logic and YMYL boundaries. UX simplification must not introduce price defaults, treatment recommendations or assumed insurance benefits.

## Reuse rule

Do not automatically copy the CALC-001 pattern to every calculator. First verify the representative implementation at desktop and mobile widths, keyboard-only use, validation states and result rendering. After approval, reuse the interaction principles while adapting inputs to each calculator's frozen spec.
