# Media Rebuild Audit

Audit date: 2026-07-12

The previous system favored a shared abstract visual grammar over immediate subject recognition. Stage 1 removes those assets from rendered public pages but leaves the files in place for an auditable rollback. Functional icons and the favicon are unaffected.

| ID / file | Type | Current route or use | Intended meaning | Understandable without copy? | Decision | Replacement type |
| --- | --- | --- | --- | --- | --- | --- |
| `home-research-constellation-{480,768,1200,1600}.{avif,webp}` | Generated raster family | Home Hero | Reading, reasoning, code, and experiments | No; the objects are ambiguous | Replace; production reference removed | Concept scene |
| `research-vla.svg` | Content SVG | Research; also reused by the VLA project | Observation/language/state/action | No; abstract blocks do not depict a task | Replace; production reference removed | Dedicated VLA concept scene |
| `research-efficient-systems.svg` | Content SVG | Research | Cached state and lightweight updates | Only with surrounding text | Replace; production reference removed | Labeled technical explanation |
| `research-workflow.svg` | Content SVG | Research | Read, recall, check, revisit, output | Only with surrounding text | Replace; production reference removed | Labeled process diagram |
| `project-gnaroshi-dev.svg` | Content SVG | Projects | Private-to-public publishing architecture | Partly, but not the actual project | Replace; production reference removed | Real project evidence |
| `paper-lab-cycle.svg` | Content SVG | Home and empty Paper Lab | Paper reading workflow | Partly, but it overstates an empty public record | Remove from empty states | No large image |
| `growth-evidence.svg` | Content SVG | Ineligible Growth state | Evidence streams | No; it resembles a graph before evidence exists | Remove from empty state | No large image |
| `blog-cover-paper-reading.svg` | Content SVG, unused | Writing fallback family | Paper reading | No | Remove in Stage 2 unless a real post needs it | Feed-owned post media or none |
| `blog-cover-research-systems.svg` | Content SVG, unused | Writing fallback family | Research systems | No | Remove in Stage 2 | Feed-owned post media or none |
| `blog-cover-implementation-notes.svg` | Content SVG, unused | Writing fallback family | Implementation notes | No | Remove in Stage 2 | Feed-owned post media or none |
| `blog-cover-ai-workflow.svg` | Content SVG, unused | Writing fallback family | AI workflow | No | Remove in Stage 2 | Feed-owned post media or none |

## Duplication And Reuse

- The Home raster files are responsive encodings of one source, not conceptual duplicates.
- `research-vla.svg` is reused for `projectGnaroshiVla`; this is unrelated-purpose reuse and must end.
- The four Blog covers share a style but are currently unused and do not identify real posts.
- There are no real project screenshots in `public/media/`.
- There are no functional icons in `public/media/`; functional icons and `public/favicon.svg` are outside this removal.

## Stage 1 Production State

- Home Hero, selected project, and Research Loop are temporarily typography-only.
- Research questions are temporarily typography-only.
- Project list and detail pages are temporarily typography-only.
- Zero-paper Paper Lab and ineligible Growth states no longer render large illustrations.
- No candidate file under `media-sources/` is imported by production code.

Legacy files remain on disk until Stage 2 so rollback is a source-control operation rather than asset recovery. `npm run media:check` fails if production code begins referencing them again.
