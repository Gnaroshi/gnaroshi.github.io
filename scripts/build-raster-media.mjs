import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { rasterMedia, variantLabels } from "./lib/raster-media-config.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public", "media");
const contactDir = path.join(root, "artifacts", "raster-candidates", "contact-sheets");

await Promise.all([mkdir(publicDir, { recursive: true }), mkdir(contactDir, { recursive: true })]);

function heightFor(width, ratio) {
  return Math.round(width * ratio[1] / ratio[0]);
}

function sourceLimitedWidth(metadata, ratio) {
  const availableWidth = Math.min(metadata.width ?? 0, Math.floor((metadata.height ?? 0) * ratio[0] / ratio[1]), 1600);
  return Math.floor(availableWidth / ratio[0]) * ratio[0];
}

function sharpPosition(focalPoint) {
  return focalPoint === "center center" ? "centre" : focalPoint.split(" ")[0];
}

async function renderVariant(asset, source, label, width) {
  const height = heightFor(width, asset.ratio);
  const base = sharp(source)
    .resize(width, height, { fit: "cover", position: sharpPosition(asset.focalPoint), withoutEnlargement: true })
    .toColourspace("srgb");
  const avifPath = path.join(publicDir, `${asset.id}-${label}.avif`);
  const webpPath = path.join(publicDir, `${asset.id}-${label}.webp`);
  await Promise.all([
    base.clone().avif({ quality: asset.hero ? 58 : 56, effort: 6 }).toFile(avifPath),
    base.clone().webp({ quality: 82, effort: 5 }).toFile(webpPath)
  ]);
}

async function renderContactSheet(asset) {
  const width = 640;
  const height = heightFor(width, asset.ratio);
  const [left, right] = await Promise.all(asset.candidates.map(async (candidate) => {
    const input = path.join(root, candidate);
    await access(input);
    return sharp(input).resize(width, height, { fit: "cover", position: sharpPosition(asset.focalPoint) }).toColourspace("srgb").toBuffer();
  }));
  await sharp({ create: { width: width * 2, height, channels: 3, background: "#e8e9e5" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: width, top: 0 }])
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(contactDir, `${asset.id}.webp`));
}

for (const asset of rasterMedia) {
  const source = path.join(root, asset.source);
  await access(source);
  const metadata = await sharp(source).metadata();
  const maxWidth = sourceLimitedWidth(metadata, asset.ratio);
  if (maxWidth < 1200) throw new Error(`${asset.id} source is too small for the required 1200px output`);
  const widths = variantLabels.map((label) => label === 1600 ? maxWidth : label);
  await Promise.all([
    ...variantLabels.map((label, index) => renderVariant(asset, source, label, widths[index])),
    renderContactSheet(asset)
  ]);
  console.log(`[media] ${asset.id}: ${widths.join(", ")}px`);
}

const familyThumbs = await Promise.all(rasterMedia.map(async (asset) => {
  const input = path.join(root, asset.source);
  return sharp(input).resize(400, 250, { fit: "cover", position: sharpPosition(asset.focalPoint) }).toColourspace("srgb").toBuffer();
}));
await sharp({ create: { width: 1600, height: 500, channels: 3, background: "#e8e9e5" } })
  .composite(familyThumbs.map((input, index) => ({ input, left: (index % 4) * 400, top: Math.floor(index / 4) * 250 })))
  .webp({ quality: 84, effort: 5 })
  .toFile(path.join(contactDir, "selected-family.webp"));

console.log(`[media] built ${rasterMedia.length * variantLabels.length * 2} public variants and contact sheets`);
