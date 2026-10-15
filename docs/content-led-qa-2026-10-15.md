# Content-Led Interaction QA

## Scope And Baseline

Owner feedback rejected the repeated abstract introductory scenes, their unrelated visual meaning, and pointer-time lag. This revision replaces them with interactions on actual approved project/research material. It does not change public claims, the full-face identity, source screenshots, content eligibility, private repository access, or public URLs.

- Starting website: `aba89338241f84d3b755bf3c6b54ab467200f2e8`.
- Initial QA public feed: `3b7e1fd92c5a6d3ef7a1298c3592b498da172d41`, schema 1.
- Final release feed: `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb`. A clean public-only checkout was pinned after checking the remote. Its only change from the initial QA feed is manifest generation/source metadata; all content files and the content hash are identical. The owner's ignored development feed checkout was not modified.
- Content hash: `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.
- Durable guidance: `gnaroshi_mds` `258d5b4`, checked with its guidance validator and pushed.
- Research, source links, distinctions between implemented sites and prompt-only examples, and the self-applied implementation prompt: [content-led-interaction-brief.md](content-led-interaction-brief.md).

The finx.dev Timeline/List interaction was exercised in the browser, not inferred from a screenshot. Its public `components/timeline.tsx` was inspected for real-data selection and list fallback. Satavisha's pinned public `components/site-mascot.tsx` was inspected for its role-specific personal identity. No third-party implementation or artwork was copied.

## Implementation

- Home: native CSS perspective on approved evidence, coalesced drag input, project selection and the existing workflow reverse. No Three.js import or idle render loop. Only the selected story occupies layout, avoiding the previous long blank below short descriptions.
- Research: question-linked drag/snap, hypothesis/uncertainty comparison, actual figure zoom/pan and keyboard reset. Zoomed image panning does not trigger question navigation. The viewport follows the selected figure height, not the tallest inactive figure.
- Projects: purpose filters hide unrelated records, empty sections and their navigation slots. Named captured steps instantiate screenshots only after selection. Decode-before-replace, request identity and retry preserve the current screen through slow or failed loading.
- About: the approved full-face logo and explicit three/six-click relief/foil remain; no secondary contour renderer starts on entry.
- Articles, status/contact pages and evidence-gated tools retain their reading/contextual controls without empty visual toys. Navigation remains ordinary document navigation without overlapping snapshots.

## Performance Method

Measurements use one headless Chromium session, sequential routes, 1440x1000, CDP 4x CPU throttling, a 1.8-second startup observation, 30 pointer movements at 35ms intervals, a 400px scroll, and an 800ms settling period. Input work is the CDP `TaskDuration` delta; script work uses `ScriptDuration`. Long tasks include startup and input. The test's own RAF sampler is instrumentation, not a site render loop.

These are single-machine laboratory observations, not field INP, real-user FPS, a percentile population, or a universal device guarantee. Other host activity can affect results. Development and production are kept separate. Script-body totals are decoded observed requests, not compressed transfer budgets; the initial baseline body listener was asynchronous, so its totals can undercount late responses. The post-change profiler explicitly drains pending bodies.

### Development Input Work

| Route | Before main-thread ms | After main-thread ms | Before script ms | After script ms |
| --- | ---: | ---: | ---: | ---: |
| Home | 615.7 | 83.9 | 71.4 | 3.9 |
| Research | 401.8 | 61.8 | 49.5 | 2.9 |
| Projects | 497.1 | 114.7 | 68.5 | 2.6 |
| About | 415.2 | 98.4 | 50.2 | 4.0 |

All four routes changed from one automatically initialized canvas to zero. The About identity still initializes only after explicit activation. The final development sample drains pending response bodies: 517,246B Home, 675,242B Research, 505,802B Projects, 499,732B About, versus roughly 6.1MB observed in the baseline. An earlier 37-54KB development count was incomplete because the listener had not drained response bodies; it is superseded, not used as an optimization claim. Use production gzip budgets rather than development bytes for delivery decisions.

### Production Input Work

This benchmark uses content-interaction source `6b1e3c4`; the subsequent `5424701` follow-up changes only header paint and is validated separately below.

| Route | Before main-thread ms | After main-thread ms | Before script ms | After script ms |
| --- | ---: | ---: | ---: | ---: |
| Home | 601.5 | 82.2 | 67.4 | 2.2 |
| Research | 505.6 | 64.8 | 67.4 | 4.5 |
| Projects | 550.1 | 113.7 | 68.2 | 3.1 |
| About | 477.7 | 89.5 | 57.1 | 2.6 |

The after column is the final immutable-release rerun, with no other owned test browser running. It reduced pointer/scroll main-thread work by about 79-87%, without an initial canvas on any core page. Post-change observed script bodies were Home 13,217B, Research 28,665B, Projects 6,728B, About 11,660B. These include observed script requests during this experiment, not every possible later interaction; activating the About relief intentionally requests a separate engine. Long tasks were not eliminated: the final sample still recorded 1-2 during startup/input, totaling 56-116ms per route. An earlier after sample was 86.0/59.7/109.0/73.6ms; it is retained locally but not substituted for this final result. No claim of universally zero lag or measured field INP is made.

## Failures Found And Corrected

The first E2E attempt was not a pass: 237 passed, 18 failed, 15 conditionally skipped.

- Actual filter bug: scoped CSS did not reach cards rendered through another Astro component. Corrected the explicit page-level hidden selector and hidden section-navigation list items.
- Actual spacing bug: nested page headers retained a bottom margin in addition to PageShell gap. Removed the duplicate margin rather than widening the test tolerance.
- Gesture conflict: zoomed figure drag also moved the question carousel. Excluded zoomed inspector gestures from Embla drag handling.
- Redundant geometry: inactive Home stories and tall Research slides reserved blank space. Only active content now determines those regions; control/viewer dimensions remain stable.
- Existing tests assumed all nine scenario images were instantiated initially. They now require three active images, six inert templates, actual decoded selections, failure recovery and stale-response rejection.
- Media selectors accidentally counted zoom-dialog copies. Assertions now target the actual inspector's picture sources.
- The button audit now recognizes idempotent current filter/step selections and waits for async decode before comparing observable state.
- The first isolated copy lacked Git metadata, producing a null website SHA. It was not deployed. Subsequent production validation uses an explicit real source SHA; no provenance assertion was weakened.
- The first exploratory screenshot script waited for unrequested below-fold lazy images and was stopped. Corrected captures scroll images into their real viewport before inspecting them. The Research image was also visibly checked in the owner's in-app browser.
- The first complete visual command was interrupted after reproducing a focused scenario slider being pushed beyond the viewport after asynchronous image decode. The initial 14 all-route captures passed, but the overall run was not a pass. The controller now retains visible focus after a decode; desktop/tablet/mobile reproductions passed before the remaining matrix was rerun.
- A performance attempt passed six routes but failed Korean Research's CLS limit (0.192 > 0.1). A layout-shift observer traced this to moving the question heading into a new host after first paint. The heading now remains in the original article; nested subgrids align its figure and copy. The budget is not raised to hide this failure.
- A first axe run had 67 passes and one missing-element failure when a separate build replaced the preview artifact during navigation. This was a QA scheduling error, not waived accessibility coverage. The entire axe suite was rerun against an unchanged artifact: 68 passed. Build and browser validation are serialized afterward.
- Mobile header utilities now reserve explicit slots before parsing completes. Global text/clip entrance effects were removed after captures showed temporarily missing leading characters and lower About sections. Ordinary text is present immediately, while content-specific interaction transitions remain.
- All-route screenshot readiness now waits for painted visible media and settles the existing empty-paper compatibility redirect before inspecting the destination. Waiting for an unrequested lazy image or inspecting a document during its redirect was a capture error, not a valid visual result.
- Dark application screenshots legitimately have low color variance. The former arbitrary stage-variance assertion was replaced by a comparison with the decoded approved image: mean RGB error below 8 and structural correlation above 0.95. Expected pixels respect fractional CSS bounds; the two-pixel compositor edge is excluded from the interior comparison. Failures attach actual/reference images rather than loosening thresholds to accept a blank canvas.

## Verification Record

Commands run from an isolated QA copy with Node 24 and the pinned public feed, preserving the owner's development server on port 4321:

```bash
npm ci --no-audit --no-fund
npm run content:check
npm run check
npm run test:feed-contract
npm run build
npm run check:i18n
npm run check:launch-content
npm run media:check
npm run check:project-readiness
npm run check:links
node scripts/check-public-tone.mjs
node scripts/check-public-copy.mjs
PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e
```

Content fixtures passed 11 valid builds and six rejection cases, including private leaks, translated content, populated paper navigation and graph boundaries. Type checking passed with zero errors, warnings and hints. Public copy/tone, media provenance, project readiness, i18n and generated links passed. A partial or failed run is never recorded as complete.

The corrected full Chromium E2E run passed 257 tests with 15 conditional skips in 4.5 minutes. Those skips require live public paper data absent from the selected feed; populated navigation/checklist behavior passed in the separate feed-contract fixtures. The full accessibility rerun passed all 68 tests, including both locales, selected interaction states, light/dark, and opt-in identity/foil. Automated axe results do not replace manual keyboard and screen review.

## Visual Review Method

The matrix covers English/Korean, light/dark, and widths 1440, 1024, 768, 430, 390, 360 and 320. All-route first-view captures include 56 routes and compatibility destinations; focused tests inspect actual selected/zoomed/flipped/scenario states and all nine project details. Contact sheets are reviewed at every viewport/theme combination, with enlarged Home, About, Research and Projects captures for text, image order and spacing. This is not a claim that every full-size image was individually read end to end.

Initial full visual execution was 104 passes and 28 failures, not a successful release gate. After redirect readiness and source-pixel calibration, the all-route and new core-page matrix rerun passed all 38 cases. The complete project-desk rerun then passed all 28 cases after correcting fractional screenshot bounds. The remaining 66 visual cases passed in the full run. Together these cover all 132 visual conditions; this is a corrected coverage record, not a claim that the initial command passed. Final immutable-release outcomes are recorded with deployment verification.

Local ignored evidence is under `artifacts/content-led-2026-10-15/`, including before/after profiler JSON and reviewed contact sheets. Tests place route/state images under `artifacts/` in their isolated checkout. No report files or profiling payloads are added to the public deployment tree.

## Limitations

The feed has no public paper notes; populated paper workflows are exercised through feed fixtures, not fabricated live history. No email, portrait or Scholar URL was invented. Stale focus data remains hidden on Home. The opt-in Three.js relief still has a large lazy engine chunk; its startup is excluded from ordinary page entry and separately tested after activation. No new animation framework, remote font, chart library, screenshot or unsupported achievement was added.

## Immutable Release Validation

PR [#51](https://github.com/Gnaroshi/gnaroshi.github.io/pull/51) preserved the purpose-specific commits and was merged as `6b1e3c439e7a46123583e04c30685912b4a3d8b9`. A fresh isolated checkout built that exact source with public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb`, fixed build time `2026-10-15T07:59:10Z`, and local/0/production provenance. The owner's port 4321 server and ignored feed were not used as release inputs or rebuilt underneath browser validation.

Final checks on that unchanged artifact:

- `npm run check`: 311 files, zero diagnostic errors/warnings/hints.
- `npm run build`: 59 static pages; 25 noindex/redirect routes pruned from sitemap.
- `npm run check:i18n`: exact 261 page-key / 341 island-key parity.
- `npm run check:launch-content`: passed with the explicitly missing profile/paper/stale-focus notices above.
- `npm run media:check`: 24 review outputs, 208 approved outputs passed.
- `npm run check:project-readiness`: nine projects / 28 approved screenshots passed.
- `npm run check:links`: 2,113 internal targets across 59 HTML files passed.
- `node scripts/check-public-tone.mjs` and `node scripts/check-public-copy.mjs`: passed. Their npm wrappers were also exercised during earlier QA before final browser runs; the final scripts inspect the exact immutable output without rebuilding it during navigation.
- `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e`: 257 passed / 15 conditional skips, 4.2 minutes. Includes production smoke checks.
- `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:a11y`: 68 passed, 53.5 seconds.
- `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:visual`: the entire final 132-case command passed in 12.5 minutes, without a build or artifact replacement during navigation. All 14 final all-route contact sheets were regenerated and reviewed; selected enlarged states supplement the overview review.
- `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke`: five passed, 3.2 seconds, including exact source/feed provenance.
- `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance`: all seven route budgets and browser samples passed, 8.4 seconds. CLS was 0 on six routes and 0.068 on Projects in this run, below the unchanged 0.1 budget. Earlier zero-shift samples are not substituted for this actual result.
- WebKit focused content/project-desk/research regression: 27 passed / two Chromium-CDP-only skips. This was run on the same rendered application code with the initial byte-identical-content feed, before the final manifest metadata pin. It is headless WebKit coverage, not a physical Safari/iOS certification.

Final production gzip CSS / initial JS: Home 11.0/4.3KB; About 7.7/4.1KB; Research 8.9/11.0KB; Projects 8.4/2.7KB; Blog 6.3/2.7KB. All seven measured routes have zero React islands in this feed state. No performance budget was increased. Initial build warnings remain for the explicitly lazy Three.js chunk and the correctly empty paper collection; neither is reported as absent.

Physical-device testing, manual VoiceOver and field INP are not completed in this task. Keyboard, pointer/touch emulation, no-JavaScript, failed import, failed/late media, reduced-motion and opt-in identity checks are automated; contact-sheet review and the owner's in-app browser are supplementary manual visual evidence.

## Live Inspection And Header Follow-Up

The first public artifact was `f82b25caba229583d6d9dc44f82f4fbdaed69962`, built from `6b1e3c4`. Exact schema-v1 live verification passed, all 59 live HTML files matched local bytes, and the live four-page EN/KO light/dark 1440/390 matrix passed 32 conditions. A first inspection helper used a nonexistent Research selector; that helper failure was corrected and the matrix rerun. Early selected-state captures also caught the intentional 220ms scenario wipe in progress; subsequent captures await finite document-timeline animations and actual compositor paint without disabling the interaction.

Enlarged live inspection revealed a separate paint issue: the 97%-opaque sticky header allowed faint scrolled text to show through. Commit `542470103c08ab7cfd6a20db373d8fc43fa2af65` changes that single background property to the existing solid theme token and adds an explicit EN/KO, light/dark scrolled-header regression. There are no layout, content, dependency or interaction-controller changes in this follow-up.

The follow-up was built in the same clean isolated checkout with the same feed, fixed build time `2026-10-15T08:28:40Z`, and its own exact source provenance. Type checking, static build, i18n, public copy/tone and 2,113 generated-link checks passed again. The focused navigation/production-smoke/all-route visual command passed 24 cases with one empty-paper conditional skip (59.2 seconds), including all 14 route-capture combinations and the new opacity regression. The full 257-E2E/132-visual results above describe the content-interaction release; they are not falsely relabeled as an additional full-suite execution after this paint-only change.

```bash
PLAYWRIGHT_USE_EXISTING_BUILD=1 npx playwright test \
  tests/e2e/navigation.spec.ts \
  tests/e2e/production-smoke.spec.ts \
  tests/e2e/all-pages.visual.spec.ts
```

The full follow-up axe rerun passed 68 tests in 51.4 seconds. Its performance rerun passed all seven routes in 9.9 seconds, with the same 0-0.068 CLS range and unchanged budgets. The one-line paint change does not silently inherit a fabricated fresh benchmark: the measured input-work table identifies its actual source revision above.

## Final Publication

- Deployed website source: `542470103c08ab7cfd6a20db373d8fc43fa2af65`.
- Public feed: `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb`.
- Deployment artifact: `a3733931f15ecbd871289dd27b8d73a747a9f9fc`, a normal fast-forward from the independently verified `f82b25c` artifact.
- Content hash and schema remain the values listed at the start of this report; local/0/production provenance is exact.
- The deployment verifier passed. All 59 live HTML files matched the validated follow-up output byte for byte.
- The live four-core-route matrix passed all 32 EN/KO, light/dark, 1440/390 conditions again, with initial and selected captures, no overflow, duplicate H1, page exceptions or console errors. Scrolled Home screenshots confirm the header no longer shows underlying text. The actual in-app browser also exercised live project selection.
- Actions remained disabled before/after both publication pushes. Only repository permission settings were read; no workflow/run/check/log query, dispatch or workflow modification was used. Pages remains `legacy` / `gh-pages:/`, custom domain and HTTPS unchanged. One explicit Pages build request was made for the first artifact; its queued response was not treated as deployment verification. The follow-up published from its branch push without another explicit build request.
- Owned headless contexts close in `finally` blocks. Owned preview ports 4324/4325 have no listener. The owner's original port 4321 development server remains available.

```bash
node scripts/verify-deployment.mjs --base-url https://gnaroshi.dev \
  --website-commit 542470103c08ab7cfd6a20db373d8fc43fa2af65 \
  --feed-commit 1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb \
  --content-hash c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee \
  --feed-schema-version 1 --workflow-run-id local \
  --workflow-run-attempt 0 --environment production
```

The later documentation-only commit records these outcomes; it is not mislabeled as a different deployed application source. Ignored screenshots, profiler JSON and final release captures remain in `artifacts/content-led-2026-10-15/`; disposable isolated checkouts are archived recoverably, not left running or deleted irreversibly.
