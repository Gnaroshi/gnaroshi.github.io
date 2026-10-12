# Design Audit — 2026-10-12

## Scope And Inputs

Direct implementation in the website repository. Baseline: `370b16b`. Public feed: `cb042193c41a1df60fbf2d37fc20cc259efbedf7`, content hash `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.

Read project AGENTS, required design/architecture/release/localization/media guidance, and the canonical web/UI guidance; synced both website and MDS before editing. No private source repositories, content feed records, approved images, project facts, or public routes were changed. Actions remain disabled; release uses local static publication.

## Findings And Fixes

| Finding | Correction |
| --- | --- |
| Whole-section scroll transforms create visual gaps unrelated to document spacing | Remove 42px section travel; preserve stable section geometry with either motion preference |
| Page-header bottom margin duplicates grid gap | One flow token owns the relationship within page shells |
| Empty eyebrow pseudo-element adds unexplained height | Remove spacer; render only actual headings and metadata |
| English 13ch heading cap creates avoidable line breaks | Balance headings within a 24ch maximum; retain natural Korean wrapping |
| Three independently styled sticky indexes compete with content | Share compact SectionNav with semantic names and one animated current underline |
| Old anchor offsets no longer match the compact index | Shared section-nav height and sticky offset; exercise direct/history/keyboard/scroll navigation |
| Research alternates visual order but not DOM order | Keep question then related evidence consistently in both layouts |
| Research assessment blocks distribute short text vertically | Align their content to the top |
| Projects index adds padding around every section on top of grid gaps | Reduce repeated padding; first section does not add another top spacer |
| Project detail text pairs distribute shorter content vertically | Align first content lines and normalize list margins |
| Scenario screenshots occupy disconnected full-width bands | Pair step and screenshot on desktop; stack them in order on mobile |
| Scenario is another large colored container | Use an unframed ordered narrative; reserve connector gutter separately from screenshots |
| Scenario bottom rule repeats the following section's top rule | Keep one boundary owned by the following section; remove the extra bottom rule and padding |
| Undefined `--step-*` typography tokens silently inherit sizes | Replace every occurrence with existing text tokens |
| Home project tags fall back to browser bullets | Provide a compact semantic tag row |
| Home single-locale note column can leave an empty second column | Single-column layout when only one list exists |
| About skill categories lack group spacing | Explicit category and item spacing with list semantics |
| Empty Reading page displays a full session tool without a paper | Personal checklist is optional and collapsed, with an honest local-only scope |
| Hover zoom and inset frame crop screenshot evidence | Keep image pixels stationary; emphasize link destination with a bottom rail |
| Mobile workflow selection changes border width | Reserve the same border width before and after selection |
| Flow selection changes color but does not explain direction | Trace the selected downstream path once; retain text/shape cues and reduced-motion equivalent |

## Contemporary References

Reviewed on 2026-10-12; sources are design/technical references, not evidence of this site's behavior.

- [Linear, March 12 2026 refresh](https://linear.app/now/behind-the-latest-design-refresh): adopt compact supporting navigation and restrained separators. Preserve Gnaroshi's approved pixel identity rather than copying Linear's style.
- [Chrome, July 2026 Web UI roundup](https://developer.chrome.com/blog/new-in-web-ui-io26): prefer native progressive interactions that respect visitor preferences. Do not add every experimental API or a dependency just because it is new.
- [Cross-document View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document): retain opacity navigation; remove unnecessary translation/scale of the entire content surface.
- [Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations): retain actual reading progress, not whole-content choreography.
- [Intrinsic-size transitions](https://developer.chrome.com/docs/css-ui/animate-to-height-auto): use feature-detected interpolation only for the requested checklist disclosure.
- [Entry/exit CSS](https://developer.chrome.com/blog/entry-exit-animations): retain native menu/dialog entry with immediate fallback.
- [W3C interaction motion](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions): preserve immediate, equivalent states under reduced motion.

Excluded: automatic loops, custom cursors, parallax, decorative orbs, glass panels around every section, heavy graph/animation frameworks, experimental navigation skeletons, and artificial content to fill empty pages.

## Visual Review

Baseline and revised full-page captures: `/tmp/gnaroshi-design-before/`, `/tmp/gnaroshi-design-after/`. Baseline exploratory full-page captures initially exposed a smooth-scroll capture artifact; settled viewport captures and revised captures were used for layout judgments, not that artifact.

The matrix suite captures both locales and light/dark at 1440, 1280, 1024, 768, 430, 390, 360, and 320px where defined. All public routes use the existing `qa-routes.ts` list, including all nine project details, tool empty states, Now, Contact, and 404. The published Korean article is checked separately by article tests.

Artifacts: `artifacts/public-page-checklist/`, `artifacts/project-stories/`, `artifacts/public-system-workflow/`, `artifacts/visual-audit-v3/final/`. Visual capture is not a pixel-baseline comparison; screenshots require human/model inspection. These ignored reports are not deployed.

The new rhythm tests check header-to-index gap at 16–33px, index-to-first-heading at 16–75px, ordinary/reduced-motion geometry equality, aligned text pairs, actual typography, and selected flow animation. Existing tests cover navigation current state, focus, history, menu trapping, locale fallback, images, and overflow.

Reviewed every first-viewport route capture through labeled contact sheets across the seven all-route viewport sizes and both themes. Inspected full-page Home, Research, Reading, About, the published Korean article, PaperFlow, and the system case study separately. This review caught the repeated scenario/next-section separator; a regression assertion now prevents its return. Final captures of changed surfaces are reviewed again after rebuilding.

Routes cover Home, About, Research, Projects, Writing/archive, Reading, Activity, Queue, Reviews/due, Formula, Questions, Implementations, Graph, Week, Now, Contact, and 404 in both locales. Project details cover `gnaroshi-vla`, `gnaroshi-dev`, `gnaroshi-studio`, `paperflow`, `arxiv-discovery`, `runshelf`, `tr-gpu-monitor`, `codex-unlock-stale`, and `contentdeck` in both locales. The Korean article is `/ko/blog/phizero-physical-language/`; real translations are not invented.

## Verification

Release checks use the actual public feed, with fixture builds isolated from the final build. Browser workers are bounded to avoid repeating the earlier process-exhaustion problem.

- Type/content check: 288 files, zero diagnostics.
- i18n: 252 page keys and 341 island keys, exact EN/KO parity.
- Links/metadata: 2,337 targets across 59 HTML pages.
- Media: 208 approved production outputs; project readiness: nine projects, 28 approved screenshots.
- Feed contract: 11 valid fixture builds and six invalid-feed rejections, including privacy and count failures.
- Functional Chromium suite: 208 passed; two populated-only tests skip on the actual zero-paper feed and run under the rich-review fixture.
- Accessibility: 58 passed, including the article and keyboard/theme check. Automated axe coverage is not a claim of exhaustive accessibility certification.

Initial test failures were repaired, not waived: the sticky offset was updated for the compact index, the scrolling assertion now checks actual overflow and active-item visibility, and the hero capability test accepts the canonical trailing slash.

- Visual matrix: 52 passed; 784 all-route viewport captures, 240 full project captures, 36 workflow captures, and 224 core route captures. After removing the last duplicate scenario rule, all 12 full-project matrix cases were repeated and passed on the rebuilt final code.
- WebKit: 43 navigation, interaction, and rhythm cases passed with one worker. This is engine coverage, not testing on every physical Apple device.
- Performance: seven passed; measured local Chromium LCP 24–72ms and CLS 0.000. CSS unused on the initial mobile viewport remains 49.1–68.6%; these small stylesheets also include other widths, themes, and interactive states.
- Production smoke: five passed.

Exact verification commands (repeated runs omitted):

```bash
npm run content:pull
npm run content:check
npm run check
npm run build
npm run check:i18n
npm run check:public-tone
node scripts/check-public-copy.mjs
node scripts/check-navigation-consistency.mjs
npm run check:launch-content
npm run check:links
npm run media:check
npm run check:project-readiness
npm run test:feed-contract
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:a11y -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:visual -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:visual -- --workers=2 tests/e2e/projects.visual.spec.ts
PLAYWRIGHT_BROWSER=webkit PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=1 tests/e2e/layout-rhythm.spec.ts tests/e2e/navigation.spec.ts tests/e2e/interaction-audit.spec.ts
npm run performance:report
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke -- --workers=2
git diff --check
```

No dependency was added. The seven route budgets have zero React islands, 1.5 KB gzip external JavaScript, 6.2–10.5 KB gzip CSS, and 7.6–124.5 KB initial eager-image bytes. Lazy screenshots are not included in the initial-image figure. Synthetic browser performance is not field performance.

The reusable content-rhythm rule was independently validated and pushed to MDS as `a5b723e`; it contains no project-private data.

## Publication Gate

Publish only from clean, exact website and public-feed checkouts under the local `gh-pages:/` procedure. No Actions run, workflow dispatch, or cross-repository token is used. Record the deployment artifact and exact live provenance after publication; until that match, the source push is not a completed release.

## Limitations

- Published paper activity is still absent; tool routes remain honest empty states, not invented research activity.
- Current focus is stale and remains hidden on Home; Now labels the dated snapshot.
- No approved portrait, public email, or Scholar link has been added.
- Unsupported CSS features fall back to immediate readable content. No claim of identical motion across all browser engines.
- Existing approved application screenshots use disclosed deterministic demo data; no new screenshot or release capability was fabricated.
