#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { parseHTML } from "linkedom";

const root = resolve(".");
const dist = join(root, "dist");
const failures = [];
const today = new Date().toISOString().slice(0, 10);

if (!existsSync(dist)) {
  console.error("Public tone check requires a current dist/ build.");
  process.exit(1);
}

const forbiddenEverywhere = [
  "AI researcher and software engineer",
  "AI researcher",
  "software engineer working on VLA systems",
  "AI 연구자이자 소프트웨어 엔지니어",
  "비전-언어-행동 시스템을 다루는 AI 연구자",
  "AI 연구자",
  "South Korea",
  "대한민국"
];

const forbiddenOutsideTechnicalProject = [
  "public projection",
  "deterministic public",
  "evidence eligibility",
  "canonical source",
  "공개 projection",
  "결정론적 공개",
  "자격 규칙",
  "근거 중심의 공개 표현"
];

const approvedTechnicalRoutes = new Set([
  "/projects/gnaroshi-dev/",
  "/ko/projects/gnaroshi-dev/"
]);

const requiredLocalePairs = [
  "/",
  "/about/",
  "/research/",
  "/projects/",
  "/projects/gnaroshi-vla/",
  "/projects/gnaroshi-dev/",
  "/blog/",
  "/blog/archive/",
  "/papers/",
  "/growth/",
  "/queue/",
  "/reviews/",
  "/formula/",
  "/questions/",
  "/implementations/",
  "/graph/",
  "/week/",
  "/now/",
  "/contact/"
];

const htmlFiles = (await filesUnder(dist)).filter((file) => file.endsWith(".html"));
const routes = new Map();
const introductions = new Map();

for (const file of htmlFiles) {
  const route = routeForFile(file);
  const html = await readFile(file, "utf8");
  const { document } = parseHTML(html);
  routes.set(route, { file, document, html });

  for (const phrase of forbiddenEverywhere) {
    if (html.toLocaleLowerCase().includes(phrase.toLocaleLowerCase())) {
      failures.push(`${route}: unsupported title or location phrase ${JSON.stringify(phrase)}`);
    }
  }

  if (!approvedTechnicalRoutes.has(route)) {
    for (const phrase of forbiddenOutsideTechnicalProject) {
      if (html.toLocaleLowerCase().includes(phrase.toLocaleLowerCase())) {
        failures.push(`${route}: internal implementation phrase ${JSON.stringify(phrase)}`);
      }
    }
  }

  if (document.querySelector(".identity-hero > .identity-hero__copy > .eyebrow")) {
    failures.push(`${route}: Home Hero still has a location/role eyebrow`);
  }
  if (document.querySelector(".profile-facts")) failures.push(`${route}: role/location fact row remains`);

  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const value = script.textContent ?? "";
    if (/"(?:jobTitle|homeLocation|affiliation|alumniOf)"\s*:/.test(value)) {
      failures.push(`${route}: unapproved Person structured-data field`);
    }
  }

  const pageIntroductions = [...document.querySelectorAll(".page-header > .lede, .paper-hero .lede, .identity-hero__bio")]
    .filter((element) => !element.closest("[hidden]"))
    .map((element) => normalize(element.textContent))
    .filter(Boolean);
  for (const introduction of new Set(pageIntroductions)) {
    const owners = introductions.get(introduction) ?? [];
    owners.push(route);
    introductions.set(introduction, owners);
  }

  for (const element of document.querySelectorAll("time[datetime], meta[property='article:published_time'], meta[property='article:modified_time']")) {
    const raw = element.getAttribute("datetime") ?? element.getAttribute("content") ?? "";
    const date = raw.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date > today) failures.push(`${route}: future date ${date}`);
  }

  if (/\b(?:TODO|TBD|placeholder|lorem ipsum|to be updated)\b|번역\s*(?:필요|예정)|임시\s*문구/i.test(document.body?.textContent ?? "")) {
    failures.push(`${route}: placeholder copy`);
  }

  if (route === "/" || route === "/ko/") {
    const lines = [...document.querySelectorAll(".identity-hero__headline > span")].map((element) => normalize(element.textContent));
    const expected = route === "/"
      ? ["I study AI systems", "and build software for research."]
      : ["AI 시스템을 공부하고,", "연구에 필요한 소프트웨어를 만듭니다."];
    if (JSON.stringify(lines) !== JSON.stringify(expected)) failures.push(`${route}: Hero line breaks changed (${JSON.stringify(lines)})`);
  }

  if (route.startsWith("/ko/")) {
    for (const button of document.querySelectorAll("a.button, button")) {
      const label = normalize(button.textContent);
      if ([...label].length > 24) failures.push(`${route}: Korean button label is too long for 360px (${JSON.stringify(label)})`);
    }
  }
}

for (const [introduction, owners] of introductions) {
  const distinctRoutes = [...new Set(owners)];
  if (distinctRoutes.length > 1) failures.push(`duplicate page introduction on ${distinctRoutes.join(", ")}: ${JSON.stringify(introduction)}`);
}

for (const englishRoute of requiredLocalePairs) {
  const koreanRoute = englishRoute === "/" ? "/ko/" : `/ko${englishRoute}`;
  if (!routes.has(englishRoute)) failures.push(`missing English route ${englishRoute}`);
  if (!routes.has(koreanRoute)) failures.push(`missing Korean route ${koreanRoute}`);
  const english = routes.get(englishRoute)?.document;
  const korean = routes.get(koreanRoute)?.document;
  if (english && korean) {
    for (const selector of ["h1", "main section", "main nav"]) {
      const enCount = english.querySelectorAll(selector).length;
      const koCount = korean.querySelectorAll(selector).length;
      if (enCount !== koCount) failures.push(`${englishRoute} / ${koreanRoute}: structural mismatch for ${selector} (${enCount} vs ${koCount})`);
    }
  }
}

if (failures.length) {
  console.error("Public tone check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public tone check passed (${htmlFiles.length} HTML files, ${requiredLocalePairs.length} EN/KO route pairs).`);

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
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
