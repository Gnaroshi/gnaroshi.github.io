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

`npm run content:check` executes the bundled canonical validator from the public feed. The JSON Schemas live in `gnaroshi-content-feed/schemas/v1/`; the website does not maintain a competing domain contract.

A generated manifest must include:

- `schemaVersion: 1`
- full `sourceCommits.paperLab` SHA
- full `sourceCommits.writing` SHA
- state `generated`, a real `generatedAt`, matching file counts and reproducible content hash
- `blog/`, `papers/`, `data/`, and declared `assets/` output

`bootstrap-empty` requires zero counts, `contentStage: seed`, false eligibility, null `generatedAt`, and no activity, Growth, weekly, or graph claims.

Unsupported versions, schema violations, privacy patterns, relation/translation/route collisions, undeclared assets, count/hash drift, or a missing manifest fail before Astro runs. The loader never substitutes an empty collection for an invalid feed.

## Astro Collections

`src/content.config.ts` loads validated public MDX and performs presentation-only transforms. Stable IDs, `canonicalSlug`, `aliases`, and feed-provided translation status remain distinct.

The `dev`, `check`, and `build` commands clear Astro's content-layer cache before loading so switching feed paths or refs cannot retain stale entries.

Local blog and paper source directories must not be recreated.

## Generated JSON

Build-time adapters under `src/utils/` read `.content-feed/data/`. Missing optional indexes render honest empty states. Growth, weekly review, activity, and graph output are never reconstructed from private or local source data.

## Assets

Only entries declared by `.content-feed/assets/index.json` are emitted. Public paths must be `/assets/<sha256>/<filename>` and use a supported image media type. Arbitrary files and `application/octet-stream` fallback are forbidden; immutable caching applies only to declared hashed assets.

## Contract Fixtures

`npm run test:feed-contract` validates rejection fixtures and builds the site against bootstrap, English-only, Korean-only, complete/partial translation, renamed-slug alias, multi-session paper, simple/rich review, implementation, and graph feeds.

## Provenance

The actual feed checkout SHA is resolved with `git rev-parse HEAD`, or from `CONTENT_FEED_COMMIT` in CI. It is recorded in page metadata and `/build-info.json` together with the manifest `contentHash` and schema version.

Production manual dispatch accepts both `feed_ref` and `feed_commit`. `feed_ref` is a human-friendly branch, tag, or commit. `feed_commit` is an optional immutable 40-character SHA, takes precedence, and must exactly match the checkout. Studio publishing should always pass `feed_commit`; a moving branch name alone is not a deterministic release input.

```bash
gh workflow run deploy.yml \
  --repo Gnaroshi/gnaroshi.github.io \
  -f feed_commit=<FULL_SHA> \
  -f feed_ref=<FULL_SHA>
```

The public feed needs no PAT because it is public. Credentials used to dispatch the website workflow belong only to Studio, a GitHub App, or the operator's authenticated local `gh` session.
