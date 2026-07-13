# Live Functional QA Final

Audit date: 2026-07-13 (Asia/Seoul)

## Scope

The audit covers the local production build and, after merge, the deployed GitHub Pages site. It includes functional controls, public wording, English/Korean parity, accessibility, performance, project information, and visual consistency.

## Route Matrix

English and Korean home, About, Research, Projects, all eight project details, Writing, Reading, Activity, Queue, Reviews, Reviews Due, Formula, Questions, Implementations, Graph, Week, Now, Links, and 404 routes are included. Static builds currently emit 54 pages.

Viewports:

- 1440×1000
- 1024×768
- 768×1024
- 430×932
- 390×844
- 360×800

Themes: light and dark. Locales: English and Korean.

## Local Results

- Baseline live/local inventory: 216 page loads, zero HTTP failures, console errors, failed requests, or horizontal overflow.
- Reading Method: mouse, keyboard, and direct-hash behavior passed in EN/KO at desktop, tablet, and mobile sizes.
- Visible buttons: every enabled visible button in the bootstrap build produced an observable state change.
- Navigation: standard route signatures match across every route and locale; the shared locale-detecting 404 exception is documented.
- Project facts: all eight projects expose a visible kind and product status; application integration status remains in secondary technical facts.
- Public copy: 54 built HTML files passed the developer-copy and retired-label scan.
- Content feed: schema v1 `bootstrap-empty` validated at feed commit `0a2b5c5cdaf283e344d896142aedb565659d26f9`.
- Build: 54 static pages emitted successfully with no Astro errors, warnings, or hints from `astro check`.
- E2E: 137 tests passed against a fresh production build.
- Accessibility: 55 axe and keyboard tests passed.
- Visual regression: 48 suites passed across the full route, locale, theme, and viewport matrix.
- Performance: seven representative routes stayed within CSS, JavaScript, image, island, LCP, and CLS budgets.
- Feed contract: 11 valid feed fixtures built and six incompatible or unsafe fixtures were rejected.
- Media: 24 review outputs, 192 approved production variants, and 232 production source files passed validation.
- Links: 2,013 built-site targets and seven bounded external targets passed.

## Screenshots

The full visual suite captured 648 screenshots across all 54 routes, both themes, and six required viewports. The project suite captured 216 screenshots for the index and all eight details in both locales, both themes, and the same six viewports. The focused visual-system suite produced another 196 screenshots. All 12 all-route contact sheets, all 12 project contact sheets, and targeted full-resolution Reading and Project screenshots were reviewed. Generated artifacts remain untracked.

## Accessibility

Automated axe checks cover every QA route. Keyboard checks cover the skip link, primary navigation, Reading Method, theme control, language switch, mobile focus trap, Escape close, outside-click close, and focus restoration. Focus visibility and reduced-motion behavior remain required release gates.

## Deployment Verification

Before this branch, live `build-info.json` matched `origin/main` and the local public feed. Final live verification must compare the merged website commit and expected feed commit, rerun the live interaction matrix, and inspect Home, Projects, all project details, Reading, Korean Reading, Writing, and About.

## Known Limitations

- The public feed is intentionally `bootstrap-empty`; writing, reading analytics, note reviews, recall practice, and Activity remain hidden until public evidence exists.
- The shared GitHub Pages `404.html` uses minimal chrome to avoid a mismatched English header on unknown Korean paths.
- Optional public email, Scholar, CV, and portrait fields are absent and therefore hidden.
- Live post-merge results cannot be recorded until the PR is merged and Pages publishes the exact commit.
- `test:feed-contract` intentionally builds multiple fixture feeds and can leave `dist/` containing the last fixture. Run `npm run build` with the normal `.content-feed/` before preview, E2E, or deployment verification.

## Commands

Passed locally:

```text
npm ci
npm run content:check
npm run check
npm run check:i18n
npm run check:public-copy
npm run check:public-tone
npm run check:project-copy
npm run check:project-readiness
npm run check:launch-content
npm run check:interactive-controls
npm run check:navigation-consistency
npm run check:links
npm run check:links:external
npm run media:check
npm run test:feed-contract
npm run build
npm run test:performance
npm run test:e2e
npm run test:a11y
npm run test:visual
```

The normal feed build was rerun after `test:feed-contract` and before browser tests. The only environment note was the local Node version: the repository requests Node 24 while this machine used Node 26.4.0. Installation and every required check still completed successfully.
