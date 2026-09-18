# LAUNCH REPORT — Dental Calculator

Updated 2026-09-18.

## Release identity
- Production domain: `dentalcostcalculator.site`
- Production origin: `https://dentalcostcalculator.site`
- Canonical host: non-www
- Production branch: `main`
- Working branch: `chatgpt-work`
- Frozen release branch: `release-candidate-2026-09-18`
- Rollback branch: `rollback-prelaunch-2026-09-18`
- Production / frozen candidate SHA: `79cf733043556ed69cb7d6f22de92ee30d12c0b9`
- Prelaunch QA: run #465 — SUCCESS
- Rollback SHA: `3e9db6a6458659c4db41b80b16a97558957b953b`

## Scope
- 39 approved Page Registry routes
- 5 deferred non-build candidates excluded
- Quote-based dental-cost calculators only; no diagnosis, treatment selection, eligibility decision, guaranteed insurance coverage, or dentist quote representation
- U.S.-focused cost education

## Production verification completed
- Cloudflare production Worker attached to `dentalcostcalculator.site`
- Production build variable set to `SITE_ORIGIN=https://dentalcostcalculator.site`
- Apex DNS resolves through Cloudflare
- HTTPS responds successfully on the production hostname
- Homepage returns HTTP 200 and renders the production site
- Representative calculator page renders and calculator validation/result flow works on the production hostname
- Production response includes restrictive Permissions-Policy, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`
- Production response does not include an `X-Robots-Tag: noindex` header
- `robots.txt` allows crawling and points to `https://dentalcostcalculator.site/sitemap.xml`
- Production sitemap contains the 39 approved canonical URLs on `https://dentalcostcalculator.site`
- Representative page source verified self-canonical, index/follow robots directive, production `og:url`, production social image metadata, X/Twitter large-image metadata, and production-domain JSON-LD
- Final 1200×630 local social card is included in the production build
- `www.dentalcostcalculator.site` permanently redirects to the non-www canonical host with HTTP 301 while preserving path and query string

## Closed launch gates
- Architecture / URL ownership
- Evidence and pricing scope controls
- Insurance/YMYL boundaries
- 39 approved route implementations
- Calculator automated regression suite
- Trust/methodology pages
- Internal-link/source cleanliness
- Preview noindex + crawl blocking
- Cloudflare preview edge headers
- Representative responsive + keyboard QA
- Local author/reviewer media
- Production canonical/robots/sitemap/schema generation
- Final social card + production OG/X image metadata
- Production DNS / HTTPS / Worker routing
- Production indexability and security-header verification
- Canonical `www` → non-www redirect
- Representative live calculator behavior

## Rollback plan
- Preserved rollback branch: `rollback-prelaunch-2026-09-18`
- Rollback target SHA: `3e9db6a6458659c4db41b80b16a97558957b953b`
- The rollback ref and procedure are preserved and can be used without rewriting release history.
- If a production regression occurs, move/redeploy production to the rollback target through GitHub/Cloudflare, then verify homepage, representative calculator, robots/indexability, canonical, sitemap, headers and media.
- A destructive live rollback was intentionally not performed after successful launch; rollback readiness was verified non-destructively by preserving the branch, SHA and documented recovery procedure.

## Deferred / post-launch hardening
- HSTS remains deferred until the production hostname has remained stable long enough to avoid locking in a bad configuration.
- CSP remains deferred pending a regression-safe policy rollout.
- These are hardening items, not known launch blockers in the verified production state.

## Current release decision
**LIVE / GO.** The frozen candidate at `79cf733043556ed69cb7d6f22de92ee30d12c0b9` is deployed on the production domain and the production checks above passed. No known hard launch blocker remains from the completed audit.
