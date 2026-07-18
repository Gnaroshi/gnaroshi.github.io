#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { DOMParser, parseHTML } from "linkedom";

const root = process.cwd();
const dist = join(root, "dist");
const siteOrigin = "https://gnaroshi.dev";
const failures = [];
const htmlFiles = existsSync(dist) ? listFiles(dist).filter((file) => extname(file) === ".html") : [];
const documents = new Map(htmlFiles.map((file) => [file, parseHTML(readFileSync(file, "utf8")).document]));
const redirectMap = new Map();
let checked = 0;

if (!existsSync(dist)) fail("dist/ does not exist. Run npm run build first.");

for (const file of listFiles(dist).filter((candidate) => [".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"].includes(extname(candidate)))) {
  const source = readFileSync(file, "utf8");
  if (/\/(?:Users|home)\/|[A-Za-z]:\\Users\\|\/mnt\/(?:data|datasets|workspace)\//.test(source)) failures.push(`${relative(root, file)}: contains a local user, server, or dataset path`);
}

for (const [file, document] of documents) {
  const label = relative(root, file);
  const route = routeForFile(file);
  const canonical = document.querySelectorAll('link[rel="canonical"]');
  if (canonical.length !== 1) failures.push(`${label}: expected exactly one canonical link, found ${canonical.length}`);
  for (const element of canonical) validateInternalTarget(file, route, element.getAttribute("href"), "canonical", { allowFragment: false });

  const redirect = document.querySelector('meta[http-equiv="refresh" i]');
  if (redirect) {
    const match = redirect.getAttribute("content")?.match(/url=(.+)$/i);
    if (!match) failures.push(`${label}: redirect has no target`);
    else {
      const target = new URL(match[1].trim(), `${siteOrigin}${route}`);
      redirectMap.set(route, target.pathname);
      validateInternalTarget(file, route, target.toString(), "redirect", { allowFragment: false });
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
      if (!robots.toLowerCase().includes("noindex")) failures.push(`${label}: redirect must be noindex`);
    }
  }

  for (const element of document.querySelectorAll("a[href], link[href]")) {
    const href = element.getAttribute("href");
    const relation = element.localName === "link" ? element.getAttribute("rel") ?? "link" : "link";
    if (element.localName === "a" && element.getAttribute("target") === "_blank") {
      const rel = new Set((element.getAttribute("rel") ?? "").split(/\s+/));
      if (!rel.has("noopener") || !rel.has("noreferrer")) failures.push(`${label}: target=_blank requires noopener noreferrer (${href})`);
    }
    validateHref(file, route, href, relation);
    if (element.localName === "a") validateCanonicalAnchor(file, route, href);
  }

  for (const element of document.querySelectorAll("script[src], img[src], source[src], video[src], link[href]")) {
    const value = element.getAttribute("src") ?? element.getAttribute("href");
    if (value && isAssetElement(element)) validateAsset(file, route, value);
  }
  for (const element of document.querySelectorAll("img[srcset], source[srcset], link[imagesrcset]")) {
    const value = element.getAttribute("srcset") ?? element.getAttribute("imagesrcset") ?? "";
    for (const candidate of value.split(",").map((item) => item.trim().split(/\s+/)[0]).filter(Boolean)) validateAsset(file, route, candidate);
  }

  for (const element of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
    validateInternalTarget(file, route, element.getAttribute("href"), `hreflang ${element.getAttribute("hreflang")}`, { allowFragment: false, rejectRedirect: true });
  }
  for (const element of document.querySelectorAll('link[rel="alternate"][type="application/rss+xml"]')) {
    validateInternalTarget(file, route, element.getAttribute("href"), "RSS", { allowFragment: false });
  }

  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.textContent);
      const records = Array.isArray(data) ? data : [data];
      if (records.some((record) => !record?.["@context"] || (!record?.["@type"] && !record?.["@graph"]))) failures.push(`${label}: JSON-LD lacks @context or type/graph`);
    } catch (error) {
      failures.push(`${label}: invalid JSON-LD (${error.message})`);
    }
  }

  if (route === "/404.html" || route === "/ko/404/") requireNoindex(document, label);
  if (route.startsWith("/dev-diagnostics/")) requireNoindex(document, label);
}

for (const [source] of redirectMap) {
  const seen = new Set([source]);
  let target = redirectMap.get(source);
  while (target && redirectMap.has(target)) {
    if (seen.has(target)) {
      failures.push(`${source}: redirect loop detected through ${target}`);
      break;
    }
    seen.add(target);
    target = redirectMap.get(target);
  }
}

validateSitemaps();
validateRss();

if (failures.length) fail(`Built-site validation failed:\n- ${failures.join("\n- ")}`);
console.log(`Built-site link, metadata, fragment, asset, redirect, RSS, sitemap, and privacy checks passed (${checked} internal targets across ${htmlFiles.length} HTML files).`);

function validateHref(file, route, href, relation) {
  if (!href) return failures.push(`${relative(root, file)}: empty ${relation}`);
  if (/^(javascript|file):/i.test(href)) return failures.push(`${relative(root, file)}: unsafe URL scheme ${href}`);
  if (/^data:/i.test(href)) return failures.push(`${relative(root, file)}: data URL is not allowed in href`);
  if (/^(mailto|tel):/i.test(href)) return;
  validateInternalTarget(file, route, href, relation, { allowFragment: true });
}

function validateCanonicalAnchor(file, route, value) {
  if (!value || /^(?:mailto|tel|javascript|file|data):/i.test(value)) return;
  let url;
  try { url = new URL(value, `${siteOrigin}${route}`); } catch { return; }
  if (url.origin !== siteOrigin || url.pathname === "/" || url.pathname.endsWith("/")) return;
  const target = resolveBuiltTarget(decodeURIComponent(url.pathname));
  if (target?.endsWith("/index.html")) {
    failures.push(`${relative(root, file)}: internal page link must use canonical trailing slash (${value})`);
  }
}

function validateInternalTarget(file, route, value, relation, options = {}) {
  if (!value) return failures.push(`${relative(root, file)}: empty ${relation}`);
  let url;
  try { url = new URL(value, `${siteOrigin}${route}`); }
  catch { return failures.push(`${relative(root, file)}: invalid ${relation} ${value}`); }
  if (url.origin !== siteOrigin) return;
  checked += 1;
  const target = resolveBuiltTarget(decodeURIComponent(url.pathname));
  if (!target) return failures.push(`${relative(root, file)}: ${relation} ${value} has no built target`);
  if (options.rejectRedirect && documents.get(target)?.querySelector('meta[http-equiv="refresh" i]')) failures.push(`${relative(root, file)}: ${relation} points to redirect ${value}`);
  if (url.hash && options.allowFragment !== false) {
    const id = decodeURIComponent(url.hash.slice(1));
    const targetDocument = documents.get(target);
    if (targetDocument && ![...targetDocument.querySelectorAll("[id], a[name]")].some((element) => element.getAttribute("id") === id || element.getAttribute("name") === id)) {
      failures.push(`${relative(root, file)}: fragment ${value} has no target`);
    }
  }
}

function validateAsset(file, route, value) {
  if (/^data:/i.test(value)) {
    if (!/^data:image\/(?:avif|gif|jpeg|png|webp);/i.test(value)) failures.push(`${relative(root, file)}: unsafe data asset ${value.slice(0, 32)}`);
    return;
  }
  if (/^(javascript|file):/i.test(value)) return failures.push(`${relative(root, file)}: unsafe asset scheme ${value}`);
  let url;
  try { url = new URL(value, `${siteOrigin}${route}`); } catch { return failures.push(`${relative(root, file)}: invalid asset URL ${value}`); }
  if (url.origin !== siteOrigin) return;
  const target = resolveBuiltTarget(decodeURIComponent(url.pathname));
  if (!target) failures.push(`${relative(root, file)}: asset ${value} has no built target`);
}

function validateSitemaps() {
  const parser = new DOMParser();
  const indexPath = join(dist, "sitemap-index.xml");
  if (!existsSync(indexPath)) return failures.push("sitemap-index.xml is missing");
  const index = parser.parseFromString(readFileSync(indexPath, "utf8"), "application/xml");
  for (const loc of index.querySelectorAll("loc")) {
    const sitemapPath = join(dist, basename(new URL(loc.textContent).pathname));
    if (!existsSync(sitemapPath)) { failures.push(`sitemap index target is missing: ${loc.textContent}`); continue; }
    const sitemap = parser.parseFromString(readFileSync(sitemapPath, "utf8"), "application/xml");
    for (const page of sitemap.querySelectorAll("url > loc")) {
      const url = new URL(page.textContent);
      const target = resolveBuiltTarget(url.pathname);
      if (!target) { failures.push(`sitemap target is missing: ${url}`); continue; }
      const document = documents.get(target);
      const robots = document?.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
      if (robots.toLowerCase().includes("noindex")) failures.push(`sitemap includes noindex route: ${url.pathname}`);
      if (document?.querySelector('meta[http-equiv="refresh" i]')) failures.push(`sitemap includes redirect route: ${url.pathname}`);
    }
  }
}

function validateRss() {
  const parser = new DOMParser();
  for (const rssPath of [join(dist, "rss.xml"), join(dist, "ko/rss.xml")]) {
    if (!existsSync(rssPath)) { failures.push(`${relative(root, rssPath)} is missing`); continue; }
    const rss = parser.parseFromString(readFileSync(rssPath, "utf8"), "application/xml");
    for (const link of rss.querySelectorAll("item > link")) {
      const url = new URL(link.textContent);
      if (url.origin === siteOrigin && !resolveBuiltTarget(url.pathname)) failures.push(`${relative(root, rssPath)}: item target is missing ${url.pathname}`);
    }
  }
}

function requireNoindex(document, label) {
  const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  if (!robots.toLowerCase().includes("noindex")) failures.push(`${label}: must be noindex`);
}

function isAssetElement(element) {
  if (element.localName === "a") return false;
  if (element.localName === "link") return ["stylesheet", "icon", "preload", "modulepreload"].includes(element.getAttribute("rel") ?? "");
  return true;
}

function resolveBuiltTarget(pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const candidates = clean === "" ? [join(dist, "index.html")] : pathname.endsWith("/") ? [join(dist, clean, "index.html")] : [join(dist, clean), join(dist, `${clean}.html`), join(dist, clean, "index.html")];
  return candidates.find((candidate) => existsSync(candidate));
}

function routeForFile(file) {
  const path = `/${relative(dist, file).replaceAll("\\", "/")}`;
  return path.endsWith("/index.html") ? path.slice(0, -"index.html".length) : path;
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const target = join(directory, entry);
    return statSync(target).isDirectory() ? listFiles(target) : [target];
  });
}

function fail(message) { console.error(message); process.exit(1); }
