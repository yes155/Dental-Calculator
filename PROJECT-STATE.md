# PROJECT STATE — Dental Calculator

Updated 2026-09-16.

## Project identity
- Site name: Dental Calculator (working name)
- Domain: not connected
- Publisher: not finalized in site configuration
- Primary audience: U.S. dental patients researching procedure cost and out-of-pocket estimates
- Risk class: Health/YMYL + financial estimation

## Repository / deployment
- GitHub repo: `yes155/Dental-Calculator`
- Production branch: `main`
- Working branch: `chatgpt-work`
- Framework: dependency-free Node.js static build
- Source directory: `src/`
- Build command: `npm run build`
- QA command: `npm run qa`
- Output directory: `dist/`
- Routing model: static directory routes
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Production domain: blocked / not connected
- Required Node version for Cloudflare preview: Node 22

## Current implementation
- Implemented procedure page: DEN-008 `/tooth-extraction-cost/`
- Implemented calculator: CALC-008 embedded on DEN-008
- CALC-008 model: quote-input calculator only; no guessed price defaults, treatment selection or benefit recalculation
- Automated calculator fixtures: 22/22 passing (13 shared + 9 extraction-specific)
- Current preview policy: `noindex,nofollow`

## Content architecture
- Approved architecture: 38 planned URLs plus 5 explicitly deferred candidates
- Architecture status: frozen by user approval on 2026-09-15
- Canonical repository registry: `data/page-registry.csv`
- Registry correction completed 2026-09-16 by rebuilding canonical IDs/URLs directly from `Dental_Topical_Map_and_Page_Registry.xlsx`
- Rule: do not create new URLs from keyword variants without architecture review
- Homepage: deliberately not designed yet
- Trust pages: planned in registry, not implemented yet
- Live preview indexable URLs: none; preview is noindex

## Current implants evidence batch
- Batch: DEN-001 + DEN-003 + DEN-007 + DEN-012
- v1 request: `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md`
- v1 returned pack: received from user 2026-09-16
- v1 QA verdict: **FAIL — external source corpus was not ingested; unsupported synthesis values appeared**
- v1 QA report: `evidence/qa/NLM_IMPLANTS_CLUSTER_EVIDENCE_QA_v1.md`
- v2 request: `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v2.md`
- v2 expected returned file: `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v2.md`
- v2 handoff status: READY_FOR_NOTEBOOKLM
- v2 change: mandatory source-ingestion preflight; task specification may control architecture only, not serve as clinical/price evidence
- Semantic briefs prepared: `briefs/DEN-001.md`, `briefs/DEN-003.md`, `briefs/DEN-007.md`, `briefs/DEN-012.md`
- Numeric implant/full-mouth/graft/All-on-4 claims: blocked until v2 evidence return + ChatGPT QA
- Implant calculator formulas/defaults: blocked until v2 evidence passes
- Gemini drafting: blocked until v2 evidence passes and briefs are evidence-finalized

## Independent source availability check
On 2026-09-16 ChatGPT independently confirmed that core intended public sources are live, including FDA dental implant guidance, ADA MouthHealthy implants, AAP implant/full-mouth/ridge pages, CareCredit implant/single-tooth/All-on-4/bone-graft cost pages, Humana implant cost/coverage, and Nobel Biocare All-on-4 manufacturer material. This availability check does not itself migrate prices into project evidence; NotebookLM v2 must return source-grounded claim blocks before source-register population.

## Data / calculators
- Current source register: `data/source-register.csv` (DEN-008 evidence migrated; other pages pending evidence QA)
- Calculator spec location: `data/calculator-specs/`
- Current written calculator spec: `data/calculator-specs/CALC-008.md`
- Calculator engine/module: `src/assets/calc008-core.mjs`
- Calculator UI module: `src/assets/calc008-ui.mjs`
- DEN-008 evidence accessed/rechecked: 2026-09-16
- DEN-008 price-data review target recorded in source register: 2027-03-16
- Broader site cost-data dataset/versioning: pending before bulk production

## Media
- Media root: not established
- Manifest: project template exists; repository copy pending
- Hero contract: not approved
- Protected flagship assets: none

## Trust / people
- Author shown on DEN-008: Farrukh Abdullah
- Editor: not claimed
- Dental reviewer(s): not claimed
- Editorial policy: planned `/editorial-policy/`, not implemented
- Corrections policy: planned `/corrections-and-updates/`, not implemented
- Cost-data methodology: planned `/cost-data-methodology/`, not live
- Calculator methodology: planned `/calculator-methodology/`, not live

## Current milestone
- M1 Baseline: IN PROGRESS
- M2 Architecture/Evidence: architecture frozen/correctly migrated; DEN-008 evidence/spec complete; implants v1 evidence rejected and v2 source-preflight rerun prepared
- M3 Content/Tools: representative DEN-008 + CALC-008 implemented; implant briefs prepared but not drafted
- M4 Design/Media: NOT STARTED
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current candidate / verification
- Draft PR: #1
- Original fully verified implementation candidate: `e3dea30b3c40cd7645ab6d0634db5034d64128d9`
- CI at original candidate: PASS
- Cloudflare deployment at original candidate: PASS
- Later project-control/evidence-QA commits require normal CI/preview confirmation before candidate promotion

## Known hard-gate exceptions
- NotebookLM implants v2 evidence pack not yet returned/audited.
- Real multi-viewport browser QA is still NOT TESTED.
- Automated accessibility and manual keyboard/screen-reader QA are still NOT TESTED.
- Planned internal-link targets are not live.
- Canonical, sitemap, final robots/indexation rules and schema are not production-ready.
- Trust/legal/methodology surfaces are incomplete.
- Site-wide source register, cost-data tables and remaining calculator specs are incomplete.
- Media system and representative visual contract are not approved.
- Rollback procedure is not yet documented.
- Production merge/domain/indexation are blocked.
