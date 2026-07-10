import { existsSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const SUPPORTED_SCHEMA_VERSIONS = new Set([1]);
const EXPECTED_DIRECTORIES = ["blog", "papers", "data"];
const SHA_PATTERN = /^[a-f0-9]{40}$/i;

export function getFeedPath() {
  return resolve(process.env.CONTENT_FEED_PATH || ".content-feed");
}

function fail(message) {
  throw new Error(`[content-feed] ${message}`);
}

function readManifest(feedPath) {
  const manifestPath = resolve(feedPath, "manifest.json");
  if (!existsSync(manifestPath)) {
    fail(`manifest.json was not found at ${manifestPath}. Run npm run content:pull first.`);
  }

  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(`manifest.json is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function isBootstrapEmpty(manifest) {
  if (manifest.state !== "bootstrap-empty" || !manifest.entries || typeof manifest.entries !== "object") return false;
  return Object.values(manifest.entries).every((value) => value === 0);
}

function validateSourceMetadata(manifest) {
  if (manifest.sourceCommits && typeof manifest.sourceCommits === "object") {
    for (const key of ["paperLab", "writing"]) {
      if (!SHA_PATTERN.test(String(manifest.sourceCommits[key] || ""))) {
        fail(`sourceCommits.${key} must be a full git commit SHA.`);
      }
    }
    return;
  }

  if (
    manifest.state === "bootstrap-empty" &&
    typeof manifest.sourceRepository === "string" &&
    manifest.sourceRepository.length > 0 &&
    SHA_PATTERN.test(String(manifest.sourceCommit || ""))
  ) {
    return;
  }

  fail("source commit metadata is missing or invalid.");
}

function getCommit(feedPath) {
  try {
    return execFileSync("git", ["-C", feedPath, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

export function validateContentFeed(feedPath = getFeedPath()) {
  const manifest = readManifest(feedPath);
  if (!SUPPORTED_SCHEMA_VERSIONS.has(manifest.schemaVersion)) {
    fail(`unsupported manifest schemaVersion ${String(manifest.schemaVersion)}; supported versions: 1.`);
  }

  validateSourceMetadata(manifest);
  const bootstrapEmpty = isBootstrapEmpty(manifest);
  const missingDirectories = EXPECTED_DIRECTORIES.filter((directory) => {
    const path = resolve(feedPath, directory);
    return !existsSync(path) || !statSync(path).isDirectory();
  });

  if (missingDirectories.length > 0) {
    fail(`expected feed directories are missing: ${missingDirectories.join(", ")}.`);
  }

  const commit = getCommit(feedPath);
  const result = {
    feedPath,
    schemaVersion: manifest.schemaVersion,
    state: manifest.state || "generated",
    commit,
    bootstrapEmpty
  };

  return { manifest, result };
}

try {
  const { result } = validateContentFeed();
  console.log(`[content-feed] schema v${result.schemaVersion} valid at ${result.feedPath}`);
  console.log(`[content-feed] commit ${result.commit || "unavailable"}; state ${result.state}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
