# Image Semantic Review

## Gate

Score each candidate from 0 to 5 for semantic clarity, page relevance, focal hierarchy, credibility, responsive crop, and visual quality.

Reject when semantic clarity, page relevance, or credibility is below 4, or when the total is below 25/30. Passing the numeric gate does not approve a candidate; explicit owner approval by candidate ID is required.

| Candidate | Clarity | Relevance | Hierarchy | Credibility | Crop | Quality | Total | Stage 1 result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `home-hero-a` | 5 | 5 | 5 | 3 | 4 | 4 | 26 | Reject: photographic result and prominent generated writing |
| `home-hero-b` | 5 | 5 | 4 | 3 | 4 | 4 | 25 | Reject: pseudo-writing dominates paper and notebook |
| `home-hero-c` | 5 | 5 | 5 | 4 | 5 | 5 | 29 | Threshold pass; explicit review still required |
| `research-vla-a` | 5 | 5 | 5 | 4 | 4 | 5 | 28 | Threshold pass; trajectory direction is ambiguous |
| `research-vla-b` | 5 | 5 | 5 | 5 | 5 | 5 | 30 | Threshold pass; explicit review still required |
| `research-vla-c` | 5 | 5 | 5 | 5 | 5 | 5 | 30 | Threshold pass; explicit review still required |
| `efficient-execution-en/ko` | 5 | 5 | 5 | 5 | 4 | 5 | 29 | Threshold pass; use locale pair and full-width placement |
| `research-workflow-en/ko` | 5 | 5 | 5 | 5 | 4 | 5 | 29 | Threshold pass; use locale pair and verify tablet labels |
| `project-gnaroshi-vla` | 4 | 5 | 4 | 5 | 4 | 4 | 26 | Threshold pass; sanity evidence only, no benchmark claim |
| `project-gnaroshi-dev` | 5 | 5 | 4 | 5 | 4 | 4 | 27 | Threshold pass; recapture after material layout changes |

## Contact Sheets

- `media-sources/contact-sheets/home-hero.png`
- `media-sources/contact-sheets/research-vla.png`
- `media-sources/contact-sheets/technical-diagrams.png`
- `media-sources/contact-sheets/project-evidence.png`

The development-only route `/dev/media-review/` shows exact EN/KO page copy, full candidates, desktop/tablet/mobile crops, a 160px thumbnail, scores, and rejection notes. Production builds emit no route or candidate asset.

## Approval State

No candidate is approved. Stage 2 is blocked until the owner provides approved IDs for the Home Hero and VLA scene and confirms the diagram/project evidence set.
