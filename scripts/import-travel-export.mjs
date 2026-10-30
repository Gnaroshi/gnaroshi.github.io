#!/usr/bin/env node

import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? "" : args[index + 1] ?? "";
};
const source = resolve(option("source") || ".");
const slug = option("slug");
const sourceCommit = option("source-commit");
const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
if (!option("source") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "skeleton") {
  throw new Error("Provide --source <reviewed export directory> and --slug <trip slug>; skeleton is not public.");
}
if (!/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error("--source-commit must be the exact 40-character travel source SHA.");

const textExtensions = new Set([".html", ".css", ".js", ".json", ".webmanifest", ".txt"]);
const allowedExtensions = new Set([...textExtensions, ".png", ".webp", ".jpg", ".jpeg", ".avif", ".ico"]);
const files = [];
async function inspect(directory, prefix = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const path = join(directory, entry.name);
    const info = await lstat(path);
    if (info.isSymbolicLink() || entry.name.startsWith(".") || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(entry.name)) {
      throw new Error(`Unsafe export entry: ${relativePath}`);
    }
    if (info.isDirectory()) { await inspect(path, relativePath); continue; }
    if (!info.isFile() || !allowedExtensions.has(extname(entry.name).toLowerCase()) || info.size > 5_000_000) {
      throw new Error(`Export contains a non-public attachment or unsupported asset: ${relativePath}`);
    }
    const bytes = await readFile(path);
    if (textExtensions.has(extname(entry.name).toLowerCase())) {
      const text = bytes.toString("utf8");
      const blocked = /\/(?:Users|home)\/|[A-Za-z]:\\Users\\|\b(?:ghp_|github_pat_|sk-proj-)[A-Za-z0-9_-]+|PRIVATE KEY|\b(?:passportNumber|bookingReference|confirmationCode|apiKey|accessToken)\s*["']?\s*[:=]/i;
      if (blocked.test(text)) throw new Error(`Export contains a private path, credential, or private-record field: ${relativePath}`);
    }
    files.push({ path: relativePath, bytes, sha256: createHash("sha256").update(bytes).digest("hex") });
  }
}
await inspect(source);
if (files.length > 300) throw new Error("Unexpectedly large export. Review its scope before importing.");
const index = files.find((file) => file.path === "index.html");
if (!index) throw new Error("Export must contain index.html.");
const html = index.bytes.toString("utf8");
const canonical = `https://gnaroshi.dev/travel/${slug}/`;
const canonicalLinks = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi) ?? [];
const canonicalHref = canonicalLinks[0]?.match(/\bhref=["']([^"']*)["']/i)?.[1];
if (canonicalLinks.length !== 1 || canonicalHref !== canonical) throw new Error(`Export must declare exactly one canonical URL: ${canonical}`);
if (!/<html\b[^>]*\blang=["'][a-zA-Z-]+["']/i.test(html) || !/<main\b/i.test(html) || !/<h1\b/i.test(html)) {
  throw new Error("Export needs document language, main landmark, and h1.");
}

const parent = join(siteRoot, "public", "travel");
const destination = join(parent, slug);
const staging = join(parent, `.${slug}-import-${process.pid}`);
const backup = join(parent, `.${slug}-previous-${process.pid}`);
await mkdir(parent, { recursive: true });
await mkdir(staging);
try {
  for (const file of files) {
    const target = join(staging, file.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, file.bytes);
  }
  const provenance = {
    schemaVersion: 1,
    sourceCommit,
    canonical,
    files: files.map(({ path, sha256 }) => ({ path, sha256 })).sort((a, b) => a.path.localeCompare(b.path))
  };
  await writeFile(join(staging, "export-provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
  let replaced = false;
  try { await rename(destination, backup); replaced = true; }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  try { await rename(staging, destination); }
  catch (error) { if (replaced) await rename(backup, destination); throw error; }
  if (replaced) await rm(backup, { recursive: true });
  console.log(`Imported ${files.length} reviewed public assets for /travel/${slug}/ at ${sourceCommit}.`);
} finally {
  await rm(staging, { recursive: true, force: true });
}
