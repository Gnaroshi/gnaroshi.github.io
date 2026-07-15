# Arxiv Discovery native transition

Arxiv Discovery moved from a Python CLI and local Flask interface to a standalone macOS application on 2026-07-15. The source repository is `Gnaroshi/Arxiv-newest-paper-crawler`, and the verified native baseline is commit `88c033dd9b25eec80fabce6a2a591725654d6b9f`.

## Product boundary

- SwiftUI owns recent-paper discovery, subject filters, search, detail review, saved metadata, explicit PDF actions, optional Korean translation, and preferences.
- The app reads public arXiv metadata directly and stores local state under Application Support.
- The Gemini API key stays in Keychain. Translation sends a selected public title and abstract only after an explicit action.
- The Python CLIs remain compatibility paths. The schema-v1 safe discovery/export provider is retained for scripts, while legacy `serve` and `all` entry points open the native app instead of starting a local web server.
- Studio integration is read-only: availability, launch, safe counts, and freshness may be exposed, while abstracts, credentials, translation, downloads, and saved-paper ownership remain inside Arxiv Discovery.

## Distribution and verification

The native baseline uses bundle identifier `dev.gnaroshi.ArxivDiscovery`, version `0.3.0`, and build `24`. A Developer ID signed build was installed at `/Applications/Arxiv Discovery.app`, verified with `codesign`, indexed by Spotlight, launched from the installed bundle, and checked against live public arXiv metadata. The repository also verifies Python compatibility and provider tests, lint, Swift debug and release builds, core parsing and repository checks, manifest identity, entitlements, provenance, and the approved app-icon hash.

## Website evidence

The previous owner-approved screenshots describe the retired Flask interface. They remain historical records but are not evidence for the native product baseline. The public project page therefore omits Arxiv Discovery screenshots until a native capture receives explicit owner approval; verified facts, localized product copy, and the text workflow remain visible.

## Compatibility and rollback

Existing public project routes and the repository link remain unchanged. Legacy crawler JSON can be imported into the app, and the Python `process` command remains available. If the native source baseline must be rolled back, revert the application repository first, then restore the website fact and only the approved media whose source commit exactly matches that restored baseline.
