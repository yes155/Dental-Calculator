# Dental Calculator

Prelaunch static site for U.S.-focused dental cost education and quote interpretation.

## Workflow

Work happens on `chatgpt-work`; production stays on `main` until all launch gates pass.

## Commands

- `npm test` — run regression and calculator tests.
- `npm run build` — build `src/` into `dist/` and run cluster build gates.
- `npm run qa` — run all tests plus build verification.

Preview content must remain `noindex,nofollow` until production approval. Calculator results are educational estimates, not dental quotes, treatment recommendations, or coverage guarantees.
