import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { rasterMedia, variantLabels } from "./lib/raster-media-config.mjs";
import { loadMediaManifest } from "./lib/load-media-manifest.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public", "media");
const { mediaManifest } = await loadMediaManifest(path.join(root, "src", "data", "mediaManifest.ts"));
const assets = Object.values(mediaManifest);
const errors = [];
const expectedFiles = new Set();
const allowedPublicSvg = new Set(["favicon.svg", "og/default.svg", "og/default-ko.svg"]);

const fail = (message) => errors.push(message);
const ratioValue = (value) => {
  const [width, height] = value.split(":").map(Number);
  return width / height;
};

async function filesBelow(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
      ? filesBelow(path.join(directory, entry.name))
      : [path.join(directory, entry.name)]));
    return nested.flat();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

const slugify = (value) => value
  .trim()
  .replace(/^['"]|['"]$/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

async function publicBlogSeries() {
  const feedRoot = path.resolve(root, process.env.CONTENT_FEED_PATH ?? ".content-feed");
  const files = (await filesBelow(path.join(feedRoot, "blog"))).filter((file) => /\.mdx?$/.test(file));
  const series = new Set();
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
    if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
    const name = frontmatter.match(/^series:\s*(.+?)\s*$/m)?.[1];
    if (name) series.add(slugify(name));
  }
  return series;
}

const series = await publicBlogSeries();

if (assets.length !== rasterMedia.length) fail(`manifest has ${assets.length} assets; expected ${rasterMedia.length}`);

for (const config of rasterMedia) {
  const asset = mediaManifest[config.key];
  if (!asset) { fail(`missing manifest asset ${config.key}`); continue; }
  if (!asset.alt?.en?.trim() || !asset.alt?.ko?.trim()) fail(`${asset.id} is missing localized alt text`);
  if (!asset.route?.startsWith("/")) fail(`${asset.id} has no public route`);
  if (asset.id.startsWith("blog-cover-") && !config.approvedFutureUse && !series.has(asset.id.replace("blog-cover-", ""))) {
    fail(`${asset.id} has no matching public blog series or approved future use`);
  }
  if (!asset.provenance?.trim() || !asset.generation?.tool || !asset.generation?.promptFile || !asset.generation?.selectedCandidate) fail(`${asset.id} has incomplete provenance`);
  if (asset.generation.selectedCandidate !== config.selectedCandidate) fail(`${asset.id} selected candidate drift`);
  if (asset.fallback.endsWith(".svg") || asset.variants.some((variant) => variant.src.endsWith(".svg"))) fail(`${asset.id} references SVG content media`);
  if (Math.abs(asset.width / asset.height - ratioValue(asset.aspectRatio)) > 0.002) fail(`${asset.id} declared dimensions do not match ${asset.aspectRatio}`);
  if (asset.variants.length !== variantLabels.length * 2) fail(`${asset.id} must have four AVIF and four WebP variants`);

  const referenced = await Promise.all(config.references.map(async (reference) => {
    const source = await readFile(path.join(root, reference), "utf8");
    return source.includes(config.key) || source.includes(config.id);
  }));
  if (!referenced.some(Boolean)) fail(`${asset.id} is referenced by no route or route-owned data file`);

  for (const label of variantLabels) {
    for (const format of ["avif", "webp"]) {
      const src = `/media/${asset.id}-${label}.${format}`;
      expectedFiles.add(src.replace("/media/", ""));
      const variant = asset.variants.find((item) => item.src === src && item.format === format);
      if (!variant) { fail(`${asset.id} missing ${label}px ${format}`); continue; }
      const file = path.join(root, "public", variant.src);
      try {
        const metadata = await sharp(file).metadata();
        if (metadata.width !== variant.width) fail(`${variant.src} width ${metadata.width} differs from manifest ${variant.width}`);
        if (Math.abs((metadata.width ?? 0) / (metadata.height ?? 1) - ratioValue(asset.aspectRatio)) > 0.003) fail(`${variant.src} dimensions do not match ${asset.aspectRatio}`);
      } catch (error) {
        fail(`${variant.src} cannot be read: ${error.message}`);
      }
    }
  }

  const fallbackVariant = asset.variants.find((variant) => variant.src === asset.fallback && variant.format === "webp");
  if (!fallbackVariant || !asset.fallback.includes("-1200.webp")) fail(`${asset.id} fallback must be the 1200px WebP`);

  for (const format of ["avif", "webp"]) {
    const file = path.join(publicDir, `${asset.id}-1200.${format}`);
    try {
      const bytes = (await stat(file)).size;
      const budget = asset.loadingPriority === "high"
        ? (format === "avif" ? 180_000 : 260_000)
        : (format === "avif" ? 150_000 : 220_000);
      if (bytes > budget) fail(`${path.basename(file)} is ${bytes} bytes; budget is ${budget}`);
    } catch (error) {
      fail(`${path.basename(file)} budget check failed: ${error.message}`);
    }
  }
}

const publicFiles = (await readdir(publicDir)).filter((file) => !file.startsWith("."));
for (const file of publicFiles) {
  if (file.endsWith(".svg")) fail(`content artwork SVG remains: public/media/${file}`);
  if (!expectedFiles.has(file)) fail(`unused public media: public/media/${file}`);
}
for (const expected of expectedFiles) if (!publicFiles.includes(expected)) fail(`missing public media: public/media/${expected}`);

const research = [mediaManifest.researchVla, mediaManifest.researchEfficientSystems, mediaManifest.researchWorkflow];
const projects = [mediaManifest.projectGnaroshiVla, mediaManifest.projectGnaroshiDev];
const hashes = new Map();
for (const asset of [...research, ...projects]) {
  const bytes = await readFile(path.join(root, "public", asset.fallback));
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hashes.has(hash)) fail(`${asset.id} reuses ${hashes.get(hash)}`);
  hashes.set(hash, asset.id);
}

async function publicSvgFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? publicSvgFiles(path.join(directory, entry.name), relative) : (entry.name.endsWith(".svg") ? [relative] : []);
  }));
  return nested.flat();
}
for (const svg of await publicSvgFiles(path.join(root, "public"))) {
  if (!allowedPublicSvg.has(svg)) fail(`public SVG is not functionally allowlisted: public/${svg}`);
}

if (errors.length > 0) {
  console.error(`[media] validation failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const totalBytes = (await Promise.all([...expectedFiles].map((file) => stat(path.join(publicDir, file))))).reduce((sum, item) => sum + item.size, 0);
console.log(`[media] ${assets.length} raster assets, ${expectedFiles.size} variants, ${(totalBytes / 1024).toFixed(1)} KiB total: valid`);
