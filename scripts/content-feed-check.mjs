import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

export function getFeedPath() {
  return resolve(process.env.CONTENT_FEED_PATH || ".content-feed");
}

export function validateContentFeed(feedPath = getFeedPath()) {
  const contractRoot = resolve(process.env.CONTENT_FEED_CONTRACT_PATH || feedPath);
  const validator = resolve(contractRoot, "dist", "feed-validate.cjs");
  if (!existsSync(validator)) {
    throw new Error(`[content-feed] canonical validator was not found at ${validator}. Pull a complete content-feed checkout or set CONTENT_FEED_CONTRACT_PATH.`);
  }
  const result = spawnSync(process.execPath, [validator, "--feed-root", feedPath, "--contract-root", contractRoot, "--json"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`[content-feed] canonical validation failed.\n${result.stdout || result.stderr}`);
  }
  const report = JSON.parse(result.stdout);
  if (report.valid !== true) throw new Error("[content-feed] validator returned an invalid report.");
  return { manifest: report, result: { feedPath, schemaVersion: report.schemaVersion, state: report.state, bootstrapEmpty: report.state === "bootstrap-empty" } };
}

try {
  const { manifest, result } = validateContentFeed();
  console.log(`[content-feed] schema v${result.schemaVersion} ${result.state} valid at ${result.feedPath}`);
  console.log(`[content-feed] content ${manifest.contentHash}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
