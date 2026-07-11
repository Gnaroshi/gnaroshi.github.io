# gnaroshi.github.io Audit

Expected owner: public presentation, localization, SEO, accessibility, feed adapters, and GitHub Pages deployment.

## Strengths

- The repository is now presentation-only. It has no canonical Blog/Paper source, authoring CLI, Worker runtime, AI client, or private checkout.
- `src/utils/contentFeed.ts` constrains reads to the ignored public feed and records feed provenance in metadata and `/build-info.json`.
- `src/utils/publicCapabilities.ts` and locale-aware navigation hide empty tools while preserving buildable noindex routes.
- Static output, custom-domain root paths, CNAME, sitemap, RSS, canonical URLs, redirects, and post-deploy route verification are configured.
- Empty-state React islands are not hydrated. Four interactive areas hydrate only when their data is present.
- Current checks pass: 42 static pages, 59 E2E tests, 31 accessibility tests, exact EN/KO dictionary parity, and 1,447 internal-link targets.
- The live build identifies both the exact website commit and exact feed commit.

## Findings

### Architecture

- **P1 - graph indexing reads the wrong eligibility field.** `src/utils/indexing.ts` checks `graph.graphEligible`, while the feed contract and `src/utils/researchGraph.ts` use `eligible`. A valid eligible graph can remain `noindex`. Owner: this repository.
- **P2 - consumer schema logic is manually duplicated.** `src/content.config.ts` repeats feed enums and public record shapes. The canonical validator still runs first, but Astro mapping can drift independently. Generate adapter types from the feed schema or isolate one versioned compatibility module.
- **P2 - migration-era documentation remains active-looking.** `docs/repository-split/` and multiple legacy audit documents are useful provenance but increase the chance that future sessions follow obsolete instructions. Move them under one clearly archived index.

### Routes

- Core Home, Research, Projects, Writing, Paper Lab, Growth, About, Blog detail, Paper detail, 404, and EN/KO index routes build correctly.
- **P2 - tool-detail localization is structurally asymmetric.** English has graph-node, queue-item, question, implementation, formula-practice, and oral-exam detail templates that Korean does not. The current source-only fallback is truthful, but future paired feed records need a single documented rule for localized detail routes.
- **P2 - queue and question routes outlive the current public feed contract.** Website adapters look for queue/question-bank JSON that schema v1 does not define. The routes are noindex and hidden, so this is not a public failure, but the ownership contract should either formalize or retire these adapters.

### Design And Media

- The page shell, typography, mobile drawer, theme switch, and evidence-gated empty states are consistent and tested at desktop and mobile widths.
- Functional SVG: `public/favicon.svg`; source-only social templates: `public/og/default.svg`, `public/og/default-ko.svg`.
- Content SVG: four Blog covers plus Research, Project, Paper Lab, and Growth illustrations under `public/media/`.
- Raster artwork: eight responsive AVIF/WebP homepage variants and two PNG Open Graph defaults. The largest variant is about 236 KB.
- **P2 - content illustration style is diagrammatic and repetitive.** `src/data/mediaManifest.ts` assigns `research-vla.svg` to more than one context, and the four empty-feed Blog covers are not currently rendered. Open PR #9 appears to address raster media, but it is not deployed.
- **P2 - media provenance is not recorded.** Website-owned artwork has no source/license/provenance manifest. Add one before introducing generated or third-party assets.

### Performance

- Route-specific styles and conditional islands keep the bootstrap site mostly static.
- Responsive hero images have explicit variants and manageable sizes; automated tests found no overflow or layout-control regressions.
- **P2 - no checked-in route budget guards LCP/CLS or total client bytes.** Existing Playwright behavior tests are strong, but a small performance budget would catch future regression.

### Deployment

- Deploy and rollback workflows are pinned to action SHAs, record provenance, use Pages artifacts, and verify the public deployment.
- **P2 - PR CI consumes moving `content-feed/main`.** A rerun can test a different feed without a website change. Record the resolved feed SHA as an artifact or allow an exact fixture ref.
- **P2 - push-triggered deploys float to feed `main`.** Studio dispatch passes an exact feed commit, which is correct. Direct website pushes are reproducible only after the resolved SHA is recorded during the run.
- **P2 - LICENSE is absent.** Decide the license for website code and website-owned artwork.

## Top 10 Improvements

1. P1: change graph indexing to the canonical `eligible` field and add an eligible-graph test.
2. P2: generate or centrally version feed adapter types.
3. P2: define the localized tool-detail route policy.
4. P2: remove or contractually define queue/question feed adapters.
5. P2: finish review and merge the media replacement PR if approved.
6. P2: add a website media provenance/license manifest.
7. P2: archive migration-only documentation under one explicit archive.
8. P2: add client-byte and key-route performance budgets.
9. P2: expose the resolved feed SHA in PR CI summaries/artifacts.
10. P2: choose and add a LICENSE.

## Files Involved

`src/utils/indexing.ts`, `src/content.config.ts`, `src/utils/contentFeed.ts`, `src/utils/publicCapabilities.ts`, `src/i18n/routes.ts`, `src/pages/`, `src/views/`, `src/data/mediaManifest.ts`, `public/media/`, `public/og/`, `.github/workflows/deploy.yml`, `.github/workflows/rollback.yml`, `.github/workflows/ci.yml`, `docs/repository-split/`.
