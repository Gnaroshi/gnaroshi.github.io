import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { heroCandidates, brandCandidates } from "../src/data/mediaReview.ts";
import { iconRegistry } from "../src/components/icons/iconRegistry.ts";

const root = resolve("artifacts/media-review");
const heroRoot = join(root, "hero");
const rawRoot = join(heroRoot, "raw");
const brandRoot = join(root, "brand");
const contactRoot = join(root, "contact-sheets");
await Promise.all([heroRoot, rawRoot, brandRoot, contactRoot].map((path) => mkdir(path, { recursive: true })));

for (const candidate of heroCandidates) {
  const raw = join(rawRoot, candidate.file);
  const output = join(heroRoot, candidate.file);
  if (existsSync(raw)) {
    await sharp(raw).resize(2000, 1600, { fit: "cover", position: "centre" }).png({ compressionLevel: 9 }).toFile(output);
  }
}

const availableHeroes = heroCandidates.filter((candidate) => existsSync(join(heroRoot, candidate.file)));
if (availableHeroes.length === heroCandidates.length) {
  const tiles = await Promise.all(availableHeroes.map(async (candidate) => {
    const image = await sharp(join(heroRoot, candidate.file)).resize(400, 320, { fit: "cover" }).png().toBuffer();
    const label = Buffer.from(`<svg width="400" height="40"><rect width="400" height="40" fill="#111713"/><text x="16" y="26" fill="#f4f5f2" font-family="Arial,sans-serif" font-size="16">${candidate.id} · Direction ${candidate.direction}</text></svg>`);
    return sharp({ create: { width: 400, height: 360, channels: 4, background: "#111713" } }).composite([{ input: image, left: 0, top: 0 }, { input: label, left: 0, top: 320 }]).png().toBuffer();
  }));
  await sharp({ create: { width: 1200, height: 720, channels: 4, background: "#111713" } })
    .composite(tiles.map((input, index) => ({ input, left: (index % 3) * 400, top: Math.floor(index / 3) * 360 })))
    .png().toFile(join(contactRoot, "hero-contact-sheet.png"));
} else {
  console.warn(`[media:review] ${availableHeroes.length}/6 Hero candidates available; contact sheet deferred`);
}

const brandTiles = [];
for (const candidate of brandCandidates) {
  const paths = candidate.paths.map((d) => `<path d="${d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${candidate.viewBox}" width="512" height="512" fill="#111713">${paths}</svg>`;
  await writeFile(join(brandRoot, `${candidate.id}.svg`), `${svg}\n`);
  const mark = await sharp(Buffer.from(svg)).resize(160, 160).png().toBuffer();
  const label = Buffer.from(`<svg width="280" height="40"><text x="12" y="26" fill="#111713" font-family="Arial,sans-serif" font-size="15">${candidate.id} · ${candidate.direction}</text></svg>`);
  brandTiles.push(await sharp({ create: { width: 280, height: 220, channels: 4, background: "#f4f5f2" } }).composite([{ input: mark, left: 60, top: 10 }, { input: label, left: 0, top: 176 }]).png().toBuffer());
}
await sharp({ create: { width: 1120, height: 220, channels: 4, background: "#f4f5f2" } })
  .composite(brandTiles.map((input, index) => ({ input, left: index * 280, top: 0 })))
  .png().toFile(join(contactRoot, "brand-contact-sheet.png"));

const iconTileWidth = 180;
const iconTileHeight = 120;
const iconTiles = await Promise.all(iconRegistry.map(async (icon) => {
  const paths = icon.component.paths.map((path) => `<path d="${path.d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconTileWidth}" height="${iconTileHeight}" viewBox="0 0 ${iconTileWidth} ${iconTileHeight}"><rect width="100%" height="100%" fill="#f4f5f2"/><g transform="translate(78 22)" fill="none" stroke="#111713" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g><text x="12" y="98" fill="#111713" font-family="Arial,sans-serif" font-size="14">${icon.name}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}));
const columns = 6;
const rows = Math.ceil(iconTiles.length / columns);
await sharp({ create: { width: columns * iconTileWidth, height: rows * iconTileHeight, channels: 4, background: "#f4f5f2" } })
  .composite(iconTiles.map((input, index) => ({ input, left: (index % columns) * iconTileWidth, top: Math.floor(index / columns) * iconTileHeight })))
  .png().toFile(join(contactRoot, "icon-contact-sheet.png"));

console.log(`[media:review] prepared ${availableHeroes.length} Hero, ${brandCandidates.length} brand, and ${iconRegistry.length} icon candidates under ${root}`);
