# Owner Page Feedback QA

Implementation started 2026-10-13; final verification completed 2026-10-14 (Asia/Seoul).

## Scope

This revision implements the owner's About and Research browser comments directly in the website repository. No private content repository, feed record, approved media, or favicon is modified. Guidance was read from the MCP index and local MDS; `gnaroshi_mds` revision `d2dfa76` records interaction intent taking precedence over literal visual defaults.

- About: remove the visible logo caption/control strip, generic Skills and tools section, redundant technology description/count, and their unused layout space. Keep the verified technology-to-project map as a semantic independent section.
- Identity: after three activations, page-wide mouse/pen input changes bounded 3D orientation without moving layout position. Touch scrolling and reduced motion do not drive tilt. Keyboard activation, arrows, Escape reset, P pause, fallback, and teardown remain available.
- Research: replace the framed article with a question-first reading spread and physical image drag/snap exploration. The selected question, explanation, caption, thumbnail, and hash change together. Arrow controls, keyboard, direct hashes, history, complete-list mode, and no-JavaScript reading remain supported.
- Navigation: public Writing becomes Blog. Empty Reading indexes and navigation are retired; existing `/papers/` and `/ko/papers/` forward to the real research-tools question through localized, noindex compatibility documents. Real feed-backed paper detail/index routes are preserved.

## Findings Fixed During Verification

- A hidden article's display rule overrode `hidden`; hidden articles now cannot create an implicit second mobile grid column.
- Native scrolling to an inactive carousel image could expose half of two slides. The viewport uses standard overflow-hidden clipping, the engine owns horizontal position, inactive slides are inert, and active media warming excludes inactive slides.
- Focus-driven scrolling before mouseup could cancel a mobile lens click. State changes now keep the selected control visible after activation, not during the initial focus event.
- Moving a directly loaded hash heading could drop focus. The selected heading is refocused after enhancement; history also restores the initial no-hash topic.
- Question changes close an open, stale media dialog and return focus to an available viewer.
- A cached offscreen observation and a cleared backing buffer could leave the foil logo invisible after a 3D/capture/foil sequence. Fresh geometry controls resumed rendering and resize restores one static frame. The initial 18/32 visual failures and subsequent diagnostic repetitions were not waived. Five repeated sequences passed after the fix. Negative RAF interpolation is separately clamped.
- Generic button audits mistook physically offscreen inert carousel controls for actionable controls. Audits now exclude inert/aria-hidden ancestors while checking every active control.
- Navigation and axe checks initially sampled the intermediate retired-route document. The compatibility document now has localized title, language, heading/landmark, noindex, and preserved target hash; route tests wait for the actual destination.
- A locale without public paper notes inherited another locale's Reading navigation and translation links. Locale-specific feed checks now omit that navigation, avoid false hreflang pairs, and give the weekly empty state a valid destination. Translated-paper fixtures exercise both positive EN/KO hash-navigation states.
- Clearing a selected system-workflow node hid its focused control. Clearing now restores focus to the visible source node; keyboard selection reserves the sticky-header offset.
- One-pixel clipping of mobile technology controls was corrected by scrolling the activated/focused control into view after selection, with an explicit header margin.
- Manual screenshot review found a near-blank Research diagram despite loaded-image/geometry assertions. Standard viewport clipping corrected one compositing case. The final screenshot guard now waits for anchor scrolling before resetting capture position and analyzes the actual image crop, not Sharp's unprocessed input image. Earlier whole-image statistics could pass a blank diagram because page text supplied color variance; those captures were superseded.
- A build in the shared development checkout stopped exiting after reporting completion. It was interrupted, not counted as a pass. The complete gate was repeated in a clean isolated source snapshot using the selected public feed and its matching bundled contract. No cause is asserted from that observation.

## Selected Inputs

- Starting website main: `4d9fbc557ae32e74b91e94261293a1a39368ad4a`.
- Public feed: `3b7e1fd92c5a6d3ef7a1298c3592b498da172d41`.
- Content hash: `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee` (schema 1).
- Node 24 is required. An initial installation under the system's Node 26 emitted an engine warning; installation and verification were repeated with Node 24.

## Final Verification

The complete code gate ran in a clean isolated snapshot, without sharing Astro caches with the owner's localhost server. Both `CONTENT_FEED_PATH` and `CONTENT_FEED_CONTRACT_PATH` were pinned to the selected public checkout; a newer neighboring feed was not silently substituted.

| Check | Result |
| --- | --- |
| `npm ci` (Node 24) | Passed; 500 packages; four low-severity audit advisories |
| `npm run content:check` | Canonical schema/privacy/hash validation passed |
| `npm run check` | 305 files; zero errors, warnings, or hints |
| `npm run build` | 59 static pages; passed |
| `npm run check:i18n` | 261 EN/KO UI keys and 341 public-copy keys; exact parity |
| `npm run check:launch-content` | Passed; missing public identity details and stale focus remain honest warnings |
| `node scripts/check-public-tone.mjs` after build | 59 HTML files and 19 EN/KO route pairs; passed |
| `npm run check:links` after build | 2,113 targets; passed |
| `npm run test:e2e -- --workers 2` | 247 passed; 15 conditional skips on the actual zero-paper feed |
| `npm run test:a11y -- --workers 2` | 68 passed |
| `npm run test:visual -- --workers 2` | 108 passed; complete tagged visual suite, not just the core routes |
| Owner feedback visual matrix | 32 scenarios; final image-crop assertions and screenshots supersede earlier captures |
| Scoped WebKit content/Research interaction tests | 25 passed; not a physical Safari/device claim |
| `npm run test:performance -- --workers 1` | Seven route budgets and seven synthetic browser checks passed |
| `npm run media:check` | 24 review and 208 approved production outputs; passed |
| `npm run check:project-readiness` | Nine projects and 28 approved screenshots; passed |
| `npm run test:feed-contract` | 11 valid builds and six expected rejection fixtures passed |

The conditional paper skips are not treated as positive populated-state evidence. Rich English and paired EN/KO feed fixtures separately verify exactly-one-current Overview/Reading-method navigation, direct hashes, keyboard activation, history, and missing-locale behavior.

Changed-page capture matrix: About and Research, EN/KO, light/dark, widths 1843, 1440, 1024, 768, 430, 390, 360, and 320; height 1000. About covers original, dimensional, and foil states; Research covers all three selected questions (192 full-page captures). Manual review uses contact sheets and detailed full-size captures; the wider suite provides automated route, geometry, focus, and screenshot coverage. No claim is made that every image in the wider suite was individually inspected at full size.

Local logs remain under ignored `artifacts/about-owner-feedback-2026-10-13/`; final screenshots remain under ignored `artifacts/owner-feedback-final/` and `artifacts/visual-audit-v3/`. No private records, machine paths, or test artifacts enter the source or static publication.

## Release

Source and artifact publication is recorded separately after exact live website/feed/hash verification. A branch push alone is not reported as deployment. Repository Actions remain disabled; no run/check/log query or dispatch is used.

## Limits

The Research scene is visibly disclosed as generated concept imagery, not experiment evidence; the two diagrams remain explanatory diagrams. The website still does not author notes or recompute private metrics. About's foil is an opt-in identity effect, not a product screenshot. Local synthetic performance is not real-user INP; measured Research CLS remains 0.087 (EN) / 0.074 (KO), below the existing 0.1 budget but not zero. No public email, portrait, or Scholar identity is invented, and stale current-focus data remains hidden from Home. The four low-severity dependency advisories are not hidden or addressed by a risky unrelated major upgrade. Optional macOS fsevents installation warnings did not fail installation or the runtime checks.

## References

- [Codrops, June 2026: interactive artifact inspection](https://tympanus.net/codrops/2026/06/09/building-an-interactive-digital-stamp-collection-with-shaders-postcards-and-playful-inspection/) informed direct manipulation of meaningful media, not copied artwork or shaders.
- [Embla source](https://github.com/davidjerleke/embla-carousel), exact 8.6.0, supplies route-local drag/snap physics; MIT attribution is bundled locally.
- [Chrome Web UI, I/O 2026](https://developer.chrome.com/blog/new-in-web-ui-io26) was reviewed for progressive enhancement; experimental canvas/transition APIs were not added or claimed.
