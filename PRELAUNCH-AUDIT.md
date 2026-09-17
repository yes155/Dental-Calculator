# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-17.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

| ID | Category | Severity | Scope | Evidence / current state | Next verification | Status |
|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Frozen registry: 38 planned URLs + 5 deferred candidates; canonical `data/page-registry.csv` reconciled to approved workbook | Preserve ownership in every new batch | PASS |
| E-001 | Evidence/Pricing | HARD | DEN-008 | Controlled source register and page claims | Periodic source refresh | PASS |
| E-002 | Evidence/Pricing | HARD | Implants | Direct verified evidence + source register; rejected NotebookLM packs retained only as lineage | Periodic source refresh | PASS |
| E-003 | Evidence/Pricing | HARD | Preventive cluster | DEN-002, DEN-006 and DEN-011 controlled against preventive direct-verified evidence/source register | Refresh time-sensitive price sources | PASS |
| E-004 | Evidence/Insurance | HARD | GUI-001 | Corrected evidence-audited source; named-plan scope and exceptions preserved | Recheck policy-sensitive sources before production | PASS |
| E-005 | Evidence/Pricing | HARD | Remaining site | Other procedure clusters remain unverified/unimplemented | Continue cluster-by-cluster evidence work | IN PROGRESS |
| Y-001 | YMYL/Clinical | HARD | Implemented calculators | No diagnosis, candidacy, treatment selection or symptom-to-price logic | Preserve regression controls | PASS |
| Y-002 | YMYL/Clinical | HARD | DEN-002 / DEN-006 | Routine-vs-deep cleaning and quadrant need are never selected by the site; published ranges are reference-only | Render/manual review | PASS |
| Y-003 | YMYL/Insurance | HARD | GUI-001 + calculators | No universal coverage percentage/guarantee; named plan examples remain scoped; only user-entered same-quote insurer estimates are subtracted in calculators | Recheck source wording before production | PASS |
| C-001 | Calculator | HARD | CALC-008 | Frozen spec + automated fixtures | Rendered UX review still open | PASS |
| C-002 | Calculator | HARD | CALC-001 | Frozen quote-input logic; representative UX user-approved | Preserve | PASS |
| C-003 | Calculator | HARD | CALC-003 / CALC-003-A04 | Frozen arch normalization; no national per-arch default; quote arch count explicit | Final multi-viewport/manual review | PASS |
| C-004 | Calculator | HARD | CALC-002 | Frozen spec; core/UI/tests implemented; reference range never changes arithmetic | Render/mobile/keyboard QA | PASS |
| C-005 | Calculator | HARD | CALC-006 | Frozen spec; quote-based quadrant count; no 4× reference multiplication; core/UI/tests implemented | Render/mobile/keyboard QA | PASS |
| C-006 | Calculator UX | HIGH | CALC-002 / CALC-006 | Three-step guided pattern, constrained width, plain-language states, conditional fields | Cloudflare screenshots + keyboard testing | IN PROGRESS |
| G-001 | Content | HIGH | DEN-002 | Evidence-controlled page; bundle-vs-cleaning guard; calculator immediately after answer-first price section | Rendered review | PASS |
| G-002 | Content | HIGH | DEN-006 | Evidence-controlled page; per-quadrant scope explicit; no default full-mouth total; calculator immediately after answer-first section | Rendered review | PASS |
| G-003 | Content | HIGH | DEN-011 | Seven named X-ray rows preserved; no synthetic all-X-ray range; no calculator | Table/mobile render QA | PASS |
| G-004 | Content | HIGH | GUI-001 | Corrected eight-heading source integrated; hypothetical arithmetic explicitly labeled; no generic procedure-price benchmark | Render/manual review | PASS |
| T-001 | Trust | HARD | Site | No false dental reviewer/credential claim; trust routes frozen but not fully implemented | Build trust/legal/methodology pages | IN PROGRESS |
| D-001 | Design | HIGH | Representative calculator pattern | CALC-001 pattern approved by user; preventive calculators use the same task-first principles | Differential multi-viewport QA | IN PROGRESS |
| M-001 | Media | HIGH | Site | No final media system/manifest approval | Define media contract and representative assets | NOT TESTED |
| S-001 | SEO/Schema | HARD | Preview | Implemented pages intentionally `noindex,nofollow`; build gates check preview directives | Canonical/robots/sitemap/schema at final candidate | IN PROGRESS |
| L-001 | Internal Links | HARD | Implemented cluster | DEN-002/DEN-006/DEN-011 now link to implemented GUI-001; some planned targets remain absent | Crawl once next related routes exist | IN PROGRESS |
| X-001 | Accessibility | HARD | Calculators/site | Native controls, visible labels, focus targets and live regions implemented | Manual keyboard, screen reader, 320/390/768/1280/1920 checks | IN PROGRESS |
| P-001 | Performance | HIGH | Site | Dependency-free static implementation; no third-party calculator requests | Measure representative pages after design stabilizes | NOT TESTED |
| R-001 | Security/Privacy | HARD | Calculators | Local arithmetic; no storage/network/URL serialization in calculator code | Browser network verification | PASS |
| B-001 | Build | HARD | Current implementation | `npm run qa` passed on implementation head `b9c683dc69b3565ce8f30e9aa41e5ec76427b954`; build gates cover DEN-002, DEN-006, DEN-011 and GUI-001 | Confirm latest control-only head CI | PASS |
| B-002 | Preview | HARD | Cloudflare | Branch preview configured; newest preventive/GUI routes not yet visually confirmed in this audit pass | Open latest branch preview and verify routes | IN PROGRESS |
| B-003 | Rollback | HARD | Release process | Rollback procedure not yet documented/tested | Document + dry run before production | NOT TESTED |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | IN PROGRESS | Repo/build/preview/control files established; full site baseline not finished |
| G1 Research/Architecture | PASS | Frozen registry; implemented clusters evidence-controlled |
| G2 Content/Trust | IN PROGRESS | Nine preview routes implemented; trust pages and remaining procedures incomplete |
| G3 Design/Media/Accessibility | IN PROGRESS | Representative calculator pattern established; preventive rendered/mobile/accessibility QA and media remain |
| G4 SEO/Schema/Links | IN PROGRESS | Preview noindex guarded; final canonical/sitemap/schema/link crawl incomplete |
| G5 Calculators/Data | PASS for implemented arithmetic | CALC-008, CALC-001, CALC-003, CALC-003-A04, CALC-002 and CALC-006 specs/automated tests controlled |
| G6 Build/Security/Performance | IN PROGRESS | Automated implementation build passes; performance and browser-network confirmation remain |
| G7 Preview | IN PROGRESS | Cloudflare branch configured; newest preventive/GUI rendered routes need confirmation |
| G8 Rollback | NOT TESTED | Procedure pending |
| G9 Production | FAIL | Intentional block until all hard gates pass |

## Current release decision

**NO-GO for production.** Automated source/build/calculator gates are healthy for the implemented routes, including the preventive batch and GUI-001. The next release-relevant work is rendered Cloudflare verification of DEN-002, DEN-006, DEN-011 and GUI-001; mobile/keyboard/accessibility checks; then continued evidence/content work, trust/methodology pages, media, final technical SEO, performance and rollback.
