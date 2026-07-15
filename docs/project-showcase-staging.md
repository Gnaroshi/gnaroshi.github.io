# Project showcase staging

Application screenshots are captured in each owning repository with an explicit showcase mode. The website imports only owner-reviewed PNG captures and never reads application repositories during a normal build.

1. Copy `project-showcases.config.example.json` to untracked `.project-showcases.local.json` and enter explicit local checkout paths.
2. Confirm each application has `showcase/manifest.json`, privacy review, and screenshot entries.
3. Run `npm run showcases:import`.
4. Start development and review `/dev/project-showcases/` in light/dark and desktop/mobile crops.
5. Record owner-approved captures in `src/data/approvedProjectShowcases.ts` with source commit, localized alt/caption, demo disclosure, and privacy review.
6. Run `npm run showcases:publish` to create responsive AVIF/WebP files without cropping the source. When only one approved application source is locally available, scope regeneration with `SHOWCASE_APPLICATION_ID=<application-id> npm run showcases:publish`; the command fails if that application has no approved record.
7. Run `npm run media:check` and `npm run check:project-readiness`.

Raw and normalized captures remain under ignored `artifacts/project-showcases/`. Manifests reject absolute paths, secret-like values, missing source commits, undisclosed fixtures, and dimension mismatches.

## Approved set

The owner approved 24 captures prepared on 2026-07-13: four appearance/workflow captures each for Gnaroshi Studio, PaperFlow, the retired Flask Arxiv Discovery interface, RunShelf, TR GPU Monitor, and ContentDeck. On 2026-07-15, the four Flask captures were retired from the current register and replaced by one owner-approved native SwiftUI capture. The current register therefore contains 21 screenshots: 20 retained captures and the native Arxiv Discovery capture.

| Application | Source commit | Primary public capture |
| --- | --- | --- |
| Gnaroshi Studio | `e6115c90ab86` | `gnaroshi-studio-managed-apps` |
| PaperFlow | `7c7bd013d171` | `paperflow-plan-review` |
| Arxiv Discovery | `1f87f235e2be` | `arxiv-discovery-discovery-list` |
| RunShelf | `7657067cfeae` | `runshelf-run-list` |
| TR GPU Monitor | `3a2fa8173f3b` | `tr-gpu-monitor-host-overview` |
| ContentDeck | `5c6e2f94d1e` | `contentdeck-active-loop` |

Every approved capture uses deterministic demo data and includes a visible localized disclosure wherever it appears. Private repository URLs, local filesystem paths, host credentials, real library records, raw experiment paths, and unpublished research data are excluded.

The current Arxiv Discovery record uses a 2x native window capture from source commit `1f87f235e2be`. Its showcase mode contains three deterministic candidates, visibly discloses that mode, and disables network requests, translation, and downloads. The previous Flask files from `e48da6e1434a` are historical only and must not be restored or relabeled as native evidence.
