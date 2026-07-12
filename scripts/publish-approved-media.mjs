import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const outputRoot = resolve("public/media/approved");
await mkdir(outputRoot, { recursive: true });

const jobs = [
  { id: "home-research-workspace", source: "media-sources/candidates/home-hero-c.webp", widths: [640, 1200, 1600] },
  { id: "research-vla-task", source: "media-sources/candidates/research-vla-b.webp", widths: [640, 1200, 1600] },
  { id: "efficient-execution-en", source: "media-sources/exports/efficient-execution-en.png", widths: [640, 1200, 1600] },
  { id: "efficient-execution-ko", source: "media-sources/exports/efficient-execution-ko.png", widths: [640, 1200, 1600] },
  { id: "research-workflow-en", source: "media-sources/exports/research-workflow-en.png", widths: [640, 1200, 1600] },
  { id: "research-workflow-ko", source: "media-sources/exports/research-workflow-ko.png", widths: [640, 1200, 1600] },
  { id: "project-gnaroshi-vla", source: "media-sources/exports/project-gnaroshi-vla.png", widths: [640, 1200, 1600] },
  { id: "project-gnaroshi-dev", source: "media-sources/exports/project-gnaroshi-dev.png", widths: [640, 1200, 1600] }
];

for (const job of jobs) {
  for (const width of job.widths) {
    const pipeline = sharp(job.source).resize({ width, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 });
    await Promise.all([
      pipeline.clone().avif({ quality: 68, effort: 6 }).toFile(resolve(outputRoot, `${job.id}-${width}.avif`)),
      pipeline.clone().webp({ quality: 84, effort: 6 }).toFile(resolve(outputRoot, `${job.id}-${width}.webp`))
    ]);
  }
}

console.log(`[media:publish] published ${jobs.length} approved assets in AVIF/WebP at 640, 1200, and 1600px`);
