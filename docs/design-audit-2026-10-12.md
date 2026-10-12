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
| Hero consumes the entire 320×568 first viewport | Viewport-height-constrained minimum; short mobile screens prioritize name, headline, and paired actions over the extended bio, with the next section visible |
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
- Final functional Chromium suite: 210 passed; two populated-only tests skip on the actual zero-paper feed and run under the rich-review fixture.
- Accessibility: 58 passed, including the article and keyboard/theme check. Automated axe coverage is not a claim of exhaustive accessibility certification.

Initial test failures were repaired, not waived: the sticky offset was updated for the compact index, the scrolling assertion now checks actual overflow and active-item visibility, and the hero capability test accepts the canonical trailing slash.

- Visual matrix: 52 passed on `9818be3`; 784 all-route viewport captures, 240 full project captures, 36 workflow captures, and 224 core route captures. The final Home-only short-viewport adjustment was followed by all 20 core visual cases on `b1370e4`, full functional/accessibility checks, and explicit first-screen assertions. Other route layouts were unchanged by that adjustment.
- WebKit: 45 navigation, interaction, and rhythm cases passed on the final source with one worker. This is engine coverage, not testing on every physical Apple device.
- Performance: seven passed on the final source. Exploratory local Chromium measurements were LCP 24–72ms and CLS 0.000; these are synthetic review-run measurements, not field performance. CSS unused on the initial mobile viewport remains 49.1–68.6%; these small stylesheets also include other widths, themes, and interactive states.
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
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:visual -- --workers=2 tests/e2e/visual-v3.spec.ts
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=1 tests/e2e/layout-rhythm.spec.ts
PLAYWRIGHT_BROWSER=webkit PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=1 tests/e2e/layout-rhythm.spec.ts tests/e2e/navigation.spec.ts tests/e2e/interaction-audit.spec.ts
npm run performance:report
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke -- --workers=2
git diff --check
```

No new direct dependency or animation framework was added. The seven route budgets have zero React islands, 1.5 KB gzip external JavaScript, 6.2–10.5 KB gzip CSS, and 7.6–124.5 KB initial eager-image bytes. Lazy screenshots are not included in the initial-image figure. Synthetic browser performance is not field performance.

### Release Runtime And Dependency Safety

The system-default runtime was Node 26.4.0, not the repository's Node 24 requirement. The initial exploratory/browser runs used that default; final release verification and isolated builds explicitly use Node 24.21.0 with `PATH=/opt/homebrew/opt/node@24/bin:$PATH`. This machine-specific prefix is a verification detail, not a project installation requirement.

The clean installation exposed 18 pre-existing audit findings (one critical, 12 high, one moderate, four low). The [Astro AVIF image-processing advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) applies before 7.2.8 when processing attacker-controlled AVIFs; static hosting alone is not a build-tool mitigation. Updated compatible dependencies in a separate lockfile commit: Astro 7.3.8, MDX 7.0.8, Markdown integration 7.3.2, Sharp 0.35.5, and compatible transitive fixes. No major-version force upgrade or new dependency was introduced.

`npm audit fix --dry-run` initially failed with an Astro/Markdown peer-resolution conflict. Updating the existing Astro/MDX/Markdown/Sharp packages together resolved it. `npm audit fix` then applied the remaining compatible fixes and returned nonzero because four low-severity KaTeX-family findings remain. Resolving those requires a breaking math-toolchain change and is deferred, not reported as a clean audit. Only the public, validated feed is rendered; no visitor-supplied math is processed by this static site.

The first isolated Node 24 fixture-browser run exposed Astro 7.3's agent-detected background preview behavior: Playwright saw its managed command exit while the server remained running. Stopped that owned server and changed Playwright's preview command to the supported `--ignore-lock` foreground mode, so browser tests own and terminate their server. This is a process-lifecycle fix, not a skipped test or a hidden background preview.

The release screenshot comparison also found capture timing differences, not geometry regressions: full-project captures returned to the top before scrollspy's frame updated, and finite entrance/underline animations were photographed mid-transition. Visual captures now finish finite animations, and project captures wait two frames and assert exactly one current first section before capture. Motion remains enabled and independently verified by interaction/rhythm tests. The preliminary release capture run was superseded by this deterministic full-matrix rerun.

```bash
env PATH=/opt/homebrew/opt/node@24/bin:$PATH npm update astro @astrojs/mdx @astrojs/markdown-remark sharp
env PATH=/opt/homebrew/opt/node@24/bin:$PATH npm audit fix
env PATH=/opt/homebrew/opt/node@24/bin:$PATH npm ls astro @astrojs/mdx @astrojs/markdown-remark sharp katex
```

The reusable content-rhythm rule was independently validated and pushed to MDS as `a5b723e`; it contains no project-private data.

## Publication Gate

Publish only from clean, exact website and public-feed checkouts under the local `gh-pages:/` procedure. No Actions run, workflow dispatch, or cross-repository token is used. Record the deployment artifact and exact live provenance after publication; until that match, the source push is not a completed release.

### Verified Publication

Verified on 2026-10-12 at 09:52 UTC:

- Source: `b1370e45c9218acbeb3013bf7085b8b420dc7dfd`.
- Public feed: `cb042193c41a1df60fbf2d37fc20cc259efbedf7`.
- Deployment artifact: `c8d42402d5a9a32c65a7b07239e6d714496adbec`, normally pushed from the unchanged prior `gh-pages` parent `154f293`.
- Built at `2026-10-12T09:38:01Z`; schema 1, `local` / `0`, production; content hash matches the input above.
- Pages remains legacy branch publication at `gh-pages:/`, custom domain and enforced HTTPS unchanged. Actions confirmed disabled before and after publication. One explicit Pages build request returned queued; exact live verification, not that response, established success.
- All 59 live HTML files matched the locally validated artifact byte-for-byte.
- 64 clean-browser live checks passed: Home, About, Research, Projects, Reading, system case study, PaperFlow, and the published Korean article at 1440×1000 and 390×844 in both themes, plus EN/KO Home at 320×568 in both themes. No overflow, duplicate H1, eager broken image, console error, or JavaScript error was found. Reading current state, workflow selection, and mobile-menu Escape were exercised.
- Reviewed all 64 live screenshots through labeled contact sheets, with the short-screen Home captures inspected separately. Reports and captures are retained locally under ignored `artifacts/`, not in deployed output.
- A Pages metadata read had one TLS timeout and succeeded on retry. This was a transient metadata fetch, not a failed deployment.
- This later audit-document commit does not change the rendered source or rewrite the site's provenance to an unbuilt revision.

Exact release verification:

```bash
node scripts/verify-deployment.mjs --base-url https://gnaroshi.dev \
  --website-commit b1370e45c9218acbeb3013bf7085b8b420dc7dfd \
  --feed-commit cb042193c41a1df60fbf2d37fc20cc259efbedf7 \
  --content-hash c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee \
  --feed-schema-version 1 --workflow-run-id local --workflow-run-attempt 0 --environment production
node /tmp/gnaroshi-live-design-qa.mjs /tmp/gnaroshi-design-release.mqTkIf/website b1370e45c9218acbeb3013bf7085b8b420dc7dfd
```

The second command is the temporary live HTML/browser audit, not repository tooling or a required future dependency. All release commands used the explicit Node 24 runtime prefix documented above. Browsers were closed in `finally`; managed preview servers were stopped after each suite, and port 4324 was checked free.

## Limitations

- Published paper activity is still absent; tool routes remain honest empty states, not invented research activity.
- Current focus is stale and remains hidden on Home; Now labels the dated snapshot.
- No approved portrait, public email, or Scholar link has been added.
- Unsupported CSS features fall back to immediate readable content. No claim of identical motion across all browser engines.
- Existing approved application screenshots use disclosed deterministic demo data; no new screenshot or release capability was fabricated.
- Four low-severity KaTeX-family dependency advisories remain; critical/high/moderate compatible fixes were applied separately from the design work.
