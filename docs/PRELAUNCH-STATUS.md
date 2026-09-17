# Prelaunch status

Updated 2026-09-17.

This branch is a prelaunch preview candidate only. It now implements the frozen approved route set for source/build validation while keeping production release blocked until remaining edge, rendered, media, domain and rollback gates pass.

## Current preview

- Branch: `chatgpt-work`
- PR: #1 (draft)
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Current tracked head before final CI: `d45dcca1f1a0f3f72571314bbeda11f3e92e35e3`
- Production branch: `main`
- Production status: blocked / not approved
- Production domain: not connected

## Passed in source/build QA before the latest author-photo commit

- Frozen Page Registry is represented by 39 approved source routes; 5 deferred routes stay out of build output.
- Quote-based calculator logic is regression-tested and does not diagnose, select treatment, infer coverage or create provider fees.
- Preview pages keep `noindex,nofollow`.
- Deployment SEO script keeps previews crawl-blocked and requires a real HTTPS `SITE_ORIGIN` for production canonicals, production robots and sitemap.
- Production-artifact fixture validates canonical, sitemap, OG/X text metadata and JSON-LD generation without inventing the real production hostname.
- Schema is deliberately limited to supported `WebSite`, `WebPage`, `ProfilePage` and `Person` entities.
- Cloudflare static `_headers` include low-risk security/privacy headers and `X-Robots-Tag: noindex, nofollow` for `workers.dev` previews.
- Regression checks block cross-project domains from approved dental pages.

## Latest media/trust update

- User supplied Farrukh Abdullah's author photo.
- Added local asset: `/assets/people/farrukh-abdullah.webp`.
- Wired the local photo into the homepage, About page and Farrukh author profile.
- Kept the old cross-project-domain guard so Skinkpedia/MyAxolotl/BettaFish references cannot return.
- No fake credential, fake review or fake clinical role was added.

## Open hard gates

- Confirm latest GitHub Actions run for the author-photo head.
- Confirm latest Cloudflare branch preview deploys the new local image without failed `farrukh-abdullah` requests.
- Verify preview response headers in the browser: `X-Robots-Tag`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Rendered viewport QA at 320, 390, 768, 1280 and 1920 px.
- Manual keyboard/screen-reader QA for representative calculators.
- Final social/brand image and `og:image` / X image metadata.
- Real production domain and production `SITE_ORIGIN`.
- Final-domain SEO/security/performance verification.
- Rollback documentation and final hard-blocker audit.

Production merge, production domain connection and indexation remain blocked.
