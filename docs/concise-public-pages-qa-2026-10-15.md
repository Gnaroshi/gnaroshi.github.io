# Concise Public Pages QA

## Scope

The owner requested less public text and removal of redundant elements. No new product feature, media, dependency, feed record, metric, or private repository import was added.

- Home: one-sentence introduction, approved project evidence, and actual recent notes. Removed repeated Research questions, repository architecture, duplicate workflow lists, generic disclosures, and the redundant bottom divider.
- About: short biography, GitHub, and the approved interactive identity. Removed skills/project mapping, generic values, repeated link headings, and identity caption. Three-click relief, six-click foil, page-pointer tracking, pause, and reduced motion remain.
- Research: shorter questions and explanations; one provenance caption and one enlargement control. Original-file access remains inside the dialog and in the no-JavaScript fallback.
- Projects: concise EN/KO card summaries, one section heading, no repeated platform/status facts, and collapsed optional technical details. Actual evidence, demo disclosure, current limitations, privacy, and source provenance remain. Existing `#project-overview` links still open and focus their content.
- Empty tools: one state and one useful next action. No empty islands, zero-stat grids, or repeated explanations. Empty Reading still redirects; navigation still says Blog.
- Now: one dated freshness notice instead of repeated stale-state explanations.

## Copy Measurement

Compared the previous live release (`5424701`) with the revised production preview at 1440px. Counts are normalized visible main-document text characters, including spaces; hidden/inert faces, screen-reader-only instructions, and closed technical details are excluded. This measures the initial selection, not every possible interaction state. Public article content was not rewritten.

| Page | EN Before → After | KO Before → After |
| --- | --- | --- |
| Home | 1424 → 301 (79% less) | 819 → 194 (76% less) |
| About | 829 → 175 (79%) | 509 → 93 (82%) |
| Research | 922 → 420 (54%) | 511 → 215 (58%) |
| Projects | 3240 → 2347 (28%) | 1856 → 1432 (23%) |
| Studio detail | 2917 → 2026 (31%) | 1496 → 1031 (31%) |
| Activity | 181 → 59 (67%) | 101 → 35 (65%) |
| Weekly notes | 275 → 60 (78%) | 140 → 31 (78%) |
| Now | 937 → 757 (19%) | 462 → 364 (21%) |

Card copy no longer has a minimum character target that encourages padding. Required facts, sentence count, scenario integrity, disclosure, provenance, and privacy validation are unchanged.

## Verification

Node 24; isolated source and public-feed checkouts. The owner's localhost server and ignored feed checkout were not rebuilt or replaced.

- Type checking: 312 files, no errors, warnings, or hints.
- Production build: 59 pages; public copy, tone, i18n, readiness, media, launch-content, and built-link checks passed.
- Full Chromium E2E: 262 passed, 15 public-data-dependent skips. Populated Reading navigation was separately exercised by feed fixtures.
- Accessibility: 68 axe/keyboard/selected-state tests passed.
- Feed contract: 11 valid builds and six expected rejection fixtures passed.
- Additional no-JavaScript media and genuine offscreen-rendering checks: four passed.
- Scoped visual checks: four all-route matrices (56 routes each, EN/KO, 1440/360, light/dark), 20 four-core-page matrices (1440/1024/768/390/360, EN/KO, light/dark), and 12 three-project front/back matrices (1440/360/320, EN/KO, light/dark) passed. These are 376 captured states, not a claim that the entire unfiltered visual suite ran.
- Reviewed all-route captures in four contact sheets, plus full-size Home, About, Research, Projects, and turned project evidence samples. The last review found and removed the ineffective last-child divider rule.
- Performance: seven route budgets/tests passed; core pages have no React islands or automatic canvas. Measured Projects CLS was 0.092 and Korean Research 0.004, not zero. Local LCP results are not field performance evidence.

## Commands

```sh
npm run check
npm run build
npm run check:i18n
npm run check:public-tone
node scripts/check-public-copy.mjs
npm run check:launch-content
npm run check:links
npm run check:project-readiness
npm run media:check
npm run test:e2e
npm run test:a11y
npm run test:feed-contract
npm run test:performance
npx playwright test tests/e2e/all-pages.visual.spec.ts --grep 'desktop (light|dark) all-route|mobile-360 (light|dark) all-route'
npx playwright test tests/e2e/content-led.spec.ts --grep 'content-led layout (1440|1024|768|390|360) '
npx playwright test tests/e2e/project-desk.spec.ts --grep 'project desk visual.* (1440|360|320) '
npx playwright test tests/e2e/interactive-identity.spec.ts tests/e2e/media.spec.ts tests/e2e/content-interactions.spec.ts --grep '3D rendering stops|new interactions retain|renders one concrete scene'
```

## Corrections And Limits

The first E2E run failed four obsolete assertions: the removed Home section count, two generic-caption selectors, and a compact-only diagram selector after its test moved to the full project diagram. They now assert the revised structure, per-record disclosure, and actual ordered repository names. No acceptance threshold was relaxed. The second full run passed.

The final divider/padding adjustment is a paint/layout-only follow-up; its focused verification and release provenance are recorded below after publication. Physical devices, VoiceOver, and field INP were not tested. Empty paper collection and the lazy opt-in Three.js chunk-size warning remain; no initial 3D runtime was added. Missing personal contact fields remain hidden, and the old focus remains dated rather than described as current.

Local screenshots and measurement data are under ignored `artifacts/concise-pages-2026-10-15/` and the isolated QA artifact directory. No screenshots of private records were captured.
