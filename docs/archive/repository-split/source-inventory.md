# Source Inventory

## Inventory Basis

- Repository: `Gnaroshi/gnaroshi.github.io`
- Commit: `42ad8002c99a1bd09e059519d684620f87a432a6`
- Rule: files are copied only; no original is removed during this phase

The classifications below describe the target owner after a completed migration. Until cutover, every original path remains in the website repository and continues to support the unchanged build.

## Keep In Website

Presentation, routing, deployment, and public metadata remain website-owned:

- Root build/config: `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `playwright.config.ts`
- Repository guidance: `README.md`, `AGENTS.md`, `.codex/`, `.gitignore`, `.nojekyll`
- Deployment: `.github/workflows/deploy.yml`, `public/CNAME`, `public/.nojekyll`, `public/robots.txt`
- Public visual assets: `public/favicon.svg`, `public/og/`
- UI and layouts: `src/components/`, `src/layouts/`, `src/styles/`, `src/views/`
- Astro routes: `src/pages/`, including EN/KO routing, RSS, SEO surfaces, and public tool shells
- Localization: `src/i18n/`
- Public profile/project data: `src/data/profile.ts`, `projects.ts`, `research.ts`, `now.ts`, `skills.ts`, `timeline.ts`, `homeCopy.ts`, `src/data/locales/`
- Public project content: `src/content/projects/`
- Website environment/client boundary: `src/env.d.ts`, `src/utils/researchApiClient.ts`, `src/utils/localizedRss.ts`
- Public QA scripts: `scripts/check-empty-shells.mjs`, `check-public-copy.mjs`, `check-content-metrics.mjs`, `check-i18n.mjs`, `check-hardcoded-ui.mjs`, `check-translation-links.mjs`, `check-links.mjs`
- Public route/visual/accessibility tests: `tests/e2e/`
- Website planning and operations docs: `docs/product.md`, `design.md`, `architecture.md`, `deployment.md`, `design-audit-v2.md`, `final-qa-report.md`, `i18n.md`, `i18n-terminology.md`, `growth-dashboard.md`, `tasks.md`, `codex-workflow.md`
- New repository-split docs: `docs/repository-split/`

A future `src/content-feed/` adapter belongs here but is not implemented in this phase.

## Move To Paper Lab

Canonical paper-research sources:

- `src/content/papers/`
- `src/content/queue/`
- `src/content/implementations/`
- `src/generated/paper-reviews/`
- `src/generated/oral-exams/`
- `src/generated/formula-recall/`
- `src/generated/question-bank/`
- `src/generated/weekly-reviews/`
- `src/data/researchGraph.manual.ts`
- Paper workflow copies of `src/config/evidenceGates.ts`
- Paper-domain docs: `docs/paper-reading-system.md`, `ai-paper-review.md`, `ai-review-rubric-examples.md`, `manual-ai-review.md`, `implementation-tracker.md`, `learning-loop-features.md`, `research-graph.md`, `research-momentum-score.md`, `weekly-review.md`, `visibility.md`

Imported examples, generated demo records, the untitled draft, and the meta-only weekly review are marked non-publishable in the private repository import manifest.

## Move To Writing

Canonical writing sources:

- `src/content/blog/en/`
- `src/content/blog/ko/`
- Blog-specific guidance from `docs/content-model.md` and `docs/paper-to-blog.md`

No blog-owned binary asset directory exists in the source repository. The target `assets/`, `drafts/`, and `series/` boundaries are initialized empty. Existing posts are classified as imported seed writing pending editorial review.

## Move To Studio

Authoring, schema, publishing, and domain-engine candidates:

- Paper creation/review: `scripts/new-paper.mjs`, `review-paper.mjs`, `review-papers.mjs`, `import-paper-review.mjs`, `validate-paper-reviews.mjs`
- Review internals: `scripts/lib/`
- Workflow conversion: `scripts/queue-to-paper.mjs`, `promote-paper-to-blog.mjs`
- Derived research builders: `scripts/build-question-bank.mjs`, `score-formula-recall.mjs`, `build-research-graph.mjs`, `build-weekly-review.mjs`, `test-momentum-score.mjs`
- Content schemas: `src/content.config.ts`
- Shared config/contracts: `src/config/evidenceGates.ts`, `src/types/api.ts`, `src/types/momentum.ts`
- Paper/review/momentum domain utilities: `src/utils/evidenceEligibility.ts`, `formulaRecall.ts`, `implementations.ts`, `momentumData.ts`, `momentumScore.ts`, `paperReviews.ts`, `papers.ts`, `questionBank.ts`, `queue.ts`, `researchGraph.ts`, `reviewDue.ts`, `weeklyReviews.ts`
- Writing/content domain utilities: `src/utils/content.ts`, `date.ts`, `localizedContent.ts`, `readingTime.ts`, `slug.ts`
- Publisher rule: `src/utils/visibility.ts`
- Domain docs copied into `gnaroshi-studio/docs/`

The imported Studio files are source snapshots, not runnable packages. Their original Astro imports and filesystem assumptions require a later normalization phase.

## Move To API

- Entire optional Worker: `apps/api/`
- API operations documentation: `docs/cloudflare-worker-api.md`

The tracked `.dev.vars.example` is safe placeholder configuration. `.dev.vars`, `.env`, Worker secrets, and credentials are not copied.

## Generated Content-Feed Output

No current source path is copied wholesale into the public feed. Future generated projections derive from:

- Approved records from `src/content/blog/` into `blog/en/` and `blog/ko/`
- Approved records from `src/content/papers/` into `papers/en/` and `papers/ko/`
- Public-safe review summaries from `src/generated/paper-reviews/` into `data/reviews/`
- Public-safe oral-exam summaries from `src/generated/oral-exams/` into `data/oral-exams/`
- Public-safe weekly summaries from `src/generated/weekly-reviews/` into `data/weekly-reviews/`
- Approved graph/derived output from `src/generated/research-graph.json` under a future versioned data contract
- Approved licensed media into `assets/`

The initial feed contains only directory placeholders and `manifest.json` with zero entries. Seed, sample, demo, draft, hidden, and meta-only data is intentionally excluded.

## Obsolete After Migration

These paths are candidates for removal from the website only after feed parity and a separate reviewed cutover:

- `.github/workflows/review-papers.yml`, after Studio owns review automation
- Direct authoring/generation scripts copied to Studio
- Direct canonical blog, paper, queue, and implementation content directories
- Direct generated research-evidence directories
- `apps/api/` after API deployment and operational ownership move
- Domain utilities replaced by versioned Studio contracts or feed adapter logic
- `.gitkeep` files whose original website directories no longer exist after cutover

They are not obsolete now and are not modified by this task.

## Uncertain / Manual Review

- `src/generated/github-contributions/`: decide whether this remains an ephemeral website build input, becomes a Studio-owned external-evidence cache, or is removed from public momentum entirely.
- `src/generated/research-graph.json`: generated projection candidate, but the final feed schema and whether graph derivation occurs in Studio or website build remain undecided.
- `docs/growth-dashboard.md`: presentation guidance belongs to the website, while metric semantics belong to Studio contracts; split the document during contract extraction.
- `docs/content-model.md`: currently spans Astro collection details and domain contracts; Writing and Studio both receive snapshots pending canonical ownership.
- `src/components/exams/` and other tool components remain website presentation; a future desktop implementation may share contracts but must not copy web UI by default.
- `src/utils/localizedContent.ts` is copied to Studio writing core but may remain a website adapter utility depending on the feed slug contract.

## Intentionally Not Copied

- No source files are removed from the original repository.
- No `.env`, `.env.local`, `.dev.vars`, API key, token, credential, local Codex config, cache, build output, `node_modules`, or Playwright artifact is copied.
- No paper PDF exists in tracked source and none is copied.
- Website components, pages, styles, public assets, project content, profile data, and GitHub Pages deployment are not copied to private content repositories.
- Sample and seed content is not copied into the public content feed.
