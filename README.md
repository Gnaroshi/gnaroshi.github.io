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
npm run test:visual
npm run check:i18n
npm run check:links
```

`dev`, `check`, and `build` validate the feed before Astro starts. Missing manifests, unsupported schema versions, invalid source commit metadata, and incomplete generated directory structures fail with a direct error.

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

Website commit, imported feed commit, and build time are available at `/build-info.json`. A richer diagnostics page exists at `/dev-diagnostics/content-feed/` only in development.

## Profile And Project Data

Public identity and presentation data remain website-owned:

```text
src/data/profile.ts
src/data/locales/
src/data/projects.ts
src/content/projects/
```

Do not place private research notes, blog drafts, API credentials, or authoring tools in this repository.

## Deployment

Pushes to `main` deploy through GitHub Actions. The workflow checks out this repository and the public content feed, validates the feed, builds Astro, and uploads the GitHub Pages artifact. Manual runs accept a `feed_ref` input, defaulting to `main`.

No cross-repository PAT or private repository token is required. See [`docs/deployment.md`](docs/deployment.md).
