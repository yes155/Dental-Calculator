# Prelaunch status

Updated 2026-09-17.

This branch is in **prelaunch closeout**. It is not approved for production or indexation.

## Current branch

- Working branch: `chatgpt-work`
- Production branch: `main` — untouched
- PR: #1
- Cloudflare project: `dental-calculator`
- Known branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Latest validated implementation head before documentation sync: `1bac5c306e44274579791c83ea1b825d01db1e50`
- Latest validated implementation CI: Prelaunch QA run #437 — SUCCESS

## Passed in source / CI

- Frozen registry: 39 approved build routes + 5 deferred non-build candidates.
- All 39 approved routes implemented in `src/`.
- Trust and methodology route set implemented.
- 212/212 automated tests pass on the validated implementation line.
- Calculator arithmetic/scope/YMYL regression controls pass.
- Sitewide approved-route and internal-link checks pass.
- Reader-facing publication-marker audit is clean.
- Preview build passes.
- CI production-artifact fixture passes using a reserved `.example` origin.
- Production build requires an explicit HTTPS `SITE_ORIGIN`; it will not invent a hostname.
- Production deployment layer generates self-canonicals, robots, registry-driven sitemap, OG/X text metadata and truthful JSON-LD.
- Deferred URLs are excluded from the sitemap.
- Schema is limited to supported `WebSite`, `WebPage`, `ProfilePage` and `Person` facts; unsupported reviewer/medical/FAQ/organization claims are blocked.
- Low-risk Cloudflare static security headers are configured in `src/_headers`.
- `workers.dev` hostnames are configured with `X-Robots-Tag: noindex, nofollow` in addition to preview HTML/robots safeguards.
- Current source payload is lightweight; no large static asset/media bundle currently justifies a performance rewrite.
- Source-level accessibility controls include skip link, visible focus, native labelled controls, error focus, live results, responsive layouts and reduced-motion handling.

## Open hard gates

- Verify the actual Cloudflare branch preview at the edge: representative URLs, HTTP security/indexation headers, preview `robots.txt`, sitemap absence and calculator behavior.
- Rendered differential checks at 320 / 390 / 768 / 1280 / 1920 px.
- Manual keyboard and representative screen-reader checks.
- Final media/social-image approval; `og:image` / X image metadata intentionally remains absent until an asset is approved.
- Connect/finalize the real production hostname and set `SITE_ORIGIN`.
- Verify final-domain canonical, robots, sitemap, JSON-LD, social metadata and indexability.
- Verify representative browser network/privacy behavior and edge performance.
- Decide/test HSTS and any CSP policy on the actual production candidate; these are intentionally not forced before browser/domain verification.
- Freeze a final candidate SHA and document/test rollback.
- Run the final hard-blocker audit.

## Release decision

**NO-GO for production.**

The remaining blockers are concentrated in rendered/edge/media/domain/release verification rather than unfinished route implementation or calculator logic. Production merge, production domain/indexation and live launch remain blocked until those gates pass.
