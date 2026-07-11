# Media Provenance

## Required Record

Every production content asset must record:

- stable media ID;
- category: concept, screenshot, artifact, social, or brand;
- routes and purpose;
- localized alt text;
- dimensions, aspect ratio, variants, and fallback;
- focal point and loading priority;
- source type: generated, real screenshot, real artifact, or owner supplied;
- source/capture date and provenance;
- full generation prompt for generated concepts;
- privacy review result for screenshots and artifacts.

Functional icons are excluded from the raster/content manifest and use the icon registry.

## Current Provenance

- Existing generated Hero: generated specifically for Gnaroshi on 2026-07-11. The production manifest summarizes the prompt but does not preserve it fully; the asset is scheduled for replacement.
- Existing content SVG diagrams: repository-authored using the V3 editorial palette; individual authoring dates are not recorded; all are scheduled for removal or replacement.
- OG PNG files: deterministic renders of `public/og/default*.svg`.
- Favicon: repository-owned one-color SVG; authorship date is not recorded.

## Candidate Provenance

Stage 1 candidate prompts are versioned in `docs/hero-candidate-prompts.md`. Candidate rasters are ignored review artifacts and are never evidence. The development review route labels them as generated concepts.

## Privacy

Real screenshots and artifacts must pass `docs/screenshot-guidelines.md`. Production manifest entries with source type `real-screenshot` or `real-artifact` require `reviewedForPrivacy: true`.
