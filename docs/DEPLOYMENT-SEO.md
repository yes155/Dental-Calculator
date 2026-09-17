# Deployment SEO contract

Updated: 2026-09-18

This project keeps source HTML preview-safe and applies production-only SEO metadata during the build. `data/page-registry.csv` remains the authority for indexable route ownership.

## Final production origin

The approved production hostname is:

`https://dentalcostcalculator.site`

This origin is finalized for canonical URLs, sitemap URLs, production robots references, OG URLs and production JSON-LD. Finalization of the hostname does **not** by itself mean the custom domain is attached to Cloudflare or approved for launch.

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

Cloudflare Workers Builds provides `WORKERS_CI_BRANCH`. The deployment script treats `main` as the production branch by default and all other Workers branches as previews. `PRODUCTION_BRANCH` can override the production branch name if repository policy changes later.

For the production build trigger, set:

`SITE_ORIGIN=https://dentalcostcalculator.site`

Do not set a production origin on preview triggers. The `chatgpt-work` preview must remain preview-mode/noindex until the production candidate is approved.

The hostname is finalized but still requires Cloudflare custom-domain attachment, DNS/HTTPS verification and final-domain QA before production approval.

## CI production-artifact fixture

GitHub Actions performs the normal preview QA and then runs a second build in production mode using the approved origin `https://dentalcostcalculator.site`. This validates the exact canonical, robots, sitemap, OG/X URL and schema origin that production will use. The CI build does not publish the site or connect the domain.

## Remaining launch checks

Before production approval, still verify:

- Cloudflare custom-domain attachment for `dentalcostcalculator.site`;
- production `SITE_ORIGIN=https://dentalcostcalculator.site` on the production build trigger;
- HTTPS and preferred-host redirect behavior;
- live canonicals on representative routes;
- live `robots.txt` and `sitemap.xml`;
- social preview image/`og:image` and X image metadata after media approval;
- schema truth/parity on the final domain;
- representative final-domain accessibility, mobile and calculator checks;
- final-domain performance/security/privacy checks;
- final candidate SHA and rollback documentation;
- final hard-blocker audit before any merge to `main`.
