#!/usr/bin/env node

const args = process.argv.slice(2);

function option(name, fallback = "") {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] ?? "" : fallback;
}

const baseUrl = option("base-url", process.env.DEPLOYMENT_URL || "https://gnaroshi.dev").replace(/\/$/, "");
const expected = {
  websiteCommit: option("website-commit", process.env.EXPECTED_WEBSITE_COMMIT),
  contentFeedCommit: option("feed-commit", process.env.EXPECTED_CONTENT_FEED_COMMIT),
  environment: option("environment", process.env.EXPECTED_ENVIRONMENT || "production"),
  contentHash: option("content-hash", process.env.EXPECTED_CONTENT_HASH),
  workflowRunId: option("workflow-run-id", process.env.EXPECTED_WORKFLOW_RUN_ID),
  workflowRunAttempt: option("workflow-run-attempt", process.env.EXPECTED_WORKFLOW_RUN_ATTEMPT),
  feedSchemaVersion: Number(option("feed-schema-version", "1"))
};
const attempts = Number(option("attempts", "8"));
const initialDelayMs = Number(option("initial-delay-ms", "5000"));
const maxDelayMs = Number(option("max-delay-ms", "30000"));
const skipNavigationSignature = args.includes("--skip-navigation-signature") || process.env.SKIP_NAVIGATION_SIGNATURE === "true";
const navigationSignature = "research|projects|writing|papers|about";
const routes = ["/", "/ko/", "/research/", "/papers/"];
const scaffoldPhrases = [
  "editable in src",
  "lorem ipsum",
  "placeholder content",
  "sample content",
  "scaffold"
];

function requirePattern(value, pattern, name) {
  if (!pattern.test(value)) throw new Error(`${name} is missing or malformed: ${value || "<empty>"}`);
}

requirePattern(expected.websiteCommit, /^[a-f0-9]{40}$/, "website commit");
requirePattern(expected.contentFeedCommit, /^[a-f0-9]{40}$/, "content feed commit");
if (expected.contentHash) requirePattern(expected.contentHash, /^[a-f0-9]{64}$/, "content hash");
if (!Number.isInteger(attempts) || attempts < 1 || attempts > 12) throw new Error("attempts must be between 1 and 12");

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchText(path) {
  const url = new URL(path, `${baseUrl}/`);
  url.searchParams.set("deployment-check", `${expected.websiteCommit}-${Date.now()}`);
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
    signal: AbortSignal.timeout(15_000)
  });
  if (!response.ok) throw new Error(`${url.pathname} returned HTTP ${response.status}`);
  return response.text();
}

function assertEqual(actual, wanted, label) {
  if (actual !== wanted) throw new Error(`${label} mismatch: expected ${wanted}, received ${actual ?? "<missing>"}`);
}

async function verify() {
  const buildInfo = JSON.parse(await fetchText("/build-info.json"));
  assertEqual(buildInfo.schemaVersion, 1, "build-info schema");
  assertEqual(buildInfo.websiteCommit, expected.websiteCommit, "website commit");
  assertEqual(buildInfo.contentFeedCommit, expected.contentFeedCommit, "content feed commit");
  assertEqual(buildInfo.environment, expected.environment, "environment");
  assertEqual(buildInfo.feedSchemaVersion, expected.feedSchemaVersion, "feed schema");
  requirePattern(buildInfo.contentHash ?? "", /^[a-f0-9]{64}$/, "deployed content hash");
  if (expected.contentHash) assertEqual(buildInfo.contentHash, expected.contentHash, "content hash");
  if (expected.workflowRunId) assertEqual(buildInfo.workflowRunId, expected.workflowRunId, "workflow run id");
  if (expected.workflowRunAttempt) assertEqual(buildInfo.workflowRunAttempt, expected.workflowRunAttempt, "workflow run attempt");

  for (const route of routes) {
    const html = await fetchText(route);
    if (!skipNavigationSignature && !html.includes(`data-navigation-signature="${navigationSignature}"`)) {
      throw new Error(`${route} is missing navigation signature ${navigationSignature}`);
    }
    const normalized = html.toLowerCase();
    const phrase = scaffoldPhrases.find((candidate) => normalized.includes(candidate));
    if (phrase) throw new Error(`${route} contains forbidden scaffold phrase: ${phrase}`);
  }

  return buildInfo;
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const buildInfo = await verify();
    console.log(JSON.stringify({ verified: true, deploymentUrl: baseUrl, buildInfo }, null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Verification attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) {
      const delay = Math.min(initialDelayMs * (2 ** (attempt - 1)), maxDelayMs);
      console.error(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
}

console.error(`Deployment verification failed for ${baseUrl}`);
console.error(`Expected website commit: ${expected.websiteCommit}`);
console.error(`Expected content feed commit: ${expected.contentFeedCommit}`);
console.error(`Last error: ${lastError?.message ?? "unknown"}`);
console.error("Rollback command:");
console.error(`gh workflow run rollback.yml --repo Gnaroshi/gnaroshi.github.io -f website_ref=${expected.websiteCommit} -f feed_commit=${expected.contentFeedCommit}`);
process.exit(1);
