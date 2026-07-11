# gnaroshi-paper-lab Audit

Expected owner: canonical private paper research and reading evidence.

## Schema Review

- Plain MDX/JSON keeps the source editable with nvim and ordinary Git.
- Paper records include stable `id`, locale/translation key, reading status/depth/priority, research notes, review schedule, reading sessions, review history, recall attempts, oral exams, implementation attempts, explicit `publicFields`, Future Me fields, and private notes.
- Queue and implementation templates default to private, ineligible working records.
- Three imported examples, one unfinished draft, generated/demo-derived records, and one meta-only record are explicitly classified by `config/import-manifest.json`; default publication is false.
- **P1 - public slug identity is not stored independently.** Active Paper files and `_template.mdx` have no `canonicalSlug` or `aliases`; Studio falls back to `id`. Stable record identity and public URL identity therefore remain coupled.
- **P1 - evidence has two possible storage shapes without one declared canonical rule.** Paper frontmatter embeds review, formula, oral-exam, and implementation arrays while top-level directories also exist. One standalone review file exists, but Studio publication loads embedded arrays. This can create divergent histories.
- **P2 - timestamps and nested record identity are verbose but not locally enforced.** Embedded session/review records depend on Studio's richer schema; the repository itself has no executable schema or validator.

## Workflow Review

- The documented flow supports creation, queue migration, Pass 1/2/3 sessions, revisit, review, implementation, public-field selection, checkpoint, and publication through Studio.
- Reading sessions, not paper status, are explicitly defined as activity evidence.
- **P1 - repository-local validation is missing.** There is no package command, pre-commit hook, or CI workflow. A direct nvim edit can be committed without schema validation unless the user manually invokes Studio CLI from another repository.
- **P2 - standalone weekly/question outputs are generated artifacts mixed with canonical inputs.** Their rebuild owner and replacement rules should be explicit, or they should move under a clearly generated subdirectory.
- **P2 - active directories still contain migration examples.** They are safely ineligible, but separating fixtures from daily authoring paths would reduce accidental selection.

## Privacy Review

- Repository visibility is private and all active templates default to `visibility: private`, false eligibility, and empty public selection.
- No tracked PDF, `.env`, credential-like file, API key pattern, local user path, dataset mount, or private key was found.
- `.gitignore` rejects PDFs and environment files.
- Private notes and unpublished research details are allowed here by design; Studio and the feed validator are the publication boundary.
- **P2 - no repository-local privacy scan exists.** A PDF is ignored, but forced adds and renamed binaries are not checked in CI.

## Git Usability

- Source remains readable and editable without Studio.
- Repository history and simple paths support external editors.
- Validation, queue conversion, and structured session operations currently depend on the Studio CLI, so emergency editing works but safe structured authoring is not self-contained.

## Top Improvements

1. P1: add `canonicalSlug` and `aliases` to the canonical Paper schema/template.
2. P1: choose embedded or standalone evidence as canonical and migrate loaders accordingly.
3. P1: add a thin repository-local validation command backed by Studio contracts.
4. P1: add private CI for schema, secret, PDF, and path checks.
5. P2: place generated question/weekly artifacts under a declared generated namespace.
6. P2: separate imported fixtures from active authoring directories.
7. P2: add relationship validation for paper IDs, implementations, reviews, and sessions.
8. P2: document review-history append-only and correction semantics.
9. P2: add a recovery recipe that works with only Markdown, JSON, Git, and the CLI package.
10. P2: settle the private-source license decision.

## Files Involved

`papers/_template.mdx`, `papers/*.mdx`, `queue/_template.mdx`, `implementations/_template.mdx`, `reviews/`, `reading-sessions/`, `question-bank/`, `config/import-manifest.json`, `docs/paper-reading-system.md`, `docs/visibility.md`, `.gitignore`, `LICENSE`.
