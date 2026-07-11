# Image System

Public content artwork uses native AVIF and WebP variants generated from selected raster sources. Functional SVG remains limited to the favicon, monogram, theme and menu controls, and small interface icons.

Read:

- [`raster-image-system.md`](raster-image-system.md) for the asset contract, build pipeline, and budgets
- [`raster-image-prompts.md`](raster-image-prompts.md) for exact selected production prompts
- [`raster-image-qa.md`](raster-image-qa.md) for candidate selection and visual verification

`src/data/mediaManifest.ts` is the public asset registry. `src/components/media/ResponsiveArtwork.astro` renders localized responsive pictures. Use `npm run media:build` after changing an ignored selected source, then run `npm run media:check` before committing public variants.

Do not add content SVG, remote dynamic image services, unreadable generated text, fake UI, or unregistered files under `public/media/`.
