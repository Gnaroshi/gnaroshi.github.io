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
npm run score:test
```

Generated research outputs can be rebuilt with:

```bash
npm run week:build
npm run graph:build
```

## Preview

```bash
npm run preview
```

## Check

```bash
npm run check
npm run build
npm run check:public-copy
npm run check:content-metrics
npm run check:links
npm run check:empty-shells
npm run test:e2e
npm run test:a11y
npm run test:visual
```

Run `npm run build` before the `check:*` scripts. The checks scan the generated public site for developer-facing copy, misleading evidence metrics, broken internal links, and empty application shells. Playwright covers routes, mobile navigation, 390px overflow, focused empty states, axe accessibility rules, and the light/dark visual matrix.

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

## Optional Voice Oral Exam API

Live paper oral exams use an optional Cloudflare Worker at `api.gnaroshi.dev`. The Astro site remains static and works without it: paper exam pages keep a copyable manual practice prompt when `PUBLIC_AI_API_BASE_URL` is absent.

Develop and verify the Worker separately:

```bash
cd apps/api
npm install
cp .dev.vars.example .dev.vars
npm run typecheck
npm test
npm run dev
```

Deploy only after adding the OpenAI key as a Worker secret:

```bash
cd apps/api
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```

Then set the GitHub Actions repository variable `PUBLIC_AI_API_BASE_URL=https://api.gnaroshi.dev` and rebuild Pages. Never expose `OPENAI_API_KEY` through Astro, browser JavaScript, GitHub Pages variables, or committed files. Architecture, endpoint, privacy, cost, and failure-mode details are in `docs/cloudflare-worker-api.md`.

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
visibility: "public"
series:
seriesOrder:
sourcePaper:
heroImage:
readingTime:
featured: false
---
```

Drafts are hidden in production builds when `draft: true`. `visibility: "public"` appears in indexes, `unlisted` builds detail pages without index placement, and `hidden` is excluded from public builds. Tags should be lowercase kebab-case and generate static tag pages under `/blog/tags/[tag]`. The blog supports MDX, code blocks, math, table of contents, series navigation, archive pages, and RSS at `/rss.xml`.

## Add A Paper Log

Create a new draft paper log with:

```bash
npm run paper:new
```

The helper writes a file under:

```text
src/content/papers/
```

It uses today's local date and never overwrites an existing file. Paper logs default to `draft: true` and `visibility: "hidden"`; set `draft: false` and `visibility: "public"` when the note should appear publicly. The schema and status/depth definitions are documented in `docs/content-model.md` and `docs/paper-reading-system.md`.

## Learning Loop Tools

The research cockpit includes static-first tools for queueing, reviewing, recalling, and practicing papers:

```bash
npm run paper:from-queue -- --slug <queue-slug>
npm run paper:promote -- --slug <paper-slug>
npm run week:build
npm run graph:build
npm run questions:build
npm run formula:score -- --slug <paper-slug> --file attempt.json
```

Public routes:

- `/queue`
- `/reviews`
- `/formula`
- `/questions`
- `/implementations`
- `/week`
- `/graph`
- `/growth`

Browser practice state is local-only until copied into Markdown frontmatter or committed generated JSON. See `docs/learning-loop-features.md`.

## Research Momentum

`/growth` summarizes public evidence across reading consistency, understanding, retrieval, research output, revisits, and balance. The v2 score reports confidence separately, caps same-day volume, and marks missing data as unavailable instead of silently treating it as zero.

A numeric score remains hidden until the public record has at least five meaningful events, three active dates, two activity categories, and one reading, retrieval, revisit, or implementation event. Before that point, `/growth` and the homepage show `Collecting evidence` with the exact remaining criteria. Seed articles, drafts, hidden/unlisted records, and system content never contribute.

Run the deterministic score scenarios with:

```bash
npm run score:test
```

The formula and data rules are documented in `docs/research-momentum-score.md` and `docs/growth-dashboard.md`. Optional day-level GitHub contribution JSON can be committed under `src/generated/github-contributions/`; no token is used by the static dashboard.

## Research Output System

The site connects research outputs across public content:

- Paper logs live in `src/content/papers/`.
- Blog posts live in `src/content/blog/`.
- Implementation attempts live in `src/content/implementations/`.
- Project cards live in `src/data/projects.ts`.
- Weekly reviews live in `src/generated/weekly-reviews/`.
- Research graph JSON lives in `src/generated/research-graph.json`.

Commands:

```bash
npm run week:build
npm run graph:build
npm run paper:promote -- --slug <paper-slug>
```

Use `visibility: "public"`, `visibility: "unlisted"`, or `visibility: "hidden"` to control public indexes and generated public stats. This is not privacy; committed content in a public repository is still visible in GitHub.

Docs:

- `docs/visibility.md`
- `docs/research-graph.md`
- `docs/weekly-review.md`
- `docs/implementation-tracker.md`
- `docs/paper-to-blog.md`

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
npm run paper:review:import -- --slug <paper-slug> --file review.json
```

Generated JSON lives in `src/generated/paper-reviews/` and renders on paper detail pages when `reviewVisibility` is `public`. Full documentation is in `docs/ai-paper-review.md` and `docs/manual-ai-review.md`.
