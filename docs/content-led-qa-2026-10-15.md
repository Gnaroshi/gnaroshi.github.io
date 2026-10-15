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

| Route | Before main-thread ms | After main-thread ms | Before script ms | After script ms |
| --- | ---: | ---: | ---: | ---: |
| Home | 601.5 | 86.0 | 67.4 | 2.1 |
| Research | 505.6 | 59.7 | 67.4 | 3.0 |
| Projects | 550.1 | 109.0 | 68.2 | 3.0 |
| About | 477.7 | 73.6 | 57.1 | 1.9 |

This sample reduced pointer/scroll main-thread work by about 80-88%, without an initial canvas on any core page. Post-change observed script bodies were Home 13,217B, Research 28,778B, Projects 6,728B, About 11,660B. These include observed script requests during this experiment, not every possible later interaction; activating the About relief intentionally requests a separate engine. Long tasks were not eliminated: the after sample still recorded 1-2 during startup/input, totaling 55-135ms per route. No claim of universally zero lag or measured field INP is made.

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
