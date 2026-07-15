import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { isAbsolute, resolve, sep } from "node:path";
import sharp from "sharp";
import { approvedProjectShowcases } from "../src/data/approvedProjectShowcases.ts";

const configPath = resolve(process.env.PROJECT_SHOWCASE_CONFIG ?? ".project-showcases.local.json");
const outputRoot = resolve("public/media/approved");

function fail(message) {
  throw new Error(`[showcases:publish] ${message}`);
}

if (!existsSync(configPath)) {
  fail(`Missing untracked source map: ${configPath}`);
}

const config = JSON.parse(await readFile(configPath, "utf8"));
const sourcePaths = new Map(config.applications?.map((item) => [item.id, item.sourcePath]) ?? []);
const requestedApplicationId = process.env.SHOWCASE_APPLICATION_ID;
const selectedShowcases = requestedApplicationId
  ? approvedProjectShowcases.filter((asset) => asset.applicationId === requestedApplicationId)
  : approvedProjectShowcases;
if (requestedApplicationId && selectedShowcases.length === 0) {
  fail(`No owner-approved screenshots registered for ${requestedApplicationId}`);
}
await mkdir(outputRoot, { recursive: true });

for (const asset of selectedShowcases) {
  const configuredPath = sourcePaths.get(asset.applicationId);
  if (!configuredPath || !isAbsolute(configuredPath)) fail(`${asset.applicationId}: sourcePath must be absolute`);
  const sourceRoot = resolve(configuredPath);
  const manifestPath = resolve(sourceRoot, "showcase/manifest.json");
  if (!manifestPath.startsWith(`${sourceRoot}${sep}`) || !existsSync(manifestPath)) fail(`${asset.applicationId}: manifest missing`);

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.applicationId !== asset.applicationId || manifest.sourceCommit !== asset.sourceApplicationCommit) {
    fail(`${asset.id}: source identity or commit does not match the approved record`);
  }
  if (manifest.usesDemoData !== true || manifest.privacyReviewed !== true) fail(`${asset.id}: source manifest lacks demo/privacy approval`);
  const screenshot = manifest.screenshots?.find((item) => item.id === asset.screenshotId);
  if (!screenshot || screenshot.file !== asset.sourceFile) fail(`${asset.id}: approved screenshot is absent from the source manifest`);
  if (screenshot.width !== asset.width || screenshot.height !== asset.height) fail(`${asset.id}: approved dimensions drifted`);

  const input = resolve(sourceRoot, "showcase", asset.sourceFile);
  const showcaseRoot = resolve(sourceRoot, "showcase");
  if (!input.startsWith(`${showcaseRoot}${sep}`) || !existsSync(input)) fail(`${asset.id}: source image missing`);

  for (const width of asset.widths) {
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true, fit: "inside" });
    await pipeline.clone().avif({ quality: 72, effort: 6 }).toFile(resolve(outputRoot, `${asset.id}-${width}.avif`));
    await pipeline.clone().webp({ quality: 84, effort: 6 }).toFile(resolve(outputRoot, `${asset.id}-${width}.webp`));
  }
}

console.log(`[showcases:publish] published ${selectedShowcases.length} owner-approved screenshots`);
