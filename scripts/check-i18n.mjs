#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const root = process.cwd();
const en = await loadDictionary(join(root, "src", "i18n", "en.ts"), "en");
const ko = await loadDictionary(join(root, "src", "i18n", "ko.ts"), "ko");
const islandMessages = await loadExports(join(root, "src", "i18n", "islands.ts"));
const failures = [];
const englishKeys = Object.keys(en).sort();
const koreanKeys = Object.keys(ko).sort();
const allowedCopies = new Set(["site.name", "nav.rss", "nav.github"]);
const properNounPattern = /^(Gnaroshi|GitHub|Astro|React|MDX|RSS|AI)$/;

for (const key of englishKeys.filter((key) => !(key in ko))) failures.push(`missing Korean key: ${key}`);
for (const key of koreanKeys.filter((key) => !(key in en))) failures.push(`extra Korean key: ${key}`);

for (const key of englishKeys) {
  for (const [locale, value] of [["en", en[key]], ["ko", ko[key]]]) {
    if (typeof value !== "string" || value.trim() === "") failures.push(`${locale}.${key}: empty translation`);
    if (/\b(TODO|TBD|placeholder|lorem ipsum)\b|번역\s*(필요|예정)|임시\s*문구/i.test(String(value))) {
      failures.push(`${locale}.${key}: placeholder translation`);
    }
  }
  if (en[key] === ko[key] && !allowedCopies.has(key) && !properNounPattern.test(en[key])) {
    failures.push(`ko.${key}: accidental English copy (${JSON.stringify(ko[key])})`);
  }
  const enParams = [...en[key].matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
  const koParams = [...ko[key].matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
  if (enParams.join("|") !== koParams.join("|")) failures.push(`${key}: interpolation parameter mismatch`);
}

if (failures.length) {
  console.error("i18n dictionary check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const englishIsland = flatten(islandMessages.enIslandMessages);
const koreanIsland = flatten(islandMessages.koIslandMessages);
for (const key of Object.keys(englishIsland).filter((key) => !(key in koreanIsland))) failures.push(`missing Korean island key: ${key}`);
for (const key of Object.keys(koreanIsland).filter((key) => !(key in englishIsland))) failures.push(`extra Korean island key: ${key}`);
for (const [key, value] of Object.entries(koreanIsland)) {
  if (typeof value !== "string" || value.trim() === "") failures.push(`ko island ${key}: empty translation`);
  if (/\b(TODO|TBD|placeholder|lorem ipsum)\b|번역\s*(필요|예정)|임시\s*문구/i.test(String(value))) failures.push(`ko island ${key}: placeholder translation`);
  if (englishIsland[key] === value && !/^(GitHub|Astro|React|MDX|RSS|AI|arXiv|Git|Markdown|Code|Paper|Project|low|medium|high)$/.test(String(value))) {
    failures.push(`ko island ${key}: accidental English copy (${JSON.stringify(value)})`);
  }
}

if (failures.length) {
  console.error("i18n dictionary check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`i18n dictionary check passed (${englishKeys.length} page keys and ${Object.keys(englishIsland).length} island keys with exact en/ko parity).`);

async function loadDictionary(file, exportName) {
  return (await loadExports(file))[exportName];
}

async function loadExports(file) {
  const source = readFileSync(file, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  const module = await import(url);
  return module;
}

function flatten(value, prefix = "", result = {}) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(child)) child.forEach((item, index) => { result[`${path}.${index}`] = item; });
    else if (child && typeof child === "object") flatten(child, path, result);
    else result[path] = child;
  }
  return result;
}
