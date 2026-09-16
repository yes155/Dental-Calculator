# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-16.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

| ID | Category | Severity | Scope | Evidence | Fix / Next action | Verification | Status |
|---|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Canonical registry rebuilt directly from approved workbook: exactly 38 planned URLs + 5 deferred candidates; IDs/parents/calculator placements corrected | Preserve frozen ownership; no keyword-variant URLs without architecture review | Registry/workbook reconciliation | PASS |
| A-002 | Architecture | HIGH | Repository control | Initial manual CSV migration contained shifted IDs/URLs; corrected before any new page drafting | Keep future registry edits derived from controlling workbook/approved decisions | Changelog + exact route audit | PASS |
| E-001 | Evidence/Pricing | HARD | DEN-008 | Page separates CareCredit US averages from Humana Orlando examples; four DEN-008 sources recorded in `data/source-register.csv` | Keep source register synchronized with content changes | Source-to-claim reconciliation | PASS |
| E-002 | Evidence/Pricing | HARD | Implants batch | 20-source NotebookLM corpus and claim-level request prepared for DEN-001, DEN-003, DEN-007, DEN-012 | Return Evidence Pack and run ChatGPT source/scope/freshness QA before drafting | `NLM_IMPLANTS_CLUSTER_EVIDENCE-PACK_v1.md` audit | IN PROGRESS |
| E-003 | Evidence/Pricing | HARD | Remaining site | Site-wide source register/cost-data tables not yet populated for remaining procedure pages | Build cluster evidence packs/source rows before drafting each page | Cluster evidence QA | IN PROGRESS |
| Y-001 | YMYL/Clinical | HARD | DEN-008/CALC-008 | Calculator does not diagnose, select extraction type, determine tooth count, or recommend treatment | Preserve current boundary in future calculators | Content + calculator regression tests | PASS |
| Y-002 | YMYL/Clinical | HARD | Implants batch | Briefs prohibit candidacy, graft-need, implant-system/material recommendation and brand endorsement | Verify returned evidence/drafts do not cross boundary | Evidence/draft QA | IN PROGRESS |
| C-001 | Calculator | HARD | CALC-008 | 13 shared + 9 extraction-specific fixtures pass; written spec exists at `data/calculator-specs/CALC-008.md` | Keep fixtures/spec synchronized with implementation changes | `npm run qa` + spec diff | PASS |
| C-002 | Calculator | HIGH | CALC-008 rendered UX | Multi-viewport interaction not yet manually verified | Test 320/390/768/1280/1920 widths and keyboard flow | Browser QA evidence | NOT TESTED |
| C-003 | Calculator | HARD | Implant calculators | CALC-001, CALC-003 and CALC-003-A04 are architecture placements only; formulas/specs not yet frozen | Wait for evidence, then write specs/fixtures before implementation | Calculator-spec review | IN PROGRESS |
| T-001 | Trust | HARD | Site | No false dental reviewer claim; trust routes are frozen in Page Registry | Build real trust/legal/methodology pages before release | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative page | CSS and static template exist | Approve representative visual system before bulk rollout | Multi-viewport visual review | NOT TESTED |
| M-001 | Media | HIGH | Site | No final media system yet | Define media root/manifest/hero contract before production batches | Manifest + rendered checks | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | `noindex,nofollow` intentionally blocks preview indexing | Add final canonical, robots, sitemap, schema only after architecture/trust routes exist | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | DEN-008 | Six planned target routes are referenced but not yet live | Implement canonical target pages before release or prevent broken production links | Link crawler/build QA | IN PROGRESS |
| X-001 | Accessibility | HARD | Calculator/page | Skip link, labels, fieldsets, live result region and error-summary hooks exist | Run automated accessibility plus manual keyboard/screen-reader QA | Browser/accessibility evidence | NOT TESTED |
| P-001 | Performance | HIGH | Representative page | Dependency-free static build; no analytics/external calculator requests | Measure representative preview after visual system stabilizes | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | CALC-008 | Prototype uses no persistence, analytics, URL serialization or external requests | Re-check if third-party scripts/services are added | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | `chatgpt-work` | GitHub Actions Prelaunch QA passed at original implementation SHA and at brief head `efdda5593`; Cloudflare original implementation preview passed | Confirm Cloudflare deployment for current project-control head before candidate promotion | GitHub Actions + Cloudflare status | IN PROGRESS |
| B-002 | Rollback | HARD | Release process | No final rollback procedure documented | Document last-known-good SHA and Cloudflare rollback steps before production | Dry-run/document review | NOT TESTED |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/framework/build/preview path established; continuity/audit/changelog controls present |
| G1 Research/Architecture | PASS | Correct frozen Page Registry now canonical; 38 planned + 5 deferred; ownership/calc placements reconciled |
| G2 Content/Trust | IN PROGRESS | DEN-008 representative content/evidence controlled; implants briefs ready; trust surfaces and remaining pages incomplete |
| G3 Design/Media/Accessibility | NOT TESTED | Representative browser/accessibility review still required |
| G4 SEO/Schema/Links | IN PROGRESS | Preview intentionally noindex; target routes and final schema/technical SEO incomplete |
| G5 Calculators/Data | IN PROGRESS | CALC-008 automated logic + written spec pass; implant calculator specs await evidence; remaining tools/data incomplete |
| G6 Build/Security/Performance | IN PROGRESS | GitHub CI/privacy baseline passes; current Cloudflare head and performance still require verification |
| G7 Preview | IN PROGRESS | Cloudflare preview path exists; current-head deployment/rendered preview verification incomplete |
| G8 Rollback | NOT TESTED | Procedure not yet documented |
| G9 Production | FAIL | Production intentionally blocked until all hard gates pass |

## Current release decision

**NO-GO for production.** Architecture control is corrected and frozen. DEN-008 is evidence/spec controlled. The implants cluster has approved briefs and a source-first NotebookLM evidence request, but no implant numeric claim or calculator formula is authorized until that Evidence Pack is returned and audited. Visual/accessibility QA, site-wide evidence, trust surfaces, technical SEO, media/performance and rollback remain incomplete.
