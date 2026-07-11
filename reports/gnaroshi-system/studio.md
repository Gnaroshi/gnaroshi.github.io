# gnaroshi-studio Audit

Expected owner: shared contracts and cores, CLI, macOS app, safe Git operations, publisher, deployment trigger, and optional API client.

## Product And Architecture Strengths

- The pnpm workspace has clear packages for contracts, Paper, Writing, Git, publisher, AI client, CLI, and desktop.
- CLI and React desktop import the same TypeScript Paper/Writing contracts and core operations.
- Canonical files remain in Paper Lab/Writing. SQLite is rebuildable and does not replace Git/MDX/JSON.
- Publisher output is staged in a temporary directory, checked with the canonical feed validator, hash-locked after preview, and atomically installed.
- Save, source checkpoint, feed stage, public confirmation, feed commit/push, deploy, monitor, and build-info verification are separate operations.
- System Git and `gh` are invoked with typed argument arrays. Tests cover literal path staging, conflicts, retries, no-op publication, private leakage, deterministic output, and verification mismatch.
- Typecheck, full desktop build, 34 TypeScript tests, and 17 Rust tests pass.

## Findings

### Architecture Correctness

- **P1 - two public Paper projection implementations disagree.** `packages/paper-core/src/index.ts` exports legacy-shaped fields such as `mainFormula`, `myConnection`, and embedded histories, while `packages/publisher/src/projection.ts` emits the canonical feed shape (`formula`, `publicResearchConnection`, selected summaries). Keep only the publisher projection as the public boundary.
- **P1 - standalone evidence files are not loaded by the publisher.** `packages/publisher/src/loaders.ts` reads Paper MDX embedded arrays. Desktop Review saves oral exams under `oral-exams/*.json`, but completion lists and public projection read `paper.oralExams`. The saved result becomes disconnected canonical data.
- **P1 - graph eligibility generation conflicts with the canonical validator.** `packages/publisher/src/derive.ts` marks a graph eligible when any edge exists, including tag-only edges; the feed validator requires a meaningful non-tag edge. A tag-only source can build an invalid staged feed.
- **P2 - Git behavior is implemented in both TypeScript and Rust.** CLI uses `packages/git-core`; desktop uses `src-tauri/src/git.rs`. Both are safe today, but policy changes and edge cases can drift.
- **P2 - public contract shapes remain duplicated in Zod and TypeScript interfaces.** The canonical feed validator is executed, which prevents invalid publication, but generation failures are discovered late.

### Workflow Completeness

- **P1 - formula recall UI is not persistent.** `ReviewScreen.tsx` renders an uncontrolled response textarea with no save/score path.
- **P1 - question-bank UI does not consume question records.** It lists a JSON document in a paper-oriented panel; selecting it cannot produce a parsed Paper or actionable question flow.
- **P1 - API workflow is partial.** Desktop calls text exam generation but not exam scoring, paper review scoring, realtime, transcription, or TTS. Manual review output has no complete schema/rubric import loop in the desktop.
- **P1 - checkpoint stages every changed source path.** The UI shows a diff and requires an explicit step, but `publish_checkpoint_sources` stages all changed paths in each canonical repository. Add path-level selection or a clearer whole-repository confirmation.
- **P2 - no real non-empty publish transaction was executed in this audit.** Tests use fixtures; publishing real private content was correctly prohibited.

### Git Safety And Recovery

- Pull uses rebase, conflicts stop processing, generated paths are allowlisted, and destructive auto-resolution is absent.
- Source commit, feed push, deploy, and verification failure states are recoverable without resetting local work.
- **P2 - deployment monitoring depends on local `gh` output shape and polling.** Tests cover parsing, but add an integration test against recorded current `gh` JSON fixtures and timeout/backoff behavior.

### Security And Local Data

- No tracked key/token/credential/database was found. Future device flow refuses to start without secure storage.
- Secret-like CLI arguments are rejected; transaction errors and command output are redacted.
- **P1 - the local SQLite search cache stores canonical body text.** `cacheMetadata()` includes the entire MDX body in `searchable_text`. It is rebuildable and credential-scanned, but private research prose is duplicated into an unencrypted local database. This needs an explicit owner decision and threat model.
- **P2 - private evidence is split between repository files and recovery/cache state.** Recovery is owner-only, but retention, deletion, backup, and macOS data-protection expectations should be documented and tested.

### macOS UX And Distribution

- Today, Paper Lab, Writing, Review, Publish, Git, and Settings screens exist; external editor, nvim preference, Finder, and Terminal integration are present.
- **P1 - the app bundle requires system Node.js and a built workspace CLI.** `src-tauri/src/publisher.rs` launches `node apps/cli/dist/index.js`. The current artifact is suitable for private development, not standalone distribution.
- **P2 - the editor chunk is large.** The `DocumentList`/CodeMirror chunk is about 916 KB minified (296 KB gzip). Further route/editor lazy loading would improve first launch.
- **P2 - distribution is ad-hoc arm64 only.** This is honestly documented; signing, notarization, updater, and universal builds remain owner decisions.

## Top Improvements

1. P1: remove the duplicate Paper public projection and use publisher output only.
2. P1: choose and implement one canonical evidence storage model across desktop and publisher.
3. P1: fix graph eligibility to match the feed's meaningful-edge rule.
4. P1: persist formula recall through shared Paper core.
5. P1: implement a typed question-bank reader and practice flow.
6. P1: complete API score/review import paths or hide unavailable controls.
7. P1: add explicit path selection or whole-repository acknowledgement before source checkpoint.
8. P1: decide whether private body text may be indexed in SQLite; encrypt or restrict if not.
9. P1: bundle the CLI runtime before distributing the app.
10. P2: reduce Rust/TypeScript Git policy duplication with shared conformance tests.
11. P2: generate public output types from the canonical feed schema.
12. P2: add full recorded `gh` monitoring fixtures and timeout tests.
13. P2: document cache/recovery retention and secure deletion expectations.
14. P2: split the editor bundle further.
15. P2: add clippy and security/audit checks to CI.

## Files Involved

`packages/contracts/`, `packages/paper-core/src/index.ts`, `packages/publisher/src/projection.ts`, `packages/publisher/src/loaders.ts`, `packages/publisher/src/derive.ts`, `packages/git-core/`, `packages/ai-client/`, `apps/desktop/src/screens/ReviewScreen.tsx`, `apps/desktop/src/lib/cache.ts`, `apps/desktop/src-tauri/src/publisher.rs`, `apps/desktop/src-tauri/src/git.rs`, `apps/desktop/src-tauri/migrations/0001_cache.sql`, `.github/workflows/macos-build.yml`.
