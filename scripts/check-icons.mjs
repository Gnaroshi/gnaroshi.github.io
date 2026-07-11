import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { iconRegistry } from "../src/components/icons/iconRegistry.ts";

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

const names = new Set();
for (const icon of iconRegistry) {
  if (names.has(icon.name)) failures.push(`${icon.name}: duplicate registry entry`);
  names.add(icon.name);
  if (icon.component.viewBox !== "0 0 24 24") failures.push(`${icon.name}: viewBox must be 0 0 24 24`);
  if (icon.component.strokeWidth !== 1.8) failures.push(`${icon.name}: stroke width must be 1.8`);
  if (icon.component.paths.length < 1 || icon.component.paths.length > 4) failures.push(`${icon.name}: expected 1-4 paths`);
  if (!icon.usedBy.length) failures.push(`${icon.name}: no intended use is recorded`);
  for (const path of icon.component.paths) {
    if (!path.d.trim()) failures.push(`${icon.name}: empty path`);
    if (path.fill && path.fill !== "currentColor") failures.push(`${icon.name}: hardcoded fill`);
  }
}

const iconComponents = (await walk(join(root, "src/components/icons"))).filter((path) => path.endsWith(".astro"));
for (const path of iconComponents) {
  const source = await readFile(path, "utf8");
  if (!source.includes('viewBox="0 0 24 24"')) failures.push(`${relative(root, path)}: missing 24x24 viewBox`);
  if (/stroke="(?!currentColor)[#a-z]/i.test(source)) failures.push(`${relative(root, path)}: hardcoded stroke color`);
}

const uiFiles = (await walk(join(root, "src/components"))).filter((path) => /\.(astro|tsx)$/.test(path));
const legacyUnicode = new Set(policy.legacyUnicodeUiAllowlist.map((item) => `${item.file}:${item.symbol}`));
const knownUiSymbols = ["↗", "→", "←", "☀", "☾", "✓", "⚠", "🔍", "📄", "🎤"];
for (const path of uiFiles) {
  const source = await readFile(path, "utf8");
  for (const symbol of knownUiSymbols) {
    if (!source.includes(symbol)) continue;
    const key = `${relative(root, path)}:${symbol}`;
    if (legacyUnicode.has(key) && policy.stage === "candidate-review") warnings.push(`${key} remains behind the Stage 1 approval gate`);
    else failures.push(`${key}: Unicode UI icon is not allowed`);
  }
  const sourceWithoutKnownSymbols = knownUiSymbols.reduce((value, symbol) => value.replaceAll(symbol, ""), source);
  if (/\p{Extended_Pictographic}/u.test(sourceWithoutKnownSymbols)) failures.push(`${relative(root, path)}: emoji is used in UI source`);
}

const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
for (const dependency of Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })) {
  if (/lucide|heroicons|fontawesome|react-icons/.test(dependency)) failures.push(`${dependency}: mixed/large icon library is not allowed`);
}

const sun = await readFile(join(root, "src/components/icons/SunIcon.astro"), "utf8");
const moon = await readFile(join(root, "src/components/icons/MoonIcon.astro"), "utf8");
for (const source of [sun, moon]) {
  if (!source.includes('viewBox="0 0 24 24"')) failures.push("Sun and Moon must share a 24x24 canvas");
}

warnings.push("Theme toggle remains below the target 44px touch size on desktop until Stage 2 production integration");
for (const warning of [...new Set(warnings)]) console.warn(`[icons:check] warning: ${warning}`);
if (failures.length) {
  for (const failure of failures) console.error(`[icons:check] ${failure}`);
  process.exit(1);
}
console.log(`[icons:check] passed (${iconRegistry.length} review candidates, ${iconComponents.length} Astro icon primitives, stage ${policy.stage})`);
