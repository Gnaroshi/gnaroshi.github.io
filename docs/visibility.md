# Visibility

The site uses a simple visibility layer for committed content. This is a publishing control, not a security boundary.

## Values

- `public`: appears in indexes, dashboards, search/filter views, generated public stats, and detail pages.
- `unlisted`: detail pages can build, but the item should not appear in public indexes, search, dashboards, or generated aggregate stats.
- `hidden`: excluded from production public pages and public generated stats.

## Important Privacy Note

This repository is public. `unlisted` and `hidden` do not make committed content private. They only control what the static site builds and links publicly. Do not commit secrets, private drafts, private reviews, credentials, or confidential paper notes.

## Utility Rules

Shared helpers live in:

```text
src/utils/visibility.ts
```

Use:

- `shouldShowInIndex()` for list pages, dashboards, search inputs, and public graph nodes.
- `shouldBuildDetailPage()` for dynamic routes where `unlisted` detail pages may build.
- `shouldIncludeInPublicStats()` for heatmaps, weekly metrics, graph generation, and aggregates.

## Content Types

Supported content should prefer the same field:

```yaml
visibility: "public"
```

Paper notes also keep `draft` and `reviewVisibility`:

- `draft: true` keeps unfinished notes out of production.
- `visibility` controls the paper note itself.
- `reviewVisibility` controls generated AI review display.

Generated paper logs and promoted blog drafts should default to `draft: true` and `visibility: "hidden"` until edited.
