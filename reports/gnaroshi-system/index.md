# Gnaroshi System Audit Index

Audit date: 2026-07-12 (Asia/Seoul)

Scope was limited to the six repositories listed below. No unrelated repository was inspected. All repositories were clean before inspection and remained clean after read-only checks. The audit was performed on the current local review branches, not by changing `main`.

## Repository Inventory

| Repository | Local path | Visibility | Default / current branch | HEAD | Sync | Latest commit | Open PRs | Latest CI | Size | License | Project metadata |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `Gnaroshi/gnaroshi.github.io` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi.github.io` | Public | `main` / `codex/public-capabilities` | `f76e30d55a3a79b0bc0b09317157721e156215c2` | clean, ahead 0, behind 0 | `f76e30d` (2026-07-11), `refactor: reveal public capabilities only when evidence exists` | #8, #9, #10 | PR CI success, run 29155795834 | local 985 MB; GitHub 6,632 KB | Missing | README, AGENTS, npm, Astro, TypeScript |
| `Gnaroshi/gnaroshi-content-feed` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi-content-feed` | Public | `main` / `codex/ecosystem-audit` | `c9d5d0bd2d1ce81719ad8a7d66e24d3abb6214e3` | clean, ahead 0, behind 0 | `c9d5d0b` (2026-07-11), `chore: refresh generated feed provenance` | #3 | Contract CI success, run 29152328041 | local 17 MB; GitHub 139 KB | Decision pending | README, AGENTS, npm, JSON Schema |
| `Gnaroshi/gnaroshi-paper-lab` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi-paper-lab` | Private | `main` / `codex/ecosystem-audit` | `a911d4e4ec8c5f6b7d589233085610180fd94ce4` | clean, ahead 0, behind 0 | `a911d4e` (2026-07-11), `docs: align paper lab ownership and privacy` | #1 | No workflow runs | local 596 KB; GitHub 39 KB | Decision pending, all rights reserved | README, AGENTS; no local package/tooling manifest |
| `Gnaroshi/gnaroshi-writing` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi-writing` | Private | `main` / `codex/ecosystem-audit` | `e89c18944e77dd65b4418ca0efe9061911fc6171` | clean, ahead 0, behind 0 | `e89c189` (2026-07-11), `docs: align writing repository ownership` | #2 | No workflow runs | local 496 KB; GitHub 27 KB | Decision pending, all rights reserved | README, AGENTS; no local package/tooling manifest |
| `Gnaroshi/gnaroshi-studio` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi-studio` | Private | `main` / `codex/ecosystem-audit` | `50428a477297442a7de21ea1aa4d011ce1e21969` | clean, ahead 0, behind 0 | `50428a4` (2026-07-11), `ci: pin Studio workflow actions` | #6 | macOS CI success, run 29152538706 | local 5.2 GB; GitHub 583 KB | Decision pending, all rights reserved | README, AGENTS, pnpm workspace, TypeScript, Rust/Tauri |
| `Gnaroshi/gnaroshi-api` | `/Users/gnaroshi/Desktop/programming/git/gnaroshi-api` | Private | `main` / `codex/ecosystem-audit` | `a965affabaeff5dc73616ae384342e78f324d92b` | clean, ahead 0, behind 0 | `a965aff` (2026-07-11), `docs: clarify worker repository boundary` | #1 | No workflow runs | local 217 MB; GitHub 39 KB | Decision pending, all rights reserved | README, AGENTS, npm, TypeScript, Wrangler |

Remote URL for every repository is `https://github.com/Gnaroshi/<repository>.git`. README and AGENTS.md are present in all six repositories. Local sizes include ignored dependencies, build output, caches, and Rust targets; GitHub size is the more useful source-size measure.

## Production Baseline

The live website reports:

- website commit `294372a14a74bb97793e0cafc33c3ac42b811e97`
- content-feed commit `0a2b5c5cdaf283e344d896142aedb565659d26f9`
- content hash `9ea450911265f1364623fc4c023952e2c6fc70f19560fad9710fe44a0307d261`
- deployment run 29149241684, successful

The local website checkout consumes the same public-feed `main` commit. The audit branches contain additional pending changes and must not be described as deployed.

## Verification Summary

- Website: content contract, Astro check, 42-route static build, i18n, links, 59 E2E tests, and 31 accessibility tests passed.
- Content Feed: bundle, deterministic fixture generation, 17 contract tests, and current feed validation passed.
- Studio: TypeScript typecheck, full build, 34 Vitest tests, and 17 Rust tests passed.
- API: TypeScript typecheck, 9 tests, and Wrangler dry-run passed. `npm run build` is not defined.
- Paper Lab and Writing have no repository-local validation command or CI workflow.
- `api.gnaroshi.dev` did not resolve during the audit; the optional API is not currently reachable.

## Reports

- [Website](./gnaroshi-github-io.md)
- [Content Feed](./content-feed.md)
- [Paper Lab](./paper-lab.md)
- [Writing](./writing.md)
- [Studio](./studio.md)
- [API](./api.md)
- [End-to-end](./end-to-end.md)
- [Consolidated report](./final.md)

No fixes, publication, content movement, commit, or push was performed.
