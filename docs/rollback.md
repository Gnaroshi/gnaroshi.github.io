# Public Deployment Rollback

Rollback changes only the public website presentation and public content-feed projection. It never changes paper-lab, writing, Studio, API, or any private source repository.

## Select Inputs

Choose an immutable website commit or tag and an exact public feed SHA from a previously verified release:

```bash
curl -fsSL https://gnaroshi.dev/build-info.json
gh run list --repo Gnaroshi/gnaroshi.github.io --workflow deploy.yml --limit 10
```

The selected website must still install and build with the current supported Node/toolchain. The rollback workflow writes the schema-v1 provenance record from current deployment tooling, so older presentation commits remain observable without modifying their source repositories.

## Run Rollback

```bash
gh workflow run rollback.yml \
  --repo Gnaroshi/gnaroshi.github.io \
  -f website_ref=<WEBSITE_SHA_OR_IMMUTABLE_TAG> \
  -f feed_commit=<FULL_FEED_SHA>
```

The workflow:

1. Checks out current deployment tooling separately.
2. Checks out the requested website and feed into isolated paths.
3. Verifies the feed SHA, schema, and content hash.
4. Runs content, type, build, i18n, link, and supported smoke checks.
5. Writes exact public build provenance into the rollback artifact.
6. Deploys through the same `github-pages` environment and `pages-production` concurrency group.
7. Verifies live website/feed commits, content hash, environment, and core routes.

## Recovery Cases

- Build failure: no Pages artifact is deployed; fix the selected input pair or choose an earlier verified pair.
- Deploy failure: the prior live site remains active; inspect the `github-pages` environment policy and retry.
- Verification failure: treat the release as failed even if Pages accepted it. Re-run rollback with the last known-good pair.
- New content is bad but presentation is good: keep `website_ref` and select an earlier feed SHA.
- Presentation is bad but content is good: select an earlier website ref and retain the current feed SHA if schema-compatible.

Never force-push, reset private sources, delete local changes, or edit generated feed records as part of rollback.
