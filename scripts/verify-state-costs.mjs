import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const path = resolve(root, "dist/assets/data/state-dental-costs.json");
const data = JSON.parse(await readFile(path, "utf8"));
const homepage = await readFile(resolve(root, "dist/index.html"), "utf8");

const required = ["implant","crown","filling","simple_extraction","clear_aligners","metal_braces"];
if (data.states.length !== 51) throw new Error(`state-costs: expected 51 jurisdictions; found ${data.states.length}`);
if (new Set(data.states.map((row) => row.abbr)).size !== 51) throw new Error("state-costs: duplicate state/district abbreviation");
if ("root_canal" in data.procedures) throw new Error("state-costs: root canal remains blocked pending source reconciliation");

for (const key of required) {
  const meta = data.procedures[key];
  if (!meta) throw new Error(`state-costs: missing procedure metadata for ${key}`);
  if (!(meta.national_average > 0)) throw new Error(`state-costs: invalid national average for ${key}`);
  if (!meta.source_url?.startsWith("https://")) throw new Error(`state-costs: invalid source URL for ${key}`);
  for (const row of data.states) {
    if (!(row[key] > 0)) throw new Error(`state-costs: missing/invalid ${key} value for ${row.name}`);
  }
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const implantRows = [...data.states].sort((a, b) => a.implant - b.implant || a.name.localeCompare(b.name));
const homepageSnapshotRows = [...implantRows.slice(0, 3), ...implantRows.slice(-3).reverse()];
for (const row of homepageSnapshotRows) {
  const token = `<span>${row.name}</span><strong>${money.format(row.implant)}</strong>`;
  if (!homepage.includes(token)) throw new Error(`state-costs: homepage implant snapshot is missing current ${row.name} value`);
}
if (!homepage.includes(`<strong>${money.format(data.procedures.implant.national_average)}</strong>`)) {
  throw new Error("state-costs: homepage implant snapshot is missing the current national average");
}
console.log(`State-cost data gate passed: ${data.states.length} jurisdictions × ${required.length} procedures.`);
