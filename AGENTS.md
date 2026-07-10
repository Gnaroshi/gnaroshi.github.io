# AGENTS.md

This repository is the source for `https://gnaroshi.dev`, a personal academic/research homepage, research blog, and paper reading tracker for Gnaroshi.

Old Lab-LVM code was intentionally deleted and backed up elsewhere. Do not recover, reference, or migrate it.

## Project Purpose

- Introduce Gnaroshi as an AI/software researcher.
- Serve as a personal homepage.
- Host a serious technical blog for notes, research logs, paper summaries, and project writeups.
- Track daily paper reading through Markdown/MDX files.
- Show GitHub-contribution-style paper reading activity.
- Support a three-pass paper reading workflow.
- Deploy as a static GitHub Pages site at `https://gnaroshi.dev`.

The tone is personal, technical, clean, and research-oriented. This is not a corporate site, a generic portfolio template, or a lab homepage.

## Planning Documents

Before changing product, design, architecture, content behavior, or major structure, read the relevant files:

- `docs/product.md`
- `docs/design.md`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/paper-reading-system.md`
- `docs/tasks.md`
- `docs/deployment.md`
- `docs/codex-workflow.md`

## Stack

- Astro 7
- TypeScript
- MDX
- React only for interactive islands
- Plain CSS with design tokens in `src/styles/tokens.css`
- Astro content collections in `src/content.config.ts`
- Static output
- GitHub Pages deployment through GitHub Actions

Do not introduce backend dependencies, server runtimes, databases, OAuth, CMS infrastructure, or secret-dependent services without explicit user approval.

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
npm run paper:new
npm run paper:review -- --slug <paper-slug>
npm run paper:review:all -- --dry-run
npm run paper:review:validate
npm run paper:review:import -- --slug <paper-slug> --file review.json
npm run paper:from-queue -- --slug <queue-slug>
npm run questions:build
npm run formula:score -- --slug <paper-slug> --file attempt.json
```

- `npm run dev`: start local Astro dev server.
- `npm run check`: run Astro/TypeScript diagnostics.
- `npm run build`: build the static site into `dist/`.
- `npm run preview`: preview the built static site.
- `npm run paper:new`: create a draft paper log in `src/content/papers/`.
- `npm run paper:review`: generate one AI paper review JSON from local CLI or GitHub Actions.
- `npm run paper:review:all`: review all non-draft paper logs; use `--dry-run` before API-backed runs.
- `npm run paper:review:validate`: validate generated AI paper review JSON.
- `npm run paper:review:import`: import JSON returned by a manual ChatGPT review prompt.
- `npm run paper:from-queue`: create a draft paper log from a queue item.
- `npm run questions:build`: build `src/generated/question-bank/question-bank.json`.
- `npm run formula:score`: score an exported formula recall attempt without an API.

The package scripts disable Astro telemetry to avoid global config writes during local and CI checks.

## Routing

Main routes:

- `/`
- `/about`
- `/research`
- `/projects`
- `/blog`
- `/blog/[slug]`
- `/blog/tags/[tag]`
- `/blog/archive`
- `/papers`
- `/papers/[slug]`
- `/papers/[slug]/formula`
- `/queue`
- `/queue/[slug]`
- `/reviews`
- `/reviews/due`
- `/formula`
- `/questions`
- `/questions/[id]`
- `/now`
- `/contact`
- `/rss.xml`

Use Astro file-based routes. Use `getStaticPaths` for dynamic blog and paper pages.

## Content And Data Locations

- Blog posts: `src/content/blog/`
- Paper logs: `src/content/papers/`
- Paper reading queue: `src/content/queue/`
- Future long-form project writeups: `src/content/projects/`
- Content collection schemas: `src/content.config.ts`
- Primary profile data: `src/data/profile.ts`
- Skills/timeline/research/project/now data: `src/data/*.ts`
- Shared layouts: `src/layouts/`
- Components: `src/components/`
- Utilities: `src/utils/`
- Design tokens: `src/styles/tokens.css`
- Global styles: `src/styles/global.css`
- Static assets and `CNAME`: `public/`
- Generated AI paper reviews: `src/generated/paper-reviews/`
- Generated question bank: `src/generated/question-bank/`
- Generated formula recall attempts: `src/generated/formula-recall/`
- Generated oral exam data: `src/generated/oral-exams/`

Astro 7 content collections are defined in `src/content.config.ts` using `glob()` loaders. Do not create or reintroduce legacy `src/content/config.ts`.

## Coding Rules

- Use TypeScript.
- Keep content and UI separate.
- Keep personal identity data centralized in `src/data/profile.ts`.
- Prefer editable data files over hardcoding repeated personal data in components.
- Keep React limited to isolated islands such as paper filtering, search, and theme controls.
- Do not turn the site into a full React app.
- Keep utilities small and local to `src/utils/`.
- Keep the site static-export compatible.
- Avoid unnecessary dependencies.
- Do not commit generated `dist/`, local caches, or machine-specific files.
- Never expose `OPENAI_API_KEY`, `OPENAI_MODEL`, or any API secret in client-side code.
- AI review scripts must run only server-side through local Node CLI or GitHub Actions.
- Generated AI paper review files must follow the schema documented in `docs/ai-paper-review.md`.
- AI review copy must be motivational, constructive, and evidence-based. Do not frame scores as intelligence, IQ, or personal worth.
- Calibrate AI review scores with `docs/ai-review-rubric-examples.md`. Do not over-score vague notes.

## Design Rules

- Minimal academic homepage.
- Blog-first and research-note friendly.
- Dense but readable.
- Fast page loads.
- Strong typography over decoration.
- Neutral palette with one quiet accent color.
- Light/dark theme support through CSS variables.
- No heavy animation.
- No decorative gradient blobs, corporate landing-page treatment, or generic portfolio template style.
- Use dashboard width only for dense interfaces such as `/papers`.
- Keep cards for repeated items, tools, and bounded panels; avoid nested card layouts.

## Accessibility Rules

- Use semantic HTML landmarks and heading order.
- Keep navigation keyboard accessible.
- Provide visible focus states.
- Maintain sufficient contrast in light and dark themes.
- Give interactive controls accessible names.
- Do not rely on hover-only behavior.
- Keep filters, toggles, and heatmap cells keyboard usable where feasible.
- Check mobile layouts for overflow and text clipping.

## Adding A Blog Post

1. Add a Markdown or MDX file under `src/content/blog/`.
2. Use the blog frontmatter schema in `docs/content-model.md`.
3. Include `title`, `description`, `pubDate`, `draft`, `tags`, and `featured`.
4. Use MDX only when components are needed.
5. Keep tags lowercase kebab-case.
6. Use `draft: true` until the post should appear publicly.
7. Run `npm run check` and `npm run build` before committing.

## Adding A Paper Log

1. Prefer:

```bash
npm run paper:new
```

2. Edit the generated draft under `src/content/papers/`.
3. Use the paper schema in `docs/content-model.md`.
4. Track `status`, `depth`, `priority`, `difficulty`, `readingTimeMinutes`, and `readDate`.
5. Keep generated notes as `draft: true` until they should appear publicly.
6. Use the three-pass sections:
   - `Why I Opened This`
   - `Pass 1: Skim`
   - `Pass 2: Structure`
   - `Pass 3: Deep Dive`
   - `Questions`
   - `Implementation Notes`
   - `Links`
7. Partial progress is valid and should be represented honestly.

## Adding A Queue Item

1. Add a Markdown or MDX file under `src/content/queue/`.
2. Use the queue schema in `docs/learning-loop-features.md`.
3. Keep `visibility: "hidden"` until the item should be public.
4. Convert to a draft paper log with:

```bash
npm run paper:from-queue -- --slug <queue-slug>
```

5. Add `--mark-converted` only when the queue item should be updated after conversion.

## Adding An AI Paper Review

1. Write or update a paper log under `src/content/papers/`.
2. Keep secrets in untracked `.env.local`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

3. Generate a review:

```bash
npm run paper:review -- --slug <paper-slug>
```

4. Use `--force` to re-review and append score history.
5. Use `--dry-run` to inspect targets without API calls or file writes.
6. Run `npm run paper:review:validate` after generated review JSON changes.
7. Set `reviewVisibility: "hidden"` in paper frontmatter if the JSON should exist but not render publicly.
8. Do not call OpenAI from browser code. Do not commit `.env.local` or workflow secrets.

Manual no-API review prompts are available on paper detail pages. Use `npm run paper:review:import -- --slug <paper-slug> --file review.json` to import returned JSON. See `docs/manual-ai-review.md`.

See `docs/ai-paper-review.md` for scoring dimensions and workflow details.

## Learning Loop Features

- Review due logic lives in `src/utils/reviewDue.ts`.
- Queue logic lives in `src/utils/queue.ts`.
- Formula recall logic lives in `src/utils/formulaRecall.ts`.
- Question bank logic lives in `src/utils/questionBank.ts`.
- Browser practice state is localStorage-only and must not be described as saved to GitHub.
- Permanent review or recall state must be committed as paper frontmatter or generated JSON.
- See `docs/learning-loop-features.md` before changing these workflows.

## Adding Projects

- Lightweight project cards currently come from `src/data/projects.ts`.
- Keep project entries honest. Do not expose developer-facing sample or placeholder language on public pages.
- Use tags, status, links, and `featured` flags consistently.
- For long-form technical writeups, add MDX files under `src/content/projects/` after the project content collection is ready.
- Do not invent formal publications, awards, or achievements.

## Build And Verification

For most code changes:

```bash
npm run check
npm run build
```

For UI changes, also run a local dev or preview server and inspect the affected pages in a browser when possible.

For content-only changes, schema validation and build are usually sufficient.

## Deployment

Deployment target:

```text
https://gnaroshi.dev
```

Deployment files:

- `astro.config.mjs` with `site: "https://gnaroshi.dev"` and no `base`
- `public/CNAME` containing exactly `gnaroshi.dev`
- `.github/workflows/deploy.yml`

Deployment flow:

1. Push to `main`.
2. GitHub Actions runs `Deploy to GitHub Pages`.
3. The workflow builds Astro, uploads a Pages artifact, and deploys it.
4. GitHub Pages serves the custom domain.

GitHub repository Settings -> Pages should use GitHub Actions as the source, with `gnaroshi.dev` as the custom domain and HTTPS enforced after certificate provisioning.

See `docs/deployment.md` for DNS, HTTPS, and 404 troubleshooting.

## Codex And MCP Notes

- Future Codex sessions should start with this file and the relevant docs under `docs/`.
- Project-scoped Codex guidance lives in `.codex/README.md`.
- `.codex/config.example.toml` is safe to commit and contains no secrets.
- Real MCP configuration, tokens, API keys, OAuth secrets, and credentials must stay local and untracked.
- `.codex/config.toml` is ignored on purpose.

## What Not To Do

- Do not recover, reference, or migrate old Lab-LVM code.
- Do not add backend services, databases, OAuth, or server runtimes without explicit approval.
- Do not commit secrets, API keys, OAuth tokens, personal credentials, or local MCP configs.
- Do not add browser-side AI API calls or expose OpenAI API keys in bundled JavaScript.
- Do not set `base: "/gnaroshi.github.io/"`; this is a user site with a custom root domain.
- Do not use a `gh-pages` branch unless the deployment strategy is explicitly changed.
- Do not commit `dist/`.
- Do not add random templates or scaffold unrelated design systems.
- Do not hardcode personal data across many components.
- Do not imply browser-side edits save to GitHub.
- Do not add heavy UI frameworks or animation libraries without a clear need.

## Commit Discipline

- Keep commits focused.
- For every user prompt that changes files, create a git commit after verification.
- Use clear conventional commit messages when possible.
- Push completed commits to GitHub unless the user explicitly asks not to push or credentials/network access are blocked.
- Always report the final commit hash, pushed branch, verification results, and any failed commands.

## GitHub Logging Policy

- For small, direct changes on `main`, commit and push with a concise message plus a detailed final summary.
- For larger work, risky changes, or multi-step features, prefer a branch and pull request when practical.
- PR descriptions should summarize the goal, important implementation details, verification commands, and known follow-up work.
- If a PR cannot be opened because tooling, auth, or network access is blocked, push the branch if possible and report the exact blocker.
- If a prompt only asks a question and no files change, do not create an empty commit.

## Future Codex Workflow

Before making changes:

1. Check `git status --short --branch`.
2. Read the relevant planning document.
3. Make the smallest complete change for the requested phase.
4. Run appropriate checks.
5. Commit and push file changes.
6. Report changed files, commands run, verification results, commit hash, and any failures.
