# CHANGELOG — PRELAUNCH

## 2026-09-16

### Repository baseline
- Initialized `yes155/Dental-Calculator` with `main` as production branch and `chatgpt-work` as working branch.
- Established dependency-free Node.js static build (`npm run build` -> `dist`).
- Added GitHub Actions prelaunch QA.
- Added Cloudflare Workers configuration for preview deployment.

### Representative page/tool
- Integrated DEN-008 `/tooth-extraction-cost/` as the first representative procedure-cost page.
- Integrated CALC-008 as an embedded quote-input calculator.
- Preserved the approved boundary: no treatment selection, no inferred tooth count, no guessed/default dental price, no diagnosis, no insurance recalculation.
- Added 13 shared quote-input fixtures and nine extraction-specific tests; 22/22 pass.
- Preview remains `noindex,nofollow`.

### Deployment verification
- GitHub Actions `Prelaunch QA` passed at the original implementation candidate `e3dea30b3c40cd7645ab6d0634db5034d64128d9`.
- Cloudflare branch preview deployment succeeded for that implementation candidate.
- GitHub Actions also passed at prior brief head `efdda5593d07de909dcb473b222419c04bccce13`.
- Production merge, domain connection and indexation remain blocked.

### Project controls
- Updated `docs/PRELAUNCH-STATUS.md` after initial CI/preview success.
- Added `PROJECT-STATE.md`.
- Added `PRELAUNCH-AUDIT.md`.
- Added this `CHANGELOG-PRELAUNCH.md`.
- Added `data/source-register.csv` for DEN-008 evidence.
- Added `data/calculator-specs/CALC-008.md`.

### Architecture registry correction
- Detected that the first manually migrated `data/page-registry.csv` did not exactly match the approved architecture workbook.
- Rebuilt the canonical registry directly from `Dental_Topical_Map_and_Page_Registry.xlsx` and applied the user's 2026-09-15 architecture approval to the planned rows.
- Correct canonical IDs/URLs now include DEN-019 veneers, DEN-024 bridge, DEN-025 dentist visit, DEN-030 dentures and DEN-032 periodontal maintenance.
- Registry now contains exactly 38 approved planned URLs plus 5 deferred non-build candidates.
- No new article was drafted against the incorrect registry mapping.

### Implants evidence batch
- Created `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md` for DEN-001, DEN-003, DEN-007 and DEN-012.
- Added a 20-source acquisition list prioritizing FDA, ADA, AAP, CMS, broad cost datasets and insurer documentation; Nobel Biocare is restricted to narrow branded-concept terminology.
- Added evidence-gated semantic briefs for DEN-001, DEN-003, DEN-007 and DEN-012.
- User returned `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md`.
- ChatGPT QA rejected v1 because NotebookLM reported the required external source corpus as missing and relied on the task specification for factual support.
- Rejected unsupported synthesis prices that appeared despite missing source lineage.
- Detected and corrected a DEN-008 canonical-reference error in the returned pack (`/dental-extraction-cost/` → `/tooth-extraction-cost/`).
- Independently confirmed that the core intended public sources are live, including FDA/AAP/ADA implant guidance and current CareCredit/Humana cost pages.
- Added `evidence/qa/NLM_IMPLANTS_CLUSTER_EVIDENCE_QA_v1.md`.
- Added `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v2.md` with a mandatory source-ingestion preflight and stop condition.
- Updated the external-model manifest: v1 = FAIL; v2 = READY_FOR_NOTEBOOKLM.
- Numeric implant/full-mouth/graft/All-on-4 claims, implant calculator formulas/defaults and Gemini drafting remain blocked until v2 passes evidence QA.

### Still open
- NotebookLM implants v2 evidence pack and ChatGPT evidence QA.
- Browser rendering at 320/390/768/1280/1920 px.
- Automated accessibility plus manual keyboard/screen-reader QA.
- Site-wide source register/cost data and remaining calculator specs.
- Trust/legal/methodology routes.
- Final metadata/canonical/robots/sitemap/schema and live internal-link targets.
- Media system, performance baseline and rollback procedure.
