#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { DOMParser, parseHTML } from "linkedom";

const dist = join(process.cwd(), "dist");
const indexPath = join(dist, "sitemap-index.xml");
if (!existsSync(indexPath)) process.exit(0);

const parser = new DOMParser();
const index = parser.parseFromString(readFileSync(indexPath, "utf8"), "application/xml");
let removed = 0;

for (const loc of index.querySelectorAll("loc")) {
  const sitemapPath = join(dist, basename(new URL(loc.textContent).pathname));
  if (!existsSync(sitemapPath)) continue;
  const sitemap = parser.parseFromString(readFileSync(sitemapPath, "utf8"), "application/xml");
  for (const url of sitemap.querySelectorAll("url")) {
    const pageUrl = url.querySelector("loc")?.textContent;
    const htmlPath = pageUrl ? resolveHtml(new URL(pageUrl).pathname) : null;
    if (!htmlPath || !isIndexable(htmlPath)) {
      url.remove();
      removed += 1;
    }
  }
  writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n${sitemap.documentElement.toString()}\n`);
}

console.log(`Sitemap indexing rules applied (${removed} noindex or redirect routes removed).`);

function isIndexable(file) {
  const { document } = parseHTML(readFileSync(file, "utf8"));
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content")?.toLowerCase() ?? "";
  return !robots.includes("noindex") && !document.querySelector('meta[http-equiv="refresh" i]');
}

function resolveHtml(pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const candidates = clean === "" ? [join(dist, "index.html")] : [join(dist, clean, "index.html"), join(dist, clean), join(dist, `${clean}.html`)];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}
