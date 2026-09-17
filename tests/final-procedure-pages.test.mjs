import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read=(route)=>readFile(new URL(`../src/${route}/index.html`,import.meta.url),'utf8');

for(const [route,h1] of [['wisdom-teeth-removal-cost','Wisdom teeth removal cost'],['periodontal-maintenance-cost','Periodontal maintenance cost']]) test(`${route} keeps preview publication safeguards`,async()=>{const html=await read(route);assert.match(html,/<meta name="robots" content="noindex,nofollow">/);assert.ok(html.includes(`<h1>${h1}</h1>`));assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.doesNotMatch(html,/\[SOURCE NEEDED BEFORE PUBLICATION\]|TODO|PLACEHOLDER|EDITOR NOTE/);assert.doesNotMatch(html,/Reviewed by Juliana Maia Teixeira/);});

test('DEN-018 preserves wisdom-tooth units and reuses quote-driven extraction calculator',async()=>{const html=await read('wisdom-teeth-removal-cost');for(const t of ['$363 average','$835 average','$2,685','$3,340','/assets/calc008-ui.mjs'])assert.ok(html.includes(t));assert.doesNotMatch(html,/value="(363|835|2685|3340)"/);assert.doesNotMatch(html,/wisdom teeth (cost|range).*\$363.*\$3,340/i);assert.match(html,/does not supply prices/);});

test('DEN-032 has no calculator, keeps whole-mouth visit unit and no assumed annual schedule',async()=>{const html=await read('periodontal-maintenance-cost');assert.match(html,/\$140–\$220 without dental benefits/);assert.match(html,/whole-mouth cleaning/);assert.doesNotMatch(html,/calculator-card|calc008-ui|data-.*calculator/);assert.match(html,/does not prescribe or assume a periodontal-maintenance interval/);assert.doesNotMatch(html,/every (3|4|6) months|four times a year|twice a year/i);});
