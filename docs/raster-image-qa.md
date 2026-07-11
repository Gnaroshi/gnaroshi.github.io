# Raster Image QA

Audit date: 2026-07-11

## Candidate Review

Two production-ratio candidates were reviewed side by side for every selected asset under:

```text
artifacts/raster-candidates/contact-sheets/
```

`selected-family.webp` shows the final eight-image family. The selected candidates are recorded in `src/data/mediaManifest.ts`. Rejected candidates remain ignored and are not committed.

The first two Hero candidates were rejected because generated paper surfaces contained text-like artifacts. The selected Hero uses closed, blank objects and broad embossed geometry. No selected candidate contains readable text, labels, logos, fake UI, stock charts, robot faces, or watermarks.

## Selected Assets

| Asset | Candidate | Review note |
| --- | --- | --- |
| Home research constellation | C | Blank, substantial, mobile-safe focal notebook and prototype |
| Research VLA | B | Mechanically plausible gripper and distinct observation/representation objects |
| Efficient systems | B | Clear cache fan and compact update cartridges |
| Research workflow | A | Open paper and incomplete recurrence path remain legible at 4:3 |
| gnaroshi_vla project | B | Unique adapter dock and experiment tray; not reused from Research VLA |
| gnaroshi.dev project | B | Clear private/filter/public material boundary |
| Paper Lab | B | Focused onboarding objects without numbered process UI |
| Growth evidence | B | Calm evidence cells without scores, chart, or gamification |

## Automated Gates

- `npm run media:build`: pass, 64 optimized variants and nine local contact sheets
- `npm run media:check`: pass, 8 assets and 64 variants, 4,345,359 bytes
- `npm run content:check`: pass, schema v1 bootstrap-empty feed
- `npm run check`: pass, 217 files with no errors, warnings, or hints
- `npm run build`: pass under Node 24.18.0, 42 pages
- `npm run check:i18n`: pass, exact English/Korean key parity
- `npm run check:links`: pass, 1,953 internal targets across 42 HTML files
- `npm run test:e2e`: pass, 58 tests
- `npm run test:a11y`: pass, 31 tests with no automated axe violations
- `npm run test:visual`: pass, 18 tests and 252 route screenshots
- `npm run test:performance`: pass, 7 deterministic and 7 browser budgets

All 1200px AVIF and WebP variants pass configured budgets. The Hero's 1200px AVIF is 76,328 bytes and WebP is 109,522 bytes. The largest below-fold 1200px files are Research VLA at 96,489 bytes AVIF and 153,598 bytes WebP.

The raster contract runs in both pull-request CI and the production Pages build before Astro compilation.

## Visual Matrix

The Playwright visual suite covers:

- 1440x1000, 1280x900
- 1024x768, 768x1024
- 430x932, 390x844, 360x800
- light and dark themes
- English and Korean shells

The run captured 252 screenshots across 18 English and Korean routes. This includes Home, Research, Projects, both project details, Paper Lab, and Growth, plus existing Blog and About regression coverage. Every screenshot was reviewed through seven viewport contact sheets under `artifacts/visual-audit-v3/raster-media/contact-sheets/`.

The review found no horizontal overflow, missing media, subject-removing crop, layout shift, generated text, image/theme conflict, or English/Korean image mismatch. Primary objects remain visible at 360px. Desktop media supports the copy without dominating it, and the same neutral family remains calm in dark mode.

## Intentional Omissions And Exceptions

- Blog series covers were not generated because the current public feed has no public posts or series. Their unused SVGs were removed.
- The built-in generator's selected sources are 1402-1586px wide. The nominal 1600 slot is capped to 1400, 1448, or 1584px to prevent upscaling; actual widths are declared in `srcset`.
- One neutral asset is used in both themes. No CSS inversion, hue rotation, destructive gradient, or separate dark asset was needed.
- The deterministic route report records 107.0KB of initially referenced Home imagery, below the 450KB target. Browser QA measured zero layout shift on every performance route.

## Owner Review

No image is blocked on owner review. The VLA project bench is the densest composition; it remains within the requested object hierarchy and survives the mobile crop, but it is the first candidate to revisit if a quieter project image is preferred later.
