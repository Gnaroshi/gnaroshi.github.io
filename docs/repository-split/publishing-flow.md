# Publishing Flow

## Current State

The website still reads content directly from its original `src/content/` and `src/generated/` paths. The new repositories are snapshots and do not affect production behavior.

## Target Flow

```text
gnaroshi-paper-lab (private) ----+
                                  +--> gnaroshi-studio --> validation --> gnaroshi-content-feed (public)
gnaroshi-writing (private) ------+                                      |
                                                                         v
                                                        gnaroshi.github.io static build

gnaroshi-api (private source) --> Cloudflare Worker --> optional browser AI sessions
```

## Publication Stages

### 1. Author

- Paper research is edited in `gnaroshi-paper-lab`.
- Blog and long-form writing are edited in `gnaroshi-writing`.
- New records default to private or draft.
- Stable IDs, locales, translation keys, visibility, and source dates are required.

### 2. Validate

Studio loads canonical sources and validates:

- Schema and required metadata
- Stable slug and translation pairing
- Draft and visibility state
- Evidence eligibility for public metrics
- Internal and external URLs
- Secret-like values and forbidden binary references
- Sample, seed, demo, and meta-only classifications

Validation failure produces no feed change.

### 3. Project

The publisher creates a clean temporary output tree. It copies only public contract fields, produces deterministic ordering, calculates approved derived fields, and writes a manifest containing:

- Contract version
- Canonical source commits
- Generation timestamp
- Entry counts by type and locale
- Excluded classification summary
- Optional content hashes

The publisher never mutates canonical source repositories.

### 4. Review And Push

- Inspect the projection diff.
- Run feed schema, link, secret, visibility, and sample-data checks.
- Commit generated output to `gnaroshi-content-feed`.
- Record the source commits in the feed commit or manifest.

### 5. Build Website

- Check out a known content-feed revision.
- Load it through a static adapter.
- Build Astro without private-repository access at runtime.
- Run public copy, content metrics, i18n, links, E2E, accessibility, and visual checks.
- Deploy through the existing GitHub Pages workflow.

## Failure Behavior

- If publication fails, keep the prior feed commit and prior website deployment.
- If feed checkout fails, the build fails before deployment; it must not silently publish an empty site.
- If the optional API fails, static pages and manual workflows remain available.
- If visibility is ambiguous, exclude the record and require manual review.

## Initial Feed State

The initial content-feed manifest has zero entries. Existing paper examples, generated review data, question-bank output, weekly-review output, and imported seed writing are excluded pending explicit human review. The website continues to serve its unchanged in-repository content during this period.
