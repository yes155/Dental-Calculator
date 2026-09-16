import { access, cp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const source = resolve(root, "src");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const required = [
  "tooth-extraction-cost/index.html",
  "assets/site.css",
  "assets/calc008-core.mjs",
  "assets/calc008-ui.mjs",
];

for (const path of required) await access(resolve(output, path));

const html = await readFile(resolve(output, "tooth-extraction-cost/index.html"), "utf8");
const requiredTokens = [
  '<meta name="robots" content="noindex,nofollow">',
  '<h1>Tooth extraction cost by quote type</h1>',
  '[CALCULATOR: CALC-008',
  'id="calculator"',
  'aria-live="polite"',
];

for (const token of requiredTokens) {
  if (!html.includes(token)) throw new Error(`Required page token missing: ${token}`);
}

const files = await readdir(output, { recursive: true });
console.log(`Build complete: ${files.filter((file) => !file.endsWith("/")).length} output entries in dist/`);

