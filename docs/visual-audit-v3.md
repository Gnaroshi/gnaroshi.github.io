# Visual Audit V3 Baseline

## Capture

Baseline commit: `6d5dcd1b85cbc0a6bccf086d082a5e356189e767`

Playwright captured 196 full-page screenshots: 14 routes, seven viewports, and light/dark themes. Screenshots and measurements are ignored build artifacts under `artifacts/visual-audit-v3/baseline/`. Contact sheets under `artifacts/visual-audit-v3/baseline-contact-sheets/` were opened and inspected manually.

Viewports: 1440x1000, 1280x900, 1024x768, 768x1024, 430x932, 390x844, and 360x800.

## Route Findings

Baseline title Y values below are `desktop/mobile`; widths are the baseline desktop main width. All routes had zero document-level horizontal overflow, but the Paper Lab subnavigation relied on clipped horizontal scrolling at mobile widths.

| Route | Title Y | Width | Alignment and spacing | Dark/mobile/Korean issue | Unnecessary element |
| --- | ---: | ---: | --- | --- | --- |
| `/` | 500/187 | 1040 | Hero copy sat low inside a large text-only area | Dark hierarchy was flat; mobile page became very long | Separate current-focus block repeated later copy |
| `/research/` | 151/135 | 1040 | Long single-column text did not use wide layout | Korean became a dense text wall | Repeated metadata labels for every theme |
| `/projects/` | 151/135 | 1040 | One project occupied a card-like strip without a visual anchor | Mobile metadata competed with the summary | Section intro repeated project framing |
| `/blog/` | 203/187 | 1040 | Custom header padding broke the editorial title grid by 52px | Empty page felt unfinished in both themes | Empty discovery space |
| `/papers/` | 183/183 | 1180 | Local nav plus app padding produced a distinct start | Mobile subnav was visually crowded | Three method cards dominated the zero state |
| `/growth/` | 183/183 | 1180 | Empty state used only part of the dashboard width | Dark empty panel blended into the shell | Data-source detail was visually louder than needed |
| `/about/` | 151/135 | 760 | Prose alignment was sound but lacked identity imagery | Korean skills block became compact and dense | None; needed stronger identity signal |
| `/ko/` | 500/187 | 1040 | Same low text-only Hero as English | Long Korean question increased Hero imbalance | Repeated current-focus explanation |
| `/ko/research/` | 151/135 | 1040 | Wide container rendered as a narrow text sequence | Most severe Korean text-wall case | Repeated labels and full detail for every theme |
| `/ko/projects/` | 151/135 | 1040 | Project evidence had no visual hierarchy | Tags and metadata compressed on mobile | Repeated selected-project framing |
| `/ko/blog/` | 203/187 | 1040 | Same 52px title-grid offset as English | Empty state used excessive vertical space | Empty discovery space |
| `/ko/papers/` | 183/183 | 1180 | App shell was structurally clear | Korean subnav labels were clipped in the horizontal rail | Full method panel before any records |
| `/ko/growth/` | 183/183 | 1180 | Evidence gate was truthful but visually sparse | Panel and background were too similar in dark mode | Secondary methodology emphasis |
| `/ko/about/` | 151/135 | 760 | Prose grid matched English | Long value statements needed more breathing room | None; needed an identity device without a fake portrait |

## System Findings

- Header height was consistently 69px, but primary navigation included Home and could not express the intended brand-as-home hierarchy.
- Desktop title X positions varied correctly by container width, while title Y positions did not: Writing was 52px below other editorial pages.
- At 768px the site switched abruptly from full navigation to a compact header; the header remained stable but the relationship between utility controls and the menu was weak.
- Unicode theme glyphs changed optical weight and baseline between light and dark modes.
- Light and dark surfaces used too few hierarchy levels.
- The site had no meaningful media, so wide layouts looked sparse while long pages looked dense.

## Redesign Response

V3 uses one gutter scale, four named container widths, 480/768/1024/1280 breakpoints, SVG theme icons, a five-item primary navigation, shared page shells, and a single coherent media system. Homepage repetition is removed and application illustrations appear only in evidence-gated onboarding states.
