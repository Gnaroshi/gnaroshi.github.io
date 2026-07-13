import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const source = resolve("media-sources/identity/gnaroshi-site-pixel-v1/gnaroshi-site-mark-pixel-v1.png");
await mkdir(resolve("public/media/identity"), { recursive: true });

for (const [path, width] of [
  ["public/favicon-16.png", 16],
  ["public/favicon-32.png", 32],
  ["public/favicon-48.png", 48],
  ["public/apple-touch-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/media/identity/gnaroshi-site-mark-64.png", 64],
  ["public/media/identity/gnaroshi-site-mark-128.png", 128]
]) {
  await sharp(source).resize(width, width, { fit: "cover", kernel: sharp.kernel.nearest }).png().toFile(resolve(path));
}

console.log("[identity:publish] published nearest-neighbor pixel browser, touch, manifest, and compact brand marks");
