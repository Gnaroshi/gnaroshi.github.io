# Arxiv Discovery native transition

Arxiv Discovery moved from a Python CLI and local Flask interface to a standalone macOS application on 2026-07-15. The source repository is `Gnaroshi/Arxiv-newest-paper-crawler`. The approved native capture baseline is commit `1f87f235e2bef334980c19e019c016bb2a60ef0c`, and the installed delivery head is `48de418`.

## Product boundary

- SwiftUI owns recent-paper discovery, subject filters, search, detail review, saved metadata, explicit PDF actions, optional Korean translation, and preferences.
- The app reads public arXiv metadata directly and stores local state under Application Support.
- The Gemini API key stays in Keychain. Translation sends a selected public title and abstract only after an explicit action.
- The Python CLIs remain compatibility paths. The schema-v1 safe discovery/export provider is retained for scripts, while legacy `serve` and `all` entry points open the native app instead of starting a local web server.
- Studio integration is read-only: availability, launch, safe counts, and freshness may be exposed, while abstracts, credentials, translation, downloads, and saved-paper ownership remain inside Arxiv Discovery.

## Distribution and verification

The native delivery uses bundle identifier `dev.gnaroshi.ArxivDiscovery`, version `0.3.0`, and build `26`. A Developer ID signed build was installed at `/Applications/Arxiv Discovery.app`, verified with `codesign`, indexed by Spotlight and LaunchServices, launched from the installed bundle, and checked against live public arXiv metadata. The repository also verifies Python compatibility and provider tests, lint, Swift debug and release builds, core parsing and repository checks, manifest identity, entitlements, provenance, and the approved app-icon hash.

## Website evidence

The public project page uses the owner-approved 1946 × 1480 native window capture from commit `1f87f235e2be`. Showcase mode renders three deterministic paper candidates, includes a visible disclosure, and disables network requests, translation, and downloads. The previous Flask screenshots are retired historical records and are not published as evidence for the native product.

## Compatibility and rollback

Existing public project routes and the repository link remain unchanged. Legacy crawler JSON can be imported into the app, and the Python `process` command remains available. If the native source baseline must be rolled back, revert the application repository first, then restore the website fact and only the approved media whose source commit exactly matches that restored baseline.
