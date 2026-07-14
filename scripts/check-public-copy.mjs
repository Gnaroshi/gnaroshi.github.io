#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { parseHTML } from "linkedom";

const root = resolve(".");
const dist = join(root, "dist");
const failures = [];

if (!existsSync(dist)) {
  console.error("Public copy check requires a current dist/ build.");
  process.exit(1);
}

const forbiddenPhrases = [
  "editable in",
  "src/data",
  "placeholder",
  "to be updated",
  "todo",
  "planned sample",
  "example:",
  "draft posts are hidden",
  "public placeholder",
  "add a public email",
  "scaffold",
  "ai researcher and software engineer",
  "south korea",
  "research cockpit",
  "paper reading tracker"
];

const retiredLabels = new Set([
  "Papers",
  "My Papers",
  "Publications",
  "내 논문",
  "출판 논문",
  "AI Review",
  "Oral Exam",
  "Reading Process Score",
  "Research Growth",
  "Weak Dimension",
  "구술 연습",
  "AI 리뷰"
]);

const labelSelectors = [
  "nav a",
  "nav span",
  ".breadcrumbs a",
  ".breadcrumbs span",
  "button",
  ".eyebrow",
  "h1",
  "h2",
  "title"
].join(",");

const htmlFiles = (await filesUnder(dist)).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const route = routeForFile(file);
  const html = await readFile(file, "utf8");
  const { document } = parseHTML(html);
  for (const element of document.querySelectorAll("script, style, template, noscript")) element.remove();
  const publicText = normalize(document.documentElement?.textContent).toLocaleLowerCase("en");

  for (const phrase of forbiddenPhrases) {
    if (publicText.includes(phrase)) failures.push(`${route}: forbidden public phrase ${JSON.stringify(phrase)}`);
  }

  for (const element of document.querySelectorAll(labelSelectors)) {
    const label = normalize(element.textContent);
    if (retiredLabels.has(label)) failures.push(`${route}: retired public label ${JSON.stringify(label)}`);
  }

  for (const link of document.querySelectorAll("a")) {
    const href = link.getAttribute("href");
    if (href === "" || href === null) failures.push(`${route}: empty link destination for ${JSON.stringify(normalize(link.textContent))}`);
    if (href?.startsWith("mailto:") && href === "mailto:") failures.push(`${route}: empty email link`);
  }
}

if (failures.length) {
  console.error("Public copy check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Public copy check passed (${htmlFiles.length} HTML files).`);

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
