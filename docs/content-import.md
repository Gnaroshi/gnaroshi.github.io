# Public Content Import

## Local Checkout

The default feed path is the ignored directory:

```text
.content-feed/
```

Create or update it with:

```bash
npm run content:pull
```

The script clones `https://github.com/Gnaroshi/gnaroshi-content-feed.git` when absent. When present, it refuses a dirty checkout, fetches the selected ref, and performs a fast-forward-only merge. It never creates commits or writes content records.

Select another ref with:

```bash
CONTENT_FEED_REF=feature/ref npm run content:pull
npm run content:pull -- --ref <branch-tag-or-sha>
```

Use an existing checkout without copying it:

```bash
CONTENT_FEED_PATH=../gnaroshi-content-feed npm run content:check
```

## Manifest Contract

`npm run content:check` supports manifest schema version `1`.

A generated manifest must include:

- `schemaVersion: 1`
- full `sourceCommits.paperLab` SHA
- full `sourceCommits.writing` SHA
- `blog/`, `papers/`, and `data/` directories

The migration-only `bootstrap-empty` state may use `sourceRepository` and `sourceCommit`. The `blog/`, `papers/`, and `data/` directories are required even when every declared entry count is zero.

Unsupported versions, missing source metadata, missing expected directories, malformed JSON, or a missing manifest fail before Astro runs.

## Astro Collections

`src/content.config.ts` loads public MDX directly from the feed and adapts contract version 1 into existing UI fields. Feed IDs remain locale-qualified internally while public slugs omit locale folders.

The `dev`, `check`, and `build` commands clear Astro's content-layer cache before loading so switching feed paths or refs cannot retain stale entries.

Local blog and paper source directories must not be recreated.

## Generated JSON

Build-time adapters under `src/utils/` read `.content-feed/data/`. Missing optional indexes render honest empty states. Growth, weekly review, activity, and graph output are never reconstructed from private or local source data.

## Assets

Files under `.content-feed/assets/` are emitted by the static `/assets/[...path]` endpoint. Hidden dotfiles are ignored. Feed asset metadata and public visibility are established by the publisher before import.

## Provenance

The actual feed checkout SHA is resolved with `git rev-parse HEAD`, or from `CONTENT_FEED_COMMIT` in CI. It is recorded in page metadata and `/build-info.json`.
