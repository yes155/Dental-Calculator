# Deployment SEO contract

Updated: 2026-09-17

This project keeps source HTML preview-safe and applies production-only SEO metadata during the build. `data/page-registry.csv` remains the authority for indexable route ownership.

## Preview behavior

- Source pages remain `noindex,nofollow`.
- `scripts/prepare-deploy-seo.mjs` runs after the existing build and cluster verification gates.
- Non-production Workers branches remain in preview mode.
- Preview output writes `robots.txt` with `Disallow: /`.
- Preview output does not publish a sitemap.
- Preview output does not add production canonicals or production `og:url` values.
- The visible prelaunch banner remains on preview pages.

## Production behavior

For a production build, `scripts/prepare-deploy-seo.mjs`:

1. Reads approved URLs from `data/page-registry.csv`.
2. Requires exactly 39 approved routes under the current frozen registry.
3. Requires a valid HTTPS `SITE_ORIGIN` with no path, query string or fragment.
4. Converts the preview robots directive to `index,follow,max-image-preview:large`.
5. Removes the visible prelaunch banner from generated production HTML.
6. Adds exactly one absolute self-canonical per approved route.
7. Adds Open Graph type, locale, site name, title, description and URL metadata.
8. Adds X/Twitter summary-card title and description metadata.
9. Generates `robots.txt` with the production sitemap location.
10. Generates `sitemap.xml` from approved registry routes only; deferred routes are excluded.

The build fails instead of silently producing a production artifact when required production configuration is missing or inconsistent.

## Cloudflare Workers Builds contract

Cloudflare Workers Builds provides `WORKERS_CI_BRANCH`. The deployment script treats `main` as the production branch by default and all other Workers branches as previews. `PRODUCTION_BRANCH` can override the production branch name if the repository policy changes later.

Before the first production deployment, set `SITE_ORIGIN` on the production build trigger to the final HTTPS site origin. Do not set a production origin on preview triggers.

The current production domain is not connected, so `SITE_ORIGIN` must remain unset in the live production trigger until the final hostname is approved and attached.

## CI production-artifact fixture

GitHub Actions performs the normal preview QA and then runs a second build in production mode using the reserved test origin `https://dental-calculator.example`. This validates production canonical, robots, sitemap and OG/X generation without publishing that origin anywhere.

## Remaining launch checks

This deployment layer does not itself close the remaining launch gates. Before production approval, still verify:

- final production hostname and Cloudflare custom-domain attachment;
- production `SITE_ORIGIN` value;
- live canonical and redirect behavior;
- live `robots.txt` and `sitemap.xml`;
- social preview image/`og:image` and X image metadata after media approval;
- schema truth/parity;
- rendered accessibility, keyboard, mobile and wide-screen checks;
- performance, security/privacy and rollback documentation;
- final Cloudflare preview audit tied to the candidate Git SHA.
