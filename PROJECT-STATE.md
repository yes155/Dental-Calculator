# PROJECT STATE — Dental Calculator

Updated 2026-09-17.

## Project identity
- Site name: Dental Calculator (working name)
- Primary market: United States
- Primary audience: people researching dental procedure costs, written quotes and out-of-pocket estimates
- Risk class: Health/YMYL-adjacent + financial estimation
- Production domain: not connected / final `SITE_ORIGIN` not set
- Production release: BLOCKED until remaining hard gates pass

## Repository / deployment
- GitHub repo: `yes155/Dental-Calculator`
- Production branch: `main` — untouched during prelaunch work
- Working branch: `chatgpt-work`
- Framework: dependency-free Node.js static build
- Source: `src/`
- Build: `npm run build`
- QA: `npm run qa`
- Output: `dist/`
- Cloudflare project: `dental-calculator`
- Known branch-preview hostname: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Preview policy: HTML stays `noindex,nofollow`; preview `robots.txt` blocks crawling; `workers.dev` responses are configured for HTTP-level `X-Robots-Tag: noindex, nofollow`
- Latest validated implementation head before this documentation sync: `1bac5c306e44274579791c83ea1b825d01db1e50`
- Latest validated CI: Prelaunch QA run #437 — SUCCESS

## Architecture / route inventory
- Frozen/user-approved architecture: 2026-09-15
- Canonical registry: `data/page-registry.csv`
- Approved build routes: **39**
- Deferred non-build candidates: **5**
- All 39 approved registry routes now have source `index.html` implementations.
- Automated QA verifies that every approved registry route has a source page and that root-relative internal page links resolve to implemented approved routes/assets.
- Deferred routes are excluded from the production sitemap.
- No new keyword-variant/tool URL may be introduced without architecture review.

## Evidence authority
Primary repo evidence controls include:
- Canonical source register: `data/source-register.csv`
- Implants: `evidence/implants/IMPLANTS_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Preventive/diagnostic: `evidence/preventive/PREVENTIVE_CLUSTER_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Restorations/root canals: `evidence/restorations/RESTORATIONS_ROOT_CANAL_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Inlays: `evidence/restorations/DEN-004_INLAY_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Onlays: `evidence/restorations/DEN-013_ONLAY_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Dentist visit: `evidence/exams/DEN-025_DENTIST_VISIT_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Wisdom teeth: `evidence/extractions/DEN-018_WISDOM_TEETH_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Orthodontics: `evidence/orthodontics/ORTHODONTICS_WAVE_B_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Cosmetic: `evidence/cosmetic/COSMETIC_WAVE_B_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Replacement/prosthetics: `evidence/replacement/REPLACEMENT_WAVE_B_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Affordable care: `evidence/access/GUI-002_AFFORDABLE_DENTAL_CARE_DIRECT_VERIFIED_EVIDENCE_v1.md`
- Calculator UX: `evidence/ux/CALCULATOR_UX_RESEARCH_v1.md`
- People/reviewer policy: `evidence/trust/PEOPLE_AND_REVIEW_POLICY_v1.md`

External-model outputs are never evidence authority by themselves. Rejected/cleaned returns remain lineage records only.

## Content / trust status
- All approved procedure, guide, homepage and trust/methodology routes are implemented in source.
- Trust surfaces implemented: About, Editorial Policy, Author, Contact, Privacy, Terms, Corrections & Updates, Cost Data Methodology, Calculator Methodology, Disclosures, Medical Disclaimer, and reviewer profile.
- Author role: Farrukh Abdullah — Researcher & Writer; no dental qualification claimed.
- Reviewer profile: Juliana Maia Teixeira — Clinical & Scientific Reviewer. Site-level reviewer status does **not** create page-level review credit.
- Automated QA blocks page-specific reviewer claims on non-trust pages without documented exact-version approval.
- Publication-marker checks block unresolved `[SOURCE NEEDED BEFORE PUBLICATION]`, `[EDITOR NOTE...]`, `[TODO...]`, `[PLACEHOLDER...]`, `planned but not live`, and `— planned` reader copy.

## Calculator status
All calculator routes assigned by the frozen registry are implemented in source, with shared or page-specific calculator cores/UIs as appropriate.

Core safeguards across calculator implementations:
- integer-cent arithmetic where monetary arithmetic is required
- blank ≠ explicit zero
- technical maximums are validation ceilings, not price assumptions
- no treatment selection, diagnosis or symptom-to-price logic
- no market price generated from symptoms or location
- no hidden price multipliers from descriptive clinical labels
- no universal insurance percentage/deductible/annual-maximum assumptions
- insurer amounts are used only when entered by the user for matching quote scope
- unknown/not-listed scope is not silently converted to zero
- published market references do not prefill calculator arithmetic
- results are educational quote summaries/estimates, not dentist quotes or coverage guarantees
- calculator values are not intentionally sent externally, stored, or serialized into the URL by calculator logic

Automated calculator/page regression coverage is green under the current QA suite.

## Automated QA / build status
Current pipeline:
1. `npm test`
2. static build
3. cluster build verifiers
4. deployment SEO preparation
5. CI-only production-artifact fixture using a reserved `.example` origin

Current baseline:
- **212/212 automated tests pass** on the validated implementation line.
- Standard preview build passes.
- Production-artifact fixture passes.
- Build/verifier false positives from ordinary HTML `placeholder` attributes were corrected with bracket-aware publication-marker checks.

## Deployment SEO status
Central deployment logic: `scripts/prepare-deploy-seo.mjs`.

### Preview mode
- source/preview pages remain `noindex,nofollow`
- preview `robots.txt` disallows crawling
- preview sitemap is not published
- canonical, OG/X and JSON-LD production metadata are not emitted
- `workers.dev` static responses are configured with `X-Robots-Tag: noindex, nofollow`

### Production mode
Production builds require a valid HTTPS `SITE_ORIGIN`. The build fails rather than silently inventing a hostname.

For all 39 approved routes, production build logic:
- removes preview UI/noindex
- normalizes old preview branding to `Dental Calculator`
- adds exactly one self-canonical
- adds OG title/description/url/site metadata
- adds X/Twitter summary title/description metadata
- generates `robots.txt`
- generates `sitemap.xml` strictly from approved registry URLs
- excludes deferred routes

`og:image` / X image metadata is intentionally open until a final approved social image exists.

## Schema status
Production-only JSON-LD is centrally generated and validated:
- homepage: `WebSite` + `WebPage`
- ordinary approved routes: `WebPage`
- author profile: `ProfilePage` + truthful `Person`
- reviewer profile: `ProfilePage` + truthful `Person`

Build safeguards explicitly prevent unsupported/overclaimed `MedicalWebPage`, `FAQPage`, `Organization`, `reviewedBy`, and accidental Juliana reviewer attribution on ordinary pages.

Schema CI gate: PASS on run #436.

## Security / privacy / performance status
`src/_headers` now provides low-risk Cloudflare static-asset controls:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restrictive `Permissions-Policy` for unused camera/geolocation/microphone/payment/USB features
- `X-Robots-Tag: noindex, nofollow` on `workers.dev` hostnames

Security-header CI gate: PASS on run #437.

Not yet enabled:
- CSP: deferred until browser/edge verification because current pages include external/profile resources and production JSON-LD is generated at build time.
- HSTS: deferred until the real production hostname/Cloudflare zone is connected and verified.
- aggressive immutable caching: not used because current static asset names are not content-fingerprinted.

Source-tree payload review found no large current asset problem: shared CSS and calculator modules are small, current HTML is lightweight, and no large media bundle is present. No performance rewrite is justified before rendered/edge measurement.

## Accessibility / design status
Source-level accessibility controls are present:
- visible skip link
- global `:focus-visible`
- labelled form controls, fieldsets/legends and native controls
- focused error summaries and `aria-invalid`
- guided step focus management / `aria-current`
- polite live-result regions
- mobile single-column fallbacks and 16px mobile inputs
- reduced-motion handling

**Still OPEN:** rendered/manual keyboard and viewport verification. Source inspection does not replace browser testing.

Required representative viewport checks remain: 320 / 390 / 768 / 1280 / 1920 plus keyboard interaction on calculator controls.

## Media status
- Final site-wide media/hero/social-image contract is not yet fully closed.
- Final social image is not approved; therefore `og:image` / X image metadata remains intentionally absent.
- Media remains a preproduction gate where applicable.

## Current milestone
- M1 Baseline: COMPLETE for source/build inventory; rendered edge baseline remains open
- M2 Architecture/Evidence: COMPLETE for the 39 approved route set used by the current candidate branch
- M3 Content/Tools: COMPLETE for approved route implementation and automated calculator/page controls
- M4 Design/Media/Accessibility: IN PROGRESS — source-level controls are strong; rendered/manual/media gates remain
- M5 Final Candidate: NOT STARTED — blocked on edge/rendered/media/domain/rollback closeout
- M6 Production: BLOCKED

## Remaining hard-gate work
1. Verify the actual Cloudflare `chatgpt-work` preview at the edge, including HTTP headers, `robots.txt`, sitemap absence, representative pages and calculators.
2. Run representative rendered/mobile/tablet/desktop/wide + keyboard QA.
3. Close final media/social-image decisions and add OG/X image metadata only after an asset is approved.
4. Connect/finalize the production hostname; set real `SITE_ORIGIN`; verify production canonical/robots/sitemap/schema behavior against that hostname.
5. Decide/test final-domain HSTS and any CSP policy after browser/edge validation.
6. Complete rollback procedure and tie the release candidate to an exact Git SHA.
7. Run final hard-blocker audit.
8. Only after all required gates pass: approve merge to `main`, deploy production, then perform live verification.

## Release status
**NO-GO for production.** Source, content, calculator, build, deployment-SEO, schema and low-risk security-header automation are green. Production remains blocked by real edge/rendered verification, final media/social image, production hostname/indexation verification, and rollback/final-candidate gates.
