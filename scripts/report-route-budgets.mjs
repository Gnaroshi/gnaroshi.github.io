#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { parseHTML } from "linkedom";

const root = process.cwd();
const dist = join(root, "dist");
const budget = JSON.parse(readFileSync(join(root, "performance-budget.json"), "utf8"));
const writeReport = process.argv.includes("--write");
const rows = [];
const failures = [];

if (!existsSync(dist)) fail("dist/ does not exist. Run npm run build first.");

for (const [route, routeBudget] of Object.entries(budget.routes)) {
  const htmlPath = routeToFile(route);
  if (!existsSync(htmlPath)) {
    failures.push(`${route}: built HTML is missing`);
    continue;
  }

  const { document } = parseHTML(readFileSync(htmlPath, "utf8"));
  const styles = [...document.querySelectorAll('link[rel="stylesheet"]')].map((element) => element.getAttribute("href")).filter(Boolean);
  const scripts = [...document.querySelectorAll('script[src], link[rel="modulepreload"]')].map((element) => element.getAttribute("src") ?? element.getAttribute("href")).filter(Boolean);
  const eagerImages = [...document.querySelectorAll("img[src]")].filter((image) => image.getAttribute("loading") !== "lazy").map((image) => image.getAttribute("src")).filter(Boolean);
  const cssBytes = compressedLocalBytes(styles);
  const jsBytes = compressedLocalBytes(scripts);
  const imageBytes = rawLocalBytes(eagerImages);
  const islands = document.querySelectorAll("astro-island").length;
  const styleNames = styles.map((href) => href.split("/").at(-1));

  if (cssBytes > budget.shared.maxCssGzipBytes) failures.push(`${route}: CSS ${cssBytes} > ${budget.shared.maxCssGzipBytes}`);
  if (jsBytes > budget.shared.maxJsGzipBytes) failures.push(`${route}: JS ${jsBytes} > ${budget.shared.maxJsGzipBytes}`);
  if (imageBytes > budget.shared.maxInitialImageBytes) failures.push(`${route}: initial images ${imageBytes} > ${budget.shared.maxInitialImageBytes}`);
  if (islands > routeBudget.maxHydratedIslands) failures.push(`${route}: hydrated islands ${islands} > ${routeBudget.maxHydratedIslands}`);
  for (const forbidden of routeBudget.forbiddenStyles) {
    if (styleNames.some((name) => name.startsWith(`${forbidden}.`) || name.startsWith(`${forbidden}-`) || name.startsWith(`${forbidden}_`))) {
      failures.push(`${route}: loads forbidden ${forbidden} stylesheet`);
    }
  }

  rows.push({ route, kind: routeBudget.kind, cssBytes, jsBytes, imageBytes, islands, unusedCss: routeBudget.baselineUnusedCssPercent, styles: styleNames.join(", ") || "none" });
}

const markdown = [
  "# Route Budget Report",
  "",
  "Generated from the production `dist/` artifact by `npm run performance:report`.",
  "",
  "| Route | Kind | CSS gzip | JS gzip | Initial images | Islands | Unused CSS baseline | Stylesheets |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ...rows.map((row) => `| \`${row.route}\` | ${row.kind} | ${formatBytes(row.cssBytes)} | ${formatBytes(row.jsBytes)} | ${formatBytes(row.imageBytes)} | ${row.islands} | ${row.unusedCss}% | ${row.styles} |`),
  "",
  "Unused CSS baselines were measured with Chromium coverage in `npm run test:performance`; rerun that command when route composition changes.",
  "LCP and CLS are synthetic local checks. The 200 ms INP value remains a field target because a static build cannot produce representative real-user INP.",
  ""
].join("\n");

if (writeReport) {
  const reportPath = join(root, "docs/route-budget-report.md");
  writeFileSync(reportPath, markdown);
  console.log(`Wrote ${reportPath}`);
}

for (const row of rows) console.log(`${row.route.padEnd(12)} CSS ${formatBytes(row.cssBytes).padStart(9)} | JS ${formatBytes(row.jsBytes).padStart(9)} | images ${formatBytes(row.imageBytes).padStart(9)} | islands ${row.islands}`);
if (failures.length) fail(`Route performance budgets failed:\n- ${failures.join("\n- ")}`);
console.log(`Route performance budgets passed (${rows.length} routes).`);

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.replace(/^\//, ""), "index.html");
}

function localFile(url) {
  if (!url?.startsWith("/")) return null;
  const pathname = new URL(url, "https://gnaroshi.dev").pathname;
  const target = resolve(dist, `.${pathname}`);
  return target.startsWith(`${dist}/`) && existsSync(target) && !statSync(target).isDirectory() ? target : null;
}

function compressedLocalBytes(urls) {
  return [...new Set(urls)].reduce((total, url) => {
    const file = localFile(url);
    return total + (file ? gzipSync(readFileSync(file), { level: 9 }).byteLength : 0);
  }, 0);
}

function rawLocalBytes(urls) {
  return [...new Set(urls)].reduce((total, url) => {
    const file = localFile(url);
    return total + (file ? statSync(file).size : 0);
  }, 0);
}

function formatBytes(bytes) { return `${(bytes / 1024).toFixed(1)} KB`; }
function fail(message) { console.error(message); process.exit(1); }
