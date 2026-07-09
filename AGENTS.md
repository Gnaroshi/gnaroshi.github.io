# AGENTS.md

This repository is the source for `https://gnaroshi.dev`, a personal academic/research homepage, research blog, and paper reading tracker for Gnaroshi.

Old Lab-LVM code was intentionally deleted and backed up elsewhere. Do not recover, reference, or migrate it.

## Project Identity

- Site name: Gnaroshi
- Domain: https://gnaroshi.dev
- Repository: Gnaroshi/gnaroshi.github.io
- Type: personal homepage, research blog, and paper reading tracker.
- Tone: personal, technical, clean, research-oriented.

This is not a corporate site and not a lab homepage.

## Current Status

The Astro app scaffold exists. It uses Astro 7, TypeScript, MDX, React islands, static output, and `npm` scripts.

Before changing product, design, architecture, or content behavior, read:

- `docs/product.md`
- `docs/design.md`
- `docs/architecture.md`
- `docs/content-model.md`
- `docs/paper-reading-system.md`
- `docs/tasks.md`

## Intended Stack

- Astro
- TypeScript
- MDX
- React only for dynamic islands
- CSS modules or plain CSS with design tokens
- No database
- No backend
- No OAuth in MVP
- GitHub Pages deployment through GitHub Actions

Do not introduce backend dependencies, server runtimes, databases, OAuth, or CMS infrastructure without explicit user approval.

## Development Commands

After Phase 1 scaffolding, expected commands are:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run check
```

The app disables Astro telemetry in package scripts to avoid writing global config during local and CI checks.

## Expected Project Structure

Target structure after scaffolding:

```text
src/
  components/
    SiteFooter.astro
    SiteHeader.astro
    SEO.astro
    ThemeToggle.tsx
  content/
    blog/
    papers/
    projects/
  data/
    profile.ts
  layouts/
    BaseLayout.astro
  utils/
  pages/
  styles/
public/
  CNAME
docs/
```

Astro 7 content collections are defined in `src/content.config.ts` using `glob()` loaders. Do not reintroduce legacy `src/content/config.ts`.

## Coding Conventions

- Use TypeScript.
- Use Astro for static routes and layouts.
- Use MDX for content.
- Use React only for isolated interactive islands.
- Keep content and UI separate.
- Keep personal identity data centralized in `src/data/profile.ts`.
- Keep lightweight editable page data in `src/data/*.ts`.
- Project cards currently come from `src/data/projects.ts`; use `src/content/projects/` later for long-form MDX writeups.
- Keep design tokens centralized in `src/styles/tokens.css`.
- Keep utilities in `src/lib/`.
- Prefer semantic HTML and accessible defaults.
- Keep the site static-export compatible.
- Avoid unnecessary dependencies.

## Design Principles

- Minimal academic homepage.
- Blog-first.
- Dense but readable.
- Fast page loads.
- Beautiful typography.
- Mobile friendly.
- Research-note friendly.
- Light/dark theme support if feasible.
- Avoid heavy animation.
- Avoid generic portfolio templates.

## Adding A Blog Post

The blog system exists:

1. Add a Markdown or MDX file under `src/content/blog/`.
2. Use the frontmatter schema from `docs/content-model.md`.
3. Include `title`, `description`, `pubDate`, `draft`, `tags`, and `featured`.
4. Use MDX only when components are needed.
5. Keep tags lowercase kebab-case.
6. Run checks before committing.

## Adding A Paper Log

After the paper system exists:

1. Add a Markdown or MDX file under `src/content/papers/`.
2. Use the paper schema from `docs/content-model.md`.
3. Track status, depth, difficulty, reading minutes, and dates.
4. Use the three-pass note sections:
   - `Why I Read This`
   - `Pass 1: Skim`
   - `Pass 2: Structure`
   - `Pass 3: Deep Dive`
   - `Questions`
   - `Implementation Notes`
   - `Links`
5. Partial progress is valid and should be represented honestly.

## Testing And Verification

When the app exists, run:

```bash
npm run check
npm run build
```

For UI changes, also run the dev server and inspect the affected pages in a browser when possible.

For content-only changes, schema validation and build are usually sufficient.

## Deployment

Deployment target is GitHub Pages with custom domain:

```text
gnaroshi.dev
```

The app should eventually include:

- `public/CNAME`
- GitHub Actions workflow for Pages deployment
- Canonical URLs based on `https://gnaroshi.dev`

Do not add deployment workflow before the app scaffold exists.

## Commit Discipline

- Keep commits focused.
- Do not include generated build output unless explicitly required.
- Do not mix app scaffolding with unrelated content changes.
- Do not add random templates.
- Do not reintroduce old Lab-LVM files.
- For every future user prompt that changes files, create a git commit after verification.
- Use clear conventional commit messages when possible.
- Include enough detail in commit bodies or final reports for the work to be auditable later.
- Push completed commits to GitHub unless the user explicitly asks not to push or credentials/network access are blocked.

## GitHub Logging Policy

Future Codex sessions should leave a clear trail on GitHub:

- For small, direct changes on `main`, commit and push with a concise message plus a detailed final summary.
- For larger work, risky changes, or multi-step features, prefer a branch and pull request when practical.
- PR descriptions should summarize the goal, important implementation details, verification commands, and known follow-up work.
- If a PR cannot be opened because tooling, auth, or network access is blocked, push the branch if possible and report the exact blocker.
- If a prompt only asks a question and no files change, do not create an empty commit; instead report the commands run and findings clearly.
- Always report the final commit hash, pushed branch, verification results, and any failed commands.

## Future Codex Workflow

Before making changes:

1. Check `git status --short --branch`.
2. Read the relevant planning document.
3. Make the smallest complete change for the requested phase.
4. Run appropriate checks.
5. Commit and push file changes.
6. Report changed files, commands run, verification results, commit hash, and any failures.
