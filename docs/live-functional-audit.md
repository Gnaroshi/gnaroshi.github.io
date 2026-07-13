# Live Functional Audit

Audit date: 2026-07-13 (Asia/Seoul)

## Deployment Baseline

The live site was current before UI changes began. No stale artifact or custom-domain cache issue was found.

| Item | Recorded value |
| --- | --- |
| `origin/main` | `4d0acde4627ff7f22fd0123b9d7589cc09bdb8a7` |
| Audit branch baseline | `aeadeb98a5c6f62ae6d0bd88b861a0241e7dadc7` |
| Live website commit | `4d0acde4627ff7f22fd0123b9d7589cc09bdb8a7` |
| Live content-feed commit | `0a2b5c5cdaf283e344d896142aedb565659d26f9` |
| Local content-feed commit | `0a2b5c5cdaf283e344d896142aedb565659d26f9` |
| Live content hash | `9ea450911265f1364623fc4c023952e2c6fc70f19560fad9710fe44a0307d261` |
| Pages workflow run | `29204932506` |
| Pages deployment | `5415303786` |
| Custom domain | `https://gnaroshi.dev` returned HTTP 200 from GitHub Pages |

Local and live baseline inventory covered 54 routes at 1440×1000 and 390×844. It recorded 216 page loads with no HTTP failure, console error, failed request, or horizontal overflow. Local and live control signatures matched.

## Verified Issues

| Issue | Evidence | Resolution |
| --- | --- | --- |
| Reading Method appeared to do nothing | The hash changed, but focus stayed on `body`, the local item had no active state, and the sticky navigation scrolled away. | Added shared same-page anchor handling, target focus, `aria-current="location"`, sticky local navigation, shared scroll offsets, and reduced-motion handling. |
| Active navigation remained a self-link | Current primary, utility, and Reading overview items were links to the current page. | Current items now render as non-interactive labels with `aria-current="page"`. |
| Outside-click mobile close lost focus | The pointer target took focus after the drawer closed. | Focus restoration now runs on the next animation frame after closing. |
| `Papers` could imply authored publications | The term appeared in global/local navigation and recovery copy. | Public labels now use Reading / 논문 읽기 and Paper Reading Notes / 논문 읽기 기록. Routes remain unchanged. |
| Review language was too evaluative | Public labels included AI Review, Oral Exam, score trend, and weak dimension. | Public labels now use Note Review, Recall Practice, Review Result, Activity Over Time, and Area to Revisit. Internal schema names remain stable. |
| Project type was not immediately visible | Research, application, and infrastructure cards relied on section placement. | Added visible type labels, role icons, text labels, and restrained type accents. |
| Product and Studio integration status were conflated | Integration language could appear as the main status. | Product status is the primary card/detail status; Studio integration appears only in secondary technical facts. |
| Korean project copy contained mechanical mixed-language phrases | Examples included broken particles and translated stable IDs. | Rewrote public Korean project stories, restored stable IDs, and retained technical proper nouns only where useful. |
| Blog discovery controls could duplicate content | Search results and the static list could coexist at the discovery threshold. | Below six posts the page is chronological only; search begins at six, archive at twelve, without a duplicate static list. |

## Interaction Inventory

Rows group routes only when they render the same component and produce the same behavior. Both locales were checked. Desktop means 1440×1000; tablet means 768×1024; mobile means 390×844 unless noted.

| Routes / locale / viewport | Accessible control | Type | Expected and observed result | URL or DOM transition | Keyboard | Result |
| --- | --- | --- | --- | --- | --- | --- |
| All standard EN/KO routes, desktop | `Gnaroshi Home` | Link | Navigate to locale home | current route → `/` or `/ko/` | Enter | Pass |
| All standard EN/KO routes, desktop | Primary navigation | Links/current label | Navigate to Research, Projects, Reading, About; current destination is a label | route changes; current item gains `aria-current="page"` | Tab + Enter | Pass |
| All standard EN/KO routes, desktop | Theme switch | Button | Toggle theme, persist preference, update theme-color | `html[data-theme]`, localStorage, and meta content change | Space/Enter | Pass |
| All standard EN/KO routes | Language | Links | Preserve counterpart route and query when a counterpart exists; otherwise use collection index | EN path ↔ `/ko/` path | Enter | Pass |
| All standard EN/KO routes, mobile | Menu / 메뉴 | Button + drawer | Open, trap focus, lock body; Escape or outside click closes and restores focus | `hidden`, `aria-expanded`, body class change | Enter, Tab, Shift+Tab, Escape | Pass |
| All standard EN/KO routes | Skip to content | Same-page link | Expose and focus `main#content` | hash becomes `#content`; focus moves to main | Enter | Pass |
| `/`, `/ko/` | Research, Writing when eligible, project and architecture links | Links | Navigate once to the named destination | pathname/hash changes | Enter | Pass |
| `/projects/`, `/ko/projects/` | Project media, title, details | Links | Open the same project detail; decorative duplicate media link stays out of the tab order | index → localized detail | Title/details links keyboard accessible | Pass |
| All 16 project details, EN/KO | Back to Projects | Link | Return to localized project index | detail → index | Enter | Pass |
| Public project links | External links | Link | Open only verified public repository/live destinations | valid HTTPS destination | Enter | Pass |
| Project workflow sections | Disclosure | `details/summary` where present | Expand/collapse technical detail without changing unrelated sections | `open` toggles | Enter/Space | Pass |
| `/blog/`, `/ko/blog/` with bootstrap feed | Recovery action | Link | Keep one meaningful path; no search, tags, archive promotion, or duplicated list | blog → Research | Enter | Pass |
| Blog routes with 1–5/6–11/12+ fixture evidence | List/search/archive | Static list or React controls | Reveal controls only at their evidence threshold | result count/list changes only when enough posts exist | Labels and controls keyboard accessible | Pass |
| `/papers/`, `/ko/papers/`, all three viewports | Reading method / 읽는 방법 | Same-page link | Update hash, place target below both sticky bars, focus target, mark local item current | no hash → `#reading-method`; `#reading-method` focused | Enter | Pass |
| Direct `/papers/#reading-method`, `/ko/papers/#reading-method` | Direct hash | URL target | Correct position and focus after load | target focused on first frame | Browser navigation | Pass |
| `/papers/`, `/ko/papers/` bootstrap feed | Overview and onboarding | Current label + one link | Overview is not a no-op link; no stats, filters, template, reviews, or trends appear | one current label; one onboarding action | Normal tab order | Pass |
| Reading with fixture evidence | Notes, filters, review/practice links | Links/React controls | Appear only when public counts cross their gates | filtered list and selected date change | Keyboard labels retained | Pass |
| `/growth/` and empty tool routes | One recovery action | Link | No zero dashboards or hydrated empty islands; one next action | tool route → Reading | Enter | Pass |
| `/404.html` | Home, Projects, Reading | Links | Recover without a loop; path and language-aware copy update | missing route → selected destination | Enter | Pass |
| `/ko/404/` | Standard header and recovery links | Links | Use the Korean shell and Korean destinations | localized navigation | Enter | Pass |

## Intentional 404 Exception

GitHub Pages serves the single English `404.html` artifact for every unknown path. That artifact detects whether the requested path begins with `/ko/` and swaps the recovery copy. It intentionally uses minimal chrome so an unknown Korean URL never displays an English global navigation bar. The explicit `/ko/404/` route uses the standard Korean shell. Static navigation checks cover every standard shell; dedicated 404 tests cover the three recovery destinations and locale detection.

## Regression Coverage

- `scripts/check-public-copy.mjs` blocks developer copy and retired public labels in built HTML.
- `scripts/check-navigation-consistency.mjs` compares primary and utility capability signatures across all built shells and both locales.
- `tests/e2e/interaction-audit.spec.ts` verifies observable button behavior, same-page anchors, Reading Method, mobile focus restoration, project type/status separation, and evidence-gated empty Reading.
- `tests/e2e/navigation-consistency.spec.ts` checks navigation on every QA route and documents the shared-404 exception.
- `tests/e2e/public-capabilities.spec.ts` covers bootstrap, writing, paper, review, recall, implementation, Growth, graph, and full-system fixtures in both locales.
