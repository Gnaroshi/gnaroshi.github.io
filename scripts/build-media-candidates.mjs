import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const roots = {
  raw: resolve("media-sources/candidates/raw"),
  candidates: resolve("media-sources/candidates"),
  exports: resolve("media-sources/exports"),
  contacts: resolve("media-sources/contact-sheets")
};
await Promise.all(Object.values(roots).map((directory) => mkdir(directory, { recursive: true })));

const generated = [
  ...["a", "b", "c"].map((suffix) => ({ id: `home-hero-${suffix}`, width: 2000, height: 1600 })),
  ...["a", "b", "c"].map((suffix) => ({ id: `research-vla-${suffix}`, width: 1600, height: 1200 }))
];

for (const candidate of generated) {
  const input = resolve(roots.raw, `${candidate.id}.png`);
  const output = resolve(roots.candidates, `${candidate.id}.webp`);
  if (existsSync(input)) {
    await sharp(input)
      .resize(candidate.width, candidate.height, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 94, effort: 6 })
      .toFile(output);
  } else if (!existsSync(output)) {
    throw new Error(`Missing generated source and normalized candidate: ${candidate.id}`);
  }
}

const renderJobs = [
  { id: "efficient-execution-en", source: "media-sources/diagrams/efficient-execution.html", query: "?locale=en", width: 1600, height: 1200 },
  { id: "efficient-execution-ko", source: "media-sources/diagrams/efficient-execution.html", query: "?locale=ko", width: 1600, height: 1200 },
  { id: "research-workflow-en", source: "media-sources/diagrams/research-workflow.html", query: "?locale=en", width: 1600, height: 1200 },
  { id: "research-workflow-ko", source: "media-sources/diagrams/research-workflow.html", query: "?locale=ko", width: 1600, height: 1200 },
  { id: "project-gnaroshi-vla", source: "media-sources/project-evidence/gnaroshi-vla.html", query: "", width: 1600, height: 1000 },
  { id: "project-gnaroshi-dev", source: "media-sources/project-evidence/gnaroshi-dev.html", query: "", width: 1600, height: 1000 }
];

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
try {
  for (const job of renderJobs) {
    const context = await browser.newContext({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1, colorScheme: "light" });
    const page = await context.newPage();
    await page.goto(`${pathToFileURL(resolve(job.source))}${job.query}`, { waitUntil: "load" });
    if (job.id === "project-gnaroshi-dev") {
      const buildInfoPath = resolve("media-sources/evidence/gnaroshi-dev/build-info.json");
      if (!existsSync(buildInfoPath)) throw new Error("Run npm run media:capture before building project evidence.");
      const buildInfo = JSON.parse(await readFile(buildInfoPath, "utf8"));
      const excerpt = [
        `schemaVersion: ${buildInfo.schemaVersion}`,
        `environment: ${buildInfo.environment}`,
        `websiteCommit: ${(buildInfo.websiteCommit ?? "unknown").slice(0, 12)}`,
        "contentFeed:",
        `  commit: ${(buildInfo.contentFeed?.commit ?? "unknown").slice(0, 12)}`,
        `  schemaVersion: ${buildInfo.contentFeed?.schemaVersion}`,
        `  contentHash: ${(buildInfo.contentFeed?.contentHash ?? "unknown").slice(0, 16)}…`,
        "routes:",
        "  / · /ko/",
        "  /research/",
        "  /projects/"
      ].join("\n");
      await page.locator("#build-info").evaluate((element, text) => { element.textContent = text; }, excerpt);
    }
    const png = resolve(roots.exports, `${job.id}.png`);
    await page.screenshot({ path: png, animations: "disabled" });
    await sharp(png).avif({ quality: 72, effort: 6 }).toFile(resolve(roots.exports, `${job.id}.avif`));
    await sharp(png).webp({ quality: 82, effort: 6 }).toFile(resolve(roots.exports, `${job.id}.webp`));
    await context.close();
  }
} finally {
  await browser.close();
}

function labelSvg(label, width, height = 46) {
  const safe = label.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111713"/><text x="16" y="30" fill="#f4f5f2" font-family="Arial,sans-serif" font-size="17">${safe}</text></svg>`);
}

async function contactSheet(name, files, tileWidth, tileHeight, columns) {
  const labelHeight = 46;
  const tiles = await Promise.all(files.map(async (file) => {
    const image = await sharp(file).resize(tileWidth, tileHeight, { fit: "cover", position: "centre" }).png().toBuffer();
    return sharp({ create: { width: tileWidth, height: tileHeight + labelHeight, channels: 4, background: "#111713" } })
      .composite([{ input: image, left: 0, top: 0 }, { input: labelSvg(basename(file, ".png"), tileWidth, labelHeight), left: 0, top: tileHeight }])
      .png().toBuffer();
  }));
  const rows = Math.ceil(tiles.length / columns);
  await sharp({ create: { width: columns * tileWidth, height: rows * (tileHeight + labelHeight), channels: 4, background: "#111713" } })
    .composite(tiles.map((input, index) => ({ input, left: (index % columns) * tileWidth, top: Math.floor(index / columns) * (tileHeight + labelHeight) })))
    .png().toFile(resolve(roots.contacts, `${name}.png`));
}

await contactSheet("home-hero", ["a", "b", "c"].map((suffix) => resolve(roots.candidates, `home-hero-${suffix}.webp`)), 500, 400, 3);
await contactSheet("research-vla", ["a", "b", "c"].map((suffix) => resolve(roots.candidates, `research-vla-${suffix}.webp`)), 480, 360, 3);
await contactSheet("technical-diagrams", renderJobs.slice(0, 4).map((job) => resolve(roots.exports, `${job.id}.png`)), 400, 300, 2);
await contactSheet("project-evidence", renderJobs.slice(4).map((job) => resolve(roots.exports, `${job.id}.png`)), 640, 400, 2);

console.log(`[media:build] prepared ${generated.length} generated candidates, ${renderJobs.length} rendered candidates, and 4 contact sheets`);
