# Raster Image System

## Purpose

Public content artwork uses a coherent family of native raster still-lifes. Functional SVG remains appropriate for the favicon, monogram, theme control, menu, and small interface icons. Content media must not use SVG.

## Art Direction

The family uses high-end editorial still-life, soft sculptural 3D, tactile paper and resin, brushed dark metal, restrained translucent material, warm off-white, stone gray, charcoal, muted forest green, dusty blue, and a small amber accent. Lighting is soft and directional with quiet contact shadows. Images contain no readable text, labels, logos, arrows, charts, browser UI, or watermarks.

## Source And Output

Candidate and selected PNG sources live under ignored paths:

```text
artifacts/raster-candidates/
artifacts/raster-selected/
```

`npm run media:build` uses Sharp to crop each selected source at its production aspect ratio and writes AVIF and WebP variants to `public/media/`. EXIF and unnecessary source metadata are omitted, pixels are converted to sRGB, and sources are never upscaled.

Each asset has nominal `480`, `768`, `1200`, and `1600` slots. Built-in image generation produced source widths between 1402 and 1586 pixels, so the final slot is source-limited:

- Hero: 1400px
- Research images: 1448px
- Project, Paper Lab, and Growth images: 1584px

The filename retains `-1600` as the responsive slot name, while `srcset` and `MediaVariant.width` declare the actual pixel width. This preserves the no-upscaling rule.

## Manifest Contract

`src/data/mediaManifest.ts` owns localized alt text, explicit dimensions, variants, fallback, focal point, sizes, priority, generation metadata, and provenance. `ResponsiveArtwork.astro` renders one `picture` with AVIF and WebP source sets and a 1200px WebP fallback.

The Hero is eager and high priority. All other artwork is lazy. Explicit dimensions and fixed aspect-ratio frames prevent layout shift. One neutral image is used in both themes without inversion or hue rotation.

## Validation

`npm run media:check` fails for:

- content media ending in `.svg`
- missing AVIF or WebP variants
- missing or mismatched dimensions
- missing localized alt text or provenance
- 1200px budget violations
- reused research/project files
- unused files in `public/media/`
- route-less assets
- blog covers without a matching public series

Public blog content is currently empty, so the four former series SVG covers were removed and no raster replacements were generated. Covers should be generated only when a public series uses them.

## Performance

The 64 public variants total 4,345,359 bytes. The previous media directory was 891,083 bytes, for a repository increase of 3,454,276 bytes. Only the responsive Hero candidate is loaded initially on Home; below-fold artwork remains lazy.

At 1200px:

| Asset | AVIF | WebP |
| --- | ---: | ---: |
| Hero | 76,328 B | 109,522 B |
| Research VLA | 96,489 B | 153,598 B |
| Efficient systems | 55,687 B | 87,132 B |
| Research workflow | 76,969 B | 116,244 B |
| VLA project | 70,562 B | 115,542 B |
| gnaroshi.dev project | 49,230 B | 82,708 B |
| Paper Lab | 64,489 B | 97,814 B |
| Growth | 57,270 B | 106,884 B |

All are below their configured Hero or below-fold budgets.
