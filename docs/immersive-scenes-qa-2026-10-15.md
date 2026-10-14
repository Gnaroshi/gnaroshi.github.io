# Immersive Scene QA

## Scope And Inputs

The owner requested perceptible spatial interaction rather than another hover-only revision. Work was performed directly in the website repository without delegation or private source imports. Shared guidance was synchronized and updated in `gnaroshi_mds` at `3c6e8c5`.

- Source baseline: `dab677f8002f43ae7a977ad13b2be293e78d1fa4`.
- Selected public feed: `3b7e1fd92c5a6d3ef7a1298c3592b498da172d41`.
- Feed schema: 1.
- Content hash: `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.
- Feed state: one Korean blog post; no public papers or eligible research metrics. No activity was invented.

## Implementation

- Home: full-band folded sculpture with unfold/reset, pointer deformation, and orbit input.
- Research: a deformable landscape responds to the actual selected question; flatten/reset controls remain independent from the approved question-image explorer.
- Projects: separable construction layers above the existing real application evidence.
- About: spatial contour field behind the approved identity. The three-click relief, six-click foil, global pointer tracking, and removed caption/Skills section are preserved.
- Scissored drawing protects HTML copy and links from geometry overlap. No outgoing snapshot transition or client route interception was added.
- Eight-second introductory/resumed motion, 1.6-second input deadline, 24/20 FPS, DPR 1.25/1, at most seven scene draw calls, no postprocessing/remote textures. Offscreen/background/paused/expired rendering stops and page exit disposes resources.
- Persistent visible pause; equivalent keyboard controls; native vertical touch scrolling; complete reduced-motion, no-JavaScript, and unavailable-WebGL fallbacks.
- No replacement application screenshots, icon, favicon, achievements, authoring tooling, or private feed computation.
- KaTeX upgraded to patched 0.18.2 with explicit `trust: false`; malicious URL/HTML command and valid-math regressions added.
- Remaining Home/RSS/article navigation names normalized to Blog, with localized Korean task copy.

## Verification Record

Local QA uses a source snapshot separate from the owner's running server to prevent Vite dependency-cache invalidation. Browser work is serialized and every owned test preview is closed after its run. The owner-requested server remains at `http://127.0.0.1:4321/`.

The first focused run caught a one-frame-after-pause bug: a pending pointer RAF could draw after the renderer stopped. The controller now cancels that pending request. New fallback test typing initially failed on an implicit `this`; the canvas override now declares `HTMLCanvasElement` explicitly.

An initial two-worker E2E run under host contention timed out in long multi-route scenarios and was stopped, not reported as a pass. The corrected run uses Node 24 and one browser worker. Functional scenarios allow 90 seconds for a whole multi-route/viewport sequence; existing action assertions and the separate 2.5-second LCP / 0.1 CLS performance gates are unchanged.

The first i18n check rejected an English Home CTA in Korean. It was changed to `블로그`; the dictionary check then passed with 261 page keys and 341 island keys.

Commands executed:

```bash
npm ci
npm run content:check
npm run check
npm run build
npm run test:math
npm audit
npm run check:i18n
node scripts/check-public-tone.mjs
node scripts/check-public-copy.mjs
npm run check:launch-content
npm run check:links
npm run media:check
npm run check:project-readiness
npm run check:project-copy
node scripts/check-navigation-consistency.mjs
npx playwright test tests/e2e/spatial-scenes.spec.ts --grep-invert @visual --workers 1
npm run test:e2e -- --workers 1
npm run test:a11y -- --workers 1
npm run test:visual -- --workers 1
npx playwright test tests/e2e/spatial-scenes.spec.ts --grep @visual-spatial --workers 1
npm run test:performance -- --workers 1
npm run test:feed-contract
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke -- --workers 1
PLAYWRIGHT_BROWSER=webkit npx playwright test tests/e2e/spatial-scenes.spec.ts --grep-invert '@visual|mobile scene' --workers 1
```

The public-tone/copy/navigation node entry points ran against the already validated build rather than rebuilding three times. Their npm wrappers execute the same checks. The browser setup uses Node 24 and existing-build mode. Chromium-specific CDP touch input is excluded from the WebKit focused suite, not counted as passed there.

### Final Results

| Check | Result |
| --- | --- |
| Astro/TypeScript check | 0 errors, 0 warnings |
| Production-compatible static build | 59 generated routes |
| Content, i18n, tone, copy, launch, links, navigation | Passed; 261 page / 341 island dictionary keys |
| Project readiness, editorial copy, approved media | Passed; nine public projects |
| Math security regression / dependency audit | 3 passed / 0 vulnerabilities |
| Focused spatial input/fallback, Chromium | 20 passed |
| Focused spatial input/fallback, WebKit | 19 passed |
| Full functional E2E | 267 passed, 15 conditional zero-paper skips |
| Accessibility, axe and keyboard states | 68 passed |
| Full visual-v3 route/motion suite | 108 passed |
| Spatial pixel/layout/input matrix | 32 passed; 256 initial/changed full-page captures |
| Performance | 7 routes passed; measured CLS 0 on all seven |
| Public-feed fixtures | 11 valid builds and 6 rejection fixtures passed |
| Post-fixture real-feed smoke | 5 passed |

The full visual suite covers 56 EN/KO routes at seven viewports and two themes. The new core matrix adds 1843, 1440, 1024, 768, 430, 390, 360, and 320 widths, both locales/themes, all four core routes, and initial/changed states. All 64 labeled core contact sheets were manually inspected, with representative full-resolution desktop, narrow-mobile, and short-height screenshots also inspected. The wider legacy route matrix is automated; this report does not claim a separate manual inspection of every unchanged legacy capture. No text/scene/control overlap, blank renderer, clipped approved screenshot, or heading movement was found in the final core matrix. Source captures remain in ignored local QA artifacts, not public project evidence.

### Failures Fixed And Invalid Attempts

- Actual narrow/short Home spacing initially pushed the next section out of view; compact rhythm and reserved scene space were corrected.
- Research/Projects intros were vertically centered below the About editorial start. They now align at the start without changing text width.
- A reset announcement was implicit; it now uses an explicit polite live region.
- About's contour keyboard input originally rotated an empty object group. It now moves the actual camera and passes painted-pixel assertions.
- Deferred scene loading could miss a partly visible mobile intro. Visibility guards, observer threshold, background wake, and disposed async handling were corrected.
- A pending pointer target could cancel a paused nudge in WebKit; nudges now start from the visible pose. Repeated touch drags now accumulate rather than resetting.
- Old tests treated the retired hero bitmap as active, unloaded `currentSrc` values as duplicate screenshots, or sub-pixel entry motion as layout shift. Assertions now wait for loaded evidence and finished entry animation without weakening genuine geometry/input checks.
- Pixel sampling initially had inconsistent focus treatment. Both samples now use the same focused host and exclude text/control regions; actual painted scene change must exceed the threshold.
- One accidentally overlapping QA launch and the interrupted contention run were stopped and are not reported as passes. Subsequent isolated browser work was serialized with an exclusive lock.

The final input changes were rechecked with types/build, Chromium, WebKit, full E2E, the 32-case pixel matrix, and performance. Accessibility, full visual-v3, and fixture results were recorded against the same final layout before those input-only changes.

Actual first-viewport engine cost is approximately 139-147 KB gzip, separately documented in [route budgets](route-budget-report.md); the small directly referenced initial scripts are not the whole JS payload. Deployment uses an immutable source/feed pair, never a source-push assumption. Exact release provenance is appended after live verification.

## Verified Release

- PR [50](https://github.com/Gnaroshi/gnaroshi.github.io/pull/50) merged through an exact-head ordinary repository merge, without querying Actions runs/checks/logs.
- Built website source: `bcae578471b0c737b31751d73cde603af617e999`.
- Public feed: `3b7e1fd92c5a6d3ef7a1298c3592b498da172d41`.
- Public static deployment commit: `ba4b44bf1a7961b9e38f2c45790a9ccaa569a17c`.
- Previous verified static deployment retained in Git: `1f878bb09a1891f553488eda2fac06b8ab728e49`.
- Fixed build timestamp: `2026-10-14T17:50:37.000Z`; schema 1, `production`, `local` / `0`, exact content hash above.

The merged website and pinned public feed were cloned into separate clean checkouts. `npm ci`, content validation, types, all 17 feed fixtures, real-feed rebuild, i18n, the actual `check:public-tone` wrapper, copy, launch, links, media, project readiness, five smoke tests, and all 68 accessibility tests passed again. Only that final `dist/` tree was copied into a checkout based on the unchanged remote `gh-pages` tip. The staged tree contained no source, `.github`, dependency directory, feed checkout, credentials, or development diagnostics. Secret/private-path scans found no matches. `CNAME` and `.nojekyll` were preserved; the push was a normal fast-forward.

A single allowed Pages build request returned queued. Exact endpoint verification then passed:

```bash
node scripts/verify-deployment.mjs \
  --base-url https://gnaroshi.dev \
  --website-commit bcae578471b0c737b31751d73cde603af617e999 \
  --feed-commit 3b7e1fd92c5a6d3ef7a1298c3592b498da172d41 \
  --content-hash c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee \
  --feed-schema-version 1 --workflow-run-id local \
  --workflow-run-attempt 0 --environment production
```

All 31 checked live HTML documents matched the validated production bytes: the four core pages in EN/KO, both Blog indexes, both retired empty Reading compatibility redirects, the Korean article, and all nine project details in both locales. Live Chromium additionally verified 32 core viewport/locale/theme states (1440 x 1000 and 390 x 844), actual WebGL pixels, keyboard manipulation, layer separation, the six-click identity foil, global pointer tracking, single H1, no horizontal overflow, and no JavaScript/console errors. All eight four-route live contact sheets were manually reviewed.

The first cold AVIF full-page capture had a loaded-but-not-yet-decoded blank image. `complete` and `naturalWidth` alone were insufficient capture readiness. The final live captures explicitly awaited `image.decode()`; the selected research image then painted correctly. The existing full visual-v3 suite already awaits decode. This was a capture-readiness correction, not a fabricated replacement screenshot or an unverified image-file repair.

Repository Actions remained `enabled: false` before/after publication. Pages remains `legacy`, `gh-pages:/`, domain `gnaroshi.dev`, HTTPS enforced, approved certificate. Later documentation commits record this release but are not substituted for its built website source SHA. Owned test browsers/previews are closed and ignored QA evidence is preserved; the owner's localhost server remains available. The shell rejected force-style temporary-directory deletion, so the four owned temporary checkouts were moved to recoverable macOS Trash instead. No owner application or source repository was removed.

## Reference Review

The loaded Arnaud Rocca full-bleed scene and its author's Codrops case study informed direct manipulation and scene/editorial hierarchy. Bruno Simon and Lusion were explored but remained at splash/loading screens in the captured sessions; those captures are not claimed as completed demo verification. A Three.js example URL redirected to its index, so that capture is also not claimed as a working example. No reference assets or shaders were copied. Links and detailed motion policy are in [interaction and motion](interaction-motion.md).

## Known Limits

- WebGL requires a compatible browser/GPU; fallback preserves content rather than simulating a successful renderer.
- These original spatial illustrations are not scientific graphs, product evidence, or a replacement for actual app media.
- Synthetic localhost timing does not establish real-user INP, battery use, or universal device performance. The lazy Three.js payload is a real cost, documented separately from directly referenced initial JS.
- Long-form writing, evidence detail pages, and empty tool routes deliberately avoid a duplicated decorative renderer.
