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
- Handoff request: `handoffs/notebooklm/NLM_IMPLANTS_CLUSTER_EVIDENCE_REQUEST_v1.md`
- Expected returned file: `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md`
- Handoff status: READY_FOR_NOTEBOOKLM
- Semantic briefs prepared: `briefs/DEN-001.md`, `briefs/DEN-003.md`, `briefs/DEN-007.md`, `briefs/DEN-012.md`
- Numeric price claims: blocked until NotebookLM evidence return + ChatGPT QA
- Source corpus: 20 URLs prioritizing FDA, ADA, AAP, CMS, broad cost datasets and insurer documentation; manufacturer evidence is restricted to narrow branded terminology

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
- M2 Architecture/Evidence: architecture frozen/correctly migrated; DEN-008 evidence/spec complete; implants evidence batch prepared and waiting for NotebookLM
- M3 Content/Tools: representative DEN-008 + CALC-008 implemented; implants briefs prepared but not drafted
- M4 Design/Media: NOT STARTED
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current candidate / verification
- Draft PR: #1
- Original fully verified implementation candidate: `e3dea30b3c40cd7645ab6d0634db5034d64128d9`
- CI at original candidate: PASS
- Cloudflare deployment at original candidate: PASS
- GitHub Actions `Prelaunch QA` also passed at brief head `efdda5593d07de909dcb473b222419c04bccce13`
- Cloudflare current-head confirmation is not yet recorded; latest observed bot deployment was still in progress at `297f39cd`
- Project-control-only commits after that head must receive normal CI/preview confirmation before promotion

## Known hard-gate exceptions
- NotebookLM implant evidence pack not yet returned/audited.
- Real multi-viewport browser QA is still NOT TESTED.
- Automated accessibility and manual keyboard/screen-reader QA are still NOT TESTED.
- Planned internal-link targets are not live.
- Canonical, sitemap, final robots/indexation rules and schema are not production-ready.
- Trust/legal/methodology surfaces are incomplete.
- Site-wide source register, cost-data tables and remaining calculator specs are incomplete.
- Media system and representative visual contract are not approved.
- Rollback procedure is not yet documented.
- Production merge/domain/indexation are blocked.
