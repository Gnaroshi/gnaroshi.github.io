#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { parseHTML } from "linkedom";

const dist = join(process.cwd(), "dist");
const strict = process.env.STRICT_EXTERNAL_LINKS === "true";
const excludedHosts = new Set(["scholar.google.com", "www.linkedin.com", "linkedin.com"]);
const urls = new Set();

if (!existsSync(dist)) fail("dist/ does not exist. Run npm run build first.");
for (const file of listFiles(dist).filter((candidate) => extname(candidate) === ".html")) {
  const { document } = parseHTML(readFileSync(file, "utf8"));
  for (const anchor of document.querySelectorAll("a[href]")) {
    try {
      const url = new URL(anchor.getAttribute("href"), "https://gnaroshi.dev");
      if (url.origin !== "https://gnaroshi.dev" && /^https?:$/.test(url.protocol) && !excludedHosts.has(url.hostname)) {
        url.hash = "";
        urls.add(url.toString());
      }
    } catch {
      // Internal validation reports malformed URLs.
    }
  }
}

const failures = [];
for (const url of [...urls].sort()) {
  const result = await checkWithRetry(url, 2);
  console.log(`${result.ok ? "OK" : "WARN"} ${result.status ?? "network"} ${url}`);
  if (!result.ok) failures.push(`${url}: ${result.status ?? result.error}`);
}

if (failures.length) {
  console.error(`External link report found ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  if (strict) process.exit(1);
} else {
  console.log(`External link report passed (${urls.size} URLs).`);
}

async function checkWithRetry(url, attempts) {
  let last = {};
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal, headers: { "user-agent": "gnaroshi.dev-link-audit/1.0" } });
      if ([403, 405, 429].includes(response.status)) response = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal, headers: { "user-agent": "gnaroshi.dev-link-audit/1.0", range: "bytes=0-1024" } });
      last = { ok: response.ok || response.status === 429, status: response.status };
      if (last.ok) return last;
    } catch (error) {
      last = { ok: false, error: error instanceof Error ? error.message : String(error) };
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  return last;
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const target = join(directory, entry);
    return statSync(target).isDirectory() ? listFiles(target) : [target];
  });
}

function fail(message) { console.error(message); process.exit(1); }
