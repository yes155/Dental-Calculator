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
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Production domain: blocked / not connected

## Current implementation
- Implemented page/tool: DEN-008 `/tooth-extraction-cost/` + CALC-008
- CALC-008 automated fixtures: 22/22 passing
- Preview policy: `noindex,nofollow`

## Architecture
- Approved/frozen: 38 planned URLs + 5 deferred candidates
- Canonical registry: `data/page-registry.csv`
- Registry reconciled to approved workbook on 2026-09-16
- No new keyword-variant URLs without architecture review

## Implants cluster — current state
Pages: DEN-001, DEN-003, DEN-007, DEN-012.

NotebookLM history:
- first return: FAIL — external corpus missing / unsupported synthesis
- second return: FAIL — still labeled v1, v2 mandatory preflight not followed, required ADA/AAP/CareCredit/Humana corpus absent
- external model manifest updated accordingly

Authoritative replacement:
- `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
- live-source verification completed against FDA, AAP, CareCredit, Humana, Cigna, Delta Dental, CMS, Nobel Biocare and Forbes secondary context
- relevant rows migrated into `data/source-register.csv`

Briefs:
- `briefs/DEN-001.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-003.md` — PARTIAL_EVIDENCE_CONTROLLED; broad full-mouth figure usable only with scope caveat, no per-arch national default
- `briefs/DEN-007.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-012.md` — EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT

Calculator specs frozen:
- `data/calculator-specs/CALC-001.md`
- `data/calculator-specs/CALC-003.md`
- `data/calculator-specs/CALC-003-A04.md`

Calculator strategy:
- quote-input / quote-normalization first
- no hidden treatment assumptions
- no automatic benefit percentage
- published price references are informational and never silently inserted into user quotes

## Key approved implant evidence
- DEN-001: CareCredit $2,143 average; $1,646–$4,157 range for artificial-root implantation process/material; crown excluded; 50 states + DC, 2023–2024 research.
- DEN-003: Forbes reports ADA-attributed $20,000–$45,000 for a “mouthful of implants,” but exact arch count/prosthesis/package scope is undefined; context only, not calculator default.
- DEN-007: CareCredit per-graft ranges — allograft $652–$1,575; alloplast $576–$1,375; autograft $2,161–$5,148; xenograft $549–$1,386.
- DEN-012: CareCredit All-on-4 $15,176 average; $11,640–$27,500 range; 2024 research across 50 states + DC; package inclusions unknown and arch count must be confirmed from quote.

## Data / calculators
- Source register: `data/source-register.csv` now includes DEN-008 plus implant-cluster and insurance-methodology sources
- Existing implementation spec: CALC-008
- Frozen-not-implemented specs: CALC-001, CALC-003, CALC-003-A04
- Reference-data review target: quarterly for material price data

## Media
- Media root/manifest/hero contract: not yet approved

## Trust / people
- Author shown on DEN-008: Farrukh Abdullah
- No editor or dental reviewer claimed
- Trust/methodology routes frozen in registry but not implemented

## Current milestone
- M1 Baseline: IN PROGRESS
- M2 Architecture/Evidence: architecture frozen; DEN-008 controlled; implants cluster evidence/briefs/specs controlled
- M3 Content/Tools: DEN-008 implemented; implant pages/specs ready for drafting + implementation
- M4 Design/Media: NOT STARTED
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Known hard-gate exceptions
- Implant pages/calculators are not yet implemented or rendered.
- Real multi-viewport browser QA is NOT TESTED.
- Automated accessibility + manual keyboard/screen-reader QA are NOT TESTED.
- Trust/legal/methodology surfaces incomplete.
- Remaining site clusters still need evidence/specs/content.
- Final canonical/sitemap/robots/schema/internal-link/live-route QA incomplete.
- Media/performance/rollback still incomplete.
- Production merge/domain/indexation blocked.
