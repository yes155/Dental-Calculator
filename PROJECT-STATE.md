# PROJECT STATE — Dental Calculator

Updated 2026-09-17.

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
- `src/assets/calc001-guided-ui.mjs` + `src/assets/calc001-charge-select.mjs` for CALC-001
- `src/assets/arch-calculators-guided-ui.mjs` for CALC-003 / CALC-003-A04
- `src/assets/calc001-plain.css` for CALC-001 render corrections
- `src/assets/arch-calculators-guided.css` for arch-calculator render corrections
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

## Approved calculator UX contract
The user reviewed multiple live CALC-001 iterations and approved the final changes on 2026-09-17. CALC-001 is now the representative interaction contract for cost calculators where the same pattern fits the task.

Approved principles:
- answer-first cost context remains above the calculator;
- calculator width is constrained rather than stretched across the full article shell;
- guided stages reduce one-page form overload;
- plain-language labels replace internal/schema terminology;
- unavoidable dental terms are paired with everyday wording, e.g. `Connector (abutment)` and `Tooth removal (extraction)`;
- status choices use Included / Separate charge / Not listed / Not sure;
- unknown optional services remain `Not sure` unless the user explicitly changes them;
- secondary package items use progressive disclosure;
- separate-charge amount fields appear only when relevant;
- money fields treat the `$` prefix and numeric input as one visual control;
- internal calculator IDs are stored only as non-visible metadata;
- itemized single-tooth charge names use a dropdown of common quote labels plus `Other charge`;
- result cards use plain labels such as `Total from your quote`, `Cost per tooth from this quote`, or `Cost per arch from this quote`;
- published source benchmarks stay visually and mathematically separate from user-entered quote arithmetic.

The arithmetic core/spec did not change during UX redesign.

## Guided UX rollout
CALC-001:
- APPROVED by user after rendered review.
- H1 shortened to `Dental implant cost calculator`.
- Three stages: `Your quote` → `What's included` → `Insurance & result`.
- Charge-name dropdown and money-field focus/error alignment approved in rendered preview.

CALC-003 and CALC-003-A04:
- Guided interaction implemented from the approved CALC-001 principles without changing their arch formulas.
- Three stages: `Your quote` → `What's included` → `Insurance & result`.
- Step 1 requires quoted total, one/two-arch selection and explicit confirmation that the arch count comes from the written quote.
- CALC-003 keeps fixed/removable/not-stated as a descriptive quote label only.
- Main package items stay visible; secondary package items default to `Not sure` under progressive disclosure.
- Separate charges are added only when the user enters an amount.
- Insurance remains user-entered, same-quote only.
- Current arch calculators require Cloudflare rendered review before final UX PASS.

Editorial/control updates:
- `briefs/DEN-001.md` → approved representative UX + plain-language control
- `briefs/DEN-003.md` → `EVIDENCE_CONTROLLED_WITH_CONTEXT_LIMIT + GUIDED_UX_IMPLEMENTED`
- `briefs/DEN-012.md` → `EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT + GUIDED_UX_IMPLEMENTED`
- DEN-003 / DEN-012 heading wording reconciled to integrated page vectors
- `scripts/build.mjs` now guards guided assets, three-step markers, hidden calculator IDs and controlled heading sequences

## Automated QA
- CALC-008 fixtures remain 22/22 passing
- implant calculator regression suite covers CALC-001, CALC-003 and CALC-003-A04 arithmetic/scope behavior
- build QA requires all five preview pages, calculator assets, noindex directives, exactly one H1 and calculator/ARIA markers
- build QA enforces the controlled H2 sequence for DEN-001, DEN-003, DEN-007 and DEN-012
- build QA rejects visible `[CALCULATOR:` metadata on implant pages
- guided arch implementation head `d1d5309d14c50b676165634ce6d26a94685dccb6` passed GitHub Actions `test-and-build`
- current control head `2f3fdad53c8970ff280f3b5e767b03d8326288a6` also passed GitHub Actions

## Implant content status
Briefs:
- `briefs/DEN-001.md` — EVIDENCE_CONTROLLED + UX/PLAIN-LANGUAGE APPROVED
- `briefs/DEN-003.md` — EVIDENCE_CONTROLLED_WITH_CONTEXT_LIMIT + GUIDED_UX_IMPLEMENTED
- `briefs/DEN-007.md` — EVIDENCE_CONTROLLED
- `briefs/DEN-012.md` — EVIDENCE_CONTROLLED_WITH_SCOPE_CAVEAT + GUIDED_UX_IMPLEMENTED

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
- M3 Content/Tools: DEN-008 + implant-cluster content/tools implemented; CALC-001 UX approved; CALC-003/CALC-003-A04 guided UX implemented
- M4 Design/Media: IN PROGRESS — arch calculators need rendered approval; media not started
- M5 Final Candidate: NOT STARTED
- M6 Production: BLOCKED

## Current verification
- GitHub Actions: PASS at current head `2f3fdad53c8970ff280f3b5e767b03d8326288a6`
- CALC-001: user confirmed final requested rendered changes are implemented
- Cloudflare PR bot comment is stale on an older commit; latest CALC-003/CALC-003-A04 guided render still needs confirmation

## Known hard-gate exceptions
- CALC-003/CALC-003-A04 latest Cloudflare rendered UX not yet reviewed.
- Real multi-viewport browser QA at 320/390/768/1280/1920 remains incomplete.
- Manual keyboard/screen-reader QA is NOT TESTED.
- CALC-008 still needs representative rendered UX review before its older form pattern is considered final.
- Trust/legal/methodology surfaces incomplete.
- Remaining site clusters still need evidence/specs/content.
- Final canonical/sitemap/robots/schema/internal-link/live-route QA incomplete.
- Media/performance/rollback still incomplete.
- Production merge/domain/indexation blocked.
