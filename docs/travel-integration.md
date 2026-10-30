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
