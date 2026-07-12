import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, isAbsolute, resolve, sep } from "node:path";
import sharp from "sharp";

const configPath = resolve(process.env.PROJECT_SHOWCASE_CONFIG ?? ".project-showcases.local.json");
const outputRoot = resolve("artifacts/project-showcases");
const metadataPath = resolve(outputRoot, "candidates.json");
const supportedApplications = new Set(["gnaroshi-studio", "paperflow", "arxiv-discovery", "runshelf", "tr-gpu-monitor", "contentdeck"]);
const required = ["schemaVersion", "applicationId", "applicationVersion", "sourceCommit", "scenarioId", "usesDemoData", "captureDate", "captureCommand", "sourceFiles", "privacyReviewed", "screenshots"];
const secretPattern = /(api[_-]?key|token|secret|password|authorization|bearer\s+[a-z0-9._-]+)/i;
const privatePathPattern = /(?:\/Users\/|~\/|[A-Z]:\\|\.ssh|Library\/Application Support)/i;

function fail(message) { throw new Error(`[showcases:import] ${message}`); }
function assertRelative(value, label) { if (typeof value !== "string" || isAbsolute(value) || value.includes("..") || privatePathPattern.test(value)) fail(`${label} must be a public-safe relative path`); }

if (!existsSync(configPath)) fail(`Missing untracked config: ${configPath}. Copy project-showcases.config.example.json to .project-showcases.local.json.`);
const config = JSON.parse(await readFile(configPath, "utf8"));
if (!Array.isArray(config.applications) || config.applications.length === 0) fail("applications must be a non-empty array");

await mkdir(outputRoot, { recursive: true });
const candidates = [];
for (const application of config.applications) {
  if (!supportedApplications.has(application.id)) fail(`Unsupported application id: ${application.id}`);
  if (!isAbsolute(application.sourcePath)) fail(`${application.id} sourcePath must be explicit and absolute in the untracked config`);
  const sourceRoot = resolve(application.sourcePath);
  const manifestPath = resolve(sourceRoot, "showcase/manifest.json");
  if (!manifestPath.startsWith(`${sourceRoot}${sep}`) || !existsSync(manifestPath)) fail(`${application.id} is missing showcase/manifest.json`);
  const raw = await readFile(manifestPath, "utf8");
  if (secretPattern.test(raw) || privatePathPattern.test(raw)) fail(`${application.id} manifest contains a secret-like value or private path`);
  const manifest = JSON.parse(raw);
  for (const field of required) if (!(field in manifest)) fail(`${application.id} manifest is missing ${field}`);
  if (manifest.schemaVersion !== 1 || manifest.applicationId !== application.id) fail(`${application.id} manifest identity/schema mismatch`);
  if (manifest.usesDemoData !== true || manifest.privacyReviewed !== true) fail(`${application.id} must disclose demo data and pass privacy review`);
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceCommit)) fail(`${application.id} sourceCommit must be a full Git SHA`);
  for (const file of manifest.sourceFiles) assertRelative(file, `${application.id} sourceFiles`);
  if (!Array.isArray(manifest.screenshots) || manifest.screenshots.length === 0) fail(`${application.id} has no screenshots to review`);

  for (const screenshot of manifest.screenshots) {
    for (const field of ["id", "file", "width", "height", "stepId", "locale", "theme", "alt"]) if (!(field in screenshot)) fail(`${application.id} screenshot is missing ${field}`);
    assertRelative(screenshot.file, `${application.id} screenshot file`);
    if (!screenshot.alt.trim() || secretPattern.test(screenshot.alt) || privatePathPattern.test(screenshot.alt)) fail(`${application.id}/${screenshot.id} has unsafe alt text`);
    const input = resolve(sourceRoot, "showcase", screenshot.file);
    if (!input.startsWith(`${resolve(sourceRoot, "showcase")}${sep}`) || !existsSync(input)) fail(`${application.id}/${screenshot.id} source image is missing`);
    const metadata = await sharp(input).metadata();
    if (metadata.width !== screenshot.width || metadata.height !== screenshot.height) fail(`${application.id}/${screenshot.id} dimensions do not match the manifest`);
    const stem = `${application.id}-${screenshot.id}`.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const directory = resolve(outputRoot, application.id);
    await mkdir(directory, { recursive: true });
    const avif = resolve(directory, `${stem}.avif`);
    const webp = resolve(directory, `${stem}.webp`);
    await sharp(input).resize(1600, 1000, { fit: "cover", position: "centre" }).avif({ quality: 72, effort: 6 }).toFile(avif);
    await sharp(input).resize(1600, 1000, { fit: "cover", position: "centre" }).webp({ quality: 84, effort: 6 }).toFile(webp);
    candidates.push({ applicationId: application.id, sourceCommit: manifest.sourceCommit, scenarioId: manifest.scenarioId, usesDemoData: true, privacyReviewed: true, ...screenshot, sourceFile: screenshot.file, avif: `${application.id}/${basename(avif)}`, webp: `${application.id}/${basename(webp)}` });
  }
}
await writeFile(metadataPath, `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), candidates }, null, 2)}\n`);
console.log(`[showcases:import] prepared ${candidates.length} review candidates; nothing was published`);
