# Project Desk QA - 2026-10-13

## Scope

The previous Home interaction was predominantly hover feedback. The new project desk appears directly after the personal introduction and changes actual project evidence, narrative, workflow, limitations, and destination. It does not introduce public research claims or an authoring system.

The approved full-face identity, About's opt-in relief/foil interaction, public routes, content eligibility, and public-feed boundary are preserved. Canonical guidance was read through MCP. The reusable discoverability rule was documented and pushed in `gnaroshi_mds` commit `124165e`.

## Evidence Sources

| Project | Approved media ID | Disclosure |
| --- | --- | --- |
| gnaroshi_vla | `project-gnaroshi-vla` | Redacted repository/configuration/manifest evidence; the sanity run is not a benchmark. |
| Gnaroshi Studio | `gnaroshi-studio-managed-apps` | Deterministic demo titles and app activity; approved application source `e6115c90ab866adde9ed1ea2cecda178fca96cdd`. |
| PaperFlow | `paperflow-plan-review` | Demo library counts/proposals; no real Zotero library was opened; source `7c7bd013d171e2e58e0a5cee97faacd0c02ee8a8`. |

No screenshot was generated, replaced, or newly approved. Existing approved AVIF/WebP assets are reused. `object-fit: contain` preserves the complete evidence. Every selected record retains its disclosure and detail destination.

## Interaction Contract

- Project buttons, arrows, horizontal pointer/touch dragging, and Arrow keys select the same three records.
- The workflow button, an active-sheet click, Enter, and Space turn the selected evidence over. Escape returns to evidence; reset selects the first front-facing record.
- Exactly one choice is pressed. Clicking the already selected front-facing choice is intentionally idempotent.
- Inactive stories and focus targets are inert. Only the selected front image has meaningful alt. The readable workflow remains ordinary document text, outside the perspective scene.
- Vertical touch scrolling is not captured. A child-to-stage capture transfer is not treated as a canceled swipe.
- The Three.js DOM renderer loads near the viewport. Requested animation settles after 850ms, with no idle rendering loop; offscreen/background rendering stops.
- Reduced motion and detected zoom use flat, equally functional views. No JavaScript retains the first approved evidence and its project link; failed scene import retains all ordinary controls.
- Lucide controls are rendered on the server, with local license attribution and no React hydration.

## Verification Record

Node `24.21.0` was used, consistent with `.node-version`. The selected public feed is `cb042193c41a1df60fbf2d37fc20cc259efbedf7`, content hash `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`, schema 1.

| Check | Result |
| --- | --- |
| `npm run test:feed-contract` | 11 valid build fixtures and 6 rejection fixtures passed. |
| `npm run check` | 298 files; zero errors, warnings, or hints. |
| `npm run build` | 59 static pages. |
| `npm run check:i18n` | Exact parity for 260 page keys and 341 island keys. |
| `npm run check:public-tone` and direct `node scripts/check-public-tone.mjs` | 59 HTML files and 19 EN/KO route pairs passed. |
| `node scripts/check-public-copy.mjs` | 59 HTML files passed. |
| `npm run check:links` | 2,343 internal targets, metadata, assets, fragments, RSS, sitemap, and privacy checks passed. |
| `npm run media:check` | 24 review outputs, 208 production outputs, 252 source files passed. |
| `npm run check:project-readiness` | 9 projects and 28 approved screenshots passed. |
| `npm run check:launch-content` | Passed; absent email/portrait/Scholar and substantive paper content remain hidden; stale focus remains hidden. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:e2e -- --workers=1` | 229 passed; 2 populated-feed tests skipped for the selected empty-paper feed. Feed fixtures cover populated contracts. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:a11y -- --workers=1` | Final full run: 64 passed, including selected/flipped desk states. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:performance -- --workers=1` | Final full run: 7 passed. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:smoke -- --workers=1` | 5 passed. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npm run test:visual -- --workers=1` | 80 passed across complete-page, project, workflow, and desk matrices. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npx playwright test tests/e2e/project-desk.spec.ts --grep '@visual' --workers=1` | Final targeted rerun: 28 passed, 168 screenshots, including the new 320px single-column assertion. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 npx playwright test tests/e2e/visual-v3.spec.ts --grep mobile-320 --workers=1` | Final narrow-page regression: 2 passed. |
| `PLAYWRIGHT_USE_EXISTING_BUILD=1 PLAYWRIGHT_BROWSER=webkit npx playwright test tests/e2e/project-desk.spec.ts --grep-invert '@visual\|@a11y' --workers=1` | 5 passed; 2 Chromium-specific CDP touch/zoom cases skipped. |

The first full E2E run found three outdated assertions: the old Home section count, the selected-choice idempotence contract, and a removed Home media selector. The assertions were updated to check the new structure and state invariant; the full rerun passed. Initial touch testing also exposed a real pointer-capture cancellation bug, fixed and re-tested using real Chromium touch events.

Terminal launches intermittently stalled. Verification continued through the same local Node 24 runtime. A long visual orchestration call exceeded the MCP transport's 300-second limit; the complete suite was restarted with durable local logging, without changing tests, operating-system security, or build requirements. These interrupted launches are not reported as successful checks.

## Visual Review

The desk matrix covers 1440, 1024, 768, 430, 390, 360, and 320px; English/Korean; light/dark; all three projects; evidence/workflow sides: 168 images in 28 contact sheets. Iterative inspection covered every state and representative full-size images, plus actual first-view Home captures. Component-only captures hide the sticky header for cropping; complete-page captures retain it.

Review criteria: approved media readability and full aspect ratio, consistent controls, state clarity, disclosure, no clipping/overflow, readable ordered workflow, theme contrast, and keyboard/touch equivalence. The small-heading default margin was removed. The 320px workflow was changed to a single column to avoid excessive line breaking and reserved whitespace; its final verification is recorded below.

The complete 80-test visual suite passed before the last narrow-layout adjustment, unused Home CSS removal, and optional image-fit scoping. The final build then passed the full functional, accessibility, and performance suites, the complete desk matrix, and the 320px page matrix. Final contact sheets were regenerated; all four 320px sheets and desktop/mobile representatives were inspected again. Existing images retain their previous fit behavior; only the desk explicitly requests `contain`.

Home's measured gzip budgets are 11.1 KiB CSS and 4.3 KiB HTML-referenced boot JavaScript, with zero React islands. These boot figures do not include the near-viewport Three.js module: its core is approximately 46.1 KiB gzip plus the small desk scene module. Rendering is on demand rather than continuous. The local mobile run measured Home CLS 0 and LCP 40ms; these are laboratory observations, not field performance promises.

Local ignored evidence: `artifacts/project-desk/`, `artifacts/project-desk-qa-2026-10-13/`, `artifacts/public-page-checklist/`, `artifacts/project-stories/`, and `artifacts/visual-audit-v3/`.

## Final Release Checklist

- [x] Evidence/privacy, feed contracts, type, content, localization, links, and complete functional checks.
- [x] Complete visual suite and final narrow-layout verification.
- [x] Final accessibility/performance checks and WebKit interaction checks.
- [x] Purpose-separated commits, PR, and source push.
- [x] Clean production build from immutable website/feed SHAs.
- [x] Fast-forward static publication with repository Actions still disabled.
- [x] Exact live provenance and live Home interaction verification.
- [x] Owned QA processes stopped; requested localhost retained.

## Published Release

- Feature: `5d22422`; interaction tests: `1b485d7`; guidance/QA: `1c90eaf`.
- [PR #47](https://github.com/Gnaroshi/gnaroshi.github.io/pull/47) merged into `main` as `138c97eda9cc717e06745f0a71333f71b45effa0`.
- Immutable public feed: `cb042193c41a1df60fbf2d37fc20cc259efbedf7`; schema 1; content hash recorded above.
- Build timestamp: `2026-10-12T19:16:58.028Z` (2026-10-13 in Korea); `local` / `0` / `production`.
- Static artifact: `5e269d07ac8fa9729eb91fa76eca3be490fb7cd1`; 408 public files; ordinary fast-forward from `d4550b591e1963eac8a6fe4cf44c34139756731e`.
- The previous artifact had advanced to the already-verified `127fc5c` source during QA. It was reconciled before preparation; the remote deployment tip was checked again immediately before publication. Nothing was force-pushed.
- Clean isolated `npm ci`, type check, all 11 valid/6 rejection feed fixtures, 59-page build, i18n/tone/copy/launch/links, 5 smoke checks, and 11 desk interaction/axe checks passed against the selected input pair.
- Root `.nojekyll` and `CNAME` were preserved. Static-tree inspection found no source checkout, dependency directory, development diagnostics, credentials, or local paths.
- Repository Actions were confirmed disabled before and after publication. No Actions run/check/log query, dispatch, or rerun was used. One permitted Pages build request returned `queued`; that response was not treated as publication proof.
- `scripts/verify-deployment.mjs` subsequently verified exact live website/feed SHAs, content hash, schema, environment, run fields, core routes, navigation, and scaffold-copy absence.
- Live Home selection, flip, and horizontal drag passed in EN/KO at 1440 and 390px, light/dark: eight combinations, zero page errors or overflow, loaded images, and one selected choice. All 16 selected/front-back screenshots were inspected in four contact sheets.
- Live EN/KO About retained original identity, third-click WebGL relief, sixth-click foil, and reset. Research retained one H1, no mobile overflow, and no page errors.
- Ignored live evidence: `artifacts/project-desk-live/`; verifier and command logs: `artifacts/project-desk-qa-2026-10-13/`. Owned preview and headless browsers closed; the user-requested `127.0.0.1:4321` server remains available.

### Non-Passing Attempts And Remaining Warnings

The isolated feed-fixture run initially reused the previously running QA server on port 4324 and compared fixture expectations against the wrong feed. It stopped with six failures. The owned server was closed; the complete fixture runner passed from the isolated checkout, then the selected production feed was rebuilt and smoke-tested. No test invariant was weakened to resolve this environment mismatch.

The first PR merge request used an abbreviated SHA and was rejected with HTTP 422. Retrying with the exact 40-character head SHA succeeded. This did not change or bypass merge requirements.

`npm audit --json` returned exit 1 for four existing low-severity KaTeX/remark-math/rehype-katex dependency advisories, with no moderate, high, or critical findings. They are not introduced by Lucide. The reported automatic remedies include breaking upgrades/downgrades, so no forced dependency rewrite was applied during this interaction task. This remains a separate dependency-hardening item, not a claim of a clean security audit.

This final release record is a later documentation-only revision. Live provenance intentionally identifies the built merge source `138c97e`, not the subsequent report commit.

## Known Limits

Three.js documents a 100% zoom constraint for `CSS3DRenderer`; zoom detection restores flat content rather than claiming perspective works at every browser scale. Chromium CDP touch/zoom emulation is not a physical-device test. Automated axe checks are not a full assistive-technology certification. Local performance observations are not field Core Web Vitals. The opted-in About WebGL effect can remain unavailable on unsupported devices, with the original approved logo preserved.

See [interaction contracts](interaction-motion.md), [deployment](deployment.md), and [rollback](rollback.md).
