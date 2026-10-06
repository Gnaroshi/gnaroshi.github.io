# Release Integrity

## Provenance Contract

`/build-info.json` is the minimum public proof for a deployed artifact:

```json
{
  "schemaVersion": 1,
  "websiteCommit": "<40-character SHA>",
  "contentFeedCommit": "<40-character SHA>",
  "builtAt": "<UTC timestamp>",
  "workflowRunId": "local",
  "workflowRunAttempt": "0",
  "environment": "production",
  "contentHash": "<feed manifest SHA-256>",
  "feedSchemaVersion": 1
}
```

The record intentionally excludes credentials, private repository paths, private record IDs, source notes, and complete private-source metadata.

The active [deployment procedure](deployment.md) builds locally and publishes static `gh-pages` output with Actions disabled. Local production builds use `local` / `0`; historical Actions artifacts retain their original run IDs and attempts. `websiteCommit` identifies the built source, not the deployment-branch commit or a later documentation/verification-tooling commit.

## Diagnosis Baseline

On 2026-07-11 before this hardening change:

- website main and live website commit: `5a8177878aee6b7343dcd32a9ac4e7f40499ae22`
- content-feed main and live feed commit: `919f37c82172b317e021fd1213dcaedb0866996f`
- latest successful Pages run: `29142544552`
- Pages artifact: `8245631133` (`github-pages`, 1,886,084 bytes)
- Pages source: GitHub Actions, `main:/`
- custom domain: `gnaroshi.dev`, HTTPS enforced

The current deployment was consistent. The historical failed manual run `29109366261` successfully built and uploaded an artifact from website commit `9ab2debb0ad8e189120da91a993d45215be8cea9`, but its `Deploy to GitHub Pages` job was rejected before any deploy step started. The previous live artifact correctly remained active. At that time, build metadata could not prove the website artifact because the endpoint lacked a website commit.

This is why build success, artifact upload, and deployment must remain separate observable states.

## Verification Rules

- A release is published only after local validation, branch publication, and live verification succeed.
- A feed-only release must use an immutable public feed SHA.
- Live website/feed SHAs, content hash, run ID, run attempt, and environment must match the selected artifact's expected values.
- Core routes must respond with the expected navigation contract and contain no scaffold copy.
- A mismatch is a failed release even when GitHub Pages reports an artifact deployment.

## First-content regression boundary

Local and production smoke tests derive expected navigation from the same selected public feed as the build (`CONTENT_FEED_PATH`). Publishing the first article may enable Writing navigation; an empty local fallback checkout must not determine expectations for a populated release.

The feed-contract fixture runner checks both bootstrap-empty and Korean-only writing through the real build, navigation, empty-state, and public-tone checks. Different locale inventories are valid: do not invent translations to make archive groups or recent-writing sections numerically equal. `data-content-group` identifies those data-dependent groups for structural comparison; static page structure and every page heading remain checked. `data-content-role="count"` distinguishes aggregate counts from editorial introductions without exempting ordinary repeated copy.

## Security Boundary

The website build reads only the public content feed. It does not hold a PAT, API key, private source checkout, or publishing credential. Local publication uses the operator's authenticated Git access; do not add repository tokens or reactivate retained workflows as a release shortcut.
