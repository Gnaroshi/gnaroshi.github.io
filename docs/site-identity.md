# Site Identity

## Source

The website mark is a pixel derivative of the owner-approved raster master in `gnaroshi_mds/identity/approved/gnaroshi-base-v1.png`. The immutable master is not copied over or replaced. The production derivative lives at:

```text
media-sources/identity/gnaroshi-site-pixel-v1/gnaroshi-site-mark-pixel-v1.png
```

The production mark keeps the large pointed ears, four sharp teal eyes, broad lower face, white teeth, and orange armor silhouette. Its generated source targets a 64×64 logical pixel grammar and removes the body, chest ornament, small facets, lettering, and background decoration so the subject remains legible at 16px. The tracked source remains a 1254×1254 raster; deterministic nearest-neighbor exports preserve the hard pixel edges.

## Production Uses

`npm run media:publish` generates:

- 16px, 32px, and 48px browser icons
- 180px Apple touch icon
- 192px and 512px web manifest icons
- 64px and 128px header/footer identity marks

These are raster outputs generated with nearest-neighbor resampling. Do not smooth the pixel master, recreate the mascot as SVG, or replace it with a letter tile.

## Color Boundary

The existing site green remains the primary interaction color. The shared Gnaroshi identity colors are additional restrained cues:

- `--color-identity-teal: #3fa6a0`
- `--color-identity-orange: #e88945`

Use them for the identity mark, pixel corner details, project-evidence accents, and similarly small ownership cues. Do not recolor the full website, status system, heatmap, or body typography to match the mascot.

## Pixel Interface Boundary

The site extends the pixel direction through interaction chrome rather than content rasterization:

- hard two-pixel borders, stepped focus and selected-navigation markers
- short two-pixel offset shadows on primary controls and identity frames
- square role glyphs and restrained corner accents
- system sans/serif typography for reading and Korean text
- normal rendering for photographs, diagrams, and actual application screenshots

Do not apply a global pixelation filter, bitmap body font, game HUD treatment, or decorative pixel frame around every section.

## Small-Size Check

Review the 16px, 32px, and 64px outputs on light and dark backgrounds after changing the master. The ears, teal eyes, and teeth must remain distinguishable; internal armor detail is secondary.
