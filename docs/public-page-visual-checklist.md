# Public Page Visual Checklist

Audit date: 2026-07-12

This checklist covers every public route family in English and Korean. A route does not need an image merely to fill space: media is required where it identifies a real subject, explains a technical idea, or shows project evidence. Empty states remain text-led.

## Global Acceptance

- [x] Review every route at 1440×1000, 1024×768, 390×844, and 360×800.
- [x] Review light and dark themes in English and Korean.
- [x] Keep one visible `h1`, semantic landmarks, visible focus, and zero axe violations.
- [x] Keep document-level horizontal overflow at 0–1px.
- [x] Give every raster image intrinsic width and height, useful alt text, and responsive sources.
- [x] Ensure image crops retain their subject at every supported viewport.
- [x] Keep generated concept scenes labeled honestly in alt text and documentation.
- [x] Keep technical diagrams localized; do not render English labels at Korean URLs.
- [x] Use actual evidence for project media and avoid unsupported performance claims.
- [x] Center numbered markers optically and mathematically, not by text baseline alone.
- [x] Keep all diagrams understandable without color and without connector lines.
- [x] Avoid client-side graph libraries when a static build-time layout is sufficient.

## Route Audit

| Route family | EN / KO | Media decision | Baseline finding | Required correction | Status |
| --- | --- | --- | --- | --- | --- |
| Home | `/`, `/ko/` | Required: one concrete research scene | Hero was text-only despite approved-quality candidates | Publish responsive Hero media; preserve identity and next-section visibility | Complete |
| About | `/about`, `/ko/about` | No fabricated portrait | Honest text page; no verified portrait exists | Keep text-led and verify spacing, links, and mobile rhythm | Complete |
| Research | `/research`, `/ko/research` | Required: VLA scene plus two localized technical diagrams | Three long text sections had no visual explanation | Pair each question with distinct, reviewed media | Complete |
| Projects index | `/projects`, `/ko/projects` | Required: actual project evidence | Project entries had no evidence or visual anchor | Add responsive repository/site evidence without card nesting | Complete |
| `gnaroshi_vla` detail | `/projects/gnaroshi-vla/`, KO equivalent | Required: actual repository/run evidence | Detail was prose-only | Add verified tree/config/manifest/terminal composite | Complete |
| `gnaroshi.dev` detail | `/projects/gnaroshi-dev/`, KO equivalent | Required: real site evidence plus architecture diagram | Evidence was absent and repository workflow read as stacked cards | Add current evidence and a clear directed flow diagram | Complete |
| Writing | `/blog`, `/blog/archive`, KO equivalents | Feed-owned media only | Bootstrap-empty state has no public posts | Keep focused empty state; do not invent covers | Complete |
| Reading | `/papers`, `/ko/papers` | No large image while empty | Honest onboarding state | Keep one action and verify method readability | Complete |
| Activity | `/growth`, `/ko/growth` | No graph before eligibility | Evidence-gated empty state | Keep non-numeric and verify contrast/hierarchy | Complete |
| Now | `/now`, `/ko/now` | Optional, not needed | Current structured text is sufficient | Verify date, hierarchy, and mobile wrapping | Complete |
| Contact | `/contact`, `/ko/contact` | Not needed | Link-led page | Verify no empty links and one clear contact path | Complete |
| Paper tools | Queue, Reviews, Reviews due, Formula, Questions, Implementations | No decorative media when empty | Focused empty states | Verify one primary action and no hydrated empty island | Complete |
| Insights | Graph and Week routes | No graph/review imagery before evidence | Evidence-gated empty states | Verify no false graph or weekly achievement | Complete |
| 404 | `/404`, `/ko/404` | Not needed | Text recovery page | Verify noindex, useful links, and locale parity | Complete |

## Workflow Diagram

- [x] Use the website-owned six-repository facts model as the only input.
- [x] Use Dagre at build time for deterministic node placement.
- [x] Emit no browser JavaScript for the diagram.
- [x] Show Paper Lab and Writing converging on Studio.
- [x] Show the API as an optional dashed side branch.
- [x] Show Studio publishing to the public feed, then the website.
- [x] Keep private repositories non-interactive and public repositories linked only in the details below.
- [x] Provide a plain-text ordered fallback for screen readers.
- [x] Use a horizontal desktop layout and a vertical mobile layout.
- [x] Center all step numbers with SVG `text-anchor="middle"` and `dominant-baseline="central"`.

## Completion Evidence

The checklist is complete only after:

- `npm run media:check`
- `npm run check`
- `npm run check:i18n`
- `npm run build`
- `npm run check:links`
- `npm run test:e2e`
- `npm run test:a11y`
- `npm run test:visual`
- `npm run test:performance`
- manual review of the final contact sheets

Completed on 2026-07-12:

- 54 English/Korean routes reviewed in 432 screenshots across four viewport sizes and two themes.
- 24 workflow-only screenshots reviewed across English/Korean, three viewport sizes, and two themes.
- 55 accessibility tests passed with no automatically detectable violations.
- 91 functional browser tests, 32 visual tests, 7 performance tests, and 17 feed-contract fixtures passed.
- 48 approved AVIF/WebP outputs validated for eight reviewed source assets.
- The workflow number-centering test measures each SVG label against its circle center on desktop and mobile.
- Paper navigation now exposes direct, evidence-backed destinations instead of independently open disclosure menus.
- The three-pass method is an unframed ordered sequence rather than nested cards, with centered numbered markers at every viewport.
- All eight current project records render in English and Korean; private repository URLs remain omitted.
- Empty About, Writing, Reading, Activity, paper-tool, insight, Contact, and 404 states intentionally remain image-free when no truthful subject or public evidence exists.
