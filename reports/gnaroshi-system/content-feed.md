# gnaroshi-content-feed Audit

Expected owner: generated, public-safe, deterministic projection and its executable public contract.

## Contract Strengths

- The current feed is a valid claim-free `bootstrap-empty` projection: every declared count is zero, eligibility is false, and Growth/graph/weekly data is absent or empty.
- `manifest.json` records schema version, producer, source SHAs, counts, state, content stage, eligibility, and content hash.
- JSON Schemas use `additionalProperties: false` for public records and cover Blog, Paper, reviews, oral exams, formula recall, implementations, activity, Growth, weekly reviews, graph, and assets.
- The validator checks schema validity, locale paths, IDs, routes, aliases, translations, cross-record references, graph edges, implementation references, exact activity derivation, manifest counts, deterministic hash, content-addressed assets, SVG safety, and privacy patterns.
- Eleven valid fixtures and six invalid fixtures passed all 17 tests. Fixtures remain separate from the root feed and do not become public activity.
- Source commit provenance is present even for bootstrap output. The website consumes this repository read-only.

## Findings

### Schema And Consistency

- **P1 - alias history is not validated across feed versions.** The current validator catches duplicate and reserved aliases but cannot prove that a removed canonical slug was retained as an alias. A publish can silently break an old URL unless Studio diff review catches it.
- **P2 - public question-bank output has no schema.** The private system and website have a question concept, but schema v1 has no question count or data contract. Keep it private intentionally or add a versioned public summary contract; do not leave consumer-only assumptions.
- **P2 - schema and policy files are outside `contentHash`.** The hash covers `blog/`, `papers/`, `data/`, and `assets/`, not `schemas/` or `config/privacy-allowlist.json`. Content integrity is sound, but a policy/contract change is invisible in the hash shown by the website.

### Privacy

- No root-feed private record, draft, hidden field, local path, PDF, credential, or raw transcript was found. The suspicious strings present in `fixtures/private-leak/` are intentional negative tests only.
- **P2 - privacy detection is necessarily heuristic.** Exact forbidden keys and credential/path/email patterns are strong, but semantically private prose cannot be identified reliably. The `formula-recall.prompt` field can also contain arbitrary text, so raw model prompts require producer-side classification.
- **P2 - the privacy allowlist is manually editable.** This is appropriate for approved public contact data, but changes need review because an expanded exact-value allowlist weakens one publication gate.

### Publishing And Manual-Edit Risk

- **P1 - generated-only ownership is documented, not technically enforced.** CI validates the resulting bytes but cannot distinguish Studio output from a human edit followed by fixture/hash regeneration. Protect `main`, require publisher provenance in commit bodies, and consider a signed/attested publish workflow.
- **P2 - contract workflow actions use floating major tags.** `.github/workflows/contract.yml` uses `actions/checkout@v4` and `actions/setup-node@v4`; pin immutable SHAs consistently with the other repositories.
- **P2 - deterministic generation is well tested but only against fixture/source snapshots.** Add a test that publishes the same real normalized source fixture twice in separate temporary roots and compares every byte and path.
- **P2 - the public repository has no settled license.** Code schemas and generated content may need different license decisions.

## Translation, Reference, And Asset Results

- Translation status rules, canonical slugs, aliases, reserved routes, dangling paper references, dangling graph edges, self-edges, and implementation links are validated.
- Asset paths are content-addressed, declared, byte-checked, hash-checked, dimension-checked, and sanitized for active/external SVG content.
- The current feed contains no public assets or translated records, so production behavior for non-empty output is evidenced by fixtures rather than a real published transaction.

## Top Improvements

1. P1: compare the next feed against the previous feed and require aliases for removed canonical routes.
2. P1: enforce generated-only updates through branch protection and publisher provenance.
3. P2: decide whether question summaries are intentionally private or add a schema-v2 contract.
4. P2: include contract/policy digests beside the content hash.
5. P2: require review for privacy allowlist changes.
6. P2: add a raw-prompt producer classification rule and fixture.
7. P2: pin contract workflow actions by SHA.
8. P2: add cross-directory deterministic byte-for-byte generation coverage.
9. P2: publish a generated-file header or manifest attestation.
10. P2: decide code and generated-content licenses separately.

## Files Involved

`manifest.json`, `schemas/index.json`, `schemas/v1/`, `scripts/feed-validation.mjs`, `scripts/build-fixtures.mjs`, `tests/feed-validation.test.mjs`, `fixtures/`, `config/privacy-allowlist.json`, `.github/workflows/contract.yml`, `LICENSE`.
