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
- CALC-008 model: quote-input calculator only; no guessed price defaults or treatment selection
- Automated calculator fixtures: 22/22 passing (13 shared + 9 extraction-specific)
- Current preview policy: `noindex,nofollow`

## Content architecture
- Approved architecture: 38 planned URLs
- Architecture status: frozen; do not create new URLs from keyword variants without architecture review
- Homepage: deliberately not designed yet
- Trust pages: not implemented yet
- Live preview indexable URLs: none; preview is noindex

## Data / calculators
- Cost-data source location: not yet migrated into a versioned repository data file
- Source register: project resource exists; repository copy pending
- Calculator spec location: project resource exists; repository calculator-spec folder pending
- Calculator engine/module: `src/assets/calc008-core.mjs`
- Calculator UI module: `src/assets/calc008-ui.mjs`
- Current cost-data version: page evidence checked 2026-09-16
- Refresh cadence: to be finalized in source register / page brief

## Media
- Media root: not established
- Manifest: project template exists; repository copy pending
- Hero contract: not approved
- Protected flagship assets: none

## Trust / people
- Author shown on DEN-008: Farrukh Abdullah
- Editor: not claimed
- Dental reviewer(s): not claimed
- Editorial policy: not implemented
- Corrections policy: not implemented
- Cost-data methodology URL: planned `/cost-data-methodology/`, not live
- Calculator methodology URL: planned `/calculator-methodology/`, not live

## Current milestone
- M1 Baseline: IN PROGRESS
- M2 Architecture/Evidence: architecture frozen; repository evidence system incomplete
- M3 Content/Tools: representative DEN-008 + CALC-008 implemented only
- M4 Design/Media: NOT STARTED
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current candidate
- Draft PR: #1
- Last fully verified calculator/build candidate before project-control-only updates: `e3dea30b3c40cd7645ab6d0634db5034d64128d9`
- CI at that SHA: PASS
- Cloudflare deployment at that SHA: PASS
- Later commits that only update project-control documentation require normal CI/preview confirmation before becoming the next candidate SHA.

## Known hard-gate exceptions
- Real multi-viewport browser QA is still NOT TESTED.
- Automated accessibility and manual keyboard/screen-reader QA are still NOT TESTED.
- Planned internal-link targets are not live.
- Canonical, sitemap, final robots/indexation rules and schema are not production-ready.
- Trust/legal/methodology surfaces are incomplete.
- Rollback procedure is not yet documented.
- Production merge/domain/indexation are blocked.
