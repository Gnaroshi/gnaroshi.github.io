# Phased Task List

## Current Status Summary

- [x] Homepage and core static pages
- [x] MDX blog system
- [x] Paper reading tracker content model and dashboard
- [x] Learning-loop feature pack for queue, reviews, formula recall, Future Me, and questions
- [x] GitHub Pages deployment
- [ ] Full polish, accessibility, SEO, and performance pass
- [ ] Future feature expansion

## Phase 0: Repository And Bootstrap

- [x] Create or connect `Gnaroshi/gnaroshi.github.io`.
- [x] Create planning documents.
- [x] Confirm GitHub authentication and push access.
- [x] Confirm default branch is `main`.
- [x] Confirm remote points to `Gnaroshi/gnaroshi.github.io`.
- [x] Keep repository free of old Lab-LVM code.

## Phase 1: Astro Scaffold

- [x] Scaffold Astro with TypeScript.
- [x] Add MDX support.
- [x] Configure strict TypeScript settings.
- [x] Configure package scripts:
  - `dev`
  - `build`
  - `preview`
  - `check`
  - `paper:new`
- [x] Add base `astro.config.mjs`.
- [x] Add `tsconfig.json`.
- [x] Add initial `src/` and `public/` structure.
- [x] Add `public/CNAME` with `gnaroshi.dev`.
- [x] Do not add visual templates beyond minimal working pages.

## Phase 2: Design System And Layout

- [x] Add `src/styles/tokens.css`.
- [x] Add `src/styles/global.css`.
- [x] Implement light theme tokens.
- [x] Add dark theme tokens.
- [x] Build `BaseLayout.astro`.
- [x] Build `SiteHeader` and `SiteFooter`.
- [x] Add responsive layout primitives.
- [x] Add prose styling for technical writing.
- [x] Add accessible focus states.
- [x] Verify mobile layout for implemented dashboard and core pages.
- [ ] Run a full site-wide visual QA pass after more real content exists.

## Phase 3: Homepage, About, Research, Projects

- [x] Create `src/data/profile.ts`.
- [x] Implement `/`.
- [x] Implement `/about`.
- [x] Implement `/research`.
- [x] Implement `/projects`.
- [x] Add project content collection schema.
- [x] Add project cards from structured data.
- [x] Add honest early project entries without developer-facing placeholder copy.
- [x] Ensure personal data is imported from `profile.ts`.
- [ ] Add real project writeups under `src/content/projects/`.

## Phase 4: Blog System

- [x] Add blog content collection schema.
- [x] Add `/blog`.
- [x] Add `/blog/[slug]`.
- [x] Add `/blog/tags/[tag]`.
- [x] Add `/blog/archive`.
- [x] Add MDX rendering.
- [x] Add reading time utility.
- [x] Add tag rendering.
- [x] Add series support.
- [x] Add table of contents.
- [x] Add code highlighting.
- [x] Add math support.
- [x] Add SEO metadata.
- [x] Add Open Graph metadata.
- [x] Add RSS feed.
- [ ] Add deeper real posts over time.
- [ ] Add richer blog search if content volume grows.

## Phase 5: Paper Reading Tracker

- [x] Add paper content collection schema.
- [x] Add paper log template.
- [x] Add `npm run paper:new`.
- [x] Add `/papers`.
- [x] Add `/papers/[slug]`.
- [x] Implement paper reading stats utilities.
- [x] Implement daily activity heatmap.
- [x] Implement current streak.
- [x] Implement longest streak.
- [x] Implement week/month/year counts.
- [x] Implement deep read count.
- [x] Implement implemented/reproduced count.
- [x] Implement search.
- [x] Implement filters by status, depth, tag, year, difficulty, featured, and selected date.
- [x] Implement sorting by latest, title, difficulty, reading time, and depth.
- [x] Add paper cards.
- [x] Add individual paper page layout with three-pass sections.
- [ ] Add real public paper logs.
- [ ] Consider BibTeX/export support later.

## Phase 6: GitHub Pages Deployment

- [x] Configure Astro for GitHub Pages custom domain deployment.
- [x] Keep `base` unset for the user site/custom root domain.
- [x] Add GitHub Actions workflow.
- [x] Ensure workflow builds static output.
- [x] Ensure Pages artifact upload is configured.
- [x] Confirm `public/CNAME` is included in build output.
- [x] Verify canonical URLs use `https://gnaroshi.dev`.
- [x] Configure GitHub Pages custom domain as `gnaroshi.dev`.
- [x] Verify GitHub Actions deployment succeeds.
- [ ] Confirm external DNS propagation from the domain provider.

## Phase 7: Polish, Accessibility, SEO

- [x] Run build checks.
- [x] Run Astro checks.
- [x] Test responsive views for the paper dashboard.
- [x] Add SEO and Open Graph defaults.
- [x] Add RSS.
- [ ] Run full responsive pass across all routes.
- [ ] Check keyboard navigation across all interactive controls.
- [ ] Check color contrast across light and dark themes.
- [ ] Check heading order across all routes.
- [ ] Validate metadata on deployed pages.
- [ ] Validate RSS in a feed reader.
- [ ] Optimize images and static assets.
- [ ] Review performance in a browser.
- [ ] Remove unused dependencies if any appear.
- [ ] Update AGENTS.md if commands or structure change.

## Future Features

- [x] Add paper reading queue.
- [x] Add spaced review due dashboard.
- [x] Add formula recall trainer.
- [x] Add Future Me paper note fields.
- [x] Add generated AI question bank.
- [ ] Add real project MDX writeups.
- [ ] Add richer project detail pages.
- [ ] Add paper reading map or topic graph.
- [ ] Add paper BibTeX export.
- [ ] Add paper revisit reminders as static metadata.
- [ ] Add richer blog search if post volume grows.
- [ ] Add social preview image assets.
- [ ] Add custom 404 page.
- [ ] Add lightweight analytics only with explicit approval.
- [ ] Add MCP-assisted local workflow only through untracked local config.

## Guardrails For All Phases

- [ ] Do not recover or reference old Lab-LVM code.
- [ ] Do not introduce a backend without explicit approval.
- [ ] Do not introduce a database without explicit approval.
- [ ] Do not add OAuth in MVP.
- [ ] Do not commit secrets or local MCP configuration.
- [ ] Keep content and UI separate.
- [ ] Keep the site static-export compatible.
- [ ] Prefer simple, maintainable implementation over clever abstractions.
