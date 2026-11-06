# Public travel pages

## Ownership and public boundary

Reusable travel UI and reviewed trip content belong to the separate private travel source repository. This website receives only its deliberately curated static export under `public/travel/<trip>/`. The private repository's visibility does not protect exported content: every imported byte is public, including JavaScript, JSON, comments, caches, and metadata.

Never import a workbook, worksheet dump, personal itinerary, attendee/contact list, identity document, reservation, payment record, exact private lodging, reimbursement detail, or credential. Public event venues and schedules are distinct from a person's lodging or movements. General estimates may be shown as estimates; private actual spending must not be presented as public budget data. Do not add the private repository URL to the public interface or portfolio registry.

The website does not read the workbook or private source, and the public feed remains the sole owner of blog/paper records. The trip's browser-local checklist and calculator must not send visitor entries to any server. A template (`skeleton`) is never imported.

## Import

Commit and validate the travel source first. Build its reviewed static export, then run:

```bash
node scripts/import-travel-export.mjs \
  --source <reviewed-export-directory> \
  --slug corl2026 \
  --source-commit <exact-40-character-travel-source-SHA>
```

The source directory is the single trip directory containing `index.html`, not the entire travel repository or build tree. The importer validates file types, rejects symlinks and hidden files, checks the expected canonical URL and basic document semantics, checks common private markers, then atomically replaces only that trip's public directory. These checks supplement human curation; they cannot prove an arbitrary document contains no sensitive content. A failed validation leaves the existing public directory unchanged.

`export-provenance.json` records the exact upstream source commit and SHA-256 values of imported files. It deliberately contains no source URL or local path. During `npm run build`, `finalize-travel-pages.mjs` adds the website/feed build metadata to travel HTML, so imported HTML hashes describe the upstream export before this deployment-specific stamp. Normal asset URLs and canonical links remain unchanged.

## Compatibility and release

| Repository | Baseline | Preserved behavior | Contract change | Migration | Validation | Rollback |
| --- | --- | --- | --- | --- | --- | --- |
| Website | `main` at `07760e2d5f3564443994b77e603d60f95ae711d2` | Existing routes, bilingual navigation, public-feed ownership, static Pages, domain/HTTPS, disabled Actions | Additive `/travel/corl2026/` static export | Validate and commit producer, import reviewed bytes, then release website normally | Import rejection checks, full existing release checks, mobile trip interaction/privacy checks, exact live bytes | Revert trip import and build finalizer change, or restore last verified static artifact by normal `gh-pages` commit |
| Travel source | New repository; producer records its own baseline | Curated public export only | Version-1 export provenance with stable trip path | Producer before consumer; no private runtime access | Producer content/privacy/build/browser checks | Rebuild a previous reviewed source commit and re-import |

Applied MDS guidance: web-application source ownership and no-private-import boundary; UI/UX mobile readability and actionable controls; cross-repository baseline, provider-first delivery, exact provenance and rollback. Existing local Pages publication is retained. No new hosting service, background data synchronization, feed schema, website language counterpart, or global navigation item is introduced. Korean trip content is an owner-requested standalone utility at the specified URL, rather than an invented English/Korean translation pair.

Run all checks in [deployment](deployment.md), including route/accessibility checks for this addition. Future event times are event data, not publication timestamps. Preserve their semantics in validation. Recheck that imported content has no private source fields or spreadsheet attachment before staging.

Publish through the established locally built `gh-pages:/` release with Actions disabled, as described in [deployment](deployment.md). Source commits alone do not publish. Keep `.nojekyll`, `CNAME`, the custom domain, HTTPS, exact website/feed source pins, and the existing verifier. Verify the changed route and its assets against local built bytes after exact global provenance verification. Record the selected travel source commit, website source commit, deployment commit, checks, and live result in the release record when complete.

## CoRL 2026 integration validation — 2026-10-30

The reviewed travel producer is pinned to `ba389a4f5e4eaae9fe268ebb1adbe859365eafb6`. Only `index.html`, `app.js`, and `style.css` were imported, with source hashes recorded in the public export provenance. No workbook or source attachments are part of this consumer. The producer's content/privacy/build checks and mobile/tablet browser interaction review passed before import.

The unchanged public feed is pinned to `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb`, schema 1, content hash `c9a73861cd05863e59caee1bfb115bd979f2b59f25d5e72dbb8307179b5462ee`.

- Import safety checks passed: unsupported attachment, private-record field, symlink, path traversal, and template exports are rejected. Rejected imports preserve the prior trip directory. Repeated provenance stamping emits one metadata pair.
- Website content/schema, project copy, and Astro checks passed (317 files, zero diagnostics).
- Feed-contract validation passed 14 valid website builds and six expected rejection fixtures, including their focused browser checks.
- Preserved website E2E at the exact pre-change baseline passed 277 cases, with 17 fixture-only cases skipped. Accessibility passed all 70 checks. This isolates preserved-site evidence from the new travel page's producer browser coverage.
- The imported website build, dictionary parity, public tone, launch-content, and link/metadata/fragment/asset/privacy checks passed (62 HTML files, 2,026 internal targets). Existing warnings for absent optional public identity data and stale Home focus remain unchanged.
- Imported website production smoke passed all five cases. Deployment provenance is added to the travel document without changing its content or runtime assets.

## Verified publication — 2026-10-30

The immutable production build used website source `918fdc2a6c3a56876572773a94b4bb734c868fde`, the exact public feed above, and travel producer `ba389a4f5e4eaae9fe268ebb1adbe859365eafb6`. A clean isolated build produced 413 public files with `production`, `local`, `0` provenance and build time `2026-10-30T06:05:19Z`.

- Publication advanced `gh-pages` normally from `85e59a755ba47685ec6af057beaeb695ded7a4eb` to `37de066d1be8725ef486e645458084222c1ffc30` after rechecking the remote release guard.
- The existing live verifier matched the exact website/feed SHAs, content hash, schema and local production provenance, plus the existing core routes and navigation.
- `/travel/corl2026/` and its JavaScript, CSS and export provenance returned HTTP 200 with byte-for-byte matches to the validated artifact. The live mobile page showed 23 destinations, 30 checklist items, blank initial personal budget and no horizontal overflow.
- Focused travel accessibility checks at 390px and 1440px found zero axe violations and zero overflow. Producer browser review covered 320px, 390px, 768px and 1440px, keyboard/hash navigation, filtering/saving, painted maps, checklist undo/persistence, budget arithmetic and invalid input. Storage denial, session operation and corrupt-state fallback also passed a DOM integration check.
- Actions remained disabled before and after publication. Pages stayed `legacy`, `gh-pages:/`, `gnaroshi.dev`, with HTTPS enforced. All owned local QA listeners were stopped.

This documentation-only commit records publication; the built source remains `918fdc2a6c3a56876572773a94b4bb734c868fde`. Rollback restores the previous verified public artifact through a new normal deployment commit, preserving the source repositories and private visitor state.

## CoRL utility view revision — 2026-10-30

Baseline: website `main` at `1cfe084a507926a5209efaec325eb3dac9f35acd`, verified deployment `37de066d1be8725ef486e645458084222c1ffc30`. The owner requested compact task views in place of the long scrolling guide. Reviewed producer `0068e96a0447a4aaea23366b54247535e09053d8` supplies the same three public assets and version-1 export provenance. The website only imports them and adds its normal build metadata. Homepage, bilingual routes, public feed, import validator, hosting and disabled Actions are unchanged.

Schedule, destinations, preparation, budget and reference views share the same stable utility route. JavaScript manages view/hash history, dialogs and browser-local actions; the public document retains a readable no-JavaScript fallback. Asset URLs use content-hash query versions so previously cached JavaScript/CSS cannot be paired with the new document. The private source URL, workbook and individual travel/payment records are absent from the public interface.

Storage compatibility preserves `travel:corl2026:v1` for existing `checks`, `saved` and `budget` fields. A separate `travel:corl2026:planner:v1` stores the new visit plan and theme. The old page can still read its existing fields, and an old writer does not erase the companion plan. Unknown/corrupt values are sanitized; denied storage leaves current-session actions usable. Visitor state is never sent to the website or copied into the export.

Validation reuses the unchanged site's earlier full feed-contract, E2E and accessibility evidence. The affected consumer checks cover content/schema and Astro validation, static build, localization, public copy, links/assets/fragments/privacy and production smoke. Producer review covers the new view interactions, existing-state migration, rollback writer, storage failure, mobile layout and actual map rendering. Exact export hashes and the deployment metadata-only HTML transformation are checked again in the isolated final build. The existing provider-first local release and normal `gh-pages` rollback remain in force; publication and live verification are recorded separately after completion.

## Verified SPA publication — 2026-10-30

Website source `2170c91e87fbc58a4161d007644b0f757090d76d`, public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` and producer `0068e96a0447a4aaea23366b54247535e09053d8` produced the validated `production/local/0` artifact at `2026-10-30T08:00:09Z`. Normal deployment `2d0b1ae25cc0b8015342462247fa7b20ea664813` advanced the previous verified artifact `37de066d1be8725ef486e645458084222c1ffc30`.

The live global verifier matched the exact source/feed/hash and core routes. `/travel/corl2026/`, both versioned runtime assets and export provenance returned HTTP 200 with exact local byte matches. Live mobile review showed one active task view and selected day. Producer QA passed 27 scenarios with zero axe findings, including original visitor state, planner rollback, history/direct entry, storage failure, budgets and 320–1440px light/dark layouts. All five final website smoke checks passed. Actions stayed disabled; Pages, domain and HTTPS were preserved. This documentation-only record does not change the built source pin.

## Verified guide refresh — 2026-11-06

Producer `6eb5837f03d29169fed70aba24326848b5d056da` supplied the refreshed conference and destination data through the existing three-asset export. The producer passed 28 browser scenarios and the public privacy audit. Website source `c48bb7e3d961058c948a7e952098e0696602fe4e` and public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` produced the 413-file local production artifact at `2026-11-06T11:05:02Z`.

The website passed Astro, localization, public copy, link and privacy checks and all five smoke cases. The guide matched the producer bytes after the expected HTML build metadata was added. The other public outputs matched the prior artifact after accounting for release metadata.

Deployment `26ea1f64ffa7cd7013f482c723d276ade01fbf2a` advanced `gh-pages` from `2d0b1ae25cc0b8015342462247fa7b20ea664813`. The live verifier matched the production source and feed pins, feed content hash and primary routes. The guide HTML, versioned JavaScript and CSS, and export provenance returned HTTP 200 with exact matches to the validated artifact. Two focused scenarios also passed on the live guide. Pages published from `gh-pages:/` with HTTPS and Actions disabled. The built website source remains `c48bb7e3d961058c948a7e952098e0696602fe4e`.

## Verified timeline layout — 2026-11-06

Producer `89b2555987792029bdfb4b3df9ae91b9bebf0b1d` groups equal-time sessions, shows separate tracks for partial overlaps, and restores each selected day's scroll position. Its 31 browser scenarios passed with zero axe findings and a clean public export audit. Website source `11c3d1382a241729156f7ba91f46605c39550f4d` and public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` produced the 413-file local production artifact at `2026-11-06T11:21:10Z`.

The source, static output, privacy and five smoke checks passed. The guide export matched the producer and the other public content matched the prior artifact after accounting for build metadata. Deployment `517e70715d7e2526d40e42dc65f71e4fa19eae4b` advanced `gh-pages` from `26ea1f64ffa7cd7013f482c723d276ade01fbf2a`.

The global verifier matched the live source and feed pins, content hash and primary routes. The guide, versioned JavaScript and CSS, and export provenance matched the artifact. The public timeline passed the focused overlap, keyboard and day-scroll scenarios at 320px, 390px and 1440px. Pages published through `gh-pages:/` with HTTPS and Actions disabled.

## Verified encrypted guide — 2026-11-06

Producer `5efbf727a7f94c5e7315dc22153c04ad0bff9cc8` added the password-unlocked “내 안내” panel at `/travel/corl2026/#mine`. The approved public export carries the ciphertext and public decryption parameters. Web Crypto unlocks it in the browser, with an optional remembered key and a forget action. The producer passed 32 browser scenarios and its privacy scan.

Website source `8aeba2a059b612fef84664ffc1a73e228caf3b0c` and public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` produced the 413-file local production artifact at `2026-11-06T13:23:54Z`. Static output checks and five smoke cases passed. Deployment `d07a5fb2d800ac6518f42d87d79850dbceeed328` advanced `gh-pages` from `517e70715d7e2526d40e42dc65f71e4fa19eae4b`.

The live verifier matched the source, feed and primary routes. The guide, versioned JavaScript and CSS, and export provenance matched the artifact. Fresh locked views passed at 320px and 390px with empty private content and no external requests. Live WebKit also verified unlock, remembered access after reload and forgetting on the same static route. Pages published through `gh-pages:/` with HTTPS and Actions disabled.

## Verified merged personal schedule — 2026-11-06

Producer `f56403c347c93fa3f5774f608414ffcbec24877d` added the merged personal schedule after unlock. The export retains three assets and the existing provenance schema. Private events appear only after browser decryption. The producer passed 32 browser scenarios, real encrypted-guide checks in Chromium and WebKit, and its public privacy scan.

Website source `6c85d64f103a9e4bd11cdb008a96d3d43e77b735` and public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` produced the 413-file local artifact at `2026-11-06T14:26:23Z`. Public output checks, five smoke cases and the encrypted-envelope check passed. Deployment `86226938250bea10f133b208be54ca0b9cd173f1` advanced `gh-pages` from `d07a5fb2d800ac6518f42d87d79850dbceeed328` and was verified live after Pages propagation.

The guide and versioned assets matched the artifact byte for byte, and fresh locked views passed at 320px and 390px. A live WebKit check confirmed that the prior remembered unlock opens the merged schedule after refresh and that locking restores the public schedule. The global verifier matched the source, feed and primary routes. Pages published through `gh-pages:/` with HTTPS and Actions disabled.

## Verified private travel days — 2026-11-06

Producer `ba7a2f6e9bea744e1ec3d347cde1a7a889751ff3` added private travel days to the unlocked schedule. The producer passed 32 browser scenarios, itinerary checks in Chromium and WebKit, and its public privacy scan. The locked public schedule data and five-date navigation matched the preceding export.

Website source `862ebec796cb6f6f59e6169282bd1c7d6c0c103f` and public feed `1deb21d9e0ca9c2f13211ea54ddef0370d4bb7fb` produced the 413-file local artifact at `2026-11-06T14:41:50Z`. Public output checks and five smoke cases passed. Deployment `73f0a7c96643eb95607c41b21aef183948fc06c5` advanced `gh-pages` from `86226938250bea10f133b208be54ca0b9cd173f1`. After delayed propagation, one documented legacy Pages request returned `queued`. Live verification subsequently matched the source, feed and primary routes.

The live guide and versioned assets matched the artifact byte for byte. At 320px and 390px, fresh locked browsers displayed the same five public dates. Live WebKit verified migration from the prior remembered key, the three private dates and event order after unlock, and restoration of the five public dates after locking. Private dates stayed out of the URL. Pages published through `gh-pages:/` with HTTPS and Actions disabled.
