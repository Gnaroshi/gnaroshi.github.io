#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const dist = resolve("dist");
const travel = join(dist, "travel");
if (existsSync(travel)) {
  const info = JSON.parse(await readFile(join(dist, "build-info.json"), "utf8"));
  if (!/^[a-f0-9]{40}$/.test(info.websiteCommit ?? "") || !/^[a-f0-9]{40}$/.test(info.contentFeedCommit ?? "")) {
    throw new Error("Travel pages require valid website and content-feed build provenance.");
  }
  let count = 0;
  async function stamp(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { await stamp(path); continue; }
      if (!entry.name.endsWith(".html")) continue;
      let html = await readFile(path, "utf8");
      html = html.replace(/<meta\b[^>]*\bname=["'](?:website-commit|content-feed-commit)["'][^>]*>\s*/gi, "");
      if (!/<\/head>/i.test(html)) throw new Error(`Travel HTML has no head closing tag: ${path}`);
      const metadata = `<meta name="website-commit" content="${info.websiteCommit}"><meta name="content-feed-commit" content="${info.contentFeedCommit}">`;
      await writeFile(path, html.replace(/<\/head>/i, `${metadata}</head>`));
      count += 1;
    }
  }
  await stamp(travel);
  console.log(`Added deployment provenance to ${count} public travel pages.`);
}
