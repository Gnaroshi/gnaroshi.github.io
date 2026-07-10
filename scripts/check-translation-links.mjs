#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const origin = "https://gnaroshi.dev";
const routes = [
  "/", "/about/", "/research/", "/projects/", "/blog/", "/blog/archive/", "/papers/", "/growth/",
  "/queue/", "/reviews/", "/reviews/due/", "/formula/", "/questions/", "/implementations/", "/graph/", "/week/", "/now/", "/contact/"
];
const failures = [];

if (!existsSync(dist)) {
  console.error("Translation link check requires a completed build. Run npm run build first.");
  process.exit(1);
}

for (const route of routes) {
  checkPage(route, "en", route, `/ko${route}`);
  checkPage(`/ko${route}`, "ko", route, `/ko${route}`);
}

for (const slug of ["first-post", "paper-reading-method", "research-workflow"]) {
  checkPage(`/blog/${slug}/`, "en", `/blog/${slug}/`, `/ko/blog/${slug}/`);
  checkPage(`/ko/blog/${slug}/`, "ko", `/blog/${slug}/`, `/ko/blog/${slug}/`);
}

for (const relative of ["rss.xml", "ko/rss.xml", "sitemap-index.xml"]) {
  if (!existsSync(join(dist, relative))) failures.push(`missing ${relative}`);
}
const sitemapPath = join(dist, "sitemap-0.xml");
if (!existsSync(sitemapPath) || !readFileSync(sitemapPath, "utf8").includes(`${origin}/ko/`)) {
  failures.push("sitemap does not include Korean routes");
}

if (failures.length) {
  console.error("Translation link check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Translation link check passed (${routes.length * 2 + 6} localized pages, RSS, and sitemap).`);

function checkPage(route, locale, englishRoute, koreanRoute) {
  const file = routeToFile(route);
  if (!existsSync(file)) {
    failures.push(`${route}: missing built page`);
    return;
  }
  const html = readFileSync(file, "utf8");
  const canonical = `${origin}${route}`;
  if (!html.includes(`<html lang="${locale}"`)) failures.push(`${route}: html lang is not ${locale}`);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) failures.push(`${route}: incorrect canonical (${canonical})`);
  for (const [hreflang, href] of [["en", englishRoute], ["ko", koreanRoute], ["x-default", englishRoute]]) {
    if (!html.includes(`hreflang="${hreflang}" href="${origin}${href}"`)) failures.push(`${route}: missing ${hreflang} alternate`);
  }
  const counterpart = locale === "en" ? koreanRoute : englishRoute;
  if (!html.includes(`href="${counterpart}"`)) failures.push(`${route}: language switch does not link to ${counterpart}`);
}

function routeToFile(route) {
  if (route === "/") return join(dist, "index.html");
  return join(dist, route.replace(/^\//, ""), "index.html");
}
