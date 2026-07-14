# Migration Map

## Source Snapshot Map

| Original path | Snapshot destination | Future owner | Notes |
| --- | --- | --- | --- |
| `src/content/papers/` | `gnaroshi-paper-lab/papers/` | Paper Lab | Templates, examples, and drafts preserved and classified non-publishable |
| `src/content/queue/` | `gnaroshi-paper-lab/queue/` | Paper Lab | Queue template retained |
| `src/content/implementations/` | `gnaroshi-paper-lab/implementations/` | Paper Lab | Implementation template retained |
| `src/generated/paper-reviews/` | `gnaroshi-paper-lab/reviews/` | Paper Lab | Demo review remains private |
| `src/generated/oral-exams/` | `gnaroshi-paper-lab/oral-exams/` | Paper Lab | Empty tracked source boundary retained |
| `src/generated/formula-recall/` | `gnaroshi-paper-lab/formula-recall/` | Paper Lab | Empty tracked source boundary retained |
| `src/generated/question-bank/` | `gnaroshi-paper-lab/question-bank/` | Paper Lab | Demo-derived bank remains private |
| `src/generated/weekly-reviews/` | `gnaroshi-paper-lab/reading-sessions/weekly-reviews/` | Paper Lab | Meta-only review remains private |
| `src/data/researchGraph.manual.ts` | `gnaroshi-paper-lab/config/researchGraph.manual.ts` | Paper Lab | Manual research relationship source |
| `src/config/evidenceGates.ts` | `gnaroshi-paper-lab/config/evidenceGates.ts` | Paper Lab / Contracts | Copied to Paper Lab and Studio for later contract reconciliation |
| `src/content/blog/en/` | `gnaroshi-writing/posts/en/` | Writing | Imported seed writing is non-publishable pending review |
| `src/content/blog/ko/` | `gnaroshi-writing/posts/ko/` | Writing | Translation pairs retain existing filenames |
| `scripts/new-paper.mjs` | `gnaroshi-studio/apps/cli/scripts/new-paper.mjs` | Studio CLI | Source snapshot, not yet path-normalized |
| AI review scripts and `scripts/lib/` | `gnaroshi-studio/apps/cli/scripts/` | Studio CLI / AI client | API credentials remain local only |
| `scripts/queue-to-paper.mjs` | `gnaroshi-studio/apps/cli/scripts/queue-to-paper.mjs` | Studio CLI | Source snapshot |
| `scripts/promote-paper-to-blog.mjs` | `gnaroshi-studio/apps/cli/scripts/promote-paper-to-blog.mjs` | Studio publisher | Must continue creating drafts only |
| Question, formula, graph, weekly, momentum scripts | `gnaroshi-studio/apps/cli/scripts/` | Studio CLI | Source snapshots |
| `src/content.config.ts` | `gnaroshi-studio/packages/contracts/src/content.config.ts` | Studio contracts | Astro-specific schema snapshot to be made framework-neutral later |
| Paper/review/momentum utilities | `gnaroshi-studio/packages/paper-core/src/` | Studio paper core | Source snapshots retain original imports |
| Writing/content utilities | `gnaroshi-studio/packages/writing-core/src/` | Studio writing core | Source snapshots retain original imports |
| `src/utils/visibility.ts` | `gnaroshi-studio/packages/publisher/src/visibility.ts` | Studio publisher | Visibility must be enforced before feed output |
| `src/types/api.ts`, `src/types/momentum.ts` | `gnaroshi-studio/packages/contracts/src/types/` | Studio contracts | Website keeps originals until it consumes versioned contracts |
| `apps/api/` | `gnaroshi-api/` | API | Root-normalized Worker snapshot; `.dev.vars` excluded |
| `docs/cloudflare-worker-api.md` | `gnaroshi-api/docs/cloudflare-worker-api.md` | API | Operational reference snapshot |

## Public Content Feed Map

The public feed is intentionally empty in this phase. Future projections map as follows:

| Canonical source | Generated destination |
| --- | --- |
| Approved English writing | `blog/en/` |
| Approved Korean writing | `blog/ko/` |
| Approved English paper notes | `papers/en/` |
| Approved Korean paper notes | `papers/ko/` |
| Public review summaries | `data/reviews/` |
| Public oral-exam summaries | `data/oral-exams/` |
| Public weekly summaries | `data/weekly-reviews/` |
| Approved public media | `assets/` |

The publisher must not copy private source trees wholesale. It emits only fields allowed by the versioned feed contract.

## Website Cutover Map

The following website paths remain unchanged now and are removed or reduced only after a feed-backed build reaches parity:

- `src/content/blog/`, `src/content/papers/`, `src/content/queue/`, `src/content/implementations/`
- `src/generated/paper-reviews/`, `src/generated/oral-exams/`, `src/generated/formula-recall/`, `src/generated/question-bank/`, `src/generated/weekly-reviews/`
- Authoring and generation scripts copied to Studio
- `apps/api/` copied to the API repository
- Domain utilities copied to Studio packages

Removal requires a separate pull request with route, link, content-metric, i18n, build, E2E, accessibility, and visual parity evidence.
