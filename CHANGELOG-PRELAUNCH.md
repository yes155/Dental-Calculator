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
- Integrated corrected v2 prose into all four `src/` implant pages.
- Preserved answer-first writing, source/date/geography/unit/package scope, canonical ownership and YMYL boundaries.
- FAQs remain deferred until Main Content/site-level supplementary planning.

### Heading-vector regression control
- Strengthened `scripts/build.mjs` so DEN-001, DEN-003, DEN-007 and DEN-012 must retain the exact frozen H2 sequence in order.
- This prevents future model drafts from silently collapsing required semantic sections.

### Still open
- Confirm final branch-head GitHub Actions after the editorial/control-file updates.
- Verify the corrected implant pages on the Cloudflare branch preview.
- Browser rendering at 320/390/768/1280/1920 px.
- Automated accessibility + manual keyboard/screen-reader QA.
- Trust/legal/methodology routes.
- Remaining site-cluster evidence/content/calculators.
- Media contract, final technical SEO, performance and rollback procedure.
- Production merge/domain/indexation remain blocked.
