# Codex Workflow

Use this workflow for presentation-layer work only. Canonical paper notes, writing, publishing, AI review, and API code belong to their owning repositories.

## Start With Context

Read `AGENTS.md`, `docs/architecture.md`, `docs/content-import.md`, `docs/design.md`, and the document specific to the change. Use `docs/deployment.md` for Pages work and `docs/i18n.md` for locale changes.

## Import Public Content

Before development, prepare the generated public feed:

```bash
npm run content:pull
npm run content:check
```

`CONTENT_FEED_PATH` may point to an existing public feed checkout. Never point it at `gnaroshi-paper-lab` or `gnaroshi-writing`, and never edit the feed from this repository.

## Scope

Website changes may cover Astro routes, components, localization, SEO, accessibility, theme, profile data, project metadata, and display-only feed adapters. Blog and paper authoring must be done through `gnaroshi-studio` and the private canonical repositories.

## Verification

Run the contract and static checks after every change:

```bash
npm run content:check
npm run check
npm run build
npm run check:i18n
npm run check:links
```

For route or interaction changes, also run `npm run test:e2e` and `npm run test:a11y`.

## Commits

Keep commits focused, use conventional commit messages, and push the verified branch. Broad changes should use a branch and pull request.

## Local Configuration

MCP and Codex configuration stays local. `.codex/config.example.toml` is safe to share; `.codex/config.toml`, tokens, OAuth secrets, API keys, and credentials must never be committed.
