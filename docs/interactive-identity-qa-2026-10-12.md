# Expressive Interaction QA

Date: 2026-10-12 (Asia/Seoul). Baseline: website `5f88363`; public feed `cb042193c41a1df60fbf2d37fc20cc259efbedf7`.

## Scope

Work was implemented directly in this task. No subagent, private authoring repository, API, generated feed record, personal achievement, or replacement screenshot was introduced. Existing public prose, project facts, approved evidence, favicon, and full-face identity remain unchanged.

## Decisions

| Surface | Correction | Acceptance |
| --- | --- | --- |
| Global navigation | Removed old/new bitmap overlap and browser root cross-fade; incoming document reveals once in 280ms | Repeated route changes remain clickable; no old text snapshot |
| Navigation speed | Opt-in Astro hover/focus prefetch for primary/hero links, tap on mobile | Warm only intended same-origin HTML, not every route or 3D engine |
| Common commands | Short pixel-corner press pulse, stable targets and role-icon response | No layout travel, screenshot crop, or custom cursor |
| Theme | Text-bearing button/surface palettes change immediately | No low-contrast gray intermediate frame; icons still respond |
| About | Approved full-face logo in an unframed interactive stage; top-aligned introduction | Same title start as other editorial shells; no portrait or monogram claim |
| Identity stages | First two presses animate the original; third opens 3D; sixth adds foil | Exactly three plus three activations, pointer/keyboard equivalence |
| 3D appearance | 64×64 sampled raster relief, one instanced draw call, view-dependent foil | Nonblank canvas pixels; real input changes rendered pixels |
| Identity controls | Reserved caption/control geometry, pause/reset, canceled stale imports | Stable height, focus restoration, no duplicate renderer |
| Identity lifecycle | Load engine on demand, bounded settling, visibility/background cleanup | No engine before third click; no frames at rest/pause/offscreen |
| Fallbacks | Original logo when WebGL is unavailable; both research positions without JS | Clear unavailable state, complete readable content |
| Research | Existing hypothesis/uncertainty become keyboard-accessible lenses | Exactly one selected tab/panel; stable height; current tab does not imply a new action |
| Media/content | Existing approved source images and copy retained | Media/readiness/tone/link/privacy checks remain enforced |

The 3D scene is a relief derived from the existing raster, not a newly modeled portrait or a replacement identity asset. The foil uses original shader code; no commercial trading-card artwork is copied. Three.js is the only new runtime dependency, dynamically loaded after interaction, with its MIT notice included in `public/licenses/three.txt`.

## Research References

- [Linear's March 2026 refresh](https://linear.app/now/behind-the-latest-design-refresh): adopt deliberate hierarchy and purposeful interaction, not marketing-style surface decoration.
- [Chrome view-transition documentation](https://developer.chrome.com/docs/web-platform/view-transitions/same-document): overlapping bitmap cross-fades are not appropriate for this site's dense text.
- [Astro intent prefetch](https://docs.astro.build/en/guides/prefetch/): use the existing framework's bounded, connection-aware feature rather than adding a client router.
- [Three.js ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html): implement the requested object/material interaction with one batched mesh and an on-demand render loop.

## Review Matrix

- Public route families: Home, About, Research, Projects and all nine details, Writing/archive/tags/article, Reading, Activity, Queue, Reviews/due, Formula, Questions, Implementations, Graph, Week, Now, Contact, and 404 in available EN/KO variants.
- Core visual widths: 1440, 1280, 1024, 768, 430, 390, 360, 320; light/dark.
- Identity: original, 3D, foil, pause/reset, reduced-motion, unavailable WebGL, delayed import cancellation, and no JavaScript; EN/KO at 1440/1024/768/390/360.
- Keyboard: Enter/Space activation, arrow-key object rotation, roving research tabs, focus return, mobile-menu Escape, hash and history navigation.
- Production release requires the exact selected source/feed pair and a later live verification record. Source push alone is not publication.

## Iterations And Failures

1. Outgoing page text originally ended at 35% opacity while incoming text and the root cross-fade also remained visible. Removed the overlap.
2. A revised native snapshot wipe still stalled repeated navigation into scroll-animated documents. Rejected that implementation and used ordinary document navigation with incoming-only entry.
3. The first broad test run rebuilt `dist` during preview tests, causing temporary 404/unpruned-sitemap failures. Subsequent runs serialize builds and browser checks against immutable output; no assertions were weakened.
4. The generic button audit did not model selected research tabs. It now captures `aria-selected`; already-selected tabs are tested as intentionally idempotent, with exactly-one-selected negative assertions in the dedicated suite.
5. Typechecking caught an unannotated `this` in the WebGL-unavailable test fixture; corrected it.
6. Style/noscript text assertions did not prove no-JavaScript readability. Replaced the noscript-dependent rendering with actual progressive enhancement: both labeled positions are visible until the lens script mounts.
7. Dark-theme interaction axe checks caught a 4.03:1 intermediate button contrast during palette interpolation. Removed that interpolation rather than waiting past the invalid frame.
8. The first full visual matrix found About's centered introduction displaced its header by 120px. Top alignment fixes the common start line; the focused alignment/identity rerun passed 13 tests.
9. The in-app browser's localhost transport returned `ERR_SOCKET_NOT_CONNECTED` during reload while ordinary HTTP and independent browser tests succeeded. No firewall/security setting was changed; this is tracked separately from site assertions.

## Pre-release Results

- Typecheck: 294 files, zero diagnostics.
- Build: 59 static pages.
- E2E: 222 passed, two populated-paper cases skipped on the current zero-paper feed; fixture coverage remains required.
- Accessibility: 60 passed, including active foil and research-lens states in light/dark EN/KO.
- Performance: seven route budgets passed; synthetic Research CLS 0.009, other measured routes 0.000. These are local regression metrics, not field Web Vitals.
- Initial About JavaScript stays small; the opt-in engine chunk measured 529,743 bytes raw / 130,887 bytes gzip. Vite's >500kB warning is disclosed; the chunk is not requested before activation.
- Media: 24 review outputs and 208 approved production outputs validated; readiness: nine projects and 28 approved screenshots.
- i18n: 260 page keys / 341 island keys in exact EN/KO parity.
- Links: 2,339 internal targets across 59 HTML files passed.
- Full visual rerun, WebKit, feed fixtures, clean release and live verification are recorded below after completion; earlier failures are not counted as final passes.

## Commands

All Node commands use `env PATH=/opt/homebrew/opt/node@24/bin:$PATH`.

```bash
npm install three@^0.186.1
npm install --save-dev @types/three@^0.186.0
npm run content:check
npm run check
npm run build
npm run check:i18n
npm run check:public-tone
npm run check:launch-content
npm run check:links
npm run media:check
npm run check:project-readiness
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:a11y -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 VISUAL_SET=interactive-2026-10-12 npm run test:visual -- --workers=2
PLAYWRIGHT_USE_EXISTING_BUILD=1 PLAYWRIGHT_BROWSER=webkit npx playwright test tests/e2e/interactive-identity.spec.ts tests/e2e/interaction-audit.spec.ts tests/e2e/layout-rhythm.spec.ts --grep-invert '@visual|@a11y|interactive identity stays framed' --workers=1
npm run test:feed-contract
```

## Remaining Constraints

- Four pre-existing low-severity KaTeX-family audit findings remain. No new runtime advisory was introduced by Three.js.
- Missing public paper activity, portrait, email, Scholar link, and stale current-focus data remain honest content limitations, not filled with generated claims.
- Unsupported graphics browsers retain the original mark, not a pretend 3D object.
- Temporary browser/preview processes must be closed; the explicitly requested user localhost server may remain available for review.
