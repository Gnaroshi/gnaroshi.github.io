# Project showcase staging

Application screenshots are captured in each owning repository with an explicit showcase mode. The website imports only owner-reviewed PNG captures and never reads application repositories during a normal build.

1. Copy `project-showcases.config.example.json` to untracked `.project-showcases.local.json` and enter explicit local checkout paths.
2. Confirm each application has `showcase/manifest.json`, privacy review, and screenshot entries.
3. Run `npm run showcases:import`.
4. Start development and review `/dev/project-showcases/` in light/dark and desktop/mobile crops.
5. Record owner-approved captures in `src/data/approvedProjectShowcases.ts` with source commit, localized alt/caption, demo disclosure, and privacy review.
6. Run `npm run showcases:publish` to create responsive AVIF/WebP files without cropping the source.
7. Run `npm run media:check` and `npm run check:project-readiness`.

Raw and normalized captures remain under ignored `artifacts/project-showcases/`. Manifests reject absolute paths, secret-like values, missing source commits, undisclosed fixtures, and dimension mismatches.

## Approved set

The owner approved all 24 captures prepared on 2026-07-13: four appearance/workflow captures each for Gnaroshi Studio, PaperFlow, Arxiv Discovery, RunShelf, TR GPU Monitor, and ContentDeck. The website publishes dark workflow captures as scenario evidence and retains each light capture as reviewed appearance evidence.

| Application | Source commit | Primary public capture |
| --- | --- | --- |
| Gnaroshi Studio | `e6115c90ab86` | `gnaroshi-studio-managed-apps` |
| PaperFlow | `7c7bd013d171` | `paperflow-plan-review` |
| Arxiv Discovery | `e48da6e1434a` | `arxiv-discovery-discovery-list` (historical; not rendered for the native baseline) |
| RunShelf | `7657067cfeae` | `runshelf-run-list` |
| TR GPU Monitor | `3a2fa8173f3b` | `tr-gpu-monitor-host-overview` |
| ContentDeck | `5c6e2f94d1e` | `contentdeck-active-loop` |

Every approved capture uses deterministic demo data and includes a visible localized disclosure wherever it appears. Private repository URLs, local filesystem paths, host credentials, real library records, raw experiment paths, and unpublished research data are excluded.

The current Arxiv Discovery product fact points to native commit `88c033dd9b25`. Its files from `e48da6e1434a` remain historical owner-approved records, but they are no longer associated with the current product fact because the Flask interface was replaced. They must not be relabeled with the native commit or returned to the current project page without a fresh native capture and owner review; the public project remains temporarily text-only.
