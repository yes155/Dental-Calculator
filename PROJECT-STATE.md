# PROJECT STATE — Dental Calculator

Updated 2026-09-20.

## Project identity
- Site name: Dental Calculator (working name)
- Primary market: United States
- Primary audience: people researching dental procedure costs and written quote/out-of-pocket estimates
- Risk class: Health/YMYL-adjacent + financial estimation
- Production domain: `dentalcostcalculator.site` — attached to the Cloudflare production project
- Production origin: `https://dentalcostcalculator.site`
- Production release: blocked until remaining hard gates pass

## Repository / deployment
- GitHub repo: `yes155/Dental-Calculator`
- Production branch: `main`
- Working branch: `visual-refresh-2026-09-18`
- Framework: dependency-free Node.js static build
- Source: `src/`
- Build: `npm run build`
- QA: `npm run qa`
- Output: `dist/`
- Cloudflare project: `dental-calculator`
- Branch preview: `https://visual-refresh-2026-09-18-dental-calculator.f-abdullah79.workers.dev`
- Preview policy: implemented pages remain `noindex,nofollow`; preview `robots.txt` blocks crawling; live `workers.dev` response carries HTTP `X-Robots-Tag: noindex`.

## Architecture
- Frozen/user-approved 2026-09-15
- Canonical registry: `data/page-registry.csv`
- 39 approved build routes + 5 deferred non-build candidates
- No new keyword-variant or tool URLs without architecture review

## Evidence authority
Primary evidence controls currently in repo:
- DEN-008: `data/source-register.csv`
- Implants: `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` + source register
- Preventive/diagnostic: `evidence/preventive/PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md` + source register
- Restorations/root canals: `evidence/restorations/RESTORATIONS_ROOT_CANAL_DIRECT_VERIFIED_EVIDENCE_v1.md` + source register
- Orthodontics: build-controlled CareCredit/Synchrony price rows and calculator tests
- Cosmetic/prosthetics/final procedures: implemented preview routes with build-controlled evidence scope tokens
- Calculator UX research: `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md`
- GUI-001 source lineage: corrected Library source `GUI-001_dental-insurance-out-of-pocket-costs_v2.md`, `GUI-001_DRAFT_AUDIT_v2.md`, migrated repo source `content/guides/GUI-001_dental-insurance-out-of-pocket-costs_v2.md`

External-model outputs are never evidence authority by themselves. Rejected/cleaned returns remain lineage records only.

## Implemented preview routes
- All 39 approved Page Registry routes are present in `src/` and covered by source/build QA.
- The 5 deferred routes remain intentionally excluded from build output and sitemap generation.

## Calculator implementation status
Implemented and regression-tested quote-based calculators include:
- CALC-008 — extraction quote organizer
- CALC-001 — single-tooth implant quote organizer
- CALC-003 — full-mouth/full-arch quote normalizer
- CALC-003-A04 — All-on-4 quote normalizer
- CALC-002 — standard cleaning quote organizer
- CALC-006 — SRP/deep-cleaning quote organizer by user-confirmed quadrant count
- CALC-005 — root-canal quote organizer with restoration/add-on separation
- CALC-010 — filling quote organizer with descriptive material/surface/location labels
- CALC-022 — crown quote organizer with descriptive material/type and explicit build-up/add-on states
- Orthodontic/cosmetic/prosthetic/final-procedure calculators where implemented remain quote-entry tools only

Common controls:
- integer-cent arithmetic
- blank ≠ explicit zero
- $1,000,000 technical input ceiling, not a price assumption
- no treatment selection or diagnosis
- no market price generated from symptoms/location
- no automatic coverage percentage/deductible/annual maximum calculation
- patient amount shown only when scope/insurance inputs permit it
- no quote values intentionally sent externally, stored or serialized into the URL

## Technical SEO / schema / security status
- Preview source pages keep `noindex,nofollow`.
- Live preview `robots.txt` was manually verified as `User-agent: *` + `Disallow: /`.
- Live preview response headers were manually verified: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`, and `X-Robots-Tag: noindex`.
- Final production origin is `https://dentalcostcalculator.site`.
- Production artifact generation requires a valid HTTPS `SITE_ORIGIN`; CI now tests the exact finalized production origin.
- Production artifacts generate self-canonicals, registry-driven `robots.txt`, registry-driven `sitemap.xml`, OG/X text metadata and production index directives.
- Production-only JSON-LD is centralized and deliberately limited to truthful `WebSite`, `WebPage`, `ProfilePage` and `Person` usage.
- Build guards block unsupported `MedicalWebPage`, `FAQPage`, `Organization`, `reviewedBy` and accidental reviewer attribution.
- Final sitewide social image is local at `/assets/social/dentalcostcalculator-og.png` (1200×630 PNG). Production build validates PNG signature/dimensions and adds `og:image`, `og:image:secure_url`, image dimensions/alt text, and X `summary_large_image` metadata across all approved routes; preview mode skips this metadata.

## Trust / people
- Author shown: Farrukh Abdullah, researcher and writer only.
- Farrukh author photo: local asset `/assets/people/farrukh-abdullah.webp`, created from user-supplied photo and used on About and the author profile. The homepage now uses a compact policy-based trust strip without full bios or profile photos.
- No dental qualification claimed for Farrukh.
- Clinical/scientific reviewer: Juliana Maia Teixeira appears only in approved trust/profile contexts.
- Article-level reviewer credit is prohibited unless that exact page version has documented review.
- Regression guard blocks sibling-project domains such as `skinkpedia.online`, `myaxolotl.us`, and `bettafish.website` from approved dental pages.

## Automated QA
Current test/build system checks include:
- 212+ source and calculator tests
- approved route presence
- preview `noindex,nofollow`
- exactly one H1 per implemented page
- publication-clean copy markers
- no sibling-project domain contamination
- local people-image presence and wiring
- internal link resolution to approved routes/assets
- reviewer boundary enforcement
- calculator arithmetic/regression fixtures
- required page/assets for build-controlled routes
- controlled H2 order
- calculator placement on calculator-intent pages
- internal calculator IDs not leaked in reader copy
- key source-scope tokens remain present
- production-artifact SEO generation fixture
- schema guardrails
- cluster verifier checks

Latest validated CI: **Prelaunch QA run #464 — SUCCESS** at `4a96515e34ea3a2d9a217f342c0dbe043ed25101`.

## Media / design / accessibility
- Representative calculator visual pattern: established through CALC-001 review.
- Homepage information architecture now reflects one canonical page per dental procedure; the procedure browser precedes compact price/state examples and the complete state comparison remains collapsed by default.
- Farrukh author photo is local and verified live on the Cloudflare preview.
- Final sitewide social card is approved, local, 1200×630, and wired only into production metadata.
- Source-level accessibility review confirmed skip links, visible focus, labelled native controls, fieldsets/legends, error focus/`aria-invalid`, live results, responsive fallbacks, 16px mobile controls and reduced-motion handling.
- Manual live-browser QA passed for the representative cleaning calculator at 320px, 390px and 768px with no reported overflow/clipping/control breakage.
- Manual keyboard QA passed on the representative cleaning calculator, including intentional validation-error handling and completion through the result state with visible/logical focus.
- Live people-media requests were verified without the prior cross-project image failure.
- Sticky shared header and accessible mobile menu are implemented through shared site chrome.
- Inner pages receive generated breadcrumbs with a Home icon and current-page label; the homepage intentionally omits a redundant breadcrumb.
- A back-to-top control appears after substantial scrolling on long pages.
- A custom noindex 404 recovery page is included and linked to common procedure destinations.
- Print CSS removes navigation and interactive chrome so procedure guidance prints as a clean reference document.
- Static full-site search is available from the shared header without creating a new indexable route. The build generates `/assets/data/site-search.json` from the 38 approved non-home registry pages, grouped as Dental procedures, Paying for care, and Trust & methodology.
- Search queries run entirely in the browser against the local index; no third-party search service or query tracking is introduced.
- Semantic SEO / keyword-mapping audit completed against the approved topical map and current source. Keyword ownership remains frozen; no new modifier URLs were added.
- Semantic correction batch implemented: evidence-aligned homepage predicate, explicit uninsured-intent responses on canonical owners, dental-plate synonym coverage on dentures, contextual methodology/insurance links, unified related-page wording, canonical site name “Dental Cost Calculator”, and production BreadcrumbList schema.
- Site owner confirmed the current page set has been reviewed by Juliana Maia Teixeira in her Clinical & Scientific Reviewer role; the homepage uses a concise review signal while hidden page-level reviewedBy schema remains intentionally blocked unless visible page-level credit is implemented.
- Inlay/onlay distinct-information-gain review and proposal-era workbook metadata sync remain open architecture/evidence follow-ups.

## Current milestone
- M1 Baseline: PASS
- M2 Architecture/Evidence: PASS for implemented source-controlled routes
- M3 Content/Tools: PASS for the 39 approved implemented routes and automated-tested calculators
- M4 Design/Media: PASS — representative rendered/accessibility QA and final social image are complete
- M5 Final Candidate: IN PROGRESS — current visual-refresh candidate has a clean Cloudflare preview build; final rendered QA and fresh production-domain validation remain before release
- M6 Production: BLOCKED

## Next logical work
1. Confirm the production build trigger still uses `SITE_ORIGIN=https://dentalcostcalculator.site`.
2. Deploy the current `visual-refresh-2026-09-18` candidate through the production build path and run fresh final-domain canonical/robots/sitemap/schema/security/performance checks.
3. Verify the new shared header/search/mobile-menu/breadcrumb/back-to-top/404 behavior on the production hostname.
4. Freeze the validated candidate SHA and record the rollback target for this release.
5. Run the final hard-blocker audit before merging the validated candidate to `main`.

## Known hard-gate exceptions
- The custom production domain is attached. The production `SITE_ORIGIN` value was previously verified for the prior release, but should be reconfirmed for the current deployment trigger.
- The current visual-refresh candidate has not yet completed fresh production-domain SEO/security/performance checks.
- The current candidate needs a release-specific rollback target recorded before merge.
- Merge of the current candidate to `main` remains blocked until those fresh checks pass.


## Current preview candidate
- Cloudflare preview build: SUCCESS on 2026-09-20
- Worker Version ID: `a70256e7-273d-41fd-9b8c-f252adc67e6f`
- Version preview: `https://a70256e7-dental-calculator.f-abdullah79.workers.dev`
- Branch preview alias: `https://visual-refresh-2026-09-18-dental-calculator.f-abdullah79.workers.dev`
- Build output: 133 entries in `dist/`; Cloudflare read 134 asset files for upload/deployment.
- All build gates passed: Wave A, orthodontics, cosmetic, prosthetics, final procedures, state-cost data, and 15 calculator landing pages.
- Preview SEO mode remained active: all 39 approved routes are `noindex` and preview robots blocks crawling.
- This was a version upload only; production traffic was not switched by this build.
