import { access, readFile, rm, writeFile } from "node:fs/promises";
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

const production = mode === "production";

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
  if (!/^\/[^?#]*\/$/.test(route)) throw new Error(`Approved registry route must use a leading and trailing slash: ${route}`);
  return resolve(output, route.slice(1), "index.html");
}

function extractTitle(html, route) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!match || !match[1].trim()) throw new Error(`${route}: missing non-empty <title>`);
  return match[1].trim();
}

function extractDescriptionTag(html, route) {
  const tag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0];
  if (!tag) throw new Error(`${route}: missing meta description`);
  const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]?.trim();
  if (!content) throw new Error(`${route}: meta description is empty`);
  return { tag, content };
}

function escapeAttr(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function canonicalUrl(origin, route) {
  return `${origin}${route}`;
}

function normalizeOrigin(raw) {
  if (!raw) throw new Error("Production build requires SITE_ORIGIN, for example https://example.com");
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_ORIGIN is not a valid absolute URL: ${raw}`);
  }
  if (url.protocol !== "https:") throw new Error("SITE_ORIGIN must use https");
  if (url.username || url.password || url.search || url.hash) throw new Error("SITE_ORIGIN must not include credentials, query parameters or a fragment");
  if (url.pathname !== "/" && url.pathname !== "") throw new Error("SITE_ORIGIN must be an origin only, with no path");
  return url.origin;
}

const registry = await readFile(registryPath, "utf8");
const approvedRoutes = parseRegistry(registry);

if (approvedRoutes.length !== 39) {
  throw new Error(`Expected 39 approved registry routes; found ${approvedRoutes.length}`);
}

const origin = production ? normalizeOrigin((process.env.SITE_ORIGIN || "").trim()) : null;
const canonicalTagPattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;
const socialTagPattern = /<meta\b[^>]*(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>/i;
const previewRobotsPattern = /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']noindex,nofollow["'][^>]*>/i;
const robotsTagPattern = /<meta\b[^>]*\bname=["']robots["'][^>]*>/i;
const previewBannerPattern = /\n?\s*<([a-z][a-z0-9]*)\b[^>]*\bclass=["'][^"']*\bpreview-banner\b[^"']*["'][^>]*>[\s\S]*?<\/\1>\s*\n?/i;
const oldPreviewBrandPattern = /Dental cost preview/gi;

for (const route of approvedRoutes) {
  const path = outputPathForRoute(route);
  await access(path);
  let html = await readFile(path, "utf8");

  const sourceTitle = extractTitle(html, route);
  const title = production ? sourceTitle.replace(oldPreviewBrandPattern, "Dental Calculator") : sourceTitle;
  const { tag: descriptionTag, content: description } = extractDescriptionTag(html, route);

  if (canonicalTagPattern.test(html) || socialTagPattern.test(html)) {
    throw new Error(`${route}: canonical/OG/X metadata is centrally owned by prepare-deploy-seo.mjs`);
  }

  if (!previewRobotsPattern.test(html)) {
    throw new Error(`${route}: source artifact must enter deploy preparation as noindex,nofollow`);
  }

  if (!production) continue;

  const canonical = canonicalUrl(origin, route);
  const metadata = [
    `  <link rel="canonical" href="${escapeAttr(canonical)}">`,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:locale" content="en_US">`,
    `  <meta property="og:site_name" content="Dental Calculator">`,
    `  <meta property="og:title" content="${escapeAttr(title)}">`,
    `  <meta property="og:description" content="${escapeAttr(description)}">`,
    `  <meta property="og:url" content="${escapeAttr(canonical)}">`,
    `  <meta name="twitter:card" content="summary">`,
    `  <meta name="twitter:title" content="${escapeAttr(title)}">`,
    `  <meta name="twitter:description" content="${escapeAttr(description)}">`,
  ].join("\n");

  html = html.replace(oldPreviewBrandPattern, "Dental Calculator");
  html = html.replace(robotsTagPattern, '<meta name="robots" content="index,follow,max-image-preview:large">');
  html = html.replace(descriptionTag, `${descriptionTag}\n${metadata}`);
  html = html.replace(previewBannerPattern, "\n");

  if (/noindex/i.test(html)) throw new Error(`${route}: production artifact still contains noindex`);
  if (/preview-banner|Prelaunch preview|Dental cost preview/i.test(html)) throw new Error(`${route}: production artifact still contains preview UI or branding`);
  if ((html.match(/rel=["']canonical["']/gi) || []).length !== 1) throw new Error(`${route}: production artifact must contain exactly one canonical`);
  if (!html.includes(`property="og:url" content="${escapeAttr(canonical)}"`)) throw new Error(`${route}: OG URL does not match canonical`);
  if (!html.includes(`property="og:title" content="${escapeAttr(title)}"`)) throw new Error(`${route}: OG title does not match normalized production title`);
  if (!html.includes('name="twitter:card" content="summary"')) throw new Error(`${route}: Twitter/X card metadata missing`);

  await writeFile(path, html, "utf8");
}

const robotsPath = resolve(output, "robots.txt");
const sitemapPath = resolve(output, "sitemap.xml");

if (!production) {
  await writeFile(robotsPath, "User-agent: *\nDisallow: /\n", "utf8");
  await rm(sitemapPath, { force: true });
  console.log(`Deploy SEO prepared in preview mode: ${approvedRoutes.length} approved routes remain noindex; robots blocks crawling.`);
} else {
  const robots = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`;
  await writeFile(robotsPath, robots, "utf8");

  const urls = approvedRoutes
    .map((route) => `  <url><loc>${escapeXml(canonicalUrl(origin, route))}</loc></url>`)
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(sitemapPath, sitemap, "utf8");

  const writtenSitemap = await readFile(sitemapPath, "utf8");
  const urlCount = (writtenSitemap.match(/<url>/g) || []).length;
  if (urlCount !== approvedRoutes.length) throw new Error(`Sitemap route count mismatch: expected ${approvedRoutes.length}; found ${urlCount}`);
  if (writtenSitemap.includes("/broken-tooth-repair-cost/") || writtenSitemap.includes("/dental-anesthesia-cost/")) {
    throw new Error("Deferred routes must not appear in the production sitemap");
  }

  console.log(`Deploy SEO prepared in production mode: ${approvedRoutes.length} canonical URLs + robots.txt + sitemap.xml for ${origin}.`);
}
