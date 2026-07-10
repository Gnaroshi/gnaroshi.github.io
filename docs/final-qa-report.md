# Final Bilingual QA Report

Date: 2026-07-10

Target: `https://gnaroshi.dev`

Scope: production visual and functional QA after the redesign and EN/KO localization

## Result

The requested English and Korean routes pass static, browser, accessibility, link, content-integrity, and visual checks. The current public state remains evidence-gated: no Momentum number, paper activity graph, or research achievement is shown before qualifying public records exist.

## Routes Tested

English:

- `/`, `/about`, `/research`, `/projects`, `/blog`
- `/papers`, `/growth`, `/queue`, `/reviews`, `/formula`
- `/questions`, `/implementations`, `/graph`, `/week`, `/404`

Korean:

- `/ko/`, `/ko/about`, `/ko/research`, `/ko/projects`, `/ko/blog`
- `/ko/papers`, `/ko/growth`, `/ko/queue`, `/ko/reviews`, `/ko/formula`
- `/ko/questions`, `/ko/implementations`, `/ko/graph`, `/ko/week`, `/ko/404`

All 30 routes were checked for successful rendering, exactly one `h1`, non-empty links, image dimensions, horizontal overflow, and browser console or page errors.

## Visual Matrix

| Viewport | Light | Dark | English routes | Korean routes | Screenshots |
| --- | --- | --- | ---: | ---: | ---: |
| 1440 x 1000 | Yes | Yes | 15 | 15 | 60 |
| 1024 x 768 | Yes | Yes | 15 | 15 | 60 |
| 390 x 844 | Yes | Yes | 15 | 15 | 60 |
| 360 x 800 | Yes | Yes | 15 | 15 | 60 |
| Total | 4 matrices | 4 matrices | 120 | 120 | 240 |

The final screenshots were generated under the ignored `artifacts/design-audit-v2/final/` directory. All 240 images were reviewed in 16 locale/matrix contact sheets. Desktop navigation stayed on one line. Mobile controls, Korean headings, tags, Paper Lab navigation, empty states, and footers did not clip or overlap in either theme.

## Issues Fixed

- Removed duplicate primary actions from empty Paper Log, Queue, Reviews, Formula, Questions, Implementations, and Graph states.
- Localized conditional Paper Log statistics, review summary, score levels, trends, statuses, depths, and implementation cards so future evidence-bearing Korean states do not expose English UI.
- Kept empty tool pages static and unhydrated; each has one primary next action.
- Expanded E2E coverage to the full requested EN/KO route set and all four viewports.
- Expanded axe coverage to all 30 requested routes.
- Made visual runs clear their output set before capture, preventing stale screenshots from being counted.
- Excluded generated build, Playwright report, test-result, and visual-artifact directories from TypeScript diagnostics.

## Functional Findings

- Header navigation, language switching, and theme switching work without control-induced layout shift.
- The mobile drawer traps focus, locks background scroll, closes with Escape, and returns focus to its trigger.
- Homepage sections introduce the person before the research workflow and remain within five major content bands.
- Blog featured/recent deduplication and the low-content search threshold are enforced by browser checks.
- Paper controls remain progressive: with zero public papers the page shows onboarding only, keeps the template collapsed, and does not hydrate filters or a heatmap.
- Momentum remains non-numeric with zero meaningful events. Confidence and evidence remain separate from the unavailable score.
- Empty Paper Lab tools do not render zero-value metric grids or unnecessary React islands.
- Locale shells use the correct `lang` value and visible dates use locale-appropriate formatting.

## Accessibility

- `@axe-core/playwright`: 30/30 requested routes passed with no automatically detectable violations.
- Keyboard/focus test: passed.
- Visible focus, drawer focus management, Escape behavior, accessible language control, and reduced-motion behavior: passed.
- Heatmap cells are implemented as labeled keyboard-operable buttons with date/count labels and roving focus. The heatmap was not rendered in this zero-paper public state, so its active runtime path remains dependent on future public paper fixtures.
- The graph remains evidence-gated and therefore shows its accessible empty state rather than a visual graph without meaningful records.

## Localization

- Page dictionaries: 250 keys with exact EN/KO parity.
- Interactive-island dictionaries: 342 keys with exact EN/KO parity.
- Translation links: 42 localized pages plus RSS and sitemap passed.
- No accidental English UI string was found on the requested Korean routes.
- Korean headings are not constrained by the English heading measure, and mobile word breaking remained readable at 360 px.

Remaining untranslated content: dynamic paper, queue, question, implementation, graph-node, formula-practice, and oral-exam detail templates are explicitly source-language-only when no Korean content counterpart exists. They advertise translation unavailability and send the Korean alternate to the relevant Korean index. Most do not currently produce public pages because there are no qualifying public records.

## Performance

- The site remains a static Astro build; the requested public index routes do not hydrate React islands in the current evidence-gated state.
- No chart or animation library is installed. Interactive React code remains limited to optional tools and data-dependent islands.
- No remote font URL or font import was found. KaTeX remains the local math dependency.
- One built JavaScript asset exceeds 100 KB: the shared React client runtime. It is not requested by the current static index/empty states.
- No public image element is currently emitted on the requested routes, so there is no missing image-dimension issue.
- Locale dictionaries are resolved server-side and only the messages required by an interactive component are passed as island props.

## Known Limitations

- There are currently zero qualifying public paper/research events. Active heatmap filtering, score trends, review-due badges, graph interaction, and populated weekly summaries cannot be exercised against real public data without violating the no-seed-data requirement.
- Automated axe checks do not replace a screen-reader session with VoiceOver or NVDA.
- Screenshots are QA artifacts and remain git-ignored; the committed Playwright tests reproduce them.
- Optional voice/API workflows were outside this visual pass and remain non-blocking; the static site builds without API credentials.

## Commands Run

Required checks:

```bash
npm run check
npm run check:public-copy
npm run check:content-metrics
npm run check:i18n
npm run check:hardcoded-ui
npm run build
npm run check:translation-links
npm run check:links
npm run test:e2e
npm run test:a11y
npm run test:visual
```

Supporting inspection commands:

```bash
npm ls --depth=0 --omit=optional
rg -n "https?://.*(fonts|woff|ttf)|@import.*font" src public
find dist/_astro -type f -size +100k -print
find artifacts/design-audit-v2/final -type f -name '*.png' | wc -l
```

Final results:

- Astro diagnostics: 235 files, 0 errors, 0 warnings, 0 hints.
- Static build: 62 pages generated.
- Public copy: 82 built text files passed.
- Content integrity: 0 meaningful events and score correctly gated.
- Internal links: 2,888 links across 62 HTML files passed.
- E2E: 48/48 passed.
- Accessibility: 31/31 passed, including 30 route scans and one focus/theme test.
- Visual: 8/8 matrix tests passed; exactly 240 screenshots generated and reviewed.

The first sandboxed `npm run test:e2e` attempt could not bind `127.0.0.1:4324` (`EPERM`). Re-running with approved local port access succeeded. No application or test failure remains.
