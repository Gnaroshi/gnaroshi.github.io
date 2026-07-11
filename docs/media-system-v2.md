# Media System V2

## Principle

Use media only when it adds truthful evidence, identity, or necessary context. The hierarchy is:

1. real screenshots and real project/research artifacts;
2. typography, layout, whitespace, color, and subtle texture;
3. at most one or two approved conceptual raster images.

Raster format does not guarantee visual quality. Content imagery is not required to be raster by principle: functional diagrams, data visualizations, and brand/icon vectors may remain SVG when that is the truthful native medium. Rejected flat illustration SVGs are a content-direction issue, not a file-format rule.

## Route Allocation

- Home: one approved concept Hero, one real featured-project image, and optionally one real workflow artifact. Maximum three large images.
- Research: typography first; add only real artifacts. A topic without evidence remains text-only.
- Projects: real screenshots, terminal/configuration excerpts, architecture trees, or result artifacts. Never generated UI.
- Writing: covers only for substantial featured posts. Short notes need no image.
- Paper Lab and Growth: no decorative onboarding art. Render real data visualization only when eligible data exists.
- About: owner-supplied photograph or approved monogram; never a generated portrait.

## Target Production Components

Stage 2 may introduce `ResponsiveImage`, `ProjectScreenshot`, `ConceptImage`, and `IconLabel`. They must require explicit dimensions and localized alt text, support AVIF/WebP/fallback variants, preserve focal point, and expose provenance only in development.

These components are intentionally not introduced during Stage 1 because no production candidate is approved.

## Budgets

- Hero 1200 AVIF: target <= 180 KB; WebP <= 260 KB.
- Project screenshot 1200 AVIF: target <= 160 KB; WebP <= 230 KB.
- Thumbnail: <= 80 KB.
- Only the approved Hero may be preloaded.
- Below-fold screenshots and article media load lazily with explicit dimensions.

## Approval Boundary

Candidate files remain under ignored `artifacts/media-review/`. No file is copied into `public/`, added to `mediaManifest.ts`, preloaded, or referenced by a public route until `docs/media-approval.md` names the approved ID and usage.
