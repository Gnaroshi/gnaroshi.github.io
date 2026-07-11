import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const contractRoot = resolve(process.env.CONTENT_FEED_CONTRACT_PATH || "../gnaroshi-content-feed");
const valid = ["bootstrap-empty", "one-english-blog", "one-korean-blog", "translated-blog-pair", "partial-blog-pair", "translated-paper-pair", "one-paper-multiple-sessions", "one-simple-public-review", "one-rich-review", "one-implementation", "valid-graph"];
const invalid = ["invalid-dangling-graph-edge", "invalid-manifest-count", "invalid-activity-mismatch", "private-leak", "unhashed-asset"];

function run(command, args, fixture, expectSuccess) {
  const feedPath = resolve(contractRoot, "fixtures", fixture);
  const result = spawnSync(command, args, { cwd: resolve("."), encoding: "utf8", env: { ...process.env, CONTENT_FEED_PATH: feedPath, CONTENT_FEED_CONTRACT_PATH: contractRoot } });
  if ((result.status === 0) !== expectSuccess) {
    throw new Error(`${fixture}: expected ${expectSuccess ? "success" : "failure"}\n${result.stdout}\n${result.stderr}`);
  }
}

for (const fixture of valid) run(process.execPath, ["scripts/content-feed-check.mjs"], fixture, true);
for (const fixture of invalid) run(process.execPath, ["scripts/content-feed-check.mjs"], fixture, false);
for (const fixture of valid) {
  run("npm", ["run", "build"], fixture, true);
  run(process.execPath, ["scripts/check-links.mjs"], fixture, true);
  if (fixture === "one-english-blog") {
    const html = readFileSync("dist/blog/english-only/index.html", "utf8");
    if (html.includes('hreflang="ko"') || existsSync("dist/ko/blog/english-only/index.html")) throw new Error("English-only post received a fabricated Korean alternate");
  }
  if (fixture === "one-korean-blog" && !existsSync("dist/ko/blog/korean-only/index.html")) throw new Error("Korean-only post route was not built");
  if (fixture === "translated-blog-pair") {
    const html = readFileSync("dist/blog/renamed-english/index.html", "utf8");
    if (!html.includes('hreflang="ko"') || !html.includes("/ko/blog/renamed-korean/")) throw new Error("Translated post pair is missing its real hreflang");
    if (!existsSync("dist/blog/old-english-slug/index.html")) throw new Error("Renamed post alias redirect was not built");
    if (!readFileSync("dist/blog/old-english-slug/index.html", "utf8").includes('content="noindex, follow"')) throw new Error("Blog alias redirect is indexable");
  }
  if (fixture === "one-paper-multiple-sessions") {
    if (!existsSync("dist/papers/old-paper-slug/index.html")) throw new Error("Renamed paper alias redirect was not built");
    if (!readFileSync("dist/papers/old-paper-slug/index.html", "utf8").includes('content="noindex, follow"')) throw new Error("Paper alias redirect is indexable");
  }
  if (fixture === "translated-paper-pair") {
    const html = readFileSync("dist/papers/paper-pair-english/index.html", "utf8");
    if (!html.includes('hreflang="ko"') || !html.includes("/ko/papers/paper-pair-korean/")) throw new Error("Translated paper pair is missing its real hreflang");
    if (!existsSync("dist/ko/papers/old-korean-paper-slug/index.html")) throw new Error("Korean paper alias redirect was not built");
  }
}
console.log(`[content-feed] ${valid.length} valid website builds and ${invalid.length} rejection fixtures passed`);
