# Prelaunch status

Updated 2026-09-16.

This branch is a preview candidate only. It integrates one reviewed page and one calculator to establish the build, test and deployment path without expanding content scope.

## Passed

- DEN-008 content correction: PASS-1 CLEANED.
- CALC-008 arithmetic: 13 shared plus nine page-specific tests pass (22/22 total).
- Dependency-free static build (`npm run build` -> `dist`).
- GitHub Actions `Prelaunch QA` passes at commit `e3dea30b3c40cd7645ab6d0634db5034d64128d9`.
- Cloudflare Workers branch preview deployment succeeded for the same commit.
- Preview remains `noindex,nofollow`.
- Prototype contains no persistence, analytics, external requests or URL serialization.

## Current preview

- Branch: `chatgpt-work`
- PR: #1 (draft)
- Cloudflare project: `dental-calculator`
- Branch preview: `https://chatgpt-work-dental-calculator.f-abdullah79.workers.dev`
- Commit preview: `https://5e40f9c0-dental-calculator.f-abdullah79.workers.dev`
- Candidate SHA: `e3dea30b3c40cd7645ab6d0634db5034d64128d9`

## Open hard gates

- Real browser rendering at 320, 390, 768, 1280 and 1920 px.
- Automated accessibility and manual keyboard/screen-reader QA.
- Future third-party privacy/data-capture verification if such services are added.
- Live internal-route targets, final metadata, canonical, sitemap, robots and schema.
- Publisher identity, brand/domain, contact, privacy/terms and actual review surfaces.
- Remaining content inventory, calculators and media.
- Rollback documentation and final editorial release.

Production merge, production domain connection and indexation remain blocked.
