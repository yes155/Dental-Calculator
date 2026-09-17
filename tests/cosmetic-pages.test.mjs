import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read=(route)=>readFile(new URL(`../src/${route}/index.html`,import.meta.url),'utf8');

for(const [route,h1] of [['dental-veneers-cost','Dental veneers cost'],['dental-bonding-cost','Dental bonding cost'],['teeth-whitening-cost-at-dentist','Teeth whitening cost at dentist']]) test(`${route} keeps preview and review safeguards`,async()=>{const html=await read(route);assert.match(html,/<meta name="robots" content="noindex,nofollow">/);assert.ok(html.includes(`<h1>${h1}</h1>`));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.doesNotMatch(html,/\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/);assert.doesNotMatch(html,/Reviewed by Juliana Maia Teixeira/);});

test('DEN-019 keeps veneer categories separate and quote-driven',async()=>{const html=await read('dental-veneers-cost');for(const t of ['$751','$1,068','$1,455','$1,781','$13,954','data-veneer-calculator'])assert.ok(html.includes(t));assert.doesNotMatch(html,/value="(751|1068|1455|1781|13954)"/);assert.doesNotMatch(html,/\$541–\$24,046/);});

test('DEN-023 preserves per-tooth bonding unit and has no calculator',async()=>{const html=await read('dental-bonding-cost');assert.match(html,/\$431 average/);assert.match(html,/\$288–\$915 range/);assert.match(html,/per tooth/);assert.doesNotMatch(html,/data-veneer-calculator|veneer-calculator-ui/);});

test('DEN-029 keeps professional whitening methods separate and has no calculator',async()=>{const html=await read('teeth-whitening-cost-at-dentist');for(const t of ['$792','$611–$1,368','$583','$463–$1,011'])assert.ok(html.includes(t));assert.doesNotMatch(html,/\$463–\$1,368 range for (professional )?whitening/i);assert.doesNotMatch(html,/data-veneer-calculator|veneer-calculator-ui/);});
