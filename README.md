# gnaroshi.dev

Personal research homepage, blog, and paper reading tracker for [gnaroshi.dev](https://gnaroshi.dev).

This site is built as a static Astro project with TypeScript, MDX, and small React islands only where interactivity is useful.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Check

```bash
npm run check
```

## Deploy

The site deploys to GitHub Pages through GitHub Actions.

- Pushing to `main` triggers `.github/workflows/deploy.yml`.
- The workflow builds the Astro static site and deploys the generated Pages artifact.
- GitHub repository Settings -> Pages -> Build and deployment -> Source should be set to **GitHub Actions**.
- The custom domain should be set to `gnaroshi.dev`.
- `public/CNAME` contains `gnaroshi.dev` so the built artifact keeps the custom domain file.
- DNS for `gnaroshi.dev` must point to GitHub Pages.
- `www.gnaroshi.dev` can be configured separately with a CNAME record if desired.
- Enable **Enforce HTTPS** after GitHub finishes issuing the certificate.

Manual repository settings, DNS records, and troubleshooting notes are documented in `docs/deployment.md`.

## Edit Profile Data

Primary identity data lives in:

```text
src/data/profile.ts
```

Edit that file for display name, headline, short bio, interests, location, and public links.

Additional editable page data lives in:

```text
src/data/skills.ts
src/data/timeline.ts
src/data/research.ts
src/data/projects.ts
src/data/now.ts
```

Project cards currently use `src/data/projects.ts` because the early homepage needs lightweight, editable project metadata. Longer technical project writeups can later be added under `src/content/projects/`.

## Add A Blog Post

Add an MDX file under:

```text
src/content/blog/
```

Use this frontmatter:

```yaml
---
title: "Post title"
description: "Short description"
pubDate: 2026-07-09
updatedDate:
draft: false
tags:
  - ai
  - research
series:
seriesOrder:
heroImage:
readingTime:
featured: false
---
```

Drafts are hidden in production builds when `draft: true`. Tags should be lowercase kebab-case and generate static tag pages under `/blog/tags/[tag]`. The blog supports MDX, code blocks, math, table of contents, series navigation, archive pages, and RSS at `/rss.xml`.

## Add A Paper Log

Create a new draft paper log with:

```bash
npm run paper:new
```

The helper writes a file under:

```text
src/content/papers/
```

It uses today's local date and never overwrites an existing file. Paper logs default to `draft: true`; set `draft: false` when the note should be public. The schema and status/depth definitions are documented in `docs/content-model.md` and `docs/paper-reading-system.md`.

## AI Paper Review

Paper notes can be reviewed by an AI-assisted CLI that scores evidence of written understanding and three-pass reading discipline. It does not run in the browser and does not expose API keys.

Local setup:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

Store those values in untracked `.env.local`, then run:

```bash
npm run paper:review -- --slug <paper-slug>
npm run paper:review:all -- --dry-run
npm run paper:review:validate
```

Generated JSON lives in `src/generated/paper-reviews/` and renders on paper detail pages when `reviewVisibility` is `public`. Full documentation is in `docs/ai-paper-review.md`.
