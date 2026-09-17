# CALC-008-WIS — Wisdom-Tooth Quote Estimator

Status: SPEC FROZEN FOR IMPLEMENTATION
Owner: DEN-018 `/wisdom-teeth-removal-cost/`
Engine: reuse CALC-008 quote-total logic.
Purpose: total a written wisdom-tooth quote and estimate patient responsibility from user-entered same-scope insurance information. It does not generate market prices, determine treatment need or classify impaction.

## Inputs and logic
Use the CALC-008 bundle/itemized quote model, adjunct component states and insurance controls.
- One complete provider bundle OR itemized extraction lines, never both.
- Preserve provider label and tooth/group scope.
- Imaging, sedation/anesthesia, graft and other lines: included, separately billed, not on quote or unknown.
- Unknown scope is not $0 and suppresses a complete patient-share result.
- Insurance applies only from a user-entered estimate confirmed to match the same quote scope.
- Clamp a negative patient result to $0 and warn when the entered insurance estimate exceeds the known quote.

## Published reference context
Keep $363 single wisdom tooth, $835 single impacted wisdom tooth, $2,685 four teeth and $3,340 four impacted teeth outside calculator arithmetic. Never prefill them or infer a tooth count.

## Required tests
Existing CALC-008 core tests remain authoritative for arithmetic. Page regression must additionally confirm no published wisdom-tooth figure is used as an input default, no impaction-selection logic is present, and reader-visible internal calculator IDs are absent.
