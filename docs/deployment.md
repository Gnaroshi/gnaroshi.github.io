# GitHub Pages Deployment

## Release Inputs

Every production artifact is defined by two immutable inputs:

- a `gnaroshi.github.io` commit
- a `gnaroshi-content-feed` commit

Pushes to website `main` deploy with feed `main` resolved and recorded at checkout time. Feed-only releases should dispatch `.github/workflows/deploy.yml` with an exact SHA:

```bash
gh workflow run deploy.yml \
  --repo Gnaroshi/gnaroshi.github.io \
  -f feed_commit=<FULL_SHA> \
  -f feed_ref=<FULL_SHA>
```

`feed_commit` wins when both inputs are present. The build fails unless it is a lowercase full SHA and exactly equals `git -C .content-feed rev-parse HEAD`. Studio should use this flow after pushing the public feed; the website does not need a new commit.

## Production Workflow

The `pages-production` concurrency group serializes deploy and rollback workflows. GitHub keeps at most one pending run, so a superseded pending artifact cannot deploy after a newer request.

The build job runs:

1. Checkout website and requested public feed.
2. Validate and record website SHA, feed SHA, feed schema, and manifest content hash.
3. `npm ci` and Chromium installation without a persisted browser cache.
4. `npm run content:check`.
5. `npm run check`.
6. `npm run build`.
7. `npm run check:i18n`.
8. `npm run check:links`.
9. `npm run test:smoke` against the existing production build.
10. Upload and deploy the exact `dist/` artifact through the `github-pages` environment.

Full visual regression remains a PR/manual QA task. Failed deploy checks upload logs, Playwright reports, screenshots, and traces for seven days.

## Post-Deploy Verification

`scripts/verify-deployment.mjs` retries with bounded exponential backoff and verifies:

- `/build-info.json` schema version 1
- exact website and feed commits
- feed content hash and schema version
- workflow run ID and attempt
- `environment: production`
- HTTP success for `/`, `/ko/`, `/research/`, and `/papers/`
- the stable primary-navigation signature
- absence of known scaffold phrases

Failure marks the workflow failed, prints expected and actual provenance, retains the deployment URL in the run, and prints a rollback command. A Pages upload or successful Git push is not deployment proof; only the post-deploy verification job proves the live result.

## Pull Request CI

`.github/workflows/ci.yml` runs on pull requests and manual dispatch. It checks out the public feed, runs all static checks, automatically discovers all non-visual E2E tests, and runs axe accessibility tests. It has read-only repository permission and cannot deploy.

Failure artifacts contain `artifacts/ci-logs/`, `playwright-report/`, and `test-results/`. Playwright browsers are installed per run instead of restoring an unsafe cross-version browser cache.

## Stale-Site Diagnosis

```bash
gh api repos/Gnaroshi/gnaroshi.github.io/commits/main --jq .sha
gh api repos/Gnaroshi/gnaroshi-content-feed/commits/main --jq .sha
gh run list --repo Gnaroshi/gnaroshi.github.io --workflow deploy.yml --limit 5
gh api repos/Gnaroshi/gnaroshi.github.io/pages
curl -fsSL https://gnaroshi.dev/build-info.json
```

Compare website main SHA, workflow head SHA, Pages artifact/run, and live `websiteCommit`. Then compare the requested/resolved feed SHA with live `contentFeedCommit`. A successful build with a failed or blocked `github-pages` environment job leaves the previous site live.

## Manual GitHub Settings

- Settings -> Pages -> Build and deployment -> Source: **GitHub Actions**
- Custom domain: `gnaroshi.dev`
- Enforce HTTPS: enabled after certificate provisioning
- Environment: `github-pages` must allow deployments from `main` and manual rollback runs
- Actions: workflow permissions must permit Pages OIDC; no cross-repository PAT is needed

`public/CNAME` must contain exactly `gnaroshi.dev`. `astro.config.mjs` must keep `site: "https://gnaroshi.dev"` with no repository subpath base.

See `docs/release-integrity.md` for provenance interpretation and `docs/rollback.md` for recovery.
