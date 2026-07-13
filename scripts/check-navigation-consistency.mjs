#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { parseHTML } from "linkedom";

const dist = resolve("dist");
const failures = [];
const signatures = { en: new Map(), ko: new Map() };

if (!existsSync(dist)) {
  console.error("Navigation consistency check requires a current dist/ build.");
  process.exit(1);
}

for (const file of (await filesUnder(dist)).filter((path) => path.endsWith(".html"))) {
  const route = routeForFile(file);
  const { document } = parseHTML(await readFile(file, "utf8"));
  const header = document.querySelector(".site-header");
  if (!header) continue;
  const locale = document.documentElement?.getAttribute("lang") === "ko" ? "ko" : "en";
  const desktop = navItems(document.querySelector(".desktop-nav"));
  const utility = navItems(document.querySelector(".utility-nav"));
  const mobile = navItems(document.querySelector("[data-mobile-nav-panel] nav"));
  const expectedMobile = [...desktop, ...utility];
  if (JSON.stringify(mobile) !== JSON.stringify(expectedMobile)) {
    failures.push(`${route}: mobile navigation differs from desktop and utility navigation`);
  }
  signatures[locale].set(route, normalizeItems(expectedMobile));
}

for (const locale of ["en", "ko"]) {
  const entries = [...signatures[locale].entries()];
  const baseline = entries[0]?.[1] ?? [];
  for (const [route, signature] of entries) {
    if (JSON.stringify(signature) !== JSON.stringify(baseline)) {
      failures.push(`${route}: ${locale} navigation capability signature differs (${signature.join("|")} vs ${baseline.join("|")})`);
    }
  }
}

const enBaseline = [...signatures.en.values()][0] ?? [];
const koBaseline = [...signatures.ko.values()][0] ?? [];
if (JSON.stringify(enBaseline) !== JSON.stringify(koBaseline)) {
  failures.push(`English and Korean navigation destinations differ (${enBaseline.join("|")} vs ${koBaseline.join("|")})`);
}

if (failures.length) {
  console.error("Navigation consistency check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Navigation consistency check passed (${signatures.en.size} EN routes, ${signatures.ko.size} KO routes).`);

function navItems(root) {
  if (!root) return [];
  return [...root.querySelectorAll("[data-nav-href]")].map((item) => item.getAttribute("data-nav-href"));
}

function normalizeItems(items) {
  return items.map((href) => String(href).replace(/^\/ko(?=\/|$)/, "").replace(/\/$/, "") || "/");
}

function routeForFile(file) {
  const path = relative(dist, file).split(sep).join("/");
  if (path === "index.html") return "/";
  if (path.endsWith("/index.html")) return `/${path.slice(0, -"index.html".length)}`;
  return `/${path}`;
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}
