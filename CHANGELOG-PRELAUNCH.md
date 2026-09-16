# CHANGELOG — PRELAUNCH

## 2026-09-16

### Repository baseline
- Initialized `yes155/Dental-Calculator` with `main` as production branch and `chatgpt-work` as working branch.
- Established dependency-free Node.js static build (`npm run build` -> `dist`).
- Added GitHub Actions prelaunch QA.
- Added Cloudflare Workers configuration for preview deployment.

### Representative page/tool
- Integrated DEN-008 `/tooth-extraction-cost/` as the first representative procedure-cost page.
- Integrated CALC-008 as an embedded quote-input calculator.
- Preserved the approved boundary: no treatment selection, no inferred tooth count, no guessed/default dental price, no diagnosis, no insurance recalculation.
- Added 13 shared quote-input fixtures and nine extraction-specific tests; 22/22 pass.
- Preview remains `noindex,nofollow`.

### Deployment verification
- GitHub Actions `Prelaunch QA` passed at `e3dea30b3c40cd7645ab6d0634db5034d64128d9`.
- Cloudflare branch preview deployment succeeded for the same candidate.
- Production merge, domain connection and indexation remain blocked.

### Project controls
- Updated `docs/PRELAUNCH-STATUS.md` after CI/preview success.
- Added `PROJECT-STATE.md`.
- Added `PRELAUNCH-AUDIT.md`.
- Added this `CHANGELOG-PRELAUNCH.md`.

### Still open
- Browser rendering at 320/390/768/1280/1920 px.
- Automated accessibility plus manual keyboard/screen-reader QA.
- Repository migration of approved Page Registry, source register, media manifest and calculator specs.
- Trust/legal/methodology routes.
- Final metadata/canonical/robots/sitemap/schema and live internal-link targets.
- Media system, performance baseline and rollback procedure.
