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
| C-003 | Calculator | HARD | CALC-001 arithmetic | Frozen quote-input logic remains in shared core; bundle/itemized math, tooth normalization, component scope and insurer bounds regression-tested | Preserve formula while testing new presentation | Automated regression tests | PASS |
| C-004 | Calculator | HARD | CALC-003 | Frozen arch-quote normalizer implemented; no national per-arch default; confirmed 1/2-arch normalization only | Render/manual QA | Automated + browser QA | PASS |
| C-005 | Calculator | HARD | CALC-003-A04 | Shares arch core; reference card non-computational; arch count explicit; package unknowns preserved | Render/manual QA | Automated + browser QA | PASS |
| C-006 | Calculator | HARD | Implant shared core | Integer cents, blank/zero distinction, max ceiling, unknown scope, insurer bounds, duplicate lines and normalization regression-tested | Preserve fixtures with future changes | Node test suite | PASS |
| C-007 | Calculator UX | HIGH | CALC-001 representative pattern | New dedicated guided UI keeps arithmetic core unchanged; three-stage flow, explicit component choices, conditional fields and stronger result context implemented | Verify live interaction and keyboard/mobile behavior before reuse | GitHub Actions + rendered QA | IN PROGRESS |
| T-001 | Trust | HARD | Site | No false reviewer claim; trust routes frozen | Build trust/legal/methodology pages | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative calculator | User reviewed first live calculator and requested higher placement, narrower width, easier navigation and less form-like interaction; redesigned CALC-001 implements those changes | Review latest Cloudflare render at target widths before approving pattern | Multi-viewport review | IN PROGRESS |
| M-001 | Media | HIGH | Site | No final media system | Define media contract/manifest | Manifest + render QA | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | All implemented pages intentionally noindex; build gate checks preview noindex tokens | Finalize canonical/robots/sitemap/schema only after trust/routes/content finalize | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | Site | Implant pages contain canonical relationship links but some target pages are not live yet | Complete routes before release | Link crawler | IN PROGRESS |
| X-001 | Accessibility | HARD | CALC-001 guided UX | Native radios/inputs/buttons, visible labels, step focus targets, error summary and live result region implemented | Run keyboard-only, focus-order and screen-reader checks on deployed guided UI | Browser/accessibility evidence | IN PROGRESS |
| P-001 | Performance | HIGH | Site | Dependency-free static implementation; no third-party calculator requests | Measure after representative UX stabilizes | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Local arithmetic only; no storage/network/URL serialization in implementation | Re-check rendered network behavior | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | Guided CALC-001/editorial candidate | Guided UX/editorial head `d54c2edc9966ee9b595edcfb85906957b0cd80c4` completed GitHub Actions `test-and-build` successfully, including `npm run qa`; new asset and revised H2 gate passed | Preserve automated gates; reconfirm after material code changes | GitHub Actions | PASS |
| B-002 | Cloudflare preview | HARD | Guided CALC-001 | Corrected-content commit `a50f7d57a63348994e5b9e7ba37724419ec9da4a` confirmed deployed successfully; guided-UX head not yet verified on Cloudflare | Verify latest branch build and render redesigned calculator | Cloudflare preview | IN PROGRESS |
| B-003 | Rollback | HARD | Release process | Rollback procedure not documented | Document before production | Dry-run/document review | NOT TESTED |
| G-001 | Editorial workflow | HARD | Gemini implant production copy | Gemini v1 drafts returned; QA found missing heading vectors and evidence overstatements; corrected controlled drafts rebuilt and integrated | Preserve corrected editorial lineage; no FAQ expansion yet | Draft QA + integrated HTML | PASS |
| G-002 | Content/UX flow | HIGH | DEN-001 | Brief updated so direct price answer remains first and calculator follows immediately; `DEN-001_DRAFT_v3.md` records approved calculator-first flow | Confirm live UX does not weaken answer-first reading | Rendered content review | IN PROGRESS |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established |
| G1 Research/Architecture | PASS | Frozen registry + direct implants evidence authority established |
| G2 Content/Trust | IN PROGRESS | Implant evidence-controlled Main Content integrated; DEN-001 UX flow revised; trust surfaces and remaining pages incomplete |
| G3 Design/Media/Accessibility | IN PROGRESS | Representative CALC-001 redesign implemented; rendered visual/accessibility approval and media work remain |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex guarded; final technical SEO/routes incomplete |
| G5 Calculators/Data | PASS for implemented arithmetic | CALC-008 and implant calculator cores/specs pass automated QA; representative rendered UX still open |
| G6 Build/Security/Performance | IN PROGRESS | Guided CALC-001 GitHub build/security QA passes; performance and latest Cloudflare verification remain |
| G7 Preview | IN PROGRESS | Corrected-content preview deployed; newest guided CALC-001 deployment/render verification incomplete |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until hard gates pass |

## Current release decision

**NO-GO for production.** The original live DEN-001 calculator was reviewed and a representative UX redesign is now implemented without changing calculator arithmetic: the direct price answer remains above the tool, the calculator moves near the top, width is constrained, the form becomes a guided three-stage flow, repetitive component dropdowns become explicit choices, and the result carries stronger quote context. GitHub Actions passes for guided head `d54c2edc9966ee9b595edcfb85906957b0cd80c4`. The next gate is Cloudflare rendering plus desktop/mobile/keyboard/accessibility verification before this interaction pattern is reused on other calculators. Trust pages, remaining clusters, media, final technical SEO, performance and rollback remain open.
