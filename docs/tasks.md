# Phased Task List

## Current Status Summary

- [x] Homepage and core static pages
- [x] MDX blog system
- [x] Paper reading tracker content model and dashboard
- [x] Learning-loop feature pack for queue, reviews, formula recall, Future Me, and questions
- [x] Research-output feature pack for graph, weekly reviews, implementation attempts, visibility, and paper-to-blog drafts
- [x] GitHub Pages deployment
- [x] Optional Cloudflare Worker and live oral-exam frontend scaffold
- [x] Product-level redesign, evidence gates, accessibility, and route QA
- [x] Multi-repository cutover to public content-feed imports
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
  - `content:pull`
  - `content:check`
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
- [x] Split global and feature CSS into maintainable modules.
- [x] Add editorial and application visual modes.
- [x] Add concise desktop navigation and accessible mobile menu.
- [x] Add Paper Lab local navigation.
- [x] Run a full site-wide visual QA pass in light/dark desktop, tablet, and mobile views.

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

## Phase 4: Blog Presentation

- [x] Add feed-backed blog content collection schema.
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

## Phase 5: Paper Reading Presentation

- [x] Add feed-backed paper content collection schema.
- [x] Move paper templates and creation commands to `gnaroshi-paper-lab` and `gnaroshi-studio`.
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
- [x] Run full responsive pass across all routes.
- [x] Check keyboard navigation for global navigation and representative interactive controls.
- [x] Run axe color/semantic checks across light and dark capable routes.
- [x] Check heading order across all public routes.
- [x] Add route, navigation, accessibility, empty-state, and visual Playwright suites.
- [x] Add internal-link, public-copy, evidence-integrity, and empty-shell checks.
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
- [x] Add implementation attempt tracker.
- [x] Add weekly research reviews.
- [x] Add static research graph.
- [x] Add paper-to-blog promotion script.
- [x] Add visibility controls for public, unlisted, and hidden content.
- [ ] Add real project MDX writeups.
- [x] Add a factual detail page for the consolidated gnaroshi.dev project.
- [ ] Add real public implementation attempts.
- [ ] Add richer graph visualization only if the static list explorer becomes insufficient.
- [ ] Add paper BibTeX export.
- [ ] Add paper revisit reminders as static metadata.
- [ ] Add richer blog search if post volume grows.
- [ ] Add social preview image assets.
- [x] Add localized-ready custom 404 page.
- [ ] Add lightweight analytics only with explicit approval.
- [ ] Add MCP-assisted local workflow only through untracked local config.
- [x] Move the optional Cloudflare Worker and AI endpoints to `gnaroshi-api`.
- [x] Add WebRTC, text, and manual oral-exam frontend fallbacks.
- [ ] Deploy `api.gnaroshi.dev` from `gnaroshi-api` and register `OPENAI_API_KEY` as a Worker secret.
- [ ] Set the GitHub Actions variable `PUBLIC_AI_API_BASE_URL` after Worker deployment.

## Guardrails For All Phases

- [ ] Do not recover or reference old Lab-LVM code.
- [ ] Do not introduce a backend or database into the website repository.
- [ ] Do not add OAuth in MVP.
- [ ] Do not commit secrets or local MCP configuration.
- [ ] Keep content and UI separate.
- [ ] Keep the site static-export compatible.
- [ ] Prefer simple, maintainable implementation over clever abstractions.

## Phase 8: English And Korean Localization

- [x] Configure Astro for unprefixed English and `/ko/` Korean routes.
- [x] Add typed page and React-island dictionaries with parity validation.
- [x] Refactor core routes to shared locale-aware views.
- [x] Localize the global shell, Paper Lab navigation, themes, and interactive dashboards.
- [x] Add locale-aware static profile, research, project, skill, and current-focus data.
- [x] Pair English and Korean blog content with stable translation keys.
- [x] Add localized dates, numbers, tag labels, RSS, canonical URLs, and `hreflang` metadata.
- [x] Add Korean typography and 390px overflow checks.
- [x] Add i18n, hardcoded-UI, and translation-link validation scripts.
- [ ] Translate future paper notes selectively when owner review is available.
- [ ] Review newly added Korean research claims with the owner before publication.

## Phase 9: Multi-Repository Cutover

- [x] Keep canonical paper content in private `gnaroshi-paper-lab`.
- [x] Keep canonical writing in private `gnaroshi-writing`.
- [x] Generate public projections through private `gnaroshi-studio`.
- [x] Consume only public `gnaroshi-content-feed` in Astro and Pages Actions.
- [x] Keep Worker code and secrets outside the website in private `gnaroshi-api`.
- [x] Remove website authoring, AI generation, publishing, and API responsibilities.
