# DEN-025 evidence blocker — dentist visit cost

Date: 2026-09-17  
Page: DEN-025 `/dentist-visit-cost/`  
Status: **HOLD — KEY PRICE EVIDENCE MISSING**

## Page-owned task
Separate an exam/checkup charge from cleaning, X-rays and broader visit bundles. The URL owns exam/checkup/consultation pricing, not cleaning-led packages or X-ray type pricing.

## What is supported

### Delta Dental — dental exams & checkups
https://www.deltadental.com/protect-my-smile/visiting-the-dentist/what-happens-during-a-dental-checkup/

- An exam and a cleaning are distinct procedures.
- When performed together they are commonly referred to as a checkup.
- The page directs users to Delta's geographic cost estimator rather than publishing a broad exam-only fee.

### CareCredit — dental procedure cost list
https://www.carecredit.com/dentistry/costs/

- CareCredit reports $203 for **“Dental exam (cleaning and x-rays)”** from its 2023–2024 U.S. cost-study lineage.
- This is a bundled observation and cannot be relabeled as an exam-only price.

### IU Northwest student clinic example
Prior targeted evidence extraction found local exam fees at a single dental education clinic in Gary, Indiana. Those are clinic-specific examples with an unstated fee-effective date and are not suitable as a U.S. benchmark.

## What remains unsupported
- Broad U.S. periodic exam-only price.
- Broad U.S. comprehensive exam-only price.
- Consultation / second-opinion national price.
- Emergency exam-only national price.
- A defensible relationship between an exam-only fee and the $203 CareCredit bundle.

## Publication decision
DEN-025 must not enter production drafting until a source establishes a page-owned price unit or the architecture/user promise is intentionally revised. Do not manufacture an exam-only fee by subtracting cleaning or X-ray averages from a bundle.

## Allowed interim work
- Preserve URL ownership and internal-link destination in briefs for sibling pages.
- Research recognized cost datasets or broad insurer fee sources that explicitly price a named exam unit.
- Local examples may be stored as examples but cannot satisfy the page's primary price answer.

## Hard blocker
`[SOURCE NEEDED BEFORE PUBLICATION] — exam-only price with explicit unit, geography, date/vintage and pricing context.`
