# Consolidated Gnaroshi System Audit

## 1. Executive Summary

The six-repository split has achieved its primary security and ownership goal. Canonical Paper and Writing data are private, Studio owns authoring/publishing, Content Feed is the only public projection, the Astro website is presentation-only, and the optional Worker is isolated. The current public feed is truthfully empty and the live website records exact commit provenance.

No P0 issue or current public private-data leak was found. The highest-priority work is to make real-content workflows continuous before publishing: unify evidence storage, remove duplicate Paper projection code, align graph and AI schemas, add source-repository validation, and deploy the API only after global cost controls are ready.

## 2. Repository Map

| Repository | Role | Current assessment |
| --- | --- | --- |
| `gnaroshi.github.io` | Public presentation | Healthy; one indexing bug and contract/media cleanup remain |
| `gnaroshi-content-feed` | Public generated boundary | Strong contract; needs route-history and generated-only enforcement |
| `gnaroshi-paper-lab` | Private Paper source | Safe and editable; schema/validation and evidence ownership need work |
| `gnaroshi-writing` | Private Writing source | Safe and paired; slug/assets/validation need work |
| `gnaroshi-studio` | App, CLI, contracts, publisher, Git | Broadly implemented and tested; several disconnected product paths remain |
| `gnaroshi-api` | Optional AI Worker | Source is bounded and tested; production is not deployed or fully hardened |

## 3. Dependency Direction

Only Studio reads private source. Only Content Feed crosses the public boundary. The website reads only Content Feed. The API returns private, hidden-by-default AI results to Studio and has no publishing rights.

## 4. What Is Complete

- Repository visibility and role separation.
- Presentation-only Astro website with EN/KO, static output, evidence-gated navigation, SEO, accessibility, and Pages deployment.
- Public feed schema v1, deterministic hashing, relationship checks, privacy scanning, content-addressed assets, and fixtures.
- Private-by-default Paper and Writing source structures.
- Shared TypeScript domain contracts and CLI/desktop authoring operations.
- Safe typed Git commands, conflict stops, atomic feed apply, explicit publish confirmation, deployment monitoring, and build-info verification.
- Worker request bounds, CORS allowlist, no-store responses, secret isolation, development fallback, and structured errors.
- Live website provenance: website `294372a...`, feed `0a2b5c5...`, successful run 29149241684.

## 5. What Is Incomplete

- Studio recall/question/oral-exam result persistence across canonical source and publisher.
- Repository-local validation/CI for Paper Lab and Writing.
- Stable source-level canonical slugs and alias history.
- Real Writing asset/series/provenance exercise.
- End-to-end non-empty publication rehearsal.
- Standalone distributable Studio runtime.
- Production API deployment, global rate limits, and complete client integration.

## 6. Boundary Violations

- **Studio, P1:** `paper-core` and `publisher` both implement public Paper projection with incompatible shapes.
- **Studio, P1:** desktop saves standalone oral-exam evidence that publisher and completion views do not consume.
- **Website, P2:** queue/question adapters assume data outside public feed schema v1; routes are safely hidden/noindex.
- No canonical private content, website UI, Worker runtime, or authoring CLI was found in the wrong repository.

## 7. Privacy Findings

- No P0 leak was found.
- Root Content Feed is empty, hash-valid, and contains no private/hidden/draft record.
- Website contains no private repository checkout or private token.
- **Studio, P1:** private body text is copied into unencrypted local SQLite full-text search.
- **API, P2:** provider processing/retention expectations need an operator-facing record.
- **Content Feed, P2:** privacy detection remains heuristic and needs producer-side semantic classification.

## 8. Schema Mismatches

- **API, P1:** API result version/identity/result shapes do not map directly to Studio canonical evidence.
- **Studio, P1:** graph builder eligibility counts tag edges while feed validation requires meaningful edges.
- **Studio, P1:** duplicate Paper exporters emit different field names and nesting.
- **Website, P1:** graph indexing checks `graphEligible` instead of feed `eligible`.
- **Paper Lab, P1:** stable ID is not separated from canonical public slug in active source.
- **Writing, P1:** canonical slug, aliases, and source translation status are absent.

## 9. Workflow Gaps

- **Studio, P1:** formula recall cannot be saved from the current UI.
- **Studio, P1:** question-bank records do not render as an actionable practice flow.
- **Studio, P1:** most Worker endpoints are not connected to canonical import/save.
- **Studio, P1:** publish checkpoint stages all changed paths per source repository.
- **Paper Lab, P1:** embedded versus standalone evidence ownership is ambiguous.
- **Content Feed, P1:** old route alias retention is not automatically enforced.

## 10. UI And Media Gaps

- **Website, P2:** some tool-detail routes are English-only under an explicit source-only policy.
- **Website, P2:** repeated diagram-like SVG artwork weakens page-specific identity; media PR #9 is pending.
- **Website, P2:** artwork provenance/license metadata is absent.
- **Studio, P2:** editor bundle is large and product screens expose incomplete review capabilities.

## 11. Deployment Gaps

- **API, P1:** `api.gnaroshi.dev` does not resolve and no deployment workflow exists.
- **API, P1:** globally reliable hourly rate/cost controls are absent.
- **Studio, P1:** the macOS app relies on system Node.js and a built workspace CLI.
- **Content Feed, P1:** generated-only changes are process-enforced, not attested.
- **Website, P2:** direct push/PR builds resolve a moving feed ref, though resolved SHA is recorded.
- **Website, P2:** website LICENSE is absent; all other repositories retain placeholder decisions.

## 12. Top 20 Improvements

1. **Studio, P1:** select one canonical evidence storage model and make desktop, CLI, loader, and publisher use it.
2. **Studio, P1:** remove the duplicate `paper-core` public projection.
3. **Studio, P1:** fix graph eligibility to match the canonical meaningful-edge rule.
4. **Website, P1:** fix graph route indexing to use `eligible` and add a regression test.
5. **API, P1:** define and implement versioned API-to-Studio result adapters.
6. **API, P1:** runtime-validate structured model output.
7. **Paper Lab, P1:** add source-level `canonicalSlug` and `aliases`.
8. **Writing, P1:** add source-level canonical slugs, aliases, and editorial translation state.
9. **Paper Lab, P1:** add a repository-local validator and private CI.
10. **Writing, P1:** add a repository-local validator and private CI.
11. **Studio, P1:** persist formula recall and implement typed question practice.
12. **Studio, P1:** finish score/review import flows or hide unavailable API actions.
13. **API, P1:** implement global production rate/cost controls.
14. **API, P1:** add reviewed deployment automation and DNS/custom-domain verification.
15. **Content Feed, P1:** enforce alias retention by comparing previous and next routes.
16. **Content Feed, P1:** protect generated-only updates with required publisher provenance/attestation.
17. **Studio, P1:** decide and enforce SQLite private-body policy.
18. **Studio, P1:** bundle the CLI runtime for standalone macOS distribution.
19. **Writing, P1:** add asset provenance/license metadata before real media.
20. **Studio, P1:** rehearse a non-empty publish in disposable fixtures from source checkpoint through deployed SHA verification.

## 13. Recommended Implementation Order

1. Unify Studio/Paper Lab evidence storage and remove the duplicate projector.
2. Fix the graph producer and website indexing consumer, each in its owning repository.
3. Add Paper Lab and Writing local validation/CI plus slug/alias fields.
4. Complete Studio formula/question/oral/review save and import paths using shared contracts.
5. Add previous-feed alias validation and generated publish attestation.
6. Decide SQLite privacy policy and bundle the Studio CLI runtime.
7. Align API contracts, add runtime validation and global rate limits, then deploy only used endpoints.
8. Run a disposable non-empty end-to-end rehearsal.
9. Resolve media provenance, pending media PR, and license decisions.
10. Publish real content only after the rehearsal and privacy review pass.

## 14. Owner Decisions Required

- Whether Paper evidence is embedded in Paper MDX or stored as standalone append-only records.
- Whether private full-body search in local SQLite is acceptable, encrypted, or metadata-only.
- Whether question-bank summaries will ever be public in Content Feed.
- Whether the optional API should be deployed now or kept disabled until Studio integration is complete.
- Which Worker abuse-control mechanism and budget are acceptable.
- Whether public Paper and Writing slugs may differ by locale and how alias/language-switch history works.
- Whether website content illustrations should be custom raster work, diagrams, or removed.
- Code/content/artwork license choices for all repositories.
- Whether Studio remains a private developer tool requiring Node or becomes a standalone signed application.
- The threshold for first real public Paper/Blog publication.

## Verification Evidence

- Website: `npm run content:check`, `npm run check`, `npm run build`, `npm run check:i18n`, `npm run check:links`, `npm run test:e2e`, `npm run test:a11y`.
- Content Feed: `npm test`, `npm run feed:validate`.
- Studio: `pnpm typecheck`, `pnpm test` including Rust tests.
- API: `npm run typecheck`, `npm test`, `npm exec wrangler deploy -- --dry-run`; `npm run build` failed because the script is absent.
- Live checks: website `/build-info.json` succeeded; API health lookup failed because the custom domain did not resolve.

No code fix, content publication, file movement, commit, or push was performed.
