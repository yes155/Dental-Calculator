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

## Architecture
- Approved/frozen: 38 planned URLs + 5 deferred candidates
- Canonical registry: `data/page-registry.csv`
- Registry reconciled to approved workbook on 2026-09-16
- No new keyword-variant URLs without architecture review

## Evidence authority
DEN-008 evidence is controlled in `data/source-register.csv`.

Implants cluster authoritative evidence:
- `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
- `data/source-register.csv`
- Sources include FDA, AAP, CareCredit, Humana, Cigna, Delta Dental, CMS, Nobel Biocare and Forbes secondary context.

NotebookLM history:
- first return: FAIL — external corpus missing / unsupported synthesis
- second return: FAIL — v2 source preflight not followed / mandatory corpus still absent
- neither NotebookLM return is an evidence authority

## Implemented pages and tools
Implemented preview pages:
- DEN-008 `/tooth-extraction-cost/` + CALC-008
- DEN-001 `/dental-implant-cost-calculator/` + CALC-001 preview implementation
- DEN-003 `/full-mouth-dental-implants-cost/` + CALC-003 preview implementation
- DEN-007 `/dental-bone-graft-cost/` cost guide; no calculator assigned
- DEN-012 `/all-on-4-dental-implants-cost/` + CALC-003-A04 preview implementation

Preview policy remains `noindex,nofollow`.

## Implants calculator implementation
Shared implementation files:
- `src/assets/implant-calculators-core.mjs`
- `src/assets/implant-calculators-ui.mjs`
- `tests/implant-calculators.test.mjs`

Frozen specs:
- `data/calculator-specs/CALC-001.md`
- `data/calculator-specs/CALC-003.md`
- `data/calculator-specs/CALC-003-A04.md`

Behavior:
- quote-input / quote-normalization only
- integer-cent arithmetic
- explicit quote-scope fields
- no hidden treatment assumptions
- no inferred implant/graft need
- no automatic deductible/coinsurance/annual-maximum logic
- only user-entered same-scope insurer estimates are subtracted
- published benchmarks are reference cards and never change arithmetic
- no quote values stored, sent externally or serialized to the URL

Automated QA:
- CALC-008 fixtures remain 22/22 passing
- implant calculator regression suite covers CALC-001, CALC-003 and CALC-003-A04 logic, scope warnings, insurance bounds, normalization and zero/blank/error behavior
- build QA now requires all five preview pages, calculator assets, noindex directives, single H1 and calculator/ARIA markers
- GitHub Actions push + PR runs passed at implementation SHA `86c68b8de04957bb5e24584cb25b6460449a0030`

## Implant content status
Briefs:
- `briefs/DEN-001.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-003.md` — EVIDENCE_CONTROLLED_WITH_CONTEXT_LIMIT
- `briefs/DEN-007.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-012.md` — EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT

Current HTML copy in `src/` is a **preview implementation scaffold**, not final production editorial copy.

Production drafting handoff:
- `handoffs/gemini/GEMINI_IMPLANTS_CLUSTER_DRAFT_REQUEST_v1.md`
- Expected drafts: `DEN-001_DRAFT_v1.md`, `DEN-003_DRAFT_v1.md`, `DEN-007_DRAFT_v1.md`, `DEN-012_DRAFT_v1.md`
- Status: READY_FOR_GEMINI
- ChatGPT must audit and integrate returned prose before content gate passes

## Key approved implant evidence
- DEN-001: CareCredit $2,143 average; $1,646–$4,157 range for artificial-root implantation process/material; crown excluded; 50 states + DC, 2023–2024 research.
- DEN-003: Forbes reports ADA-attributed $20,000–$45,000 for a “mouthful of implants,” but exact arch count/prosthesis/package scope is undefined; context only, not calculator default.
- DEN-007: CareCredit per-graft ranges — allograft $652–$1,575; alloplast $576–$1,375; autograft $2,161–$5,148; xenograft $549–$1,386.
- DEN-012: CareCredit All-on-4 $15,176 average; $11,640–$27,500 range; 2024 research across 50 states + DC; package inclusions unknown and arch count must be confirmed from quote.

## Media
- Media root/manifest/hero contract: not yet approved

## Trust / people
- Author shown: Farrukh Abdullah
- No editor or dental reviewer claimed
- Trust/methodology routes frozen in registry but not implemented

## Current milestone
- M1 Baseline: IN PROGRESS
- M2 Architecture/Evidence: architecture frozen; DEN-008 and implants cluster evidence/briefs/specs controlled
- M3 Content/Tools: CALC-008 plus implant-cluster calculator logic/pages implemented as preview scaffolds; production implant prose awaiting Gemini return + ChatGPT QA
- M4 Design/Media: NOT STARTED
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current verification
- GitHub Actions: PASS at implementation SHA `86c68b8de04957bb5e24584cb25b6460449a0030`
- Cloudflare: earlier preview deployment path exists, but the PR bot comment observed during this batch was stale/in-progress on an earlier implant-page commit; latest implementation-head deployment is not yet recorded as verified

## Known hard-gate exceptions
- Production prose for DEN-001/DEN-003/DEN-007/DEN-012 not yet returned/audited from Gemini.
- Latest Cloudflare implementation head not yet verified.
- Real multi-viewport browser QA is NOT TESTED.
- Automated accessibility + manual keyboard/screen-reader QA are NOT TESTED.
- Trust/legal/methodology surfaces incomplete.
- Remaining site clusters still need evidence/specs/content.
- Final canonical/sitemap/robots/schema/internal-link/live-route QA incomplete.
- Media/performance/rollback still incomplete.
- Production merge/domain/indexation blocked.
