# PROJECT STATE — Dental Calculator

Updated 2026-09-17.

## Project identity
- Site name: Dental Calculator (working name)
- Primary market: United States
- Primary audience: people researching dental procedure costs and written quote/out-of-pocket estimates
- Risk class: Health/YMYL-adjacent + financial estimation
- Production domain: not connected
- Production release: blocked until hard gates pass

## Repository / deployment
- GitHub repo: `yes155/Dental-Calculator`
- Production branch: `main`
- Working branch: `chatgpt-work`
- Framework: dependency-free Node.js static build
- Source: `src/`
- Build: `npm run build`
- QA: `npm run qa`
- Output: `dist/`
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Preview policy: implemented pages remain `noindex,nofollow`

## Architecture
- Frozen/user-approved 2026-09-15
- Canonical registry: `data/page-registry.csv`
- 38 planned URLs + 5 deferred non-build candidates
- Registry reconciled to approved workbook on 2026-09-16
- No new keyword-variant or tool URLs without architecture review

## Evidence authority
Primary evidence controls currently in repo:
- DEN-008: `data/source-register.csv`
- Implants: `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` + source register
- Preventive/diagnostic: `evidence/preventive/PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` + source register
- Calculator UX research: `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md`
- GUI-001 source lineage: corrected Library source `GUI-001_dental-insurance-out-of-pocket-costs_v2.md`, `GUI-001_DRAFT_AUDIT_v2.md`, migrated repo source `content/guides/GUI-001_dental-insurance-out-of-pocket-costs_v2.md`

External-model outputs are never evidence authority by themselves. Rejected/cleaned returns remain lineage records only.

## Implemented preview routes
1. DEN-008 `/tooth-extraction-cost/` + CALC-008
2. DEN-001 `/dental-implant-cost-calculator/` + CALC-001
3. DEN-003 `/full-mouth-dental-implants-cost/` + CALC-003
4. DEN-007 `/dental-bone-graft-cost/` — no calculator
5. DEN-012 `/all-on-4-dental-implants-cost/` + CALC-003-A04
6. DEN-002 `/dental-cleaning-cost/` + CALC-002
7. DEN-006 `/deep-teeth-cleaning-cost/` + CALC-006
8. DEN-011 `/dental-x-ray-cost/` — no calculator
9. GUI-001 `/dental-insurance-out-of-pocket-costs/` — no calculator

## Calculator implementation status
### Approved representative UX
CALC-001 is the user-approved representative interaction pattern where the same task fits:
- direct answer before calculator
- calculator immediately after the answer-first price section on calculator-intent pages
- constrained calculator width
- three guided stages
- plain-language labels
- Included / Separate charge / Not listed / Not sure states
- conditional amount fields
- same-scope insurer estimate only
- published references visually and mathematically separate from quote arithmetic
- no hidden clinical or insurance defaults

### Implemented/tested calculators
- CALC-008 — extraction quote organizer
- CALC-001 — single-tooth implant quote organizer
- CALC-003 — full-mouth/full-arch quote normalizer
- CALC-003-A04 — All-on-4 quote normalizer
- CALC-002 — standard cleaning quote organizer
- CALC-006 — SRP/deep-cleaning quote organizer by user-confirmed quadrant count

Common controls:
- integer-cent arithmetic
- blank ≠ explicit zero
- $1,000,000 technical input ceiling, not a price assumption
- no treatment selection or diagnosis
- no market price generated from symptoms/location
- no automatic coverage percentage/deductible/annual maximum calculation
- patient amount shown only when scope/insurance inputs permit it
- no quote values sent externally, stored or serialized into the URL

## Preventive cluster status
### DEN-002 / CALC-002
- Evidence-controlled.
- Primary reference: Delta Dental `$85–$160` standard cleaning without dental benefits.
- Cigna `about $104` is older corroborating context.
- Humana `$80–$109` remains Orlando, Florida local context.
- CareCredit `$203` remains a broader exam/cleaning/X-ray bundle and cannot be relabeled as cleaning-only.
- CALC-002 spec frozen at `data/calculator-specs/CALC-002.md`.
- Calculator core, UI and regression tests implemented.
- Calculator appears immediately after the direct price answer.
- Automated QA: PASS.
- Rendered multi-viewport/manual keyboard QA: OPEN.

### DEN-006 / CALC-006
- Evidence-controlled.
- Primary reference: Delta Dental `$180–$295` without dental benefits for one quadrant.
- Humana `$235–$303` remains Orlando, Florida local context.
- No automatic four-quadrant/full-mouth multiplication.
- Quadrant count must come from and be explicitly confirmed against the written quote.
- CALC-006 spec frozen at `data/calculator-specs/CALC-006.md`.
- Calculator core, UI and regression tests implemented.
- Automated QA: PASS.
- Rendered multi-viewport/manual keyboard QA: OPEN.

### DEN-011
- Evidence-controlled non-calculator page.
- Seven CareCredit/Synchrony imaging rows remain separate by named modality/series.
- Bitewing `$52–$120` is guarded from being generalized to all X-rays.
- No imaging type/frequency recommendation.
- Automated build QA: PASS.
- Rendered table/mobile QA: OPEN.

## GUI-001 insurance guide status
- Corrected/evidence-audited source migrated into repo.
- Implemented preview route `/dental-insurance-out-of-pocket-costs/`.
- No calculator assigned.
- Eight-heading vector frozen in build QA.
- Named 2026 FEDVIP examples remain plan-specific.
- Static worked numbers are explicitly hypothetical/imaginary and are not procedure prices or calculator defaults.
- Build QA rejects generic procedure-price benchmarking on this guide.
- Automated QA: PASS on implementation batch.
- Rendered/manual accessibility QA: OPEN.

## Implant cluster status
- DEN-001/CALC-001: implemented; representative UX user-approved.
- DEN-003/CALC-003 and DEN-012/CALC-003-A04: calculator-first guided UX implemented; formulas remain frozen.
- DEN-007: implemented non-calculator guide.
- Implant direct evidence and source-register lineage controlled.
- Arch-calculator final multi-viewport/accessibility confirmation remains open.

## Automated QA
Current test/build system checks:
- calculator unit/regression fixtures
- required page/assets exist
- `noindex,nofollow` preview directive
- exactly one H1 per implemented page
- controlled H2 order
- calculator placement on calculator-intent pages
- internal calculator IDs not leaked in reader copy
- key source-scope tokens remain present
- DEN-011 no-calculator/type-range safeguards
- DEN-002 bundle-scope safeguards
- DEN-006 no-default-quadrant/no-4x safeguards
- GUI-001 no-calculator/hypothetical-example/generic-price safeguards

Implementation head `b9c683dc69b3565ce8f30e9aa41e5ec76427b954` completed the actual `npm run qa` step successfully. Later brief/state-only commits require routine branch CI confirmation but do not change calculator/page runtime logic.

## Trust / people
- Author shown: Farrukh Abdullah, research/writing only
- No dental qualification claimed
- No editor/dental reviewer claimed
- Trust/methodology routes are frozen in registry but not yet fully implemented

## Media / design / accessibility
- Final media manifest/hero contract: not yet approved
- Representative calculator visual pattern: established through CALC-001 review
- Preventive calculators still need rendered desktop/mobile review
- Manual keyboard/screen-reader testing remains open
- 320/390/768/1280/1920 differential visual checks remain open

## Current milestone
- M1 Baseline: IN PROGRESS
- M2 Architecture/Evidence: architecture frozen; DEN-008, implants and preventive evidence controlled; additional procedure clusters remain
- M3 Content/Tools: 9 preview routes implemented; 6 calculators implemented/tested
- M4 Design/Media: IN PROGRESS — representative calculator pattern exists; broader rendered QA/media remains
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Next logical work
1. Confirm current Cloudflare preview for DEN-002, DEN-006, DEN-011 and GUI-001.
2. Run representative rendered/mobile/keyboard QA on CALC-002 and CALC-006.
3. Resolve DEN-025 exam-only evidence gap before implementing `/dentist-visit-cost/`.
4. Decide whether DEN-032 evidence is strong enough for Wave B implementation or needs one additional source.
5. Continue next Wave A procedure cluster evidence/spec/content batch.
6. Build trust/methodology pages before production candidate stage.

## Known hard-gate exceptions
- CALC-002/CALC-006 rendered multi-viewport/manual accessibility QA incomplete.
- DEN-011 table/mobile render QA incomplete.
- GUI-001 rendered/manual accessibility QA incomplete.
- CALC-008 older form pattern still needs representative rendered review.
- Trust/legal/methodology surfaces incomplete.
- Remaining procedure clusters need evidence/spec/content.
- Final canonical/robots/sitemap/schema/internal-link crawl incomplete.
- Media/performance/rollback incomplete.
- Production merge/domain/indexation blocked.
