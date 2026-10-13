# Content Interaction QA - 2026-10-13

## Scope And Boundary

About, Research, and Projects now have distinct content-led interaction rather than repeating the Home desk. Existing profile prose, research questions, nine public project records, product status, and approved media are retained. No private source, canonical content, metrics, authoring workflow, API, dependency, or replacement screenshot is added.

Guidance was read from the current local `gnaroshi_mds` checkout because its MCP resource was unavailable; the checkout was fast-forward synchronized. Reusable per-page interaction and occlusion review guidance was pushed as `fc6d34c`. The pre-change live source is `138c97eda9cc717e06745f0a71333f71b45effa0`; selected public feed is `cb042193c41a1df60fbf2d37fc20cc259efbedf7`, schema 1, hash `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.

## Component Decisions

| Component | Action and content | Geometry and fallback |
| --- | --- | --- |
| About introduction | Existing bio beside the approved opt-in identity | Biography no longer occupies a separate sparse band; full-face/3D/foil behavior is preserved. |
| Tool connections | Select Python/TypeScript/Swift/React/Shell to highlight only verified project-stack matches | Desktop paths remain in the column gutter. Mobile filters the real links; no empty placeholder graph. Buttons remain 44px; arrows support keyboard selection. Static fallback retains all nine project links. |
| Research question view | Focus one existing question or show all three; hash links and history reveal the destination before focus | Exactly one current item; hidden topics do not confuse scroll spy. The complete-view choice survives same-document navigation. Static fallback keeps all content. |
| Research comparison | Compare existing hypothesis and uncertainty without rewriting either | Equal heading-to-body gaps, content aligned at the start, three stable control columns; natural mobile expansion rather than a permanently tall hidden-panel slot. |
| Featured app viewer | Native range or arrows select one of three approved captures and the associated scenario description; the expand link opens that selected approved original | Full aspect ratio, one exposed image/note, reserved image/control/caption geometry. Keyboard focus cancels long scrolling and respects sticky offsets. Primary screen/detail link survive without JavaScript. |
| Project composition | App identity/summary before the viewer on mobile and paired cards | Shared card tracks retain EN/KO alignment. Demo disclosure remains visible; repeated caption paraphrases are removed. |

Approved sources: Studio `e6115c90ab866adde9ed1ea2cecda178fca96cdd`, PaperFlow `7c7bd013d171e2e58e0a5cee97faacd0c02ee8a8`, Arxiv Discovery `e48da6e1434adbeee8d6570816141d0f393a0fda`. Only existing scenario media IDs are used. The three captured screens are not presented as the complete four-step workflow; uncaptured steps remain in the ordinary detail pages.

## Findings Resolved During Review

- Comparison markup initially put the combined panel before its peers, exposing an index-order assumption. Panel lookup now follows each tab's explicit `aria-controls`, and static reading order is preserved.
- Paired comparison bodies distributed extra vertical space independently. Both now align content at the start with equal heading/body gaps.
- App names originally followed the image and new controls. The introduction now comes first in DOM and in narrow/paired presentation; the large lead image keeps its desktop evidence column.
- Step description and image caption paraphrased the same action. The viewer keeps the step description and exact demo disclosure once.
- Existing diagram-open controls were smaller than the new 44px control contract. Their minimum was corrected.
- Long smooth focus scrolling left some app controls outside the viewport; minimum-width reading tabs could reach the viewport edge. Scoped immediate focus visibility and sticky-aware scroll margins fix both cases.
- Sequential rectangle reads during smooth scrolling produced false gap results. Related bounds are now measured in the same frame; actual control occlusion is checked through hit testing.
- Whole-page capture after scrolling misplaced sticky chrome in the stitched image. Captures now use a common top position; real focused-control visibility is checked separately before normalization.
- Below-fold lazy images were unrequested in early complete-page captures. Final capture loads visible media by scrolling and requires successful natural image dimensions, without making production media eager.

## Local Verification

Node 24.21.0. Required checks use the same selected public feed.

| Command | Result |
| --- | --- |
| `npm run check` | 301 files, zero diagnostics. |
| `npm run build` | 59 static pages. |
| `npm run check:i18n` | 260 page / 341 island keys with exact EN/KO parity. |
| `node scripts/check-public-tone.mjs` / `node scripts/check-public-copy.mjs` | 59 HTML files; tone checks 19 EN/KO pairs. |
| `npm run check:links` | 2,363 internal targets across 59 HTML files, including original-screen links. |
| `npm run media:check` | 24 review outputs, 208 approved production outputs, 254 source files scanned. |
| `npm run check:project-readiness` / `npm run check:project-copy` | Nine projects / 28 approved screenshots; no advisory copy-length warning. |
| `npm run check:launch-content` | Nine projects, three research areas, 213 public source files; existing missing-profile/stale-focus/empty-paper warnings remain honestly hidden. |
| Focused related E2E (applications, identity, rhythm, media, new interactions) | 107 passed before final focus refinements. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:a11y -- --workers=1` | 68 passed, including selected/comparison/last-screen states. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=1` | Final source: 242 passed, two explicit populated-feed skips; 3.7 minutes. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance -- --workers=1` | Final source: 7 passed; local CLS 0 on changed routes; no React islands. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npx playwright test tests/e2e/content-interactions.spec.ts --grep @visual --workers=1` | Final source: 28 passed, 168 warmed-media captures. |
| `PLAYWRIGHT_BROWSER=webkit PLAYWRIGHT_USE_EXISTING_BUILD=1 npx playwright test tests/e2e/content-interactions.spec.ts --grep-invert '@visual\|@a11y' --workers=1` | Final source: 13 passed, including all four research widths, history, approved-screen order, and no-JavaScript fallback. |
| `npm run test:feed-contract` | 11 valid website builds and six rejection fixtures passed; no preview server was reused. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke -- --workers=1` | Five production route/provenance checks passed after the fixture builds were replaced with the selected public feed. |

The matrix covers About/Research/Projects in EN/KO, light/dark, 1440/1024/768/430/390/360/320px, initial/selected states: 168 complete-page images. Local evidence is ignored under `artifacts/content-interactions/` and `artifacts/content-interactions-qa-2026-10-13/`. Full-page contact sheets are an overview aid; detailed crops and actual focused viewports are inspected separately for legibility/occlusion.

All 42 contact sheets were reviewed for flow and overlap. Desktop project/Research comparison crops and six full-size 320px application crops were inspected separately. Full-page sheets are not treated as proof that small application text is readable: the selected original image was opened and loaded successfully for all three apps in both locales. Local screenshots are not new approved product evidence and are not published as product assets.

Before/after measurements cover 48 combinations: three routes, two locales, four widths (1440/768/390/320), previous live site and final preview. At 1440px, About biography starts at 296px EN / 266px KO instead of 619px; at 390px it starts at 299px / 270px instead of 714px / 684px. The added verified-project map increases total About length without retaining the old blank introduction band. Research controls-to-nav and nav-to-question gaps are 16px at all four widths. App screen-to-controls and controls-to-note gaps are 12px in both locales at all four widths. These are observed geometry, not guarantees for every possible future content length.

The complete pre-existing `@visual-v3` suite was not rerun for this task. The changed-route seven-width matrix was run instead; complete functional and accessibility suites cover the unchanged routes. One initial WebKit command used `--project=webkit` without the repository's `PLAYWRIGHT_BROWSER=webkit` selector and failed before running tests; the corrected command passed all 13 checks. Earlier layout/capture failures listed above were fixed and rerun, not counted as successful attempts.

## Release Checklist

- [x] Final complete functional checks and warmed-media visual capture.
- [x] Final type, content, locale, tone/copy, links, media, readiness, smoke, and feed fixtures.
- [x] WebKit interaction checks.
- [x] Complete contact-sheet and detailed viewport review.
- [ ] Purpose-separated commits, PR, and push.
- [ ] Clean pinned production build and normal static publication.
- [ ] Exact live provenance and changed-route interaction checks.
- [ ] Owned QA processes closed; requested localhost retained.

## Known Limits

Automated axe, Chromium, and WebKit checks do not certify every physical device or assistive technology. Local timing is not field Core Web Vitals. Existing low-severity math dependency advisories remain the separate hardening item documented in the previous [desk QA](project-desk-qa-2026-10-13.md). Research figures retain their generated-concept/technical-diagram labels rather than being presented as experiment evidence.

Browser semantics references: [WAI tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) and [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). These informed keyboard/panel and size-observer handling; they are not evidence of product QA.
