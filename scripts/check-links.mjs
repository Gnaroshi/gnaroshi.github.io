#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const siteOrigin = "https://gnaroshi.dev";

if (!existsSync(dist)) fail("dist/ does not exist. Run npm run build first.");

const htmlFiles = listFiles(dist).filter((file) => extname(file) === ".html");
const failures = [];
let checked = 0;

for (const file of htmlFiles) {
  const source = readFileSync(file, "utf8");
  const hrefs = [...source.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const href of hrefs) {
    if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;

    let url;
    try {
      url = new URL(href, `${siteOrigin}${routeForFile(file)}`);
    } catch {
      failures.push(`${relative(root, file)}: invalid href ${href}`);
      continue;
    }

    if (url.origin !== siteOrigin) continue;
    checked += 1;
    const target = resolveBuiltTarget(decodeURIComponent(url.pathname));
    if (!target) failures.push(`${relative(root, file)}: ${href} has no built target`);
  }
}

if (failures.length > 0) {
  console.error("Internal link check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Internal link check passed (${checked} links across ${htmlFiles.length} HTML files).`);

function resolveBuiltTarget(pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const candidates = clean === ""
    ? [join(dist, "index.html")]
    : pathname.endsWith("/")
      ? [join(dist, clean, "index.html")]
      : [join(dist, clean), join(dist, `${clean}.html`), join(dist, clean, "index.html")];
  return candidates.find((candidate) => existsSync(candidate));
}

function routeForFile(file) {
  const path = `/${relative(dist, file).replaceAll("\\", "/")}`;
  return path.endsWith("/index.html") ? path.slice(0, -"index.html".length) : path;
}

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const target = join(directory, entry);
    if (statSync(target).isDirectory()) files.push(...listFiles(target));
    else files.push(target);
  }
  return files;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
