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

UX / plain-language research:
- `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md`
- Comparable patterns reviewed from Delta Dental, CareCredit and FAIR Health; CDC plain-language guidance used for jargon reduction and first-use definitions.

External-model history:
- NotebookLM return 1: FAIL — external corpus missing / unsupported synthesis
- NotebookLM return 2: FAIL — v2 source preflight not followed / mandatory corpus still absent
- Gemini production drafts: FAIL AS RECEIVED — incomplete frozen H2 vectors plus several scope/wording overstatements
- ChatGPT correction pass: COMPLETE — evidence-safe drafts rebuilt and integrated

External-model lineage: `handoffs/EXTERNAL_MODEL_HANDOFF_MANIFEST.md`.

## Implemented pages and tools
Implemented preview pages:
- DEN-008 `/tooth-extraction-cost/` + CALC-008
- DEN-001 `/dental-implant-cost-calculator/` + CALC-001
- DEN-003 `/full-mouth-dental-implants-cost/` + CALC-003
- DEN-007 `/dental-bone-graft-cost/` cost guide; no calculator assigned
- DEN-012 `/all-on-4-dental-implants-cost/` + CALC-003-A04

Preview policy remains `noindex,nofollow`.

## Implants calculator implementation
Shared logic files:
- `src/assets/implant-calculators-core.mjs`
- `src/assets/implant-calculators-ui.mjs` for CALC-003 / CALC-003-A04
- `src/assets/calc001-guided-ui.mjs` for representative guided CALC-001 UX
- `src/assets/calc001-plain.css` for representative CALC-001 render corrections
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
- only user-entered same-quote insurer estimates are subtracted
- published benchmarks are reference cards and never change arithmetic
- no quote values stored, sent externally or serialized to the URL

## CALC-001 representative UX contract
User review of the live preview identified excessive form feel, width/placement concerns, technical wording, awkward H1 wrapping and a money-input validation border that visually separated the `$` prefix from the amount field.

Current source-controlled direction:
- direct price answer remains first;
- calculator follows immediately after the answer-first cost section;
- calculator card target max-width remains about 60rem / 960px;
- three guided stages: `Your quote` → `What's included` → `Insurance & result`;
- visible wording prefers everyday questions such as `Does your quote show one total or separate charges?` and `What does this amount cover?`;
- unavoidable dental terms are paired with plain explanations, e.g. `Connector (abutment)` and `Tooth removal (extraction)`;
- H1 shortened to `Dental implant cost calculator`; single-tooth scope remains in supporting copy;
- visible status choices: Included / Separate charge / Not listed / Not sure;
- only the three core implant components require an explicit status choice;
- secondary items begin as `Not sure`, stay under progressive disclosure and can only become `Not listed` through explicit user action;
- itemized quote labels use `Name of charge`, `Amount`, and `What does this amount cover?` rather than internal schema terminology;
- result labels use plain phrases such as `Total from your quote` and `Cost per tooth from this quote`;
- money-field validation now outlines the complete prefixed control, including `$`, rather than the numeric input alone;
- published reference benchmark remains visibly separate from arithmetic.

The arithmetic core/spec did not change.

Editorial/control updates:
- `briefs/DEN-001.md` → `EVIDENCE_CONTROLLED + UX_FLOW_APPROVED + PLAIN_LANGUAGE_APPROVED`
- `content/implants/DEN-001_DRAFT_v4.md` is the current plain-language editorial source
- `scripts/build.mjs` requires the guided/plain assets, concise H1, plain-language UI tokens and current controlled H2 sequence

## Automated QA
- CALC-008 fixtures remain 22/22 passing
- implant calculator regression suite covers CALC-001, CALC-003 and CALC-003-A04 arithmetic/scope behavior
- build QA requires all five preview pages, calculator assets, noindex directives, exactly one H1 and calculator/ARIA markers
- build QA enforces the controlled H2 sequence for DEN-001, DEN-003, DEN-007 and DEN-012
- current plain-language/UX research head `692c9315b59032fcc5243e880d1c0f6360d957ea` passed GitHub Actions `test-and-build`, including `npm run qa`

## Implant content status
Briefs:
- `briefs/DEN-001.md` — EVIDENCE_CONTROLLED + UX_FLOW_APPROVED + PLAIN_LANGUAGE_APPROVED
- `briefs/DEN-003.md` — EVIDENCE_CONTROLLED_WITH_CONTEXT_LIMIT
- `briefs/DEN-007.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-012.md` — EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT

Gemini QA:
- `evidence/qa/GEMINI_IMPLANTS_CLUSTER_DRAFT_QA_v1.md`
- Returned v1 drafts rejected as production copy.

Controlled editorial files:
- `content/implants/DEN-001_DRAFT_v4.md` — current plain-language representative page source
- `content/implants/DEN-003_DRAFT_v2.md`
- `content/implants/DEN-007_DRAFT_v2.md`
- `content/implants/DEN-012_DRAFT_v2.md`

Main Content remains evidence-controlled; FAQs remain deferred.

## Key approved implant evidence
- DEN-001: CareCredit $2,143 average; $1,646–$4,157 dedicated single-tooth range; artificial-root implantation process/material scope; crown excluded; national 50 states + DC research.
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
- M3 Content/Tools: DEN-008 + implant-cluster content/tools implemented; CALC-001 representative UX and plain-language source pass complete
- M4 Design/Media: IN PROGRESS — representative calculator latest render approval pending; media not started
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current verification
- GitHub Actions: PASS for plain-language/UX head `692c9315b59032fcc5243e880d1c0f6360d957ea`
- Cloudflare: user supplied rendered screenshots for the preceding guided UX and optional-adjunct revision; newest plain-language head still requires deployment/render verification

## Known hard-gate exceptions
- Latest plain-language CALC-001 Cloudflare preview not yet verified.
- Real multi-viewport browser QA at 320/390/768/1280/1920 remains incomplete.
- Manual keyboard/screen-reader QA is NOT TESTED.
- CALC-003/CALC-003-A04 must not inherit the representative UX until CALC-001 is approved after latest rendered testing.
- Trust/legal/methodology surfaces incomplete.
- Remaining site clusters still need evidence/specs/content.
- Final canonical/sitemap/robots/schema/internal-link/live-route QA incomplete.
- Media/performance/rollback still incomplete.
- Production merge/domain/indexation blocked.
