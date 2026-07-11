# GitHub Pages Deployment

## Workflow

`.github/workflows/deploy.yml` runs on pushes to `main` and manual dispatches.

The build job:

1. Checks out `Gnaroshi/gnaroshi.github.io`.
2. Checks out public `Gnaroshi/gnaroshi-content-feed` into `.content-feed/`.
3. Records the website SHA, feed checkout SHA, and UTC build timestamp.
4. Installs dependencies with `npm ci`.
5. Runs `npm run content:check`.
6. Runs `npm run build`.
7. Uploads `dist/` as the GitHub Pages artifact.

The deploy job publishes that artifact with GitHub Pages OIDC permissions. A final verification job fetches `https://gnaroshi.dev/build-info.json` and fails unless `websiteCommit` matches the workflow's `github.sha`.

## Manual Feed Ref

`workflow_dispatch` accepts `feed_ref`, defaulting to `main`. It may be a branch, tag, or commit available in the public feed repository.

## Credentials

The content feed is public. Do not configure a cross-repository PAT, private repository deploy key, or content-source token. The workflow does not access private paper or writing repositories.

## Local Verification

```bash
npm run content:pull
npm install
npm run content:check
npm run check
npm run build
npm run check:links
```

Confirm `dist/build-info.json` contains `websiteCommit`, `contentFeedCommit`, and `builtAt`, and that production output does not contain `dist/dev-diagnostics/content-feed/index.html`.

## GitHub Pages Settings

- Settings -> Pages -> Source: **GitHub Actions**
- Custom domain: `gnaroshi.dev`
- Enforce HTTPS after certificate provisioning

`public/CNAME` must contain exactly `gnaroshi.dev`. `astro.config.mjs` must keep `site: "https://gnaroshi.dev"` and no repository subpath `base`.

## Failure Modes

- Missing `manifest.json`: verify the feed checkout step and path.
- Unsupported schema version: update the website adapter before deploying the new feed contract.
- Missing directories: publish a complete generated feed with `blog/`, `papers/`, and `data/`, including for the zero-entry bootstrap state.
- Wrong build provenance: inspect the feed checkout ref and `/build-info.json`.
- Route 404: confirm the latest Pages artifact and existing Astro static path.
