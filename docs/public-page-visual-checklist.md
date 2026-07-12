# Public Page Visual Checklist

Audit date: 2026-07-12

This checklist covers every public route family in English and Korean. A route does not need an image merely to fill space: media is required where it identifies a real subject, explains a technical idea, or shows project evidence. Empty states remain text-led.

## Global Acceptance

- [ ] Review every route at 1440×1000, 1024×768, 390×844, and 360×800.
- [ ] Review light and dark themes in English and Korean.
- [ ] Keep one visible `h1`, semantic landmarks, visible focus, and zero axe violations.
- [ ] Keep document-level horizontal overflow at 0–1px.
- [ ] Give every raster image intrinsic width and height, useful alt text, and responsive sources.
- [ ] Ensure image crops retain their subject at every supported viewport.
- [ ] Keep generated concept scenes labeled honestly in alt text and documentation.
- [ ] Keep technical diagrams localized; do not render English labels at Korean URLs.
- [ ] Use actual evidence for project media and avoid unsupported performance claims.
- [ ] Center numbered markers optically and mathematically, not by text baseline alone.
- [ ] Keep all diagrams understandable without color and without connector lines.
- [ ] Avoid client-side graph libraries when a static build-time layout is sufficient.

## Route Audit

| Route family | EN / KO | Media decision | Baseline finding | Required correction | Status |
| --- | --- | --- | --- | --- | --- |
| Home | `/`, `/ko/` | Required: one concrete research scene | Hero was text-only despite approved-quality candidates | Publish responsive Hero media; preserve identity and next-section visibility | In progress |
| About | `/about`, `/ko/about` | No fabricated portrait | Honest text page; no verified portrait exists | Keep text-led and verify spacing, links, and mobile rhythm | Pending QA |
| Research | `/research`, `/ko/research` | Required: VLA scene plus two localized technical diagrams | Three long text sections had no visual explanation | Pair each question with distinct, reviewed media | In progress |
| Projects index | `/projects`, `/ko/projects` | Required: actual project evidence | Project entries had no evidence or visual anchor | Add responsive repository/site evidence without card nesting | In progress |
| `gnaroshi_vla` detail | `/projects/gnaroshi-vla/`, KO equivalent | Required: actual repository/run evidence | Detail was prose-only | Add verified tree/config/manifest/terminal composite | In progress |
| `gnaroshi.dev` detail | `/projects/gnaroshi-dev/`, KO equivalent | Required: real site evidence plus architecture diagram | Evidence was absent and repository workflow read as stacked cards | Add current evidence and a clear directed flow diagram | In progress |
| Writing | `/blog`, `/blog/archive`, KO equivalents | Feed-owned media only | Bootstrap-empty state has no public posts | Keep focused empty state; do not invent covers | Pending QA |
| Papers | `/papers`, `/ko/papers` | No large image while empty | Honest onboarding state | Keep one action and verify method readability | Pending QA |
| Activity | `/growth`, `/ko/growth` | No graph before eligibility | Evidence-gated empty state | Keep non-numeric and verify contrast/hierarchy | Pending QA |
| Now | `/now`, `/ko/now` | Optional, not needed | Current structured text is sufficient | Verify date, hierarchy, and mobile wrapping | Pending QA |
| Contact | `/contact`, `/ko/contact` | Not needed | Link-led page | Verify no empty links and one clear contact path | Pending QA |
| Paper tools | Queue, Reviews, Formula, Questions, Implementations | No decorative media when empty | Focused empty states | Verify one primary action and no hydrated empty island | Pending QA |
| Insights | Graph and Week routes | No graph/review imagery before evidence | Evidence-gated empty states | Verify no false graph or weekly achievement | Pending QA |
| 404 | `/404`, `/ko/404` | Not needed | Text recovery page | Verify noindex, useful links, and locale parity | Pending QA |

## Workflow Diagram

- [ ] Use the website-owned six-repository facts model as the only input.
- [ ] Use Dagre at build time for deterministic node placement.
- [ ] Emit no browser JavaScript for the diagram.
- [ ] Show Paper Lab and Writing converging on Studio.
- [ ] Show the API as an optional dashed side branch.
- [ ] Show Studio publishing to the public feed, then the website.
- [ ] Keep private repositories non-interactive and public repositories linked only in the details below.
- [ ] Provide a plain-text ordered fallback for screen readers.
- [ ] Use a horizontal desktop layout and a vertical mobile layout.
- [ ] Center all step numbers with SVG `text-anchor="middle"` and `dominant-baseline="central"`.

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
