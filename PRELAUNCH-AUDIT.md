# PRELAUNCH AUDIT — Dental Calculator

Updated 2026-09-17.

Status values: PASS / FAIL / IN PROGRESS / DEFERRED / NOT TESTED

Latest validated implementation head before documentation sync: `1bac5c306e44274579791c83ea1b825d01db1e50`  
Latest validated CI: **Prelaunch QA run #437 — SUCCESS**

| ID | Category | Severity | Scope | Evidence / current state | Next verification | Status |
|---|---|---|---|---|---|---|
| A-001 | Architecture | HARD | Site | Frozen `data/page-registry.csv`: 39 APPROVED build routes + 5 DEFERRED non-build candidates. All 39 approved routes have source implementations. | Preserve ownership; no new URL without architecture review. | PASS |
| A-002 | Cannibalization | HARD | Site | Frozen one-owner URL architecture retained; deferred routes remain outside the build/sitemap. | Final crawl/control-page review after real domain is set. | PASS |
| E-001 | Evidence/Pricing | HARD | Site | Procedure clusters have repo evidence packs/source-register lineage; automated page safeguards preserve price type, geographic scope and category boundaries. | Recheck time-sensitive source freshness immediately before production. | PASS |
| E-002 | Evidence/Insurance | HARD | Site/calculators | No universal coverage guarantee; named-plan examples remain scoped; calculators use only user-entered same-quote insurer estimates where supported. | Final wording/source refresh before production. | PASS |
| Y-001 | YMYL/Clinical | HARD | Site/calculators | No diagnosis, treatment selection, candidacy decision or symptom-to-price logic. | Preserve through rendered/final candidate audit. | PASS |
| Y-002 | YMYL/Reviewer | HARD | Site | Author/reviewer roles are explicit; automated QA blocks page-specific reviewer credit without exact-version approval. | Preserve during final schema/render review. | PASS |
| C-001 | Calculators | HARD | Registry-assigned tools | Calculator cores/UIs/specs implemented with blank≠zero, scope controls, reference-data separation and insurance safeguards; automated regression suite green. | Rendered keyboard/viewport checks. | PASS |
| C-002 | Calculator output safety | HARD | Site | Results remain educational quote summaries/estimates, not treatment recommendations, dentist quotes or coverage guarantees. | Representative live-browser verification. | PASS |
| G-001 | Content | HARD | Approved routes | All 39 approved routes implemented; publication-marker audit is clean. | Final rendered differential QA. | PASS |
| G-002 | Internal links | HARD | Approved routes | Automated sitewide test verifies root-relative page links resolve to implemented approved routes/assets. | Final-domain crawl after candidate deployment. | PASS |
| T-001 | Trust | HARD | Site | About, Editorial Policy, Author, Contact, Privacy, Terms, Corrections & Updates, Cost Data Methodology, Calculator Methodology, Disclosures, Medical Disclaimer and reviewer profile implemented. | Render/live parity check. | PASS |
| T-002 | Credentials/review | HARD | People/pages | No fabricated dentist qualification or automatic reviewer endorsement; reviewer profile explicitly limits page-level credit. | Preserve on production artifacts. | PASS |
| S-001 | Preview indexation | HARD | Preview | Preview HTML remains `noindex,nofollow`; generated preview `robots.txt` blocks crawling; `workers.dev` `_headers` rule adds `X-Robots-Tag: noindex, nofollow`. | Verify actual Cloudflare response headers/robots at edge. | IN PROGRESS |
| S-002 | Canonicals | HARD | Production artifact | Production build requires HTTPS `SITE_ORIGIN` and generates exactly one self-canonical per approved route. CI production fixture passes. | Set real hostname and verify canonical URLs on Cloudflare production candidate. | IN PROGRESS |
| S-003 | Sitemap | HARD | Production artifact | `sitemap.xml` is generated only from 39 APPROVED registry URLs; deferred routes are excluded. CI production fixture passes. | Verify real-domain sitemap and HTTP status before launch. | IN PROGRESS |
| S-004 | Robots | HARD | Production artifact | Production `robots.txt` allows crawling and points to `${SITE_ORIGIN}/sitemap.xml`; preview uses blocking robots. | Verify both edge environments. | IN PROGRESS |
| S-005 | OG/X metadata | HIGH | Production artifact | OG title/description/url/site + X summary title/description are generated centrally and tied to canonical/title/description. | Approve social image; then add/verify `og:image` and X image metadata. | IN PROGRESS |
| S-006 | Schema | HARD | Production artifact | CI-generated JSON-LD is limited to truthful `WebSite`, `WebPage`, `ProfilePage` and `Person`; overclaims such as `MedicalWebPage`, `FAQPage`, `Organization`, `reviewedBy` are blocked. Run #436 passed. | Real-domain rendered/schema validation. | PASS |
| D-001 | Design | HIGH | Site/calculators | Shared responsive CSS and representative guided calculator pattern implemented. | 320/390/768/1280/1920 rendered differential QA. | IN PROGRESS |
| X-001 | Accessibility — source | HARD | Site/calculators | Skip link, focus-visible, native controls, labels, fieldsets/legends, focused error summaries, aria-invalid, live results, mobile form sizing and reduced-motion handling present. | Browser/manual keyboard and screen-reader spot checks. | PASS |
| X-002 | Accessibility — rendered | HARD | Representative pages/tools | Source inspection cannot prove keyboard order, clipping, zoom, focus visibility or screen-reader behavior at runtime. | Manual rendered QA at required viewports. | IN PROGRESS |
| M-001 | Media | HIGH | Site | Current source tree has no large media bundle; reviewer image is local. Final site-wide hero/social-image contract is not fully closed. | Approve final representative/social assets and verify mapping/crops. | IN PROGRESS |
| P-001 | Performance | HIGH | Source/static payload | Current source is lightweight: shared CSS ~15.5 KB; largest calculator UI module ~20.3 KB; HTML pages generally small; no large media bundle. No performance rewrite justified yet. | Measure representative Cloudflare pages after rendered candidate exists. | IN PROGRESS |
| R-001 | Security headers | HARD | Static assets | `_headers` supplies `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy and restrictive unused-feature Permissions-Policy. Run #437 passed. | Verify actual edge response headers. | IN PROGRESS |
| R-002 | Privacy | HARD | Calculators | Calculator arithmetic is local; code/test policy states quote values are not intentionally sent, stored or serialized into URL. | Browser network verification on representative calculators. | IN PROGRESS |
| R-003 | CSP/HSTS | HIGH | Final domain | CSP intentionally deferred to avoid untested resource breakage; HSTS deferred until real production domain/zone exists. | Decide/test on production candidate hostname. | DEFERRED |
| B-001 | Build | HARD | Site | `npm run qa` passes; 212/212 automated tests green; preview build + cluster verifiers + production-artifact fixture pass. Latest implementation run #437 SUCCESS. | Keep green after documentation/media/final candidate changes. | PASS |
| B-002 | Cloudflare preview | HARD | `chatgpt-work` | Branch preview hostname is known, but this audit environment could not reliably resolve/inspect it. | Verify representative URLs, calculators, robots and headers at the actual edge. | IN PROGRESS |
| B-003 | Production hostname | HARD | Release | Real production hostname not connected/set; build refuses to invent `SITE_ORIGIN`. | Connect/finalize domain and set production build variable. | IN PROGRESS |
| B-004 | Rollback | HARD | Release | No final candidate SHA + tested rollback record yet. | Document rollback target/procedure and dry-run/verify before production. | NOT TESTED |

## Hard-gate summary

| Gate | Status | Evidence |
|---|---|---|
| G0 Baseline | PASS for source/build; rendered edge baseline OPEN | Source inventory, route registry, build/QA and deployment controls are established. |
| G1 Research/Architecture | PASS | 39 approved routes frozen; 5 deferred non-build routes excluded; current procedure clusters evidence-controlled. |
| G2 Content/Trust | PASS for source | All approved source routes and trust/methodology surfaces implemented; publication copy clean. |
| G3 Design/Media/Accessibility | IN PROGRESS | Source-level responsive/accessibility controls are present; rendered multi-viewport/keyboard QA and final media/social image remain open. |
| G4 SEO/Schema/Links | IN PROGRESS | Canonical/robots/sitemap/OG-X/JSON-LD automation passes CI; real production hostname and edge verification remain open; social image metadata not yet added. |
| G5 Calculators/Data | PASS for automated logic | Registry-assigned tools have automated arithmetic/scope/YMYL safeguards; rendered interaction verification remains part of G3/G7. |
| G6 Build/Performance/Security/Privacy | IN PROGRESS | Build/CI and source security controls pass; edge headers/network/performance measurements remain open. |
| G7 Candidate/Preview | IN PROGRESS | Working branch is green, but Cloudflare branch preview has not been independently verified in this audit environment. |
| G8 Rollback | NOT TESTED | Final candidate and rollback procedure not yet frozen/tested. |
| G9 Production | FAIL | Intentional NO-GO until remaining hard gates pass. |

## Current release decision

**NO-GO for production.**

What is already green: architecture, approved-route source implementation, evidence/scope controls, trust pages, calculator regression logic, internal-link checks, publication cleanliness, build, production SEO generation, truthful JSON-LD, and low-risk static security-header configuration.

Remaining release blockers are concentrated rather than content-wide:
1. actual Cloudflare branch-preview/edge verification;
2. rendered multi-viewport + keyboard/accessibility checks;
3. final media/social-image decision and social image metadata;
4. real production hostname + `SITE_ORIGIN` and final canonical/robots/sitemap/schema verification;
5. representative edge network/performance/security-header verification and final-domain CSP/HSTS decision where appropriate;
6. final candidate SHA + rollback procedure;
7. final hard-blocker audit before any merge to `main`.
