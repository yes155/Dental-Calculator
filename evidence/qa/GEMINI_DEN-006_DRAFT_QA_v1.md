# DEN-006 returned draft QA — v1

Date: 2026-09-17  
Page: DEN-006 `/deep-teeth-cleaning-cost/`  
Result: **FAIL AS RECEIVED — CORRECTION REQUIRED**

## What can be retained
- Correctly keeps CareCredit national context separate from the Humana Orlando example.
- Correctly warns against multiplying a single-quadrant observation into a default full-mouth total.
- Correctly preserves the calculator as user-entered quote arithmetic rather than a treatment selector.
- Correctly routes routine cleaning and periodontal-maintenance pricing to their canonical owners.

## Corrections required
1. **Lead price source is stale relative to the current controlled brief.** The current brief uses Delta Dental's `$180–$295` average cost without dental benefits for one quadrant as the primary broad consumer benchmark. CareCredit `$242` may remain secondary context if used with its 2024 study scope.
2. **Unsupported inclusion wording.** The returned draft says examination, imaging and anesthesia are “often separate adjunct lines.” The current evidence supports only that the quote may list them separately, include them, omit them or leave scope unclear. Do not assert prevalence.
3. **Overbroad care-pathway claim.** The sentence stating that after deep cleaning “ongoing care shifts to periodontal maintenance rather than returning to routine cleanings” is too categorical. DEN-006 may distinguish the services and route ongoing periodontal-maintenance pricing to DEN-032; it must not prescribe an individual reader's follow-up pathway.
4. **Treatment-extent wording.** Explain the quote's stated quadrant count, but do not attribute the number of quadrants to the reader's disease extent or infer treatment need.
5. **Insurance wording.** Keep deductibles, coinsurance, frequency and plan rules conditional and owned primarily by GUI-001. Do not imply any named category or percentage applies universally.
6. **Link sanitation.** One returned copy contains Google-search wrapper URLs. Production uses exact relative internal URLs and direct original evidence URLs only.
7. **Heading vector.** Use the current controlled DEN-006 brief, not the older Gemini packet heading sequence.

## Production decision
Rebuild as `content/preventive/DEN-006_DRAFT_v2.md` using the current brief and direct-verified preventive evidence. No repeat Gemini run is required.
