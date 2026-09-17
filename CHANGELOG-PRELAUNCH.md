# CHANGELOG — PRELAUNCH

## 2026-09-16

### Repository baseline
- Initialized `yes155/Dental-Calculator` with `main` as production branch and `chatgpt-work` as working branch.
- Established dependency-free Node.js static build (`npm run build` -> `dist`).
- Added GitHub Actions prelaunch QA and Cloudflare preview configuration.

### Representative page/tool
- Integrated DEN-008 `/tooth-extraction-cost/` + CALC-008.
- Preserved quote-input boundary: no diagnosis, treatment selection, guessed/default price or automatic insurance recalculation.
- Added 13 shared + 9 extraction-specific tests; 22/22 pass.

### Architecture registry correction
- Rebuilt `data/page-registry.csv` from the approved workbook after detecting shifted IDs/URLs in the first manual migration.
- Canonical registry now contains exactly 38 approved planned URLs + 5 deferred non-build candidates.

### Implants evidence batch — external-model QA
- Created NotebookLM v1 and v2 evidence handoffs for DEN-001, DEN-003, DEN-007 and DEN-012.
- First NotebookLM return failed because required external sources were missing and unsupported synthesis values appeared.
- Second return also failed the v2 preflight: it still identified itself as v1 and omitted the required ADA/AAP/CareCredit/Humana evidence set.
- Preserved both failures in `handoffs/EXTERNAL_MODEL_HANDOFF_MANIFEST.md` rather than silently accepting partial evidence.

### Direct implants source verification
- Switched the cluster to direct live-source verification rather than running a third failed NotebookLM loop.
- Added `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`.
- Verified/migrated evidence from FDA, AAP, CareCredit, Humana, Cigna, Delta Dental, CMS, Nobel Biocare and Forbes secondary context.
- Expanded `data/source-register.csv` with implant, graft, All-on-4 and insurance-methodology rows.

### Evidence decisions
- DEN-001: CareCredit $2,143 average / $1,646–$4,157 dedicated single-tooth range; artificial-root implantation process/material; crown excluded.
- DEN-003: Forbes ADA-attributed $20,000–$45,000 “mouthful of implants” figure retained only as broad context because arch/prosthesis/package scope is not defined; not a calculator default.
- DEN-007: CareCredit separate per-graft ranges for allograft, alloplast, autograft and xenograft; no sinus-lift price on this URL.
- DEN-012: CareCredit All-on-4 $15,176 average / $11,640–$27,500 range with 2024 national research; package inclusions remain unknown and quote arch count must be confirmed.
- Insurance: no universal implant coverage percentage; deductible/maximum/waiting-period/coverage inputs remain plan-specific.

### Briefs finalized
- `briefs/DEN-001.md` → EVIDENCE_CONTROLLED
- `briefs/DEN-003.md` → EVIDENCE_CONTROLLED_WITH_CONTEXT_LIMIT
- `briefs/DEN-007.md` → EVIDENCE_CONTROLLED
- `briefs/DEN-012.md` → EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT

### Calculator specs frozen
- `data/calculator-specs/CALC-001.md`
- `data/calculator-specs/CALC-003.md`
- `data/calculator-specs/CALC-003-A04.md`
- All three use quote-input/quote-normalization logic; published benchmarks are informational and never hidden defaults.

### Implant calculator implementation
- Added shared calculator core: `src/assets/implant-calculators-core.mjs`.
- Added shared accessible UI controller: `src/assets/implant-calculators-ui.mjs`.
- Added regression suite: `tests/implant-calculators.test.mjs`.
- Implemented CALC-001 bundle/itemized quote math, explicit tooth-count normalization, unknown-scope handling and same-scope insurer subtraction.
- Implemented CALC-003 confirmed 1/2-arch normalization with no national per-arch default.
- Implemented CALC-003-A04 on the same arch core; CareCredit All-on-4 reference data never affects arithmetic.
- Preserved zero vs blank distinction, integer-cent arithmetic, $1,000,000 ceiling, duplicate-line detection and no automatic insurance percentage.

### Implant preview pages
- Added DEN-001 `/dental-implant-cost-calculator/` with CALC-001.
- Added DEN-003 `/full-mouth-dental-implants-cost/` with CALC-003.
- Added DEN-007 `/dental-bone-graft-cost/` as a non-calculator cost guide.
- Added DEN-012 `/all-on-4-dental-implants-cost/` with CALC-003-A04.
- All four pages remain `noindex,nofollow`.

### Build / automated QA
- Extended `scripts/build.mjs` to require all five implemented procedure pages plus calculator assets.
- Added build checks for noindex, one H1 per page, calculator markers, ARIA result regions and key evidence tokens.
- GitHub Actions push run and PR run both passed at implementation SHA `86c68b8de04957bb5e24584cb25b6460449a0030`.

### Gemini production drafting and correction
- Added `handoffs/gemini/GEMINI_IMPLANTS_CLUSTER_DRAFT_REQUEST_v1.md`.
- User returned four Gemini drafts: DEN-001, DEN-003, DEN-007 and DEN-012.
- Added `evidence/qa/GEMINI_IMPLANTS_CLUSTER_DRAFT_QA_v1.md`.
- Gemini v1 drafts were rejected as production copy because they collapsed the frozen H2 vectors and contained several evidence overstatements.
- Reverified live CareCredit/Forbes price evidence before correction.
- Created corrected production drafts:
  - `content/implants/DEN-001_DRAFT_v2.md`
  - `content/implants/DEN-003_DRAFT_v2.md`
  - `content/implants/DEN-007_DRAFT_v2.md`
  - `content/implants/DEN-012_DRAFT_v2.md`
- Integrated corrected prose into all four `src/` implant pages.
- Preserved answer-first writing, source/date/geography/unit/package scope, canonical ownership and YMYL boundaries.
- FAQs remain deferred until Main Content/site-level supplementary planning.

### Heading-vector regression control
- Strengthened `scripts/build.mjs` so DEN-001, DEN-003, DEN-007 and DEN-012 must retain the controlled H2 sequence in order.
- This prevents future model drafts from silently collapsing required semantic sections.

### CareCredit DEN-001 discrepancy control
- Detected that CareCredit's general implant guide currently shows a conflicting top-summary upper bound (`$4,175`) while its body and the dedicated single-tooth page show `$4,157`.
- Added `evidence/qa/DEN001_CARECREDIT_RANGE_DISCREPANCY_2026-09-16.md`.
- Kept `$4,157` as the controlling DEN-001 upper bound because the dedicated single-tooth source supports it; recorded the discrepancy in `data/source-register.csv`.

### CALC-001 representative UX redesign
- Reviewed the first live DEN-001 preview and identified excessive form length, repetitive status dropdowns, weak progress cues and a calculator position that was too low for calculator-dominant intent.
- Kept the direct price answer first, then moved `## Dental implant cost calculator` immediately after the first answer section.
- Added dedicated presentation controller `src/assets/calc001-guided-ui.mjs`; the underlying `implant-calculators-core.mjs` arithmetic did not change.
- Constrained the guided calculator card to about 60rem / 960px instead of the full article shell width.
- Reworked CALC-001 into three stages: `Your quote` → `Included items` → `Insurance & result`.
- Replaced repetitive component status dropdowns with explicit choices: Included / Separate fee / Not listed / Not sure.
- Added conditional reveal for separate-fee amounts and insurance estimate fields.
- Kept core implant components visible while moving extraction/graft/imaging/sedation/other adjuncts behind progressive disclosure.
- Itemized quotes skip the bundle-component stage under the existing frozen arithmetic model.
- Strengthened result presentation with quote total, per-tooth normalization, conditional patient amount, tooth count, quote type and insurance-state context.
- Added mobile reflow, 16px mobile inputs, focusable step headings, visible progress, reduced-motion behavior and touch-friendly controls.
- Updated `briefs/DEN-001.md` to `EVIDENCE_CONTROLLED + UX_FLOW_APPROVED` and created `content/implants/DEN-001_DRAFT_v3.md` for the revised flow.
- Updated `scripts/build.mjs` to require the guided asset, the three progress markers and the revised DEN-001 H2 sequence.
- GitHub Actions `test-and-build` passed at guided head `d54c2edc9966ee9b595edcfb85906957b0cd80c4`, including `npm run qa`.

### CALC-001 rendered review round 2 — plain language and alignment
- User review of the next live screenshots identified three issues: the prefixed money field validation outline was visually misaligned, the calculator/page language was too technical for a general consumer, and the long H1 wrapped into an unnecessary technical second phrase.
- Reviewed comparable consumer tools from Delta Dental, CareCredit and FAIR Health plus CDC plain-language guidance; documented the findings in `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md`.
- Shortened the user-facing H1 to `Dental implant cost calculator`; single-tooth scope remains explicit in the answer copy and SEO title.
- Replaced visible internal terms such as bundle, itemized quote, provider line-item label, quoted amount, pricing scope and per-tooth normalization with everyday questions/labels where possible.
- Kept unavoidable dental terms but paired them with explanations, including `Connector (abutment)` and `Tooth removal (extraction)`.
- Changed the three-stage visible labels to `Your quote` → `What's included` → `Insurance & result`.
- Secondary quote items now begin as `Not sure` and stay optional/collapsed; only explicit user action can mark them all `Not listed`.
- Result language now uses `Total from your quote`, `Cost per tooth from this quote`, and a clearer uncertainty warning.
- Added `src/assets/calc001-plain.css` so a money-field validation outline wraps the `$` prefix and amount input as one control.
- Added `content/implants/DEN-001_DRAFT_v4.md` and updated `briefs/DEN-001.md` to `EVIDENCE_CONTROLLED + UX_FLOW_APPROVED + PLAIN_LANGUAGE_APPROVED`.
- Updated `scripts/build.mjs` to require the plain-language CSS asset, concise H1, plain-language UI tokens and current controlled H2 sequence.
- GitHub Actions `test-and-build` passed at plain-language/UX research head `692c9315b59032fcc5243e880d1c0f6360d957ea`, including `npm run qa`.

## 2026-09-17

### CALC-001 final rendered approval
- User confirmed the final requested CALC-001 changes are implemented.
- Fixed the `$ + amount` focus/error anomaly so the prefixed money control behaves as one visual field.
- Removed visible `[CALCULATOR: CALC-001]` development metadata; calculator ID is now non-visible `data-calculator-id` metadata guarded by build QA.
- Replaced free-text itemized `Name of charge` with a dropdown containing common quote labels plus `Other charge`; the calculator still uses the selected label only as quote organization, never clinical inference.
- CALC-001 is now frozen as the approved representative calculator UX contract.

### Guided arch-calculator rollout
- Added `src/assets/arch-calculators-guided-ui.mjs` and `src/assets/arch-calculators-guided.css`.
- Reworked CALC-003 and CALC-003-A04 into three stages: `Your quote` → `What's included` → `Insurance & result`.
- Preserved the shared tested arch-normalization core; no formula or evidence defaults changed.
- Step 1 requires the written total, one/two-arch choice and explicit confirmation that the selected arch count is stated by the written quote.
- CALC-003 keeps fixed/removable/not-stated as a descriptive quote label only; no suitability decision is made.
- Main package items remain visible while secondary items use progressive disclosure and default to `Not sure`.
- Separate-charge amounts appear only when the user explicitly marks an item as separate.
- Insurance remains optional user-entered same-quote information; no percentage, deductible or annual-maximum calculation was added.
- Published $20,000–$45,000 full-mouth context and $15,176 / $11,640–$27,500 All-on-4 reference remain visually separate and never affect arithmetic.
- Updated `briefs/DEN-003.md` and `briefs/DEN-012.md` with the approved guided UX rules and reconciled their heading wording to the integrated page vectors.
- Updated `scripts/build.mjs` to require the arch guided assets/three-step markers and to reject visible internal calculator IDs on implant pages.
- Guided arch implementation head `d1d5309d14c50b676165634ce6d26a94685dccb6` passed GitHub Actions `test-and-build`; control head `2f3fdad53c8970ff280f3b5e767b03d8326288a6` also passed.

### Arch calculators rendered review and correction
- User supplied live CALC-003 and CALC-003-A04 screenshots and identified the same yellow focus-outline anomaly plus additional UX problems.
- Fixed arch money fields so focus/error outlines wrap the entire `$ + amount` control, matching the approved CALC-001 behavior.
- Shortened H1s to `Full-mouth dental implants cost` and `All-on-4 dental implant cost`.
- Moved CALC-003 higher: after the direct cost answer and the full-arch/full-mouth unit explanation.
- Moved CALC-003-A04 higher: after the direct answer, All-on-4 definition and arch-unit caveat.
- Added `id="calculator-heading"` to both calculator H2s so guided Back/Continue navigation has a valid focus/scroll target.
- Simplified reference-strip wording from internal `calculator math` language to `reference only` / `not used in your calculator result`.
- Shortened result output: the three main package items stay visible while secondary package items are collapsed under `Other quote items`.
- When an insurance estimate is entered but package details remain incomplete, the result now says `Needs quote details` and explains why an after-insurance amount is withheld.
- Created `content/implants/DEN-003_DRAFT_v3.md` and `DEN-012_DRAFT_v3.md` and updated both briefs to match the new placement/H2 vectors.
- Updated build QA to require concise H1s, calculator-heading anchors, revised H2 order and new reference wording.
- Higher-placement/focus/result revision through `60b432e8f2b93dca7c7506275e63f2d9491ca33c` passed GitHub Actions `npm run qa`.

### Preventive / diagnostic evidence reuse
- Reopened existing completed preventive evidence instead of launching a duplicate research batch.
- Promoted `evidence/preventive/PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` and existing source-register rows as the controlling evidence for the implemented preventive pages.
- Preserved source boundaries: national/broad consumer references remain separate from Orlando local examples; the CareCredit `$203` exam/cleaning/X-ray observation is not a cleaning-only price.

### DEN-011 dental X-ray cost
- Implemented `/dental-x-ray-cost/` as a no-calculator type-comparison guide.
- Preserved seven separate CareCredit/Synchrony price rows for bitewing, periapical, full-mouth series, occlusal, panoramic, cephalometric and CBCT imaging.
- Added a regression guard preventing the bitewing `$52–$120` range from being generalized to all dental X-rays.
- Kept imaging need/frequency as a dentist-determined clinical decision rather than a cost-calculator rule.
- Updated `briefs/DEN-011.md` to `EVIDENCE_CONTROLLED + IMPLEMENTED_PREVIEW + AUTOMATED_QA_PASS`.

### DEN-002 / CALC-002 dental cleaning
- Implemented `/dental-cleaning-cost/` + CALC-002.
- Primary published reference: Delta Dental `$85–$160` for a standard cleaning without dental benefits.
- Kept Cigna `about $104` as older corroborating context and Humana `$80–$109` as an Orlando, Florida local example.
- Explicitly prevented the CareCredit `$203` broader exam/cleaning/X-ray bundle from being relabeled as a cleaning-only fee.
- Added `src/assets/cleaning-calculator-core.mjs`, `cleaning-calculator-ui.mjs`, `cleaning-calculator.css` and `tests/cleaning-calculator.test.mjs`.
- CALC-002 organizes a written quote only: one-total or separate-charge mode, exam/X-ray/fluoride/other inclusion states, and optional same-quote insurer estimate.
- Published price references never initialize or alter calculator arithmetic.
- Positioned CALC-002 immediately after the answer-first price section.
- Updated `briefs/DEN-002.md` to `EVIDENCE_CONTROLLED + CALCULATOR_SPEC_FROZEN + IMPLEMENTED_PREVIEW + AUTOMATED_QA_PASS`.

### DEN-006 / CALC-006 deep cleaning
- Implemented `/deep-teeth-cleaning-cost/` + CALC-006.
- Primary published reference: Delta Dental `$180–$295` without dental benefits for one quadrant.
- Humana `$235–$303` remains an Orlando, Florida local comparison only.
- Corrected the returned external draft rather than accepting unsupported statements about adjunct billing or mandatory post-SRP care pathways.
- Added `src/assets/deep-cleaning-calculator-core.mjs`, `deep-cleaning-calculator-ui.mjs` and `tests/deep-cleaning-calculator.test.mjs`.
- Quadrant count must be explicitly selected and confirmed from the written quote; the calculator never infers treatment extent.
- The tool can compute an average per quoted quadrant from user-entered quote amounts, but never multiplies the published reference into a default full-mouth total.
- Separate anesthesia/other charges can affect the entered total without contaminating the SRP base average.
- Added build guards against default quadrant metadata and synthetic four-quadrant reference ranges.
- Updated `briefs/DEN-006.md` to `EVIDENCE_CONTROLLED + CALCULATOR_SPEC_FROZEN + IMPLEMENTED_PREVIEW + AUTOMATED_QA_PASS`.

### GUI-001 dental insurance and out-of-pocket costs
- Migrated the previously corrected/audited `GUI-001_dental-insurance-out-of-pocket-costs_v2.md` source into the repo and implemented `/dental-insurance-out-of-pocket-costs/`.
- Added `briefs/GUI-001.md` with the frozen eight-H2 vector and no-calculator boundary.
- Preserved 2026 Delta Dental FEDVIP examples as named-plan examples only; they are not generalized to all dental plans.
- Preserved the worked example as explicitly invented/hypothetical arithmetic rather than procedure pricing or a calculator default.
- Added build gates rejecting a calculator or generic procedure-price benchmark on GUI-001.
- This implementation closes the shared insurance-guide route used by DEN-002 and DEN-006 instead of leaving those links pointed at a missing planned page.

### Preventive / insurance build and QA controls
- Extended `scripts/build.mjs` to require DEN-002, DEN-006, DEN-011 and GUI-001 plus their relevant calculator assets.
- Added frozen heading-order checks, `noindex,nofollow` checks, calculator-placement checks and source-scope regression tokens.
- CALC-002 and CALC-006 regression suites joined the existing calculator test suite.
- Implementation head `b9c683dc69b3565ce8f30e9aa41e5ec76427b954` passed the actual `npm run qa` step.
- Control-file head `3bde39d45bab0889e206abd55eefbc7341ed3ace` completed GitHub Actions `Prelaunch QA` successfully.

### Cloudflare preventive-batch preview
- Cloudflare bot reported a successful `chatgpt-work` deployment for the preventive implementation tree.
- Branch preview remains `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`.
- Deployment success verifies the build/deploy path, but rendered visual/mobile/keyboard QA remains a separate open gate.

### Current preview status
- Nine preview routes are implemented; six calculators have frozen/tested arithmetic.
- CALC-001 representative UX is user-approved.
- DEN-002/CALC-002 and DEN-006/CALC-006 require rendered multi-viewport and keyboard review.
- DEN-011 requires table/mobile render review.
- GUI-001 requires rendered/manual accessibility review.
- Production remains blocked pending trust/legal/methodology pages, remaining evidence clusters, media, final technical SEO, accessibility, performance and rollback documentation.
