# Phased Task List

## Phase 0: Repository And Bootstrap

- [x] Create or connect `Gnaroshi/gnaroshi.github.io`.
- [x] Create planning documents.
- [x] Confirm GitHub authentication and push access.
- [x] Confirm default branch is `main`.
- [x] Confirm remote points to `Gnaroshi/gnaroshi.github.io`.
- [ ] Keep repository free of old Lab-LVM code.

## Phase 1: Astro Scaffold

- [x] Scaffold Astro with TypeScript.
- [x] Add MDX support.
- [x] Configure strict TypeScript settings.
- [x] Configure package scripts:
  - `dev`
  - `build`
  - `preview`
  - `check`
- [x] Add base `astro.config.mjs`.
- [x] Add `tsconfig.json`.
- [x] Add initial `src/` and `public/` structure.
- [x] Add `public/CNAME` with `gnaroshi.dev`.
- [x] Do not add visual templates beyond minimal working pages.

## Phase 2: Design System And Layout

- [ ] Add `src/styles/tokens.css`.
- [ ] Add `src/styles/global.css`.
- [ ] Implement light theme tokens.
- [ ] Add dark theme tokens if feasible.
- [ ] Build `BaseLayout.astro`.
- [ ] Build `SiteHeader` and `SiteFooter`.
- [ ] Add responsive layout primitives.
- [ ] Add prose styling for technical writing.
- [ ] Add accessible focus states.
- [ ] Verify mobile layout.

## Phase 3: Homepage, About, Research, Projects

- [ ] Create `src/data/profile.ts`.
- [ ] Implement `/`.
- [ ] Implement `/about`.
- [ ] Implement `/research`.
- [ ] Implement `/projects`.
- [ ] Add project content collection.
- [ ] Add project cards.
- [ ] Add at least one placeholder project entry only if content is clearly marked as draft/sample.
- [ ] Ensure personal data is imported from `profile.ts`.

## Phase 4: Blog System

- [ ] Add blog content collection schema.
- [ ] Add `/blog`.
- [ ] Add `/blog/[slug]`.
- [ ] Add MDX rendering.
- [ ] Add reading time utility.
- [ ] Add tag rendering.
- [ ] Add series support.
- [ ] Add table of contents.
- [ ] Add code highlighting.
- [ ] Add math support.
- [ ] Add SEO metadata.
- [ ] Add Open Graph metadata.
- [ ] Add RSS feed if simple.

## Phase 5: Paper Reading Tracker

- [ ] Add paper content collection schema.
- [ ] Add `/papers`.
- [ ] Add `/papers/[slug]`.
- [ ] Implement paper reading stats utilities.
- [ ] Implement daily activity heatmap.
- [ ] Implement current streak.
- [ ] Implement longest streak.
- [ ] Implement week/month/year counts.
- [ ] Implement deep read count.
- [ ] Implement implemented/reproduced count.
- [ ] Implement search.
- [ ] Implement filters by status, depth, tag, year, and difficulty.
- [ ] Implement sorting by latest, difficulty, reading time, and depth.
- [ ] Add paper cards or rows.
- [ ] Add individual paper page layout with three-pass sections.

## Phase 6: GitHub Pages Deployment

- [ ] Configure Astro for GitHub Pages custom domain deployment.
- [ ] Add GitHub Actions workflow.
- [ ] Ensure workflow builds static output.
- [ ] Ensure Pages artifact upload is configured.
- [ ] Confirm `public/CNAME` is included in build output.
- [ ] Verify `https://gnaroshi.dev` points to GitHub Pages.
- [ ] Verify canonical URLs use `https://gnaroshi.dev`.

## Phase 7: Polish, Accessibility, SEO

- [ ] Run build checks.
- [ ] Run Astro checks.
- [ ] Test responsive views.
- [ ] Check keyboard navigation.
- [ ] Check color contrast.
- [ ] Check heading order.
- [ ] Validate metadata.
- [ ] Validate RSS if implemented.
- [ ] Optimize images and static assets.
- [ ] Review performance.
- [ ] Remove unused dependencies.
- [ ] Update AGENTS.md if commands or structure change.

## Guardrails For All Phases

- [ ] Do not recover or reference old Lab-LVM code.
- [ ] Do not introduce a backend without explicit approval.
- [ ] Do not introduce a database without explicit approval.
- [ ] Do not add OAuth in MVP.
- [ ] Keep content and UI separate.
- [ ] Keep the site static-export compatible.
- [ ] Prefer simple, maintainable implementation over clever abstractions.
