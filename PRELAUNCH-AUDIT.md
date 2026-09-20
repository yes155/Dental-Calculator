# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-20.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

Latest validated CI: **Prelaunch QA run #464 — SUCCESS** at `4a96515e34ea3a2d9a217f342c0dbe043ed25101`.

| ID | Category | Severity | Scope | Evidence / current state | Next verification | Status |
|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Frozen `data/page-registry.csv`: 39 APPROVED build routes + 5 DEFERRED non-build candidates. All 39 approved routes have source implementations. | Preserve ownership; no new URL without architecture review. | PASS |
| A-002 | Cannibalization | HARD | Site | Frozen one-owner URL architecture retained; deferred routes remain outside the build/sitemap. | Final crawl/control-page review after real domain is set. | PASS |
| E-001 | Evidence/Pricing | HARD | Site | Procedure clusters have repo evidence packs/source-register lineage; automated page safeguards preserve price type, geographic scope and category boundaries. | Recheck time-sensitive source freshness immediately before production. | PASS |
| E-002 | Evidence/Insurance | HARD | Site/calculators | No universal coverage guarantee; named-plan examples remain scoped; calculators use only user-entered same-quote insurer estimates where supported. | Final wording/source refresh before production. | PASS |
| Y-001 | YMYL/Clinical | HARD | Site/calculators | No diagnosis, treatment selection, candidacy decision or symptom-to-price logic. | Preserve through final candidate audit. | PASS |
| Y-002 | YMYL/Reviewer | HARD | Site | Author/reviewer roles are explicit; automated QA blocks page-specific reviewer credit without exact-version approval. | Preserve on production artifacts. | PASS |
| C-001 | Calculators | HARD | Registry-assigned tools | Calculator cores/UIs/specs implemented with blank≠zero, scope controls, reference-data separation and insurance safeguards; automated regression suite green. Representative cleaning-calculator keyboard flow passed manually. | Preserve through production candidate. | PASS |
| C-002 | Calculator output safety | HARD | Site | Results remain educational quote summaries/estimates, not treatment recommendations, dentist quotes or coverage guarantees. Representative live-browser completion passed. | Preserve through production candidate. | PASS |
| G-001 | Content | HARD | Approved routes | All 39 approved routes implemented; publication-marker audit is clean. | Final-domain differential crawl. | PASS |
| G-002 | Internal links | HARD | Approved routes | Automated sitewide test verifies root-relative page links resolve to implemented approved routes/assets. | Final-domain crawl after candidate deployment. | PASS |
| T-001 | Trust | HARD | Site | About, Editorial Policy, Author, Contact, Privacy, Terms, Corrections & Updates, Cost Data Methodology, Calculator Methodology, Disclosures, Medical Disclaimer and reviewer profile implemented. Farrukh and reviewer people-media load successfully on preview. | Production parity check. | PASS |
| T-002 | Credentials/review | HARD | People/pages | No fabricated dentist qualification or automatic reviewer endorsement; reviewer profile explicitly limits page-level credit. | Preserve on production artifacts. | PASS |
| S-001 | Preview indexation | HARD | Preview | Live preview manually verified: page source/meta remains noindex; `robots.txt` returns `User-agent: *` + `Disallow: /`; edge response includes `X-Robots-Tag: noindex`. | None for preview; keep until production cutover. | PASS |
| S-002 | Canonicals | HARD | Production artifact | Production build requires HTTPS `SITE_ORIGIN` and generates exactly one self-canonical per approved route. CI production fixture passes. | Set real hostname and verify canonical URLs on Cloudflare production candidate. | IN PROGRESS |
| S-003 | Sitemap | HARD | Production artifact | `sitemap.xml` is generated only from 39 APPROVED registry URLs; deferred routes are excluded. CI production fixture passes. | Verify real-domain sitemap and HTTP status before launch. | IN PROGRESS |
| S-004 | Robots | HARD | Production artifact | Production `robots.txt` allows crawling and points to `${SITE_ORIGIN}/sitemap.xml`; preview blocking robots is verified live. | Verify production robots after hostname connection. | IN PROGRESS |
| S-005 | OG/X metadata | HIGH | Production artifact | Final 1200×630 local social card is validated during production build; all 39 approved routes receive `og:image`/secure URL/type/width/height/alt plus X `summary_large_image` + image metadata. Run #464 passed. | Verify the absolute image URL on the final production hostname. | PASS |
| S-006 | Schema | HARD | Production artifact | CI-generated JSON-LD is limited to truthful `WebSite`, `WebPage`, `ProfilePage` and `Person`; overclaims such as `MedicalWebPage`, `FAQPage`, `Organization`, `reviewedBy` are blocked. Run #436 passed. | Real-domain schema validation. | PASS |
| D-001 | Design | HIGH | Site/calculators | Shared responsive CSS and representative guided calculator pattern implemented. Manual live-browser checks passed at 320px, 390px and 768px on the representative cleaning calculator with no reported clipping/overflow/control breakage. | Final-domain control-page spot check. | PASS |
| D-002 | Homepage information architecture | HIGH | Homepage | Router-first source implementation is complete: task doorways and category navigation precede three scoped price examples and a static state snapshot; deep state content is collapsed; trust/FAQ content is condensed; the closing band has an action. Local QA and build gates pass. | Publish to the visual-refresh preview and inspect desktop/mobile render, disclosure behavior and spacing. | IN PROGRESS |
| X-001 | Accessibility — source | HARD | Site/calculators | Skip link, focus-visible, native controls, labels, fieldsets/legends, focused error summaries, aria-invalid, live results, mobile form sizing and reduced-motion handling present. | Preserve through final candidate. | PASS |
| X-002 | Accessibility — rendered | HARD | Representative pages/tools | Manual keyboard-only QA passed on the cleaning calculator, including intentional validation error and successful completion through the result state; focus remained visible/logical. Responsive checks passed at 320/390/768. | Final-domain spot check after deployment. | PASS |
| M-001 | Media | HIGH | Site | Reviewer/Farrukh people-media are local and verified live; final sitewide 1200×630 social card is local and build-validated; prior cross-project image failure is regression-guarded. | Final-domain asset/preview spot check. | PASS |
| P-001 | Performance | HIGH | Source/static payload | Current source is lightweight: shared CSS ~15.5 KB; largest calculator UI module ~20.3 KB; HTML pages generally small; no large media bundle. Live preview document and static assets load successfully. | Measure representative final-domain pages before launch. | IN PROGRESS |
| R-001 | Security headers | HARD | Preview/static | Live edge response manually verified: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, plus preview `X-Robots-Tag: noindex`. | Recheck on final production hostname. | PASS |
| R-002 | Privacy | HARD | Calculators | Calculator arithmetic is local; code/test policy states quote values are not intentionally sent, stored or serialized into URL. Manual calculator completion produced no reported privacy/network anomaly. | Final-domain network spot check. | PASS |
| R-003 | CSP/HSTS | HIGH | Final domain | CSP intentionally deferred to avoid untested resource breakage; HSTS deferred until real production domain/zone exists. | Decide/test on production candidate hostname. | DEFERRED |
| B-001 | Build | HARD | Site | `npm run qa` passes; automated tests/build/verifiers/production-artifact fixture are green. Latest validated run #464 SUCCESS at `4a96515e34ea3a2d9a217f342c0dbe043ed25101`, including the real production origin and social-image metadata path. | Keep green through documentation/final candidate freeze. | PASS |
| B-002 | Cloudflare preview | HARD | `chatgpt-work` | Branch preview verified manually: homepage 200, people-media assets load, robots blocks crawling, and required security headers are present. | Preserve until production cutover. | PASS |
| B-003 | Production hostname | HARD | Release | Real production hostname not connected/set; build refuses to invent `SITE_ORIGIN`. | Connect/finalize domain and set production build variable. | IN PROGRESS |
| B-004 | Rollback | HARD | Release | Rollback target is current `main` at `3e9db6a6458659c4db41b80b16a97558957b953b`; procedure is documented in `LAUNCH-REPORT.md`. It has not yet been tested against the live production-domain candidate. | Verify rollback after candidate deployment and before merge. | IN PROGRESS |


## Semantic SEO + keyword-mapping audit — 2026-09-20

Audit basis: approved Dental Topical Map/Page Registry and 932-row Keyword Mapping workbook; current `visual-refresh-2026-09-18` source; dental project rules; Koray/Ehsan semantic-audit rules. Numeric diagnostic heuristics do not override the frozen architecture, evidence scope or YMYL safety boundaries.

| ID | Category | Severity | Scope | Finding | Required action | Status |
|---|---|---|---|---|---|---|
| K-001 | Keyword mapping integrity | HARD | Keyword map | 932 research rows reconcile: 749 mapped, 101 excluded, 46 deferred-research, 35 deferred-page and 1 intentional zero-count duplicate variant. Counted mapped demand is 841,900. No duplicate normalized keyword is assigned to competing URLs; every mapped owner has one Primary keyword; page-level keyword/volume totals reconcile. | Preserve canonical ownership; do not create modifier URLs for cost/price/how-much/with-or-without-insurance variants. | PASS |
| K-002 | Query responsiveness | HIGH | DEN-002, DEN-005, DEN-008, DEN-010, DEN-018, DEN-025 | Large mapped uninsured-intent families are consolidated correctly but several current pages do not explicitly use/answer the “without insurance” formulation. Root canal and extraction are the clearest gaps because their Primary keyword is the uninsured variant. | Add bounded answer-first uninsured wording inside the existing canonical page; do not create separate uninsured URLs. | IN PROGRESS |
| K-003 | Synonym coverage | MEDIUM | DEN-030 | Primary mapped query is “dental plate cost,” but the current dentures page does not use “dental plate/plate.” | Add one natural clarifying synonym/quote-language sentence without changing the canonical entity or H1. | IN PROGRESS |
| A-003 | Workbook source-of-truth drift | HIGH | Architecture resources | The approved workbook still contains proposal-era statuses and does not include later trust page TRU-012, while repo `data/page-registry.csv` is frozen and current. | Sync workbook status/registry metadata to the frozen repo architecture; do not alter validated keyword assignments during the sync. | IN PROGRESS |
| A-004 | Inlay/onlay information gain | HIGH | DEN-004 / DEN-013 | Separate owners remain valid only if each page provides distinct user value. Current pages are semantically differentiated but both rely on the same combined national ceramic inlay/onlay evidence and each has only one mapped keyword. | Keep separate for now; require an explicit human architecture/evidence review before production. Merge only if distinct evidence/user task cannot be sustained. | IN PROGRESS |
| G-003 | Semantic internal-link graph | HIGH | Procedure pages / methodology | The approved link plan calls for contextual bridges to Cost Data Methodology, Insurance & Out-of-Pocket Costs and, for calculator pages, Calculator Methodology. Multiple implemented procedure pages are missing one or more of these links; Calculator Methodology currently has no body links back to supported tools. | Add contextual links at the relevant price/insurance/calculator passages and add supported-tool links from Calculator Methodology. | IN PROGRESS |
| G-004 | Architecture wording consistency | MEDIUM | Replacement / orthodontic / cosmetic related sections | Several pages still use headings such as “Related replacement cost guides,” “Related orthodontic cost guides,” and “Related cosmetic dental cost guides” after the site adopted one canonical procedure-page model. | Rename these to neutral “Related … pages” labels; no URL changes. | IN PROGRESS |
| T-003 | Reviewer/trust claim accuracy | HARD | Homepage | Hero trust strip says “Version-specific clinical & scientific review,” but project policy prohibits implying page-level review without documented exact-version review. | Replace with a verifiable non-endorsement signal such as “Sources & review boundaries disclosed.” | FAIL |
| T-004 | Brand/entity consistency | HIGH | Site + production metadata | Shared chrome brands the site “Dental Cost Calculator,” while About/Editorial/Reviewer surfaces and production WebSite/OG metadata still use “Dental Calculator.” | Choose one canonical site name and use it consistently across visible trust pages, WebSite schema, `og:site_name` and metadata. Current domain/header strongly support “Dental Cost Calculator.” | IN PROGRESS |
| S-007 | Breadcrumb structured data | MEDIUM | Production schema | Visible sitewide breadcrumbs now exist, but production JSON-LD does not emit `BreadcrumbList`. | Add truthful `BreadcrumbList` for inner pages and validate against visible breadcrumb hierarchy. | IN PROGRESS |
| G-005 | Predicate strength | MEDIUM | Homepage hero | H1 “Know what a dental procedure should cost” is stronger/normative wording than the site’s evidence model, which provides published context and user-entered quote organization rather than a definitive expected fee. | Consider a softer evidence-aligned H1 during copy correction; preserve the dental-procedure-cost entity and intent. | REVIEW |

### Audit interpretation

- The keyword map is **not** the problem. Canonical ownership and deduplication are strong.
- Do **not** create new pages for uninsured, average-cost, price or “how much” modifiers.
- The highest-value prelaunch corrections are trust-claim accuracy, brand/entity consistency, semantic internal linking and explicit uninsured-intent answers on the existing owners.
- The generic “<=15 contextual links” heuristic is not applied to the homepage directory because the homepage intentionally functions as the procedure hub; architecture and user navigation take precedence over that numeric heuristic.
- Deferred premium-shopping, clinical/symptom and ambiguous-service candidates remain deferred; no launch URL expansion is recommended from this audit.


## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | PASS | Source/build and live preview baseline verified. |
| G1 Research/Architecture | PASS | 39 approved routes frozen; 5 deferred non-build routes excluded; current procedure clusters evidence-controlled. |
| G2 Content/Trust | PASS | All approved source routes and trust/methodology surfaces implemented; publication copy clean; people-media verified live. |
| G3 Design/Media/Accessibility | PASS | Representative responsive + keyboard QA passes; people-media and final 1200×630 sitewide social card are complete and build-validated. |
| G4 SEO/Schema/Links | IN PROGRESS | Canonical/robots/sitemap/OG-X/JSON-LD automation passes CI against the finalized origin; only live final-domain verification remains open. |
| G5 Calculators/Data | PASS | Registry-assigned tools have automated arithmetic/scope/YMYL safeguards and representative rendered interaction QA passed. |
| G6 Build/Performance/Security/Privacy | IN PROGRESS | Build/CI, live preview security headers and representative privacy behavior pass; final-domain performance/security checks remain. |
| G7 Candidate/Preview | PASS for preview | `chatgpt-work` preview manually verified at the edge; final production candidate still depends on domain/social image. |
| G8 Rollback | IN PROGRESS | Rollback target/procedure documented; live candidate rollback verification remains open. |
| G9 Production | FAIL | Intentional NO-GO until remaining final-release gates pass. |

## Current release decision

**NO-GO for production.**

What is now green: architecture, approved-route implementation, evidence/scope controls, trust pages, calculator regression logic, representative calculator keyboard/responsive QA, internal links, publication cleanliness, build, preview indexation controls, live Cloudflare preview, live security headers, truthful JSON-LD, and local people-media.

Remaining release blockers are now limited to:
1. Cloudflare attachment of `dentalcostcalculator.site` + production `SITE_ORIGIN` setting;
2. final-domain canonical/robots/sitemap/schema/security/performance verification;
3. final candidate freeze + live rollback verification;
4. final hard-blocker audit before any merge to `main`.
