# UI/UX Audit — 2026-07-12

This audit followed `docs/design.md`, `docs/public-page-visual-checklist.md`, and the shared `gnaroshi_mds` UI/UX guidance. It covered every generated public route in English and Korean without adding public claims or private-source data.

## Coverage

- 54 generated routes in English and Korean
- 1440×1000, 1024×768, 390×844, and 360×800
- light and dark themes
- 432 visual screenshots reviewed through contact sheets
- focused full-page review of Papers and Projects in both locales and desktop/mobile layouts
- keyboard, link, localization, accessibility, performance, and feed-contract checks

## Findings And Corrections

### Paper navigation

The previous Paper Lab navigation used six independent disclosure menus. Several could remain open at once, and bootstrap-empty builds advertised tools with no public evidence.

The navigation now uses direct links and derives visibility from the public feed only:

- bootstrap-empty: Overview and Reading method
- papers: Paper notes
- reviews: AI review and Reviews due
- oral exams or formula recall: Practice
- implementations: Build
- eligible weekly review, graph, or Growth snapshot: Insights

Routes remain buildable and noindex where required, but absent public capabilities are no longer advertised. English and Korean navigation are generated from the same capability model.

Feed-contract fixtures also verify that Reading method and Paper notes anchors remain valid when papers exist, when the feed is empty, and when a translated counterpart is unavailable. A locale without a paired note keeps its localized onboarding state instead of silently rendering the other language.

### Reading method

The three-pass explanation used a bordered outer card containing three more cards and pill-shaped principles. It now renders as one ordered reading sequence with centered numbered markers, simple separators, and a plain principle list. The desktop and mobile layouts preserve the same order and hierarchy.

### Primary navigation

Writing and Activity previously appeared during bootstrap-empty even though the feed contained no writing and no eligible Growth snapshot. Primary and footer navigation now omit unavailable destinations while always retaining Research, Projects, and About. Paper Lab remains available through its explicit onboarding flag.

### Projects

The GitHub activity review found eight current website project records:

- gnaroshi_vla
- gnaroshi.dev
- Gnaroshi Studio
- PaperFlow
- Arxiv Discovery
- RunShelf
- TR GPU Monitor
- ContentDeck

All eight render in both locales. The page header now links directly to the six-application index so the two selected case studies do not imply that they are the entire project list. Public repositories link to GitHub where appropriate; private repository URLs are intentionally not exposed. Single trailing application cards now span the desktop grid instead of leaving an unexplained empty column.

## Result

- No document-level horizontal overflow was found in the four target viewport sizes.
- Paper navigation has no nested or independently persistent disclosure state.
- Empty capabilities are hidden rather than disabled.
- Numbered reading steps are centered with CSS Grid rather than text-baseline offsets.
- No additional public claims, fake achievements, or private repository data were introduced.
- No new client-side library or hydration was required.

## Commands

```bash
npm run check
npm run build
npm run check:i18n
npm run check:public-tone
npm run check:launch-content
npm run check:links
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:performance
npm run test:feed-contract
```
