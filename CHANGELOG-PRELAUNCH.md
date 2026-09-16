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

### Cloudflare preview status
- Cloudflare confirmed successful deployment of corrected-content commit `a50f7d57a63348994e5b9e7ba37724419ec9da4a` and later guided UX commit `495cf615b1ab5a7c7cadb031f0331c30de1ebabe`.
- User supplied rendered screenshots of the guided flow and optional-adjunct behavior.
- Latest plain-language/alignment head still requires Cloudflare render verification before the pattern is frozen for reuse.

### Still open
- Verify the latest plain-language CALC-001 branch preview on Cloudflare.
- Browser rendering at 320/390/768/1280/1920 px.
- Manual calculator interaction, keyboard-only navigation and screen-reader/accessibility QA.
- Do not roll the guided interaction pattern to other calculators until representative CALC-001 approval.
- Trust/legal/methodology routes.
- Remaining site-cluster evidence/content/calculators.
- Media contract, final technical SEO, performance and rollback procedure.
- Production merge/domain/indexation remain blocked.
