# Projects technology catalog

`src/data/facts/techCatalog.ts` is the only public technology catalog. A technology is listed only when a package manifest, Cargo manifest, Python project file, Xcode source, or repository documentation verifies that it is part of the product architecture.

## Verified sources

| Project | Public technologies | Verification source |
| --- | --- | --- |
| gnaroshi_vla | Python, Shell, YAML | repository files and documentation |
| gnaroshi.dev | Astro, TypeScript, GitHub Actions, Playwright | `package.json` and workflow files |
| Gnaroshi Studio | TypeScript, React, Rust, Tauri | workspace package manifests and Cargo manifest |
| PaperFlow | Python, Swift, SwiftUI, Zotero Local API | `pyproject.toml`, Swift package/source, repository code |
| Arxiv Discovery | Swift, SwiftUI, Python | `Package.swift`, Swift package/source, `pyproject.toml` |
| RunShelf | Python, Swift, SwiftUI | `pyproject.toml`, Swift package/source |
| TR GPU Monitor | Swift, SwiftUI, SQLite | Xcode source and SQLite persistence implementation |
| ContentDeck | TypeScript, React, Electron, Vite, Fastify | `package.json` |

## Icons and rendering

`TechIcon.astro` uses small repository-owned category symbols rendered with `currentColor`. Every symbol has an accessible label and visible technology text. The symbols are original project UI assets rather than third-party brand marks, so no external CDN or runtime icon request is used.

`TechStackStrip.astro` is the compact index presentation. `TechStackGrid.astro` groups the complete detail stack by category. Do not add low-level dependencies merely to make a stack look larger.
