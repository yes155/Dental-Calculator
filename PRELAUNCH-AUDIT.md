# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-16.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

| ID | Category | Severity | Scope | Evidence | Fix / Next action | Verification | Status |
|---|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Canonical registry reconciled to approved workbook: 38 planned URLs + 5 deferred candidates | Preserve frozen ownership | Registry/workbook reconciliation | PASS |
| E-001 | Evidence/Pricing | HARD | DEN-008 | Controlled CareCredit + Humana + ADA evidence in source register | Keep synchronized | Source-to-claim reconciliation | PASS |
| E-002 | Evidence/Pricing | HARD | Implants NotebookLM | Two returned NotebookLM packs failed source-ingestion requirements; neither is evidence authority | Keep rejected; preserve QA lineage | External model manifest | FAIL |
| E-003 | Evidence/Pricing | HARD | Implants direct verification | Direct live-source verification completed; FDA/AAP/CareCredit/Humana/Cigna/Delta/CMS/Nobel/Forbes rows migrated | Use direct evidence file + source register as authority | Claim/source reconciliation | PASS |
| E-004 | Evidence/Pricing | HARD | Remaining site | Remaining clusters not yet evidence-controlled | Build next cluster evidence | Cluster QA | IN PROGRESS |
| Y-001 | YMYL/Clinical | HARD | DEN-008/CALC-008 | No diagnosis/treatment selection/benefit recalculation | Preserve | Regression tests | PASS |
| Y-002 | YMYL/Clinical | HARD | Implants | Briefs/specs prohibit candidacy, graft-need inference, material/system recommendation, brand endorsement and benefit guarantees | Verify in drafts/implementation | Content + calculator QA | PASS |
| C-001 | Calculator | HARD | CALC-008 | Written spec + 22/22 fixtures pass | Keep synchronized | `npm run qa` | PASS |
| C-002 | Calculator | HIGH | CALC-008 rendered UX | Multi-viewport/manual interaction not yet verified | Render/browser QA | Browser evidence | NOT TESTED |
| C-003 | Calculator | HARD | CALC-001 | Frozen quote-input spec exists | Implement with fixtures before page integration | Spec + automated tests | IN PROGRESS |
| C-004 | Calculator | HARD | CALC-003 | Frozen arch-quote normalizer spec exists; no national per-arch default | Implement shared arch core + fixtures | Spec + automated tests | IN PROGRESS |
| C-005 | Calculator | HARD | CALC-003-A04 | Frozen All-on-4 quote normalizer spec exists; published reference non-computational | Implement shared arch core + fixtures | Spec + automated tests | IN PROGRESS |
| T-001 | Trust | HARD | Site | No false reviewer claim; trust routes frozen | Build trust/legal/methodology pages | Route/content/schema review | IN PROGRESS |
| D-001 | Design | HIGH | Representative page | CSS/template exists | Approve representative visual system | Multi-viewport review | NOT TESTED |
| M-001 | Media | HIGH | Site | No final media system | Define media contract/manifest | Manifest + render QA | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | Preview intentionally noindex | Finalize technical SEO after routes/trust exist | Automated technical SEO QA | IN PROGRESS |
| L-001 | Internal Links | HARD | Site | Planned targets not all live | Implement canonical targets before release | Link crawler | IN PROGRESS |
| X-001 | Accessibility | HARD | Site/calculators | Structural hooks exist on representative page only | Automated + manual accessibility QA | Browser evidence | NOT TESTED |
| P-001 | Performance | HIGH | Site | Dependency-free static baseline | Measure after visual/tool rollout | Performance audit | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Specs prohibit storage/network/URL serialization of entered quote values absent review | Re-check implementation | Source/network/privacy review | PASS |
| B-001 | Build/Deploy | HARD | `chatgpt-work` | Prior CI/Cloudflare baseline passed; latest evidence/spec head needs confirmation | Verify current head | GitHub Actions + Cloudflare | IN PROGRESS |
| B-002 | Rollback | HARD | Release process | Rollback procedure not documented | Document before production | Dry-run/document review | NOT TESTED |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established |
| G1 Research/Architecture | PASS | Frozen registry + direct implants evidence authority established |
| G2 Content/Trust | IN PROGRESS | DEN-008 controlled; implant briefs finalized; trust and remaining pages incomplete |
| G3 Design/Media/Accessibility | NOT TESTED | Representative visual/accessibility review required |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex; final technical SEO/routes incomplete |
| G5 Calculators/Data | IN PROGRESS | CALC-008 passes; CALC-001/CALC-003/CALC-003-A04 specs frozen but not implemented |
| G6 Build/Security/Performance | IN PROGRESS | Security model defined; latest head/performance need verification |
| G7 Preview | IN PROGRESS | Preview exists; latest head/rendered tools incomplete |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until hard gates pass |

## Current release decision

**NO-GO for production.** The implants evidence stage is now controlled despite two failed NotebookLM extractions: direct source verification, source-register migration, finalized briefs and frozen calculator specs are complete. Next work is implementation/drafting plus automated/rendered QA. Trust pages, remaining clusters, media, technical SEO, accessibility, performance and rollback remain incomplete.
