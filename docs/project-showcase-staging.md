# Project showcase staging

Application screenshots are captured in each owning repository with an explicit showcase mode. The website imports only owner-reviewed PNG captures and never reads application repositories during a normal build.

1. Copy `project-showcases.config.example.json` to untracked `.project-showcases.local.json` and enter explicit local checkout paths.
2. Confirm each application has `showcase/manifest.json`, privacy review, and screenshot entries.
3. Run `npm run showcases:import`.
4. Start development and review `/dev/project-showcases/` in light/dark and desktop/mobile crops.
5. Owner approval and the existing production media publication process are separate. Importing never changes `public/` or `approvedMediaCandidateIds`.

Raw and normalized captures remain under ignored `artifacts/project-showcases/`. Manifests reject absolute paths, secret-like values, missing source commits, undisclosed fixtures, and dimension mismatches.
