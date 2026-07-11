#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] ?? "" : fallback;
};

const siteDirectory = resolve(option("site-dir", "."));
const feedDirectory = resolve(option("feed-dir", `${siteDirectory}/.content-feed`));
const outputPath = resolve(option("output", `${siteDirectory}/dist/build-info.json`));
const manifest = JSON.parse(await readFile(`${feedDirectory}/manifest.json`, "utf8"));
const environment = process.env.DEPLOYMENT_ENVIRONMENT === "production" ? "production" : "ci";
const buildInfo = {
  schemaVersion: 1,
  websiteCommit: process.env.WEBSITE_COMMIT,
  contentFeedCommit: process.env.CONTENT_FEED_COMMIT,
  builtAt: process.env.BUILD_TIMESTAMP ?? new Date().toISOString(),
  workflowRunId: process.env.GITHUB_RUN_ID ?? "local",
  workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? "0",
  environment,
  contentHash: manifest.contentHash ?? null,
  feedSchemaVersion: manifest.schemaVersion
};

if (!/^[a-f0-9]{40}$/.test(buildInfo.websiteCommit ?? "")) throw new Error("WEBSITE_COMMIT must be a full SHA");
if (!/^[a-f0-9]{40}$/.test(buildInfo.contentFeedCommit ?? "")) throw new Error("CONTENT_FEED_COMMIT must be a full SHA");
if (!/^[a-f0-9]{64}$/.test(buildInfo.contentHash ?? "")) throw new Error("Feed contentHash must be a SHA-256 value");
if (buildInfo.feedSchemaVersion !== 1) throw new Error(`Unsupported feed schema ${buildInfo.feedSchemaVersion}`);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(buildInfo, null, 2)}\n`);
console.log(`Wrote deployment provenance to ${outputPath}`);
