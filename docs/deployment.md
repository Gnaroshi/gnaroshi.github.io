# GitHub Pages Deployment

## Active Method And Inputs

Build and validate locally, then publish public static files to `gh-pages:/`. Repository GitHub Actions are disabled. This direct branch-publication path was verified for this repository on 2026-10-06; it is not a claim that every GitHub account or Pages configuration supports the same behavior.

Source pushes to `main` do not deploy. Each artifact uses an immutable website source SHA and an immutable public `gnaroshi-content-feed` SHA. Use clean, isolated checkouts and verify both `HEAD` values against the selected full, lowercase 40-character SHAs before building. Never import private authoring sources. A feed-only release keeps the website SHA and selects a new exact public feed SHA.

The live `websiteCommit` identifies the source that was built, not the separate `gh-pages` artifact commit. A later documentation/verification-tooling commit can be newer without changing the rendered website; do not rewrite provenance to claim an unbuilt revision.

## Local Build And Validation

Use Node 24 from `.node-version`. Set `CONTENT_FEED_PATH` and `CONTENT_FEED_CONTRACT_PATH` to the selected complete public-feed checkout, `WEBSITE_COMMIT` and `CONTENT_FEED_COMMIT` to their verified SHAs, a fixed `BUILD_TIMESTAMP`, and `DEPLOYMENT_ENVIRONMENT=production`. Do not rely on an ignored `.content-feed` fallback or a neighboring checkout that may be stale. Clear inherited `GITHUB_SHA`, `GITHUB_RUN_ID`, and `GITHUB_RUN_ATTEMPT` so local provenance is not mislabeled.

```bash
npm ci
npm run content:check
npm run check
npm run test:feed-contract
npm run build
npm run check:i18n
npm run check:public-tone
npm run check:launch-content
npm run check:links
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke
```

Install local Playwright Chromium if missing. Run additional route, accessibility, or visual checks when relevant. Keep smoke-test expectations on the same selected feed as the build. Complete fixture tests and rebuilding checks before preparing the final deployment tree.

Confirm `dist/build-info.json` contains the exact website/feed SHAs, manifest content hash and schema, `workflowRunId: "local"`, `workflowRunAttempt: "0"`, and `environment: "production"`.

## Publish The Static Branch

1. Confirm repository Actions remain disabled (`enabled: false`) before the publication push. This is a repository-settings check, not a workflow/run query. If enabled or unavailable, stop for owner direction; do not change the setting implicitly.
2. In an isolated deployment checkout based on current remote `gh-pages`, replace the public static tree with the validated contents of `dist/`, not a nested `dist/` directory. Include root `.nojekyll` and `CNAME` containing exactly `gnaroshi.dev`.
3. Inspect the staged tree: only public static output; no `.github/`, feed checkout, source, dependencies, credentials, local reports, or development diagnostics. Preserve the generated input provenance.
4. Record the source SHA, feed SHA, content hash, and deployment commit. Serialize local releases. Recheck remote `gh-pages` before pushing; if it advanced, stop and reconcile. Use a normal fast-forward push, never a force-push.
5. Keep Pages at **Deploy from a branch → gh-pages → / (root)** (`build_type: legacy`, source `gh-pages:/`). Preserve `gnaroshi.dev`, HTTPS, and DNS. If publication needs an explicit request, the Pages builds endpoint can be requested once while Actions remain disabled; a queued response is not proof of publication.
6. Verify the exact live artifact below and confirm Actions remain disabled afterward. A source/branch push or Pages acceptance alone is not completion.

`public/CNAME` must remain exactly `gnaroshi.dev`. `astro.config.mjs` must retain `site: "https://gnaroshi.dev"` with no repository subpath base. Include `.nojekyll` in every deployment tree even when absent from `dist/`.

## Post-Deploy Verification

Run the existing verifier locally with values from the validated artifact:

```bash
node scripts/verify-deployment.mjs \
  --base-url https://gnaroshi.dev \
  --website-commit <FULL_WEBSITE_SHA> \
  --feed-commit <FULL_FEED_SHA> \
  --content-hash <FEED_CONTENT_HASH> \
  --feed-schema-version 1 \
  --workflow-run-id local \
  --workflow-run-attempt 0 \
  --environment production
```

It retries with bounded backoff and checks schema-v1 provenance, exact expected values, core routes (`/`, `/ko/`, `/research/`, `/papers/`), consistent primary navigation, and absence of known scaffold copy. Also verify changed content routes; when establishing a new publication path, compare live article bytes with the validated static file.

Treat any mismatch as an unverified release even if Pages accepted the branch. Follow [rollback](rollback.md), not Actions reruns.

## Stale-Site Diagnosis

Use ordinary Git/Pages metadata and the public endpoint, without Actions run/check/log queries:

```bash
gh api repos/Gnaroshi/gnaroshi.github.io/commits/main --jq .sha
gh api repos/Gnaroshi/gnaroshi.github.io/commits/gh-pages --jq .sha
gh api repos/Gnaroshi/gnaroshi-content-feed/commits/main --jq .sha
gh api repos/Gnaroshi/gnaroshi.github.io/pages
curl -fsSL https://gnaroshi.dev/build-info.json
```

Compare the selected input pair and content hash with the deployment-branch artifact and live provenance. Latest branch tips are not necessarily the selected release inputs. Distinguish local build success, branch publication, Pages acceptance, and exact live verification.

## Verified Publication Record — 2026-10-06

- Actions were confirmed `enabled: false` before the publication push/settings change and after live verification. No Actions workflow execution or run/check/log query was used.
- Pages changed from workflow publication (`main:/`) to `build_type: legacy`, source `gh-pages:/`; the custom domain and HTTPS were unchanged.
- Initial orphan deployment commit: `154f2935b8c4c99f3c345e3772335ce680933348`, containing 397 public static files, root `.nojekyll`, and `CNAME`.
- Website source: `cb0a3c35a3b3f727d28e8873e72466eeff7c2b9e`.
- Public feed: `cb042193c41a1df60fbf2d37fc20cc259efbedf7`.
- Feed content hash: `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.
- One Pages build request returned `queued` while Actions were disabled. Subsequent live verification matched the exact inputs, `local` / `0`, and `production`.
- The [Korean article](https://gnaroshi.dev/ko/blog/phizero-physical-language/) returned HTTP 200 and matched local static bytes. Desktop/mobile, light/dark checks found no JavaScript errors, overflow, or broken images. Previous live website/feed revisions were `18f7850` / `0a2b5c5`.

## Retained Workflows — Inactive

Deploy, rollback, and PR CI files under `.github/workflows/` remain historical tooling, not the active release path. Their `pages-production` concurrency group and `github-pages` environment describe the former Actions method and do not serialize local publication. Do not dispatch, rerun, enable, modify, or query workflow runs/checks/logs while Actions use is forbidden. Reactivation requires explicit owner authorization and configuration review.

See [release integrity](release-integrity.md) for provenance and historical evidence, and [rollback](rollback.md) for recovery.
