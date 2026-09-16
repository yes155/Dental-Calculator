# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-16.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

| ID | Category | Severity | Scope | Evidence | Fix / Next action | Verification | Status |
|---|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Approved architecture contains 38 planned URLs; DEN-008 ownership frozen | Preserve registry ownership; do not create keyword-variant URLs | Registry review before new routes | PASS |
| E-001 | Evidence/Pricing | HARD | DEN-008 | Page separates CareCredit US averages from Humana Orlando examples and labels source scope/date limitations | Migrate source register and page evidence metadata into repository | Source-register reconciliation | IN PROGRESS |
| Y-001 | YMYL/Clinical | HARD | DEN-008/CALC-008 | Calculator does not diagnose, select extraction type, determine tooth count, or recommend treatment | Preserve current boundary in future calculators | Content + calculator regression tests | PASS |
| C-001 | Calculator | HARD | CALC-008 | 13 shared + 9 extraction-specific fixtures pass | Keep fixtures mandatory for every implementation change | `npm run qa` | PASS |
| C-002 | Calculator | HIGH | CALC-008 rendered UX | Multi-viewport interaction not yet manually verified | Test 320/390/768/1280/1920 widths and keyboard flow | Browser QA evidence | NOT TESTED |
| T-001 | Trust | HARD | Site | No false dental reviewer claim; author attribution present | Build real trust/legal/methodology pages before release | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative page | CSS and static template exist | Approve representative visual system before bulk rollout | Multi-viewport visual review | NOT TESTED |
| M-001 | Media | HIGH | Site | No final media system yet | Define media root/manifest/hero contract before production batches | Manifest + rendered checks | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | `noindex,nofollow` intentionally blocks preview indexing | Add final canonical, robots, sitemap, schema only after architecture/trust routes exist | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | DEN-008 | Six planned target routes are referenced but not yet live | Implement canonical target pages before release or prevent broken production links | Link crawler/build QA | IN PROGRESS |
| X-001 | Accessibility | HARD | Calculator/page | Skip link, labels, fieldsets, live result region and error-summary hooks exist | Run automated accessibility plus manual keyboard/screen-reader QA | Browser/accessibility evidence | NOT TESTED |
| P-001 | Performance | HIGH | Representative page | Dependency-free static build; no analytics/external calculator requests | Measure representative preview after visual system stabilizes | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | CALC-008 | Prototype uses no persistence, analytics, URL serialization or external requests | Re-check if third-party scripts/services are added | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | `chatgpt-work` | GitHub Actions Prelaunch QA passed at `e3dea30b`; Cloudflare preview deployment succeeded | Keep CI required for each candidate | GitHub Actions + preview deployment | PASS |
| B-002 | Rollback | HARD | Release process | No final rollback procedure documented | Document last-known-good SHA and Cloudflare rollback steps before production | Dry-run/document review | NOT TESTED |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/framework/build/preview path established; project-control files now being formalized |
| G1 Research/Architecture | IN PROGRESS | 38-URL architecture frozen; repository Page Registry/source register migration pending |
| G2 Content/Trust | IN PROGRESS | DEN-008 representative page cleaned; trust surfaces incomplete |
| G3 Design/Media/Accessibility | NOT TESTED | Representative browser/accessibility review still required |
| G4 SEO/Schema/Links | IN PROGRESS | Preview intentionally noindex; target routes and final schema/technical SEO incomplete |
| G5 Calculators/Data | IN PROGRESS | CALC-008 automated logic passes; rendered UX and repository data/spec migration remain |
| G6 Build/Security/Performance | IN PROGRESS | Build/CI/privacy baseline pass; performance not tested |
| G7 Preview | IN PROGRESS | Cloudflare preview deploy succeeds; rendered preview verification still incomplete |
| G8 Rollback | NOT TESTED | Procedure not yet documented |
| G9 Production | FAIL | Production intentionally blocked until all hard gates pass |

## Current release decision

**NO-GO for production.** The representative implementation is suitable for continued prelaunch development only. Automated logic/build/deployment are working; visual/accessibility QA, repository evidence/registry controls, live supporting routes, trust surfaces, final technical SEO and rollback remain incomplete.
