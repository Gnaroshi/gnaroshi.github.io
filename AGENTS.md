# AGENTS.md

This repository is the presentation layer for `https://gnaroshi.dev`, a personal academic homepage, research blog, and public paper-reading record.

It is not a canonical authoring repository. Public blog and paper data must come only from `Gnaroshi/gnaroshi-content-feed`.

## Read First

Before structural changes, read:

- `docs/architecture.md`
- `docs/content-import.md`
- `docs/deployment.md`
- `docs/local-development.md`
- `docs/design.md`
- `docs/i18n.md`
- `docs/i18n-terminology.md`

## Stack

- Astro 7 static output
- TypeScript
- MDX imported from the public feed
- React only for interactive presentation islands
- Plain CSS and tokens in `src/styles/tokens.css`
- GitHub Pages through GitHub Actions

There is no backend, database, OAuth, authoring CLI, AI client, or private content checkout in this repository.

## Commands

```bash
npm run content:pull
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run content:check
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run check:i18n
npm run check:links
```

- `content:pull`: clone or fast-forward the public feed in ignored `.content-feed/`.
- `content:check`: validate the manifest version, directory contract, and source commit metadata.
- `dev`, `check`, and `build`: fail before Astro starts when the feed is unavailable or incompatible.
- `check:links`: run after `build`.

Use `CONTENT_FEED_PATH` for an existing local public-feed checkout. Never point it to private paper or writing repositories.

## Ownership

Website-owned:

- Astro pages, layouts, and UI components
- English/Korean localization
- SEO, RSS, sitemap, accessibility, and theme
- Public navigation and route tests
- `src/data/profile.ts`, locale-aware profile data, research copy, and project metadata
- presentation adapters in `src/utils/`

Feed-owned:

- `.content-feed/blog/`
- `.content-feed/papers/`
- `.content-feed/data/`
- `.content-feed/assets/`
- `.content-feed/manifest.json`

Studio-owned:

- content schemas and domain rules
- paper and writing authoring
- AI review and oral-exam generation
- formula/question/weekly/graph builders
- publishing and repository writes

The website may format dates, filter public records, calculate reading time for display, and adapt feed records to UI props. It must display canonical Growth snapshots, weekly reviews, activity, and graph data from the feed without recomputing private-source metrics.

## Content Loading

`src/content.config.ts` maps feed schema version 1 into the existing Astro presentation types. Local `src/content/projects/` remains website-owned. Do not recreate local blog, paper, queue, or implementation source directories.

The initial `bootstrap-empty` feed is valid only when every declared entry count is zero. Generated feeds must include `blog/`, `papers/`, and `data/`.

Every production build exposes website and imported-feed commits through meta tags and `/build-info.json`. Development-only diagnostics use `/dev-diagnostics/content-feed/` and must not be emitted in production.

## Routing

Keep English unprefixed and Korean under `/ko/`. Preserve existing public route shapes, including `/blog/[slug]/`, `/papers/[slug]/`, `/growth/`, `/week/`, and `/graph/`.

Use shared locale-aware views. Never add `/en/` or `/kr/` routes. Do not render silent English fallback content at a Korean content URL.

## Coding Rules

- Use TypeScript and static-compatible Astro APIs.
- Keep React limited to search, filter, theme, and other genuine islands.
- Keep Node filesystem access in build-time feed adapters only; never bundle it into client islands.
- Keep personal identity centralized in `src/data/profile.ts`.
- Keep feed-specific compatibility logic out of UI components.
- Avoid unnecessary dependencies and large chart libraries.
- Do not commit `.content-feed/`, `dist/`, credentials, local caches, or machine-specific files.
- Do not write into the content-feed checkout.

## Design And Accessibility

- Maintain the minimal academic/editorial design.
- Keep application mode limited to public Paper Lab and Growth views.
- Use semantic landmarks and heading order.
- Preserve visible focus states, keyboard navigation, contrast, and mobile overflow protection.
- Keep graph list fallback and heatmap labels accessible.
- Do not expose developer or authoring instructions on public pages.

## Prohibited Changes

- Do not import `gnaroshi-paper-lab` or `gnaroshi-writing`.
- Do not add private repository tokens or a cross-repository PAT.
- Do not create paper files, blog drafts, or implementation records here.
- Do not add OpenAI calls, review generation, scoring scripts, publishing scripts, or an authoring CLI.
- Do not add `apps/api`, a database, OAuth, or a server runtime.
- Do not recompute canonical Growth, weekly review, or graph outputs from page content.
- Do not set an Astro repository subpath base.

## Verification

For code changes:

```bash
npm run content:check
npm run check
npm run build
npm run check:i18n
npm run check:links
```

For route or interaction changes, also run `npm run test:e2e` and `npm run test:a11y`.

## Git Discipline

- Start with `git status --short --branch`.
- Keep commits focused and use conventional commit messages.
- For each file-changing prompt, verify, commit, and push unless blocked or explicitly told not to.
- Prefer a branch and PR for broad architecture changes.
- Report the commit, pushed branch, checks, failures, and deployment state.
