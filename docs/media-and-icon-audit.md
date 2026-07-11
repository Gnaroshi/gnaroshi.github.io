# Media And Icon Audit

Audit date: 2026-07-12

This is the Stage 1 inventory for the public website. It records the current production state before any visual replacement. `Keep` means the file remains during candidate review; `Replace` and `Remove` are Stage 2 decisions and require an approved candidate or real evidence asset.

## Production Asset Inventory

| File | Classification | Format / dimensions | Size | Route / component | Purpose | Decision | Reason |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `public/media/home-research-constellation-480.avif` | generated-concept-image | AVIF, 480x384 | 25,844 B | `/`, `Hero.astro` | Hero responsive source | Replace | Rejected research-desk direction; contains fake writing, charts, and excessive props. |
| `public/media/home-research-constellation-768.avif` | generated-concept-image | AVIF, 768x614 | 67,192 B | `/`, `Hero.astro`, preload | Hero responsive source | Replace | Same source and content problems; 768 variant is also not an exact 5:4 crop. |
| `public/media/home-research-constellation-1200.avif` | generated-concept-image | AVIF, 1200x960 | 174,462 B | `/`, `Hero.astro` | Hero responsive source | Replace | Meets the current byte target but not the new credibility direction. |
| `public/media/home-research-constellation-1600.avif` | generated-concept-image | AVIF, 1600x1280 | 236,162 B | `/`, `Hero.astro` | Hero responsive source | Replace | Below the requested candidate source resolution and visually rejected. |
| `public/media/home-research-constellation-480.webp` | generated-concept-image | WebP, 480x384 | 21,532 B | `/`, `Hero.astro` | Hero fallback source | Replace | Raster fallback of the rejected Hero. |
| `public/media/home-research-constellation-768.webp` | generated-concept-image | WebP, 768x614 | 52,218 B | `/`, `Hero.astro` | Hero fallback source | Replace | Raster fallback of the rejected Hero. |
| `public/media/home-research-constellation-1200.webp` | generated-concept-image | WebP, 1200x960 | 134,964 B | `/`, `Hero.astro`, manifest fallback | Hero fallback source | Replace | Raster fallback of the rejected Hero. |
| `public/media/home-research-constellation-1600.webp` | generated-concept-image | WebP, 1600x1280 | 169,972 B | `/`, `Hero.astro` | Hero fallback source | Replace | Raster fallback of the rejected Hero. |
| `public/media/research-vla.svg` | content-illustration | SVG, 800x600 | 1,083 B | `/research/`, `/projects/gnaroshi-vla/` | VLA concept and project evidence | Remove | Flat diagram and reused for unrelated explanatory/evidence roles. The project needs a real repository artifact. |
| `public/media/research-efficient-systems.svg` | content-illustration | SVG, 800x600 | 1,127 B | `/research/` | Efficient execution concept | Remove | Rejected flat infographic direction; no verified artifact is currently available in this repository. |
| `public/media/research-workflow.svg` | content-illustration | SVG, 800x600 | 1,062 B | `/research/` | Research-loop concept | Remove | Rejected flat infographic direction; Research should become typography-first. |
| `public/media/project-gnaroshi-dev.svg` | content-illustration | SVG, 960x600 | 1,221 B | Home, `/projects/`, `/projects/gnaroshi-dev/` | Website publishing architecture | Replace | A real website screenshot or truthful build/deployment artifact is stronger evidence. |
| `public/media/paper-lab-cycle.svg` | content-illustration | SVG, 960x600 | 1,199 B | Home and `/papers/` | Paper Lab onboarding | Remove | Decorative onboarding art is explicitly rejected; empty state should be copy, icon, and one action. |
| `public/media/growth-evidence.svg` | content-illustration | SVG, 960x600 | 1,043 B | `/growth/` | Growth onboarding | Remove | Generated-looking chart before eligible data can be mistaken for evidence. |
| `public/media/blog-cover-paper-reading.svg` | unused | SVG, 960x540 | 482 B | Manifest only | Planned series cover | Remove | No substantial public post uses it; pre-generated category art is not needed. |
| `public/media/blog-cover-research-systems.svg` | unused | SVG, 960x540 | 477 B | Manifest only | Planned series cover | Remove | No substantial public post uses it. |
| `public/media/blog-cover-implementation-notes.svg` | unused | SVG, 960x540 | 429 B | Manifest only | Planned series cover | Remove | No substantial public post uses it. |
| `public/media/blog-cover-ai-workflow.svg` | unused | SVG, 960x540 | 614 B | Manifest only | Planned series cover | Remove | No substantial public post uses it. |
| `public/og/default.svg` | social-preview | SVG source, 1200x630 | 1,166 B | `render-og-images.mjs` | English OG source | Keep temporarily | Typography-led and truthful. Revisit after brand approval; production uses the rendered PNG. |
| `public/og/default-ko.svg` | social-preview | SVG source, 1200x630 | 1,164 B | `render-og-images.mjs` | Korean OG source | Keep temporarily | Same as English source. |
| `public/og/default-en.png` | social-preview | PNG, 1200x630 | 32,024 B | `SEO.astro` | English social preview | Keep temporarily | Production default is readable and small; update only with approved identity. |
| `public/og/default-ko.png` | social-preview | PNG, 1200x630 | 25,090 B | `SEO.astro` | Korean social preview | Keep temporarily | Production default is readable and small; update only with approved identity. |
| `public/favicon.svg` | favicon / brand-icon | SVG, 64x64 | 254 B | `BaseLayout.astro` | Browser identity | Keep pending review | Simple and legible, but the block letterform is generic. Four alternatives are prepared without auto-selection. |

## Current Media Allocation

- Home renders three large images: generated Hero, duplicated project diagram, and Paper Lab diagram. It is at the requested maximum but only the Hero is conceptually allowed; the other two need real evidence or removal.
- Research renders one flat diagram for every topic. This conflicts with the new typography-first hierarchy.
- Projects renders diagrams as if they were evidence. Neither current project has a real screenshot in the website repository.
- Paper Lab and Growth render decorative onboarding illustrations before evidence exists. Both must become image-free in Stage 2.
- Writing has four unused pre-generated covers.
- About does not invent a portrait and should continue using text or an approved monogram.

## Duplication And Provenance

- `research-vla.svg` is reused by `researchVla` and `projectGnaroshiVla`. One is explanatory art; the other is presented as project evidence. This is the only unrelated-purpose image reuse.
- The Hero is the only generated raster family. Its manifest records generation on 2026-07-11, but not the full prompt or model/output identifier.
- The SVG diagrams are repository-authored, but their provenance is generic and has no per-file author/date record.
- The OG SVG files are source artwork; PNGs are deterministic derivatives.

## Icon Audit

| Current implementation | Classification | Status | Stage 2 action |
| --- | --- | --- | --- |
| `SunIcon.astro` | functional-icon | 24x24 viewBox, 1.8 stroke, `currentColor`; good baseline | Migrate into approved registry without changing optical size. |
| `MoonIcon.astro` | functional-icon | Matches Sun canvas and style; current visual test passes | Migrate into approved registry. |
| Mobile menu two CSS spans | functional-icon | CSS glyph rather than shared SVG; open/close states are not one icon system | Replace with approved Menu/Close SVG candidates. |
| `ExternalLink.astro` `↗` | functional-icon | Unicode UI symbol; explicitly disallowed by the target system | Replace only in Stage 2 with approved ExternalLink icon. |
| `PaperScoreTrend.astro` inline SVG | real-research-artifact | Data visualization, not a functional icon | Keep; exclude from icon registry. |
| Text-only desktop navigation | navigation | Correct | Keep text-only. |

No emoji icon, raster UI icon, Lucide, Heroicons, or icon-library dependency is present in the website. Keyboard event names such as `ArrowLeft` are not visible UI symbols.

## Stage 1 Legacy Allowlist

`config/media-policy.json` explicitly lists the rejected production SVGs, unused covers, duplicated VLA use, and Unicode external-link arrow. The allowlist prevents new violations while approval is pending. Stage 2 removes the entries and makes the checks strict.

## Decision

No production media is changed in Stage 1. Candidate IDs, crops, optical alignment, and real screenshot plans must be reviewed first. The production Hero, favicon, diagrams, and Unicode external-link marker remain unchanged until the owner supplies approved IDs.
