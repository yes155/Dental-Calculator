# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-16.

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
| C-003 | Calculator | HARD | CALC-001 arithmetic | Frozen quote-input logic remains in shared core; bundle/itemized math, tooth normalization, component state and insurer bounds regression-tested | Preserve formula while testing presentation | Automated regression tests | PASS |
| C-004 | Calculator | HARD | CALC-003 | Frozen arch-quote normalizer implemented; no national per-arch default; confirmed 1/2-arch normalization only | Render/manual QA | Automated + browser QA | PASS |
| C-005 | Calculator | HARD | CALC-003-A04 | Shares arch core; reference card non-computational; arch count explicit; package unknowns preserved | Render/manual QA | Automated + browser QA | PASS |
| C-006 | Calculator | HARD | Implant shared core | Integer cents, blank/zero distinction, max ceiling, unknown scope, insurer bounds, duplicate lines and normalization regression-tested | Preserve fixtures with future changes | Node test suite | PASS |
| C-007 | Calculator UX | HIGH | CALC-001 representative pattern | Guided three-stage UX implemented; second rendered review identified technical wording, H1 wrap and money-field validation alignment; source now uses plain-language labels and whole-control validation outline | Verify newest Cloudflare render before pattern reuse | GitHub Actions + rendered QA | IN PROGRESS |
| T-001 | Trust | HARD | Site | No false reviewer claim; trust routes frozen | Build trust/legal/methodology pages | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative calculator | Calculator moved near top after direct answer, constrained to ~960px, secondary items collapsed, concise H1 and plain-language UI applied | Verify latest desktop/mobile render and validation state | Multi-viewport review | IN PROGRESS |
| M-001 | Media | HIGH | Site | No final media system | Define media contract/manifest | Manifest + render QA | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | All implemented pages intentionally noindex; build gate checks preview noindex tokens | Finalize canonical/robots/sitemap/schema only after trust/routes/content finalize | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | Site | Implant pages contain canonical relationship links but some target pages are not live yet | Complete routes before release | Link crawler | IN PROGRESS |
| X-001 | Accessibility | HARD | CALC-001 guided UX | Native controls, visible labels, step focus targets, error summary, live result region and reduced-motion handling implemented; prefixed money validation now outlines the whole control | Run keyboard-only, focus-order and screen-reader checks on latest deployed version | Browser/accessibility evidence | IN PROGRESS |
| P-001 | Performance | HIGH | Site | Dependency-free static implementation; no third-party calculator requests | Measure after representative UX stabilizes | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Local arithmetic only; no storage/network/URL serialization in implementation | Re-check rendered network behavior | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | Plain-language CALC-001 candidate | Head `692c9315b59032fcc5243e880d1c0f6360d957ea` completed GitHub Actions `test-and-build` successfully, including `npm run qa`; plain-language asset/tokens and revised H2 gate passed | Preserve automated gates; reconfirm after later control commits as routine | GitHub Actions | PASS |
| B-002 | Cloudflare preview | HARD | Latest CALC-001 | User supplied rendered screenshots for the preceding guided UX; newest plain-language head has not yet been visually verified | Verify latest branch deployment and render concise H1, money validation border and simplified labels | Cloudflare preview | IN PROGRESS |
| B-003 | Rollback | HARD | Release process | Rollback procedure not documented | Document before production | Dry-run/document review | NOT TESTED |
| G-001 | Editorial workflow | HARD | Gemini implant production copy | Gemini v1 drafts returned; QA found missing heading vectors and evidence overstatements; corrected controlled drafts rebuilt and integrated | Preserve corrected editorial lineage; no FAQ expansion yet | Draft QA + integrated HTML | PASS |
| G-002 | Content/UX flow | HIGH | DEN-001 | Direct price answer remains first; calculator follows immediately; plain-language v4 source and concise H1 now control the page | Confirm latest live render retains answer-first clarity | Rendered content review | IN PROGRESS |
| G-003 | Health literacy | HIGH | DEN-001 / CALC-001 | Comparable Delta Dental, CareCredit and FAIR Health tools reviewed; CDC plain-language guidance applied; unavoidable dental terms paired with everyday explanations | Reuse only after representative render approval | `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md` + browser review | IN PROGRESS |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established |
| G1 Research/Architecture | PASS | Frozen registry + direct implants evidence authority established |
| G2 Content/Trust | IN PROGRESS | Implant evidence-controlled Main Content integrated; DEN-001 plain-language flow revised; trust surfaces and remaining pages incomplete |
| G3 Design/Media/Accessibility | IN PROGRESS | Representative CALC-001 plain-language redesign implemented; latest rendered/accessibility approval and media work remain |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex guarded; final technical SEO/routes incomplete |
| G5 Calculators/Data | PASS for implemented arithmetic | CALC-008 and implant calculator cores/specs pass automated QA; representative rendered UX still open |
| G6 Build/Security/Performance | IN PROGRESS | Latest plain-language CALC-001 GitHub QA passes; performance and latest Cloudflare verification remain |
| G7 Preview | IN PROGRESS | Guided preview has been user-reviewed; newest plain-language deployment/render verification incomplete |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until hard gates pass |

## Current release decision

**NO-GO for production.** The representative CALC-001 now follows two rendered-review rounds: the first moved the calculator higher, narrowed it and changed it to a guided flow; the second identified technical language, an awkward long H1 and a validation outline that split the `$` prefix from the amount input. Those issues are corrected in source without changing calculator arithmetic. GitHub Actions passes for plain-language head `692c9315b59032fcc5243e880d1c0f6360d957ea`. The next gate is the newest Cloudflare render plus desktop/mobile/keyboard/accessibility verification before this interaction pattern is reused on other calculators. Trust pages, remaining clusters, media, final technical SEO, performance and rollback remain open.
