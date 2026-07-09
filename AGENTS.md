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

After the blog system exists:

1. Add a Markdown or MDX file under `src/content/blog/`.
2. Use the frontmatter schema from `docs/content-model.md`.
3. Include title, description, publication date, draft state, and tags.
4. Use MDX only when components are needed.
5. Run checks before committing.

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

## Future Codex Workflow

Before making changes:

1. Check `git status --short --branch`.
2. Read the relevant planning document.
3. Make the smallest complete change for the requested phase.
4. Run appropriate checks.
5. Report changed files, commands run, and any failures.
