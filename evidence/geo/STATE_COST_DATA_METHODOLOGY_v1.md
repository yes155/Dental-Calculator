# State Cost Data Methodology v1

Date: 2026-09-19
Status: APPROVED FOR PREVIEW — supplementary geographic comparison only

## Purpose
Provide a U.S. state map, state selector and comparison table without manufacturing local prices or creating state landing pages.

## Included numeric source
The current state dataset uses procedure-specific state/district averages published by CareCredit/Synchrony and attributed to ASQ360° procedural-cost research. Each included procedure has all 50 states plus the District of Columbia and a named priced unit.

Included:
- full-size single-tooth implant root — crown excluded;
- porcelain crown;
- composite filling;
- simple tooth extraction;
- clear aligner treatment;
- metal braces.

## Excluded numeric sources
- Medicaid dental fee schedules: reimbursement schedules, not consumer market prices.
- Delta Dental Cost Estimator: useful methodology reference, but interactive estimates are not copied into this dataset.
- FAIR Health Consumer: useful geozip/percentile methodology reference, but interactive estimates are not bulk-republished here.
- individual dental practices: local examples only, not state averages.
- RealDentalCosts.com: competitor output is not used as evidence.

## Procedure holds
- Standard cleaning: HOLD because CareCredit's state table is scope-ambiguous relative to its exam/cleaning/X-ray bundle and our standalone cleaning page.
- Root canal: HOLD because conflicting state values were observed across CareCredit source presentations on 2026-09-19. No root-canal state map values publish until the source is reconciled.

## Display rules
1. Label every value as a published state average, not a quote.
2. Keep procedure unit and exclusions visible.
3. Compare with the source's published U.S. average; do not invent a synthetic national figure from state values.
4. Do not create an affordability score.
5. Do not estimate insurance payment.
6. Do not create state-specific indexable URLs from this dataset alone.
7. Refresh on source change and at least every six months.

## Methodology references
- CareCredit cost calculator methodology: https://www.carecredit.com/well-u/financial-health/procedure-cost-calculator/
- FAIR Health consumer methodology: https://www.fairhealthconsumer.org/
- Delta Dental cost estimator methodology: https://www.deltadental.com/member/cost-estimator/
- ADA Medicaid fee schedules: https://www.ada.org/advocacy/advocacy-issues/medicaid/medicaid-fee-schedules
