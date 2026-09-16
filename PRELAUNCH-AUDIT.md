# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-17.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

| ID | Category | Severity | Scope | Evidence | Fix / Next action | Verification | Status |
|---|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Canonical registry reconciled to approved workbook: 38 planned URLs + 5 deferred candidates | Preserve frozen ownership | Registry/workbook reconciliation | PASS |
| E-001 | Evidence/Pricing | HARD | DEN-008 | Controlled CareCredit + Humana + ADA evidence in source register | Keep synchronized | Source-to-claim reconciliation | PASS |
| E-002 | Evidence/Pricing | HARD | Implants NotebookLM | Two returned NotebookLM packs failed source-ingestion requirements; neither is evidence authority | Preserve rejected lineage only | External model manifest | FAIL |
| E-003 | Evidence/Pricing | HARD | Implants direct verification | FDA/AAP/CareCredit/Humana/Cigna/Delta/CMS/Nobel/Forbes evidence verified and migrated | Keep evidence/register synchronized with copy | Claim/source reconciliation | PASS |
| E-004 | Evidence/Pricing | HARD | Remaining site | Remaining clusters not yet evidence-controlled | Build next cluster evidence | Cluster QA | IN PROGRESS |
| Y-001 | YMYL/Clinical | HARD | DEN-008/CALC-008 | No diagnosis/treatment selection/benefit recalculation | Preserve | Regression tests | PASS |
| Y-002 | YMYL/Clinical | HARD | Implants | Controlled copy and calculator specs prohibit candidacy, graft-need, material/system recommendation, brand superiority and benefit guarantees | Preserve in future edits | Content + calculator QA | PASS |
| C-001 | Calculator | HARD | CALC-008 | Written spec + 22/22 fixtures pass | Keep synchronized | `npm run qa` | PASS |
| C-002 | Calculator | HIGH | CALC-008 rendered UX | Multi-viewport/manual interaction not yet verified | Render/browser QA | Browser evidence | NOT TESTED |
| C-003 | Calculator | HARD | CALC-001 arithmetic | Frozen quote-input logic remains in shared core; bundle/itemized math, tooth normalization, component state and insurer bounds regression-tested | Preserve formula | Automated regression tests | PASS |
| C-004 | Calculator | HARD | CALC-003 arithmetic | Frozen arch-quote normalizer implemented; no national per-arch default; confirmed 1/2-arch normalization only | Preserve formula | Automated regression tests | PASS |
| C-005 | Calculator | HARD | CALC-003-A04 arithmetic | Shares arch core; reference card non-computational; arch count explicit; package unknowns preserved | Preserve formula | Automated regression tests | PASS |
| C-006 | Calculator | HARD | Implant shared core | Integer cents, blank/zero distinction, max ceiling, unknown scope, insurer bounds, duplicate lines and normalization regression-tested | Preserve fixtures with future changes | Node test suite | PASS |
| C-007 | Calculator UX | HIGH | CALC-001 representative pattern | Multiple user-reviewed Cloudflare renders; final requested money-field alignment, hidden ID metadata, charge dropdown and plain-language changes confirmed implemented by user | Freeze as representative pattern | User rendered approval + GitHub QA | PASS |
| C-008 | Calculator UX | HIGH | CALC-003 / CALC-003-A04 | First live guided renders reviewed by user; follow-up fixes now add whole-control `$ + amount` focus, shorter H1s, higher calculator placement, collapsed secondary result details and clearer incomplete-insurance messaging | Verify corrected Cloudflare render before final UX PASS | GitHub QA + rendered review | IN PROGRESS |
| T-001 | Trust | HARD | Site | No false reviewer claim; trust routes frozen | Build trust/legal/methodology pages | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | CALC-001 representative calculator | Width/placement/guided flow/plain-language controls corrected through user screenshot review | Preserve pattern; multi-viewport check remains under accessibility/design gate | User rendered approval | PASS |
| D-002 | Design | HIGH | Arch calculators | First guided render showed calculator too low, technical H1s and dense result detail; corrected source now places CALC-003 after answer + arch-unit explanation and CALC-003-A04 after answer + definition + arch caveat | Review corrected desktop/mobile render | Multi-viewport review | IN PROGRESS |
| M-001 | Media | HIGH | Site | No final media system | Define media contract/manifest | Manifest + render QA | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | All implemented pages intentionally noindex; build gate checks preview noindex tokens | Finalize canonical/robots/sitemap/schema only after trust/routes/content finalize | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | Site | Implant pages contain canonical relationship links but some target pages are not live yet | Complete routes before release | Link crawler | IN PROGRESS |
| X-001 | Accessibility | HARD | Guided calculators | Native controls, visible labels, live result regions and reduced-motion handling implemented; arch calculator H2s now expose the `calculator-heading` target used by step navigation; prefixed money controls focus as one unit | Run keyboard-only, focus-order, screen-reader and mobile checks | Browser/accessibility evidence | IN PROGRESS |
| P-001 | Performance | HIGH | Site | Dependency-free static implementation; no third-party calculator requests | Measure after representative UX stabilizes | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Local arithmetic only; no storage/network/URL serialization in implementation | Re-check rendered network behavior | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | Corrected arch candidate | Higher-placement/focus/result revision through `60b432e8f2b93dca7c7506275e63f2d9491ca33c` completed GitHub Actions successfully, including `npm run qa` | Reconfirm routinely after control-only commits | GitHub Actions | PASS |
| B-002 | Cloudflare preview | HARD | CALC-003 / CALC-003-A04 | User reviewed first guided arch renders; corrected versions have not yet been visually confirmed | Verify latest branch deployment: money focus, higher placement, concise H1 and result disclosure | Cloudflare preview | IN PROGRESS |
| B-003 | Rollback | HARD | Release process | Rollback procedure not documented | Document before production | Dry-run/document review | NOT TESTED |
| G-001 | Editorial workflow | HARD | Gemini implant production copy | Gemini v1 drafts returned; QA found missing heading vectors and evidence overstatements; corrected controlled drafts rebuilt and integrated | Preserve corrected editorial lineage; no FAQ expansion yet | Draft QA + integrated HTML | PASS |
| G-002 | Content/UX flow | HIGH | DEN-001 | Direct price answer remains first; calculator follows immediately; concise H1 and plain-language v4 source are user-approved in rendered form | Preserve | Rendered content review | PASS |
| G-003 | Health literacy | HIGH | Calculator UX contract | Delta Dental, CareCredit and FAIR Health patterns reviewed; CDC plain-language guidance applied; unavoidable dental terms paired with everyday explanations | Reuse selectively where task fits | Research file + user approval | PASS |
| G-004 | Brief/source parity | HIGH | DEN-003 / DEN-012 | Briefs revised with higher calculator placement, concise H1s and guided-result behavior; v3 editorial drafts created to match integrated source | Preserve parity | Brief/draft/build comparison | PASS |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established |
| G1 Research/Architecture | PASS | Frozen registry + direct implants evidence authority established |
| G2 Content/Trust | IN PROGRESS | Implant Main Content controlled; trust surfaces and remaining pages incomplete |
| G3 Design/Media/Accessibility | IN PROGRESS | CALC-001 representative UX approved; arch calculators corrected after first rendered review; multi-viewport/accessibility and media remain |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex guarded; final technical SEO/routes incomplete |
| G5 Calculators/Data | PASS for implemented arithmetic | CALC-008 and implant calculator cores/specs pass automated QA; corrected arch rendered UX still open |
| G6 Build/Security/Performance | IN PROGRESS | Corrected arch GitHub QA/security controls pass; performance remains |
| G7 Preview | IN PROGRESS | CALC-001 representative UX approved; corrected CALC-003/CALC-003-A04 deployment/render verification pending |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until hard gates pass |

## Current release decision

**NO-GO for production.** CALC-001 is the approved representative calculator UX. CALC-003 and CALC-003-A04 were adapted to that pattern, then revised again after user screenshots exposed the same prefixed-money focus problem plus overly late calculator placement, technical H1s and dense result detail. Those issues are corrected in source without changing the frozen arch-normalization formulas or evidence boundaries, and GitHub QA passes. The next calculator gate is one corrected Cloudflare rendered review, followed by mobile/keyboard/accessibility checks. Trust pages, remaining evidence clusters, media, final technical SEO, performance and rollback remain open.
