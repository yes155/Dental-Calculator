# Dental Calculator

Prelaunch repository for the US dental-cost site. The approved architecture contains 38 planned URLs, but this repository currently implements only the reviewed DEN-008 tooth-extraction page and CALC-008 quote-input calculator.

## Current status

- Architecture: frozen and approved.
- DEN-008 article: PASS-1 CLEANED.
- CALC-008 logic: 22/22 tests pass.
- Homepage: deliberately not designed.
- Domain, production deployment and indexation: blocked.
- Clinical reviewer: not claimed.

## Commands

```bash
npm test
npm run build
npm run qa
```

The build uses Node's standard library only and writes the static site to `dist/`.

## Cloudflare Pages preview settings

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22

Do not connect a production domain or remove `noindex,nofollow` until the documented launch gates pass.
