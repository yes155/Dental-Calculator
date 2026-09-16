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
| Y-002 | YMYL/Clinical | HARD | Implants | Corrected v2 copy removes candidacy, graft-need, material/system recommendation, brand superiority and benefit-guarantee language | Preserve in future edits | Content + calculator QA | PASS |
| C-001 | Calculator | HARD | CALC-008 | Written spec + 22/22 fixtures pass | Keep synchronized | `npm run qa` | PASS |
| C-002 | Calculator | HIGH | CALC-008 rendered UX | Multi-viewport/manual interaction not yet verified | Render/browser QA | Browser evidence | NOT TESTED |
| C-003 | Calculator | HARD | CALC-001 | Frozen spec implemented in shared implant core/UI; bundle/itemized, tooth-count normalization, component scope and same-scope insurer estimate regression-tested | Render/manual QA | Automated + browser QA | PASS |
| C-004 | Calculator | HARD | CALC-003 | Frozen arch-quote normalizer implemented; no national per-arch default; confirmed 1/2-arch normalization only | Render/manual QA | Automated + browser QA | PASS |
| C-005 | Calculator | HARD | CALC-003-A04 | Shares arch core; reference card non-computational; arch count explicit; package unknowns preserved | Render/manual QA | Automated + browser QA | PASS |
| C-006 | Calculator | HARD | Implant shared core | Integer cents, blank/zero distinction, max ceiling, unknown scope, insurer bounds, duplicate lines and normalization regression-tested | Preserve fixtures with future changes | Node test suite | PASS |
| T-001 | Trust | HARD | Site | No false reviewer claim; trust routes frozen | Build trust/legal/methodology pages | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative pages | Existing static visual system applied to implant-cluster previews | Approve representative visual system after rendered review | Multi-viewport review | NOT TESTED |
| M-001 | Media | HIGH | Site | No final media system | Define media contract/manifest | Manifest + render QA | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | All implemented pages intentionally noindex; build gate checks preview noindex tokens | Finalize canonical/robots/sitemap/schema only after trust/routes/content finalize | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | Site | Implant pages contain canonical relationship links but some target pages are not live yet | Complete routes before release | Link crawler | IN PROGRESS |
| X-001 | Accessibility | HARD | Implant calculators | Programmatic labels/fieldsets, error summary, live results, reduced-motion behavior and keyboard-capable controls implemented | Run automated + manual keyboard/screen-reader QA | Browser/accessibility evidence | IN PROGRESS |
| P-001 | Performance | HIGH | Site | Dependency-free static implementation; no third-party calculator requests | Measure after visual/tool rollout | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Implant UI/core use local arithmetic only; no storage/network/URL serialization in implementation | Re-check rendered network behavior | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | Implant code/content | Build now requires DEN-008 + four implant pages/assets, single H1, noindex, calculator/ARIA markers and frozen implant H2 order | Confirm final branch-head Actions pass after control-file updates | GitHub Actions | IN PROGRESS |
| B-002 | Cloudflare preview | HARD | Latest corrected implant pages | Branch preview exists but latest corrected-copy head has not been verified/rendered | Verify current head on Cloudflare and render pages | Cloudflare preview | IN PROGRESS |
| B-003 | Rollback | HARD | Release process | Rollback procedure not documented | Document before production | Dry-run/document review | NOT TESTED |
| G-001 | Editorial workflow | HARD | Gemini implant production copy | Gemini v1 drafts returned; QA report found missing heading vectors and evidence overstatements; corrected v2 drafts rebuilt and integrated | Preserve corrected v2 as editorial lineage; no FAQ expansion yet | `evidence/qa/GEMINI_IMPLANTS_CLUSTER_DRAFT_QA_v1.md` + integrated HTML | PASS |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established |
| G1 Research/Architecture | PASS | Frozen registry + direct implants evidence authority established |
| G2 Content/Trust | IN PROGRESS | Implant evidence-controlled Main Content integrated; trust surfaces and remaining pages incomplete |
| G3 Design/Media/Accessibility | IN PROGRESS | Structural accessibility exists; rendered visual/accessibility and media work remain |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex guarded; final technical SEO/routes incomplete |
| G5 Calculators/Data | PASS for implemented scope | CALC-008 and implant calculator cores/specs pass automated QA; rendered UX still separately open |
| G6 Build/Security/Performance | IN PROGRESS | Build/security controls strengthened; final branch-head CI and performance remain |
| G7 Preview | IN PROGRESS | Branch preview exists; latest corrected-copy deployment/render verification incomplete |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until hard gates pass |

## Current release decision

**NO-GO for production.** The four Gemini drafts were not accepted verbatim. ChatGPT corrected them to the frozen semantic vectors, removed evidence overstatements, created v2 editorial files, integrated the corrected prose into the noindex preview pages, and added build enforcement for H2 order. Automated calculator logic remains controlled. Final branch-head CI confirmation, Cloudflare rendered verification, multi-viewport/accessibility QA, trust pages, remaining clusters, media, technical SEO, performance and rollback remain open.
