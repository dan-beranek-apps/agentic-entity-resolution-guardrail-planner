import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const configPath = path.join(root, "assets/data/distribution-platforms.json");
const keywordProjectionPath = path.join(root, "assets/data/dio-odi-keyword-projection.json");
const socialPreviewRelativePath = "assets/branding/social-preview.png";
const socialPreviewUrl = "https://dan-beranek.github.io/agentic-entity-resolution-guardrail-planner/" + socialPreviewRelativePath;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const keywordProjection = JSON.parse(await fs.readFile(keywordProjectionPath, "utf8"));
if (keywordProjection.source?.registry_version !== "2.6.0" || keywordProjection.source?.registry_status !== "canonical-approved" || keywordProjection.profile?.id !== "commit-boundary-paper" || !Array.isArray(keywordProjection.resolved_keywords) || keywordProjection.resolved_keywords.length !== 34) {
  throw new Error("DIO/ODI keyword projection must use the approved 2.6.0 commit-boundary-paper profile with all 34 resolved terms.");
}
const expectedKeywordContent = keywordProjection.resolved_keywords.join(", ");
if (!Array.isArray(config.platforms) || config.platforms.length === 0) {
  throw new Error("Add at least one platform to assets/data/distribution-platforms.json.");
}

const allIds = new Set();
for (const platform of config.platforms) {
  if (!platform.id || allIds.has(platform.id)) {
    throw new Error("Distribution platform IDs must be present and unique.");
  }
  allIds.add(platform.id);
  if (!["available", "planned", "disabled"].includes(platform.availability)) {
    throw new Error("Platform availability must be available, planned or disabled.");
  }
  if (platform.availability === "available") {
    if (platform.affiliate !== true) {
      throw new Error("Every available distribution platform must use an affiliate link.");
    }
    const url = new URL(platform.url);
    if (url.protocol !== "https:") {
      throw new Error("Available platform URLs must use HTTPS.");
    }
    if (!platform.name || !platform.button_label) {
      throw new Error("Available platforms need a name and button label.");
    }
  }
}

const agensi = config.platforms.find((platform) => platform.id === "agensi");
const expectedAgensiUrl = "https://www.agensi.io/r/DANIELBERANEK?to=/skills/agentic-entity-resolution-guardrail-planner";
if (!agensi || agensi.availability !== "available" || agensi.url !== expectedAgensiUrl || agensi.affiliate !== true) {
  throw new Error("Agensi must remain available through the configured affiliate route.");
}

const platforms = config.platforms
  .filter((platform) => platform.availability === "available")
  .sort((a, b) => {
    if (Boolean(a.primary) !== Boolean(b.primary)) return a.primary ? -1 : 1;
    return (a.order ?? 100) - (b.order ?? 100);
  });

if (platforms.length === 0) throw new Error("No available distribution platforms are configured.");

const platformMarkup = platforms.map((platform, index) => {
  const style = index === 0 ? "platform-link-primary" : "platform-link-secondary";
  const aria = "Get Agentic Entity Resolution Guardrail Planner on " + platform.name;
  return '<a class="platform-link ' + style + '" href="' + escapeHtml(platform.url) +
    '" target="_blank" rel="sponsored nofollow noopener noreferrer" aria-label="' + escapeHtml(aria) + '">' +
    escapeHtml(platform.button_label) + ' <span aria-hidden="true">↗</span><span class="platform-name">' +
    escapeHtml(platform.name) + '</span></a>';
}).join("\n");

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });

let html = await fs.readFile(path.join(root, "index.html"), "utf8");
const marker = "<!-- PLATFORM_LINKS -->";
const markerCount = html.split(marker).length - 1;
if (markerCount !== 3) {
  throw new Error("Expected exactly three distribution-platform insertion points; found " + markerCount + ".");
}
html = html.split(marker).join(platformMarkup);
if (html.includes(marker)) throw new Error("Unresolved distribution-platform insertion point.");

if (/href=["']https:\/\/www\.agensi\.io\/skills\//i.test(html)) {
  throw new Error("A direct Agensi Skill URL was found. Purchase links must use the affiliate route.");
}
if (/(?:\$|€)\s?\d|(?:USD|EUR|CZK)\s?\d/i.test(html)) {
  throw new Error("A fixed price was found in the product page. Pricing belongs on the distribution platform.");
}
if (!html.includes('rel="sponsored nofollow noopener noreferrer"')) {
  throw new Error("Affiliate links must carry sponsored and safe external-link attributes.");
}

const ctaUrlCount = html.split(expectedAgensiUrl).length - 1;
if (ctaUrlCount !== markerCount) {
  throw new Error("Expected one Agensi affiliate URL per CTA placement; found " + ctaUrlCount + ".");
}

await fs.writeFile(path.join(dist, "index.html"), html, "utf8");
await fs.mkdir(path.join(dist, "methodology"), { recursive: true });
await fs.copyFile(path.join(root, "methodology/index.html"), path.join(dist, "methodology/index.html"));
await fs.cp(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });
await fs.cp(path.join(root, "demo-for-agensi"), path.join(dist, "demo-for-agensi"), { recursive: true });
await fs.mkdir(path.join(dist, "demo"), { recursive: true });
await fs.copyFile(path.join(root, "demo/index.html"), path.join(dist, "demo/index.html"));

for (const filename of ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"]) {
  await fs.copyFile(path.join(root, filename), path.join(dist, filename));
}

const requiredOutputs = [
  "index.html",
  "methodology/index.html",
  "demo/index.html",
  "assets/site.css",
  "assets/site.js",
  "assets/data/distribution-platforms.json",
  "assets/data/dio-odi-keyword-projection.json",
  "assets/branding/agentic-entity-resolution-guardrail-planner-logo.svg",
  "assets/branding/social-preview.png",
  "assets/diagrams/investigation-workflow.svg",
  "demo-for-agensi/00-README.md",
  "demo-for-agensi/guardrail-spec.json",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt"
];

for (const relativePath of requiredOutputs) {
  if (!(await exists(path.join(dist, relativePath)))) {
    throw new Error("Missing build output: " + relativePath);
  }
}

console.log("Static site built successfully.");
console.log("Available platforms: " + platforms.map((platform) => platform.name).join(", "));
console.log("Affiliate CTA placements: " + markerCount);
console.log("Fixed prices on website: none");

const socialImage = await fs.readFile(path.join(dist, socialPreviewRelativePath));
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (!socialImage.subarray(0, 8).equals(pngSignature) || socialImage.readUInt32BE(16) !== 1200 || socialImage.readUInt32BE(20) !== 630) {
  throw new Error("Social preview must be a valid 1200x630 PNG.");
}
for (const page of ["index.html", "methodology/index.html", "demo/index.html"]) {
  const pageHtml = await fs.readFile(path.join(dist, page), "utf8");
  const keywordMatch = pageHtml.match(/<meta name="keywords" content="([^"]*)">/);
  if (!keywordMatch || keywordMatch[1] !== expectedKeywordContent) throw new Error("DIO/ODI Keywords metadata does not match the complete ordered registry projection in " + page + ".");
  for (const marker of [
    '<meta name="dio-odi-keyword-profile" content="commit-boundary-paper">',
    '<meta name="dio-odi-keyword-registry-version" content="2.6.0">',
    '<meta property="og:image" content="' + socialPreviewUrl + '">',
    '<meta name="twitter:image" content="' + socialPreviewUrl + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">'
  ]) if (!pageHtml.includes(marker)) throw new Error("Missing required social/semantic metadata marker in " + page + ": " + marker);
}
console.log("Social preview: 1200x630 PNG, referenced by Open Graph and Twitter metadata on all pages.");
console.log("DIO/ODI Keywords: " + keywordProjection.resolved_keywords.length + " ordered terms from " + keywordProjection.profile.id + " (registry " + keywordProjection.source.registry_version + ").");
console.log("Output directory: " + dist);
