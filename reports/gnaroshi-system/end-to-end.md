# End-to-End System Audit

## Dependency Direction

```text
paper-lab ─┐
           ├─> Studio contracts/core/publisher ─> content-feed ─> Astro website
writing ───┘                    │
                               └─> optional API for bounded AI operations
```

Private source repositories do not flow directly into the website. The public Content Feed is the only public content boundary.

## Paper Flow

Expected: Studio -> Paper Lab -> explicit public fields -> Content Feed -> website.

- Paper creation, private defaults, reading sessions, checkpoints, public-field selection, feed staging, validation, and website rendering all have implemented pieces.
- Paper Lab remains editable with nvim/MDX/JSON/Git if Studio is unavailable.
- The feed validator blocks private keys/fields, drafts, local paths, invalid references, count drift, and unselected/generated claims.
- **Owner: Studio, P1.** Desktop-created standalone oral-exam records are not reloaded into embedded Paper history and therefore do not reach Growth, public summaries, or completed-review views.
- **Owner: Paper Lab, P1.** Embedded and standalone evidence ownership is not singularly defined.
- **Owner: Studio, P1.** Formula recall and question practice are not complete save/read workflows.
- **Owner: Paper Lab, P1.** Public slug and alias identity are not stored separately from the stable record ID.

No real Paper was published during the audit. Current source records are imported demo/draft material and correctly remain outside the public feed.

## Writing Flow

Expected: Studio -> Writing -> translation/asset validation -> Content Feed -> website.

- Private draft creation, paper-to-draft allowlisting, EN/KO pairing, MDX editing, source checkpoint, publication preview, and public feed projection exist.
- Current EN/KO seed pairs are structurally complete but intentionally non-publishable.
- **Owner: Writing, P1.** Canonical slug and alias history are absent from source records.
- **Owner: Writing, P1.** No local validation/CI catches pair, frontmatter, link, date, or asset errors before Studio.
- **Owner: Writing, P1.** Asset provenance and licensing are not yet modeled in the canonical source repository.

No Blog post was published during the audit.

## AI Flow

Expected: Studio -> API -> private result -> selected public summary -> Content Feed -> website.

- API keys remain server-side, API requests are bounded, and manual fallback keeps Studio usable without the Worker.
- **Owner: API, P1.** The custom API domain is not reachable and no deployment workflow exists.
- **Owner: API, P1.** API response schemas and Studio canonical evidence schemas have no explicit versioned adapter.
- **Owner: Studio, P1.** Only text exam generation is integrated; scoring, review, realtime, transcription, and speech outputs are not connected to canonical save/import flows.
- **Owner: API, P1.** Globally reliable hourly cost limiting is absent.

No AI request or private result was sent during the audit.

## Source Of Truth And Schema Ownership

| Concern | Intended source of truth | Audit result |
| --- | --- | --- |
| Canonical Paper records | Paper Lab files | Pass, except evidence storage shape is ambiguous |
| Canonical Writing records | Writing files | Pass |
| Private authoring state | Source files and Git | Pass; SQLite remains rebuildable |
| Public contract | Content Feed JSON Schemas and validator | Pass at publication boundary |
| Public generated output | Content Feed | Pass |
| Website presentation | Website repository | Pass |
| API runtime | API repository | Pass |
| Public Paper projection implementation | Studio publisher | Fail: Paper core has a second incompatible exporter |

- **Owner: Studio, P1.** Remove the duplicate `paper-core` public exporter.
- **Owner: website, P2.** Generate/version Astro adapter types rather than manually repeating contract shapes.
- **Owner: Content Feed, P2.** Decide whether a public question contract exists; schema v1 currently omits it.

## Determinism And Provenance

- Content Feed fixture generation and publishing tests are deterministic.
- The root feed's count and hash match its bytes.
- Feed manifests identify exact Paper Lab and Writing source SHAs.
- Website builds identify exact website and feed SHAs. The live site currently matches public-feed `main` exactly.
- **Owner: Content Feed, P1.** Previous canonical routes are not compared during validation, so alias retention is not guaranteed.
- **Owner: Content Feed, P1.** Generated-only updates rely on branch/process controls rather than cryptographic or workflow attestation.

## Privacy Boundary

- No secret, token, PDF, local source path, private transcript, hidden public record, or canonical private source was found in the root public feed or website.
- Private-leak examples exist only under contract fixtures and are verified to fail.
- Website does not import Paper Lab or Writing.
- **Owner: Studio, P1.** The unencrypted SQLite full-text cache duplicates private MDX body text; this needs an explicit threat-model decision.
- **Owner: API, P2.** Provider-side processing/retention expectations for submitted notes/audio/transcripts need an operational checklist.

## Failure Recovery

- Studio state tests cover source conflicts, feed-push retry, deploy retry, no-op publish, and build-info mismatch.
- Content Feed replacement is atomic and generated paths are allowlisted.
- Deployment rollback accepts exact refs and the live site exposes verifiable build information.
- **Owner: Studio, P2.** A real non-empty transaction across six repositories has not yet been rehearsed in a disposable test organization/workspace.

## Overall Result

The repository boundaries are substantially real: private source, publisher, public projection, presentation, and optional API are separated. The public live system is safely empty and reproducibly deployed. The largest remaining risk is not public leakage today; it is workflow discontinuity when real evidence is created, especially standalone review/exam/recall files, duplicated projection code, and an undeployed/mismatched AI API.
