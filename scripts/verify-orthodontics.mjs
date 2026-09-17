import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
const output = resolve(root, 'dist');
const required = ['invisalign-cost-calculator/index.html','braces-cost/index.html','dental-retainer-cost/index.html','assets/orthodontics-calculator-core.mjs','assets/orthodontics-calculator-ui.mjs','assets/orthodontics-calculator.css'];
for (const path of required) await access(resolve(output,path));
const checks = [
  ['invisalign-cost-calculator/index.html',['<h1>Invisalign cost calculator</h1>','$5,108 average','$1,800–$8,100 range','clear aligner treatment','not Invisalign alone','data-orthodontic-calculator']],
  ['braces-cost/index.html',['<h1>Braces cost</h1>','$6,343','$5,834','$9,221','separate treatment categories, not one combined braces price range','data-orthodontic-calculator']],
  ['dental-retainer-cost/index.html',['<h1>Dental retainer cost</h1>','$344','$181','$302','fee for a replacement retainer is determined by the orthodontist']],
];
for (const [path,tokens] of checks) {
  const html = await readFile(resolve(output,path),'utf8');
  if (!html.includes('<meta name="robots" content="noindex,nofollow">')) throw new Error(`${path}: preview must remain noindex,nofollow`);
  if ((html.match(/<h1\b/g)||[]).length !== 1) throw new Error(`${path}: expected exactly one H1`);
  if (/\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/i.test(html)) throw new Error(`${path}: unresolved publication marker`);
  if (html.includes('Reviewed by Juliana Maia Teixeira')) throw new Error(`${path}: reviewer credit requires exact-version approval`);
  for (const token of tokens) if (!html.includes(token)) throw new Error(`${path}: missing required token ${token}`);
}
const retainer = await readFile(resolve(output,'dental-retainer-cost/index.html'),'utf8');
if (retainer.includes('data-orthodontic-calculator')) throw new Error('DEN-027: frozen registry assigns no calculator');
const braces = await readFile(resolve(output,'braces-cost/index.html'),'utf8');
if (braces.includes('$2,500–$17,411')) throw new Error('DEN-020: must not manufacture one all-types braces range');
console.log('Orthodontics cluster build gate passed: DEN-017, DEN-020, DEN-027.');
