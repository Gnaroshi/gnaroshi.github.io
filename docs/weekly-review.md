# Weekly Research Review

Weekly reviews summarize public research output without calling an AI model.

## Routes

- `/week`: weekly review archive.
- `/week/[weekId]`: one static weekly review page.

Week IDs use ISO week format:

```text
2026-W28
```

## Generated Files

Generated JSON lives in:

```text
src/generated/weekly-reviews/
```

Build the current week:

```bash
npm run week:build
```

Build a specific week:

```bash
npm run week:build -- --week 2026-W28
```

Use `--force` to overwrite a changed generated review:

```bash
npm run week:build -- --force
```

For the current week, `endDate` is capped at the local build date so the public review never presents future days as completed. Explicitly requested future weeks are rejected.

## Schema

Each review includes:

- `schemaVersion`
- `weekId`
- `startDate`
- `endDate`
- `generatedAt`
- `visibility`
- `summary`
- `metrics`
- `strongestDimension`
- `weakestDimension`
- `wins`
- `openLoops`
- `nextWeekFocus`
- `featuredItems`

Metrics:

- `papersRead`
- `deepReads`
- `aiReviews`
- `oralExams`
- `formulaRecalls`
- `blogPosts`
- `projectUpdates`
- `githubContributions`

## Counting Rules

Only public content is counted. Draft, hidden, and unlisted content is excluded from public weekly metrics.

AI paper reviews are counted only when they are public and map to a public paper log. This avoids presenting private drafts or calibration examples as real public progress.

GitHub contribution count is currently `0` because the site has no authenticated backend or API-based contribution import.

## Workflow

1. Publish or update public content.
2. Run `npm run week:build`.
3. If the week already exists and content changed, rerun with `--force`.
4. Run `npm run graph:build -- --force` when weekly review nodes should appear in the graph.
5. Run `npm run build`.
