# PROJECT STATE — Dental Calculator

Updated 2026-09-18.

## Project identity
- Site name: Dental Calculator (working name)
- Primary market: United States
- Primary audience: people researching dental procedure costs and written quote/out-of-pocket estimates
- Risk class: Health/YMYL-adjacent + financial estimation
- Production domain: not connected
- Production release: blocked until hard gates pass

## Repository / deployment
- GitHub repo: `yes155/Dental-Calculator`
- Production branch: `main`
- Working branch: `chatgpt-work`
- Framework: dependency-free Node.js static build
- Source: `src/`
- Build: `npm run build`
- QA: `npm run qa`
- Output: `dist/`
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
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
- Production artifact generation requires a real HTTPS `SITE_ORIGIN`; production build fails if missing or invalid.
- Production artifacts generate self-canonicals, registry-driven `robots.txt`, registry-driven `sitemap.xml`, OG/X text metadata and production index directives.
- Production-only JSON-LD is centralized and deliberately limited to truthful `WebSite`, `WebPage`, `ProfilePage` and `Person` usage.
- Build guards block unsupported `MedicalWebPage`, `FAQPage`, `Organization`, `reviewedBy` and accidental reviewer attribution.
- `og:image` / X image metadata remains open until a final social/brand image is approved.

## Trust / people
- Author shown: Farrukh Abdullah, researcher and writer only.
- Farrukh author photo: local asset `/assets/people/farrukh-abdullah.webp`, created from user-supplied photo and used on homepage, About, and author profile.
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

Latest validated CI: **Prelaunch QA run #460 — SUCCESS** at `0a2822208eee5b785104a60648d368fcc70b5140`.

## Media / design / accessibility
- Representative calculator visual pattern: established through CALC-001 review.
- Farrukh author photo is local and verified live on the Cloudflare preview.
- Final sitewide social-media image contract is not yet approved.
- Source-level accessibility review confirmed skip links, visible focus, labelled native controls, fieldsets/legends, error focus/`aria-invalid`, live results, responsive fallbacks, 16px mobile controls and reduced-motion handling.
- Manual live-browser QA passed for the representative cleaning calculator at 320px, 390px and 768px with no reported overflow/clipping/control breakage.
- Manual keyboard QA passed on the representative cleaning calculator, including intentional validation-error handling and completion through the result state with visible/logical focus.
- Live people-media requests were verified without the prior cross-project image failure.

## Current milestone
- M1 Baseline: PASS
- M2 Architecture/Evidence: PASS for implemented source-controlled routes
- M3 Content/Tools: PASS for the 39 approved implemented routes and automated-tested calculators
- M4 Design/Media: PASS for representative rendered/accessibility QA; final social image remains open
- M5 Final Candidate: IN PROGRESS — blocked on real production hostname/social image/final-domain checks/rollback record
- M6 Production: BLOCKED

## Next logical work
1. Approve/create the final social/brand image and add `og:image` / X image metadata.
2. Finalize/connect the real production domain and set production `SITE_ORIGIN`.
3. Run final-domain canonical/robots/sitemap/schema/security/performance checks.
4. Freeze a final candidate SHA and document/test rollback procedure.
5. Run the final hard-blocker audit before any merge to `main`.

## Known hard-gate exceptions
- Final social/brand image and `og:image` incomplete.
- Real production domain/`SITE_ORIGIN` not connected.
- Final-domain SEO/security/performance checks incomplete.
- Rollback documentation incomplete.
- Production merge/domain/indexation blocked.
