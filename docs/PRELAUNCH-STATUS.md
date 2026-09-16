# Prelaunch status

Updated 2026-09-16.

This branch is a preview candidate only. It integrates one reviewed page and one calculator to establish the build, test and rendering path without expanding content scope.

## Passed

- DEN-008 content correction: PASS-1 CLEANED.
- CALC-008 arithmetic: 13 shared plus nine page-specific tests pass.
- Dependency-free static build.
- Prototype contains no persistence, analytics, external requests or URL serialization.

## Open hard gates

- GitHub Actions run on the pushed branch.
- Real browser rendering at 320, 390, 768, 1280 and 1920 px.
- Automated accessibility and manual keyboard/screen-reader QA.
- Future third-party privacy/data-capture verification.
- Live internal-route targets, metadata, canonical, sitemap, robots and schema.
- Publisher identity, brand/domain, contact, privacy/terms and actual review surfaces.
- Remaining content inventory, calculators and media.
- Preview, rollback and final editorial release.

Production and indexation remain blocked.

