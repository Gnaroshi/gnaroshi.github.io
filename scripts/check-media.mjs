import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import sharp from "sharp";
import { mediaManifest } from "../src/data/mediaManifest.ts";
import { heroCandidates } from "../src/data/mediaReview.ts";

const root = resolve(".");
const policy = JSON.parse(await readFile(join(root, "config/media-policy.json"), "utf8"));
const failures = [];
const warnings = [];

async function walk(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const sourceFiles = await walk(join(root, "src"));
const sourceText = (await Promise.all(sourceFiles
  .filter((path) => /\.(astro|ts|tsx|css)$/.test(path) && !path.endsWith("mediaManifest.ts"))
  .map((path) => readFile(path, "utf8")))).join("\n");
const productionFiles = (await walk(join(root, "public/media"))).filter((path) => !path.endsWith(".DS_Store"));
const manifestPaths = new Map();

for (const asset of Object.values(mediaManifest)) {
  for (const field of ["id", "purpose", "aspectRatio", "source", "provenance", "focalPoint", "loadingPriority"]) {
    if (!asset[field]?.toString().trim()) failures.push(`${asset.id}: missing ${field}`);
  }
  if (!asset.alt?.en?.trim() || !asset.alt?.ko?.trim()) failures.push(`${asset.id}: localized alt text is incomplete`);
  for (const path of [asset.light, asset.dark].filter(Boolean)) {
    const users = manifestPaths.get(path) ?? [];
    if (!users.includes(asset.id)) users.push(asset.id);
    manifestPaths.set(path, users);
  }
}

for (const [path, users] of manifestPaths) {
  if (users.length > 1 && !policy.unrelatedReuseAllowlist.includes(path)) {
    failures.push(`${path}: reused by unrelated manifest records ${users.join(", ")}`);
  }
}

for (const file of productionFiles) {
  const publicPath = `/${relative(join(root, "public"), file).split("\\").join("/")}`;
  const declared = manifestPaths.has(publicPath);
  const referencedDirectly = sourceText.includes(publicPath);
  if (!declared && !referencedDirectly && !policy.unusedProductionAllowlist.includes(publicPath)) {
    failures.push(`${publicPath}: unused production image`);
  }
  if (extname(file).toLowerCase() === ".svg" && !policy.contentImageSvgAllowlist.includes(publicPath)) {
    failures.push(`${publicPath}: content SVG is outside the Stage 1 allowlist`);
  }
}

const requiredHeroWidths = [480, 768, 1200, 1600];
for (const width of requiredHeroWidths) {
  for (const format of ["avif", "webp"]) {
    const path = join(root, `public/media/home-research-constellation-${width}.${format}`);
    if (!existsSync(path)) failures.push(`Hero responsive variant is missing: ${relative(root, path)}`);
  }
}

for (const [file, budget] of [
  ["public/media/home-research-constellation-1200.avif", policy.budgets.hero1200Avif],
  ["public/media/home-research-constellation-1200.webp", policy.budgets.hero1200Webp]
]) {
  const bytes = (await stat(join(root, file))).size;
  if (bytes > budget) failures.push(`${file}: ${bytes} bytes exceeds ${budget}`);
}

const candidateRoot = join(root, "artifacts/media-review/hero");
if (existsSync(candidateRoot)) {
  for (const candidate of heroCandidates) {
    const path = join(candidateRoot, candidate.file);
    if (!existsSync(path)) {
      failures.push(`${candidate.id}: candidate raster is missing`);
      continue;
    }
    const metadata = await sharp(path).metadata();
    if (metadata.width !== 2000 || metadata.height !== 1600) {
      failures.push(`${candidate.id}: expected 2000x1600, found ${metadata.width}x${metadata.height}`);
    }
  }
}

if (policy.stage === "candidate-review") {
  warnings.push(`${policy.contentImageSvgAllowlist.length} legacy content SVGs remain until visual approval`);
  warnings.push(`${policy.unusedProductionAllowlist.length} unused Blog covers remain until Stage 2 cleanup`);
  warnings.push(`${policy.unrelatedReuseAllowlist.length} unrelated-purpose media reuse remains until a real artifact is approved`);
}

for (const warning of warnings) console.warn(`[media:check] warning: ${warning}`);
if (failures.length) {
  for (const failure of failures) console.error(`[media:check] ${failure}`);
  process.exit(1);
}
console.log(`[media:check] passed (${Object.keys(mediaManifest).length} manifest records, ${productionFiles.length} production media files, stage ${policy.stage})`);
