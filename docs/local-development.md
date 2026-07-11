# Local Development

## First Start

```bash
npm run content:pull
npm install
npm run dev
```

`content:pull` uses only Node and Git, so it can run before dependency installation.

## Existing Feed Checkout

```bash
CONTENT_FEED_PATH=../gnaroshi-content-feed npm run dev
```

The override must point to the public generated feed, not to private paper or writing repositories.

## Validation

```bash
npm run content:check
npm run check
npm run build
npm run check:i18n
npm run check:links
npm run test:visual
npm run test:smoke
```

Run `check:links` after `build`. Use `test:e2e` and `test:a11y` for route, interaction, or layout changes.

## Diagnostics

- `/build-info.json` uses safe local fallbacks (`workflowRunId: local`, attempt `0`, environment `local`) while retaining real local website/feed SHAs and the public content hash.
- `/dev-diagnostics/content-feed/` exists only in development and shows website/feed commits, public source counts, and feed state.
- Every page contains a `content-feed-commit` meta tag.

## Failure Testing

Missing feed:

```bash
CONTENT_FEED_PATH=/tmp/missing-gnaroshi-feed npm run content:check
```

An unsupported schema version should be tested with a temporary feed fixture, never by editing the real content-feed checkout.

## Content Changes

Do not create or edit paper or blog content here. Author canonical content and publish it through `gnaroshi-studio`, then rerun `npm run content:pull`.
