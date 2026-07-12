# Website Architecture

## Role

`Gnaroshi/gnaroshi.github.io` is a presentation-only Astro application. It renders public identity data and the generated projection in `Gnaroshi/gnaroshi-content-feed`.

Canonical paper research, writing, publishing rules, AI workflows, and repository writes live outside this repository.

## Data Flow

```text
Gnaroshi Studio
       |
       v
private paper-lab + private writing
       |
       v
generated public content feed
       |
       v
presentation-only Astro website
       |
       v
GitHub Pages
```

The website never checks out or imports private authoring repositories.

## Public System Workflow

Home and the `gnaroshi.dev` project detail explain the stable roles of the two private source repositories, Studio, the optional API, the public content feed, and the website. This model is website-owned and renders even when the feed is empty. It is presentation architecture, not a live operations dashboard.

Current diffs, dirty state, validation results, private commits, and deployment monitoring remain in Gnaroshi Studio. The public site exposes only public build provenance already covered by the build-info contract. See `docs/public-system-workflow.md`.

## Build Inputs

- `.content-feed/blog/`: public English/Korean blog MDX.
- `.content-feed/papers/`: public English/Korean paper MDX.
- `.content-feed/data/`: canonical public JSON projections.
- `.content-feed/assets/`: public feed assets emitted under `/assets/`.
- `.content-feed/manifest.json`: schema version, source commits, counts, hash, and generation metadata.
- `src/data/facts/`: shared public IDs, dates, status, links, and verified technical properties.
- `src/data/locales/`: English and Korean presentation copy, joined to the shared facts at build time.
- `src/data/`: website-owned public identity, research, Now, and project presentation adapters.

`src/content.config.ts` is an adapter from feed contract version 1 to Astro view models. It is not the canonical domain schema.

## Publication Properties

- **Source-of-truth separation:** paper research and writing remain canonical in private repositories; the website cannot edit them.
- **Public projection:** Studio emits only reviewed public fields to the generated feed.
- **Privacy boundary:** private source repositories and credentials are never checked out by the website or Pages workflow.
- **Deterministic feed:** the manifest records source commits, schema version, counts, and content hash.
- **Bilingual presentation:** shared facts are joined with English and Korean copy without duplicating dates, status, or links.
- **Evidence-gated metrics:** Growth, weekly review, and graph outputs are rendered only when the feed marks them eligible.

## Derived Data Boundary

The site may perform presentation transforms such as:

- locale-aware dates and numbers
- reading-time labels
- public search, filtering, and sorting
- route and tag generation
- deriving UI labels from validated enum values

The following must come from `.content-feed/data/`:

- activity calendar
- Growth snapshot
- paper review summaries
- weekly reviews
- research graph
- other public generated evidence

The website does not regenerate or silently rename these outputs. Missing evidence hides the corresponding section; adapters do not create empty review dimensions, badges, effort estimates, completion states, translation counterparts, or fallback graph types.

Activity semantics remain distinct: reading sessions, distinct papers touched, minutes, active days, completed passes, revisits, implementations, and deep sessions. Weekly review metrics retain their native names and state. Unknown graph node or edge enums fail before Astro runs.

## Runtime

- Astro static output only.
- No backend or database.
- No OpenAI or other secret-backed client.
- No private repository token.
- React is limited to public presentation islands.

Feed access uses Node filesystem APIs only at build time. Browser bundles receive sanitized public props.

## Build Provenance

The public build provenance contract is exposed as:

- `<meta name="content-feed-commit">` on every page.
- `<meta name="website-commit">` on every page.
- `/build-info.json` schema version 1 with website/feed commits, feed content hash and schema, UTC build time, workflow run/attempt, and environment.
- `/dev-diagnostics/content-feed/` with public source counts and feed state during development only.

The endpoint contains no private source paths, private IDs, credentials, or unpublished source metadata.

## Deployment

GitHub Actions checks out the website and an explicitly resolved public feed commit into `.content-feed`, validates all static contracts, runs a focused route smoke suite, and deploys `dist/` to GitHub Pages. A post-deploy verifier compares live provenance and navigation with the exact inputs. PR CI never deploys.

The Astro site remains rooted at `https://gnaroshi.dev` with no repository subpath `base`.
