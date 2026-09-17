import { access, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const output = resolve(root, "dist");
const registryPath = resolve(root, "data", "page-registry.csv");
const productionBranch = (process.env.PRODUCTION_BRANCH || "main").trim();
const workersBranch = (process.env.WORKERS_CI_BRANCH || "").trim();
const workersCi = process.env.WORKERS_CI === "1";
const explicitMode = (process.env.SITE_MODE || "").trim().toLowerCase();

if (explicitMode && !["preview", "production"].includes(explicitMode)) {
  throw new Error(`SITE_MODE must be "preview" or "production"; received "${explicitMode}"`);
}

let mode = explicitMode || "preview";
if (workersCi && workersBranch) {
  const expectedMode = workersBranch === productionBranch ? "production" : "preview";
  if (explicitMode && explicitMode !== expectedMode) {
    throw new Error(`Workers build safety check: branch "${workersBranch}" requires SITE_MODE=${expectedMode}`);
  }
  mode = expectedMode;
}

if (mode !== "production") {
  console.log("Social image metadata skipped in preview mode.");
  process.exit(0);
}

function normalizeOrigin(raw) {
  if (!raw) throw new Error("Production social metadata requires SITE_ORIGIN");
  const url = new URL(raw);
  if (url.protocol !== "https:" || (url.pathname !== "/" && url.pathname !== "") || url.search || url.hash) {
    throw new Error("SITE_ORIGIN must be an HTTPS origin with no path, query or fragment");
  }
  return url.origin;
}

function parseRegistry(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines.shift()?.split(",") || [];
  const urlIndex = header.indexOf("url");
  const statusIndex = header.indexOf("status");
  if (urlIndex === -1 || statusIndex === -1) throw new Error("page-registry.csv is missing url/status columns");
  return lines
    .map((line) => line.split(","))
    .filter((columns) => (columns[statusIndex] || "").startsWith("APPROVED"))
    .map((columns) => columns[urlIndex]);
}

function outputPathForRoute(route) {
  if (route === "/") return resolve(output, "index.html");
  return resolve(output, route.slice(1), "index.html");
}

const origin = normalizeOrigin((process.env.SITE_ORIGIN || "").trim());
const socialPath = "/assets/social/dentalcostcalculator-og.png";
const socialFile = resolve(output, socialPath.slice(1));
await access(socialFile);
const image = await readFile(socialFile);
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (image.length < 24 || !image.subarray(0, 8).equals(pngSignature)) throw new Error("Social image must be a valid PNG");
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width !== 1200 || height !== 630) throw new Error(`Social image must be 1200x630; found ${width}x${height}`);

const imageUrl = `${origin}${socialPath}`;
const imageAlt = "DentalCostCalculator.site — Understand Dental Costs";
const registry = await readFile(registryPath, "utf8");
const approvedRoutes = parseRegistry(registry);
if (approvedRoutes.length !== 39) throw new Error(`Expected 39 approved routes; found ${approvedRoutes.length}`);

for (const route of approvedRoutes) {
  const path = outputPathForRoute(route);
  let html = await readFile(path, "utf8");
  if (/property=["']og:image["']/i.test(html) || /name=["']twitter:image["']/i.test(html)) {
    throw new Error(`${route}: social image metadata must be centrally added exactly once`);
  }
  const cardTag = '<meta name="twitter:card" content="summary">';
  if (!html.includes(cardTag)) throw new Error(`${route}: expected production Twitter/X card tag is missing`);

  const tags = [
    `  <meta property="og:image" content="${imageUrl}">`,
    `  <meta property="og:image:secure_url" content="${imageUrl}">`,
    `  <meta property="og:image:type" content="image/png">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <meta property="og:image:alt" content="${imageAlt}">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:image" content="${imageUrl}">`,
    `  <meta name="twitter:image:alt" content="${imageAlt}">`,
  ].join("\n");

  html = html.replace(`  ${cardTag}`, tags);

  if ((html.match(/property=["']og:image["']/gi) || []).length !== 1) throw new Error(`${route}: expected exactly one og:image`);
  if ((html.match(/name=["']twitter:image["']/gi) || []).length !== 1) throw new Error(`${route}: expected exactly one twitter:image`);
  if (!html.includes(`property="og:image" content="${imageUrl}"`)) throw new Error(`${route}: og:image URL mismatch`);
  if (!html.includes('name="twitter:card" content="summary_large_image"')) throw new Error(`${route}: large-image X card missing`);
  await writeFile(path, html, "utf8");
}

console.log(`Social metadata prepared for ${approvedRoutes.length} production routes using ${imageUrl}.`);
