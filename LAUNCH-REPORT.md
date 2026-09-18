# LAUNCH REPORT — Dental Calculator

Updated 2026-09-18.

## Release identity
- Production domain: `dentalcostcalculator.site`
- Production origin: `https://dentalcostcalculator.site`
- Production branch: `main`
- Working branch: `chatgpt-work`
- Latest validated implementation SHA before documentation sync: `4a96515e34ea3a2d9a217f342c0dbe043ed25101`
- Latest validated CI: Prelaunch QA run #464 — SUCCESS
- Final candidate SHA: PENDING documentation-sync CI and production-domain verification

## Scope
- 39 approved Page Registry routes
- 5 deferred non-build candidates excluded
- Quote-based dental-cost calculators only; no diagnosis, treatment selection, eligibility decision, guaranteed insurance coverage, or dentist quote representation
- U.S.-focused cost education

## Closed prelaunch gates
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
- Production canonical/robots/sitemap/schema generation in CI
- Final 1200×630 social card + production OG/X image metadata

## Open before production approval
1. Attach `dentalcostcalculator.site` to the Cloudflare production project.
2. Set production build variable `SITE_ORIGIN=https://dentalcostcalculator.site`.
3. Verify live production-domain canonical, robots, sitemap, schema, OG/X image URL, HTTPS/security headers, representative performance and calculator behavior.
4. Freeze final candidate SHA.
5. Verify rollback procedure against the candidate.
6. Run final hard-blocker audit.
7. Merge to `main` only after approval.

## Rollback plan
- Rollback target: current production branch `main` at `3e9db6a6458659c4db41b80b16a97558957b953b`.
- Do not delete or rewrite this rollback target before launch approval.
- If the candidate fails final-domain verification before merge, keep `main` unchanged and correct `chatgpt-work`.
- If a post-merge production regression occurs, redeploy/revert to `3e9db6a6458659c4db41b80b16a97558957b953b` through GitHub/Cloudflare, then verify homepage, representative calculator, robots/indexability, canonical, sitemap, headers and media.
- Rollback verification status: NOT YET TESTED against the production-domain candidate.

## Current release decision
**NO-GO until the production-domain and rollback-verification checks above pass.**
