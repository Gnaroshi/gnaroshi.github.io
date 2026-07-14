# Multi-Repository Architecture

## Checkpoint

- Source repository: `Gnaroshi/gnaroshi.github.io`
- Source commit: `42ad8002c99a1bd09e059519d684620f87a432a6`
- Migration date: `2026-07-10`
- Safety tag: `pre-repository-split-2026-07`
- Backup branch: `backup/pre-repository-split-2026-07`

This phase creates repositories, documentation, and source snapshots only. It does not delete files, change imports, alter routes, or change the deployed website behavior.

## Ownership Boundaries

| Repository | Visibility | Owns | Must not own |
| --- | --- | --- | --- |
| `gnaroshi.github.io` | Public | Astro presentation, public profile/project metadata, i18n, SEO, Pages deployment, route and visual tests | Canonical private writing, canonical research records, authoring engines, Worker secrets |
| `gnaroshi-paper-lab` | Private | Paper notes, reading queue, implementations, reviews, recall, questions, reading-session evidence | Public site UI, deployment, API secrets |
| `gnaroshi-writing` | Private | Blog and long-form source writing, drafts, writing assets, series metadata | Public site UI, paper research evidence |
| `gnaroshi-content-feed` | Public | Generated, validated, explicitly publishable projections | Canonical drafts, hidden/private evidence, credentials, raw transcripts |
| `gnaroshi-studio` | Private | macOS app, CLI, contracts, domain packages, publisher, Git and AI clients | Canonical content, public website UI, Worker runtime |
| `gnaroshi-api` | Private | Cloudflare Worker, short-lived AI session endpoints, CORS, rate limiting, validation | Canonical content, static website presentation |

## Dependency Direction

Dependencies flow toward public presentation:

1. `gnaroshi-paper-lab` and `gnaroshi-writing` contain canonical private sources.
2. `gnaroshi-studio` validates those sources and creates an explicit public projection.
3. `gnaroshi-content-feed` stores generated public output only.
4. `gnaroshi.github.io` consumes the feed through a static build adapter.
5. `gnaroshi-api` is an optional runtime sidecar for AI endpoints and is never required to render the static site.

The website must not read private repositories during a public browser request. Feed consumption happens at build time from a checked-out or pinned public feed revision.

## Migration Phases

### Phase A: Snapshot

Completed by this change:

- Record the source SHA.
- Create a remote safety tag and backup branch.
- Create target repositories and normalized directory scaffolds.
- Copy source snapshots without deleting originals.
- Keep imported sample, seed, draft, and meta-only records out of the public feed.

### Phase B: Contracts

- Extract framework-neutral content schemas into `gnaroshi-studio/packages/contracts`.
- Define a versioned `manifest.json` and JSON/MDX feed contract.
- Make studio packages runnable and add cross-repository contract tests.
- Decide licenses before distributing code or content beyond current repository visibility.

### Phase C: Publisher

- Read canonical private content from paper-lab and writing checkouts.
- Apply draft, visibility, translation, and evidence-eligibility rules.
- Emit deterministic public files into content-feed.
- Refuse publication when private fields, secrets, sample classifications, or invalid links are detected.

### Phase D: Website Adapter

- Add the feed adapter to the Astro build.
- Run the existing direct-content build and feed-backed build in comparison mode.
- Verify route, SEO, i18n, metric, accessibility, and visual parity.
- Pin or record the consumed feed commit in build output.

### Phase E: Cutover

- Switch the website to feed-backed content only after parity checks pass.
- Remove duplicated canonical content and authoring tools from the website in a separate reviewed change.
- Retain the safety tag and backup branch permanently.

## Non-Goals For This Phase

- No website import or route changes.
- No removal of `src/content`, `src/generated`, `scripts`, or `apps/api` from the original repository.
- No publication of sample records.
- No automation with cross-repository write tokens.
- No macOS application implementation.
