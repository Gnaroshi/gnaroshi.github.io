# gnaroshi.dev

Presentation-only Astro application for [gnaroshi.dev](https://gnaroshi.dev).

The website renders public research and writing exported by [`Gnaroshi/gnaroshi-content-feed`](https://github.com/Gnaroshi/gnaroshi-content-feed). Canonical paper notes and writing do not live in this repository.

## Repository Boundary

- This repository owns Astro routes, layouts, components, localization, SEO, accessibility, theme, profile data, project metadata, and public display transforms.
- `gnaroshi-content-feed` owns the generated public projection consumed at build time.
- Private paper and writing repositories are never checked out by the website or its deployment workflow.
- Authoring, review generation, scoring, publishing, and Git operations belong to `gnaroshi-studio`.

## Run Locally

```bash
npm run content:pull
npm install
npm run dev
```

The feed is cloned into the ignored `.content-feed/` directory. To use an existing read-only checkout:

```bash
CONTENT_FEED_PATH=../gnaroshi-content-feed npm run content:check
CONTENT_FEED_PATH=../gnaroshi-content-feed npm run dev
```

`CONTENT_FEED_REF` or `npm run content:pull -- --ref <ref>` selects a feed branch, tag, or commit.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run content:pull
npm run content:check
npm run test:e2e
npm run test:a11y
npm run test:smoke
npm run test:visual
npm run test:feed-contract
npm run test:performance
npm run check:i18n
npm run check:launch-content
npm run check:links
npm run check:links:external
```

`dev`, `check`, and `build` run the feed's canonical JSON Schema validator before Astro starts. Count/hash drift, schema or privacy violations, broken relations, route/alias collisions, and undeclared assets fail with a direct error.

Use Node 24 as declared in `.node-version`. `test:performance` checks deterministic route budgets and runs mobile Chromium coverage/LCP/CLS. External links are checked only by the manual/scheduled report because third-party availability must not block ordinary content deployment.

## Content Import

Astro content collections load public MDX from:

```text
.content-feed/blog/
.content-feed/papers/
```

Canonical generated JSON is loaded from:

```text
.content-feed/data/
```

This includes public reviews, activity, Growth snapshots, weekly reviews, and the research graph. Feed assets are emitted under `/assets/` during the static build.

The bootstrap-empty feed is a deliberate zero-content migration state. It renders honest empty states without treating seed or demo records as public activity.

See [`docs/content-import.md`](docs/content-import.md) for the schema and failure behavior.

## Build Metadata

Every page includes:

```html
<meta name="content-feed-commit" content="...">
```

`/build-info.json` exposes a versioned public provenance record: website and feed commits, feed content hash and schema, build time, workflow run and attempt, and environment. A richer diagnostics page with public feed state and counts exists at `/dev-diagnostics/content-feed/` only in development.

## Profile And Project Data

Public identity and presentation data remain website-owned:

```text
src/data/profile.ts
src/data/facts/
src/data/locales/
src/data/projects.ts
```

Facts such as IDs, dates, status, links, repository URLs, and verified technical properties live in `src/data/facts/`. English and Korean locale files contain copy only. `npm run check:launch-content` verifies locale parity, freshness, public dates, project links, private-path leaks, and launch-content policy.

Do not place private research notes, blog drafts, API credentials, or authoring tools in this repository.

## Deployment

Pushes to `main` deploy through GitHub Actions. A feed-only release can dispatch the same workflow with an immutable feed SHA:

```bash
gh workflow run deploy.yml \
  --repo Gnaroshi/gnaroshi.github.io \
  -f feed_commit=<FULL_SHA> \
  -f feed_ref=<FULL_SHA>
```

`feed_commit` takes precedence and is verified against the checkout before build. Pull requests run non-deploying CI; production deployment runs static checks and a focused smoke suite, then verifies the live provenance and core routes. Use the manual rollback workflow only with an explicit public website ref and public feed SHA.

No cross-repository PAT or private repository token is required. See [`docs/deployment.md`](docs/deployment.md), [`docs/release-integrity.md`](docs/release-integrity.md), and [`docs/rollback.md`](docs/rollback.md).

Search, privacy, asset-boundary, CSP, and performance decisions are documented in [`docs/technical-hardening-report.md`](docs/technical-hardening-report.md).
