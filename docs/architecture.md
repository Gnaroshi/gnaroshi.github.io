# Website Architecture

## Role

`Gnaroshi/gnaroshi.github.io` is a presentation-only Astro application. It renders public identity data and the generated projection in `Gnaroshi/gnaroshi-content-feed`.

Canonical paper research, writing, publishing rules, AI workflows, and repository writes live outside this repository.

## Data Flow

```text
private paper-lab + private writing
              |
              v
       gnaroshi-studio publisher
              |
              v
 public gnaroshi-content-feed
              |
       build-time checkout
              v
    Astro presentation application
              |
              v
          GitHub Pages
```

The website never checks out or imports private authoring repositories.

## Build Inputs

- `.content-feed/blog/`: public English/Korean blog MDX.
- `.content-feed/papers/`: public English/Korean paper MDX.
- `.content-feed/data/`: canonical public JSON projections.
- `.content-feed/assets/`: public feed assets emitted under `/assets/`.
- `.content-feed/manifest.json`: schema version, source commits, counts, hash, and generation metadata.
- `src/data/`: website-owned public identity, research, Now, and project presentation data.
- `src/content/projects/`: website-owned long-form project presentation.

`src/content.config.ts` is an adapter from feed contract version 1 to Astro view models. It is not the canonical domain schema.

## Derived Data Boundary

The site may perform presentation transforms such as:

- locale-aware dates and numbers
- reading-time labels
- public search, filtering, and sorting
- route and tag generation
- adapting feed node names to graph component props

The following must come from `.content-feed/data/`:

- activity calendar
- Growth snapshot
- paper review summaries
- weekly reviews
- research graph
- other public generated evidence

The website does not regenerate these outputs from source notes.

## Runtime

- Astro static output only.
- No backend or database.
- No OpenAI or other secret-backed client.
- No private repository token.
- React is limited to public presentation islands.

Feed access uses Node filesystem APIs only at build time. Browser bundles receive sanitized public props.

## Build Provenance

The imported feed checkout commit is exposed as:

- `<meta name="content-feed-commit">` on every page.
- `/build-info.json` with website commit, imported feed commit, and UTC build time.
- `/dev-diagnostics/content-feed/` during development only.

## Deployment

GitHub Actions checks out the website, checks out the public feed into `.content-feed`, installs dependencies, validates the feed, builds Astro, and deploys `dist/` to GitHub Pages.

The Astro site remains rooted at `https://gnaroshi.dev` with no repository subpath `base`.
