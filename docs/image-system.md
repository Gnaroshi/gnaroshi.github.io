# Image System

## Direction

Images support explanation, not decoration. The visual language uses editorial technical diagrams, tactile neutral paper, charcoal linework, research green, muted blue, and a small amber signal. It avoids portraits, stock photography, robot imagery, neon effects, and text embedded in generated artwork.

`src/data/mediaManifest.ts` is the public asset registry. It records route, purpose, localized alt text, aspect ratio, source, provenance, focal point, and loading priority.

## Assets

| ID | Route | Aspect | Format | Purpose |
| --- | --- | --- | --- | --- |
| `home-research-constellation` | Home | 5:4 | AVIF/WebP | Connected papers, diagrams, code, and experiment traces |
| `research-vla` | Research | 4:3 | SVG | Observation/language/state/action structure |
| `research-efficient-systems` | Research | 4:3 | SVG | Cached state and lightweight update paths |
| `research-workflow` | Research | 4:3 | SVG | Read, recall, critique, implement, revisit loop |
| `project-gnaroshi-dev` | Projects | 16:10 | SVG | Studio to private sources to public feed to website |
| `paper-lab-cycle` | Paper Lab | 16:10 | SVG | Reading and review workflow onboarding |
| `growth-evidence` | Growth | 16:10 | SVG | Evidence streams converging into a timeline |
| `blog-cover-*` | Writing | 16:9 | SVG | Reusable series cover family |

## Hero Generation

The homepage hero is original artwork generated for Gnaroshi on 2026-07-11 with OpenAI image generation. The production prompt requested an overhead editorial research workspace containing connected papers, subtle formula marks, a code notebook, evidence cards, and experiment traces. It explicitly excluded people, fake portraits, logos, readable text, robot heads, neon, gradients, and stock-photo styling.

Responsive outputs are available at 480, 768, 1200, and 1600 pixels in AVIF and WebP. The 768-pixel AVIF is preloaded with a responsive `imagesrcset`; below-fold SVGs use lazy loading and explicit dimensions.

## Dark Mode

The generated hero uses a controlled neutral palette that remains legible on a dark surface without inversion. SVG diagrams contain their own neutral canvas and do not glow or depend on page background colors. A separate dark asset should be added only when a future image loses information against the dark shell.

## Performance

- Preload only the homepage hero.
- Keep all below-fold media lazy-loaded.
- Preserve explicit width, height, and aspect ratio to avoid layout shift.
- The selected hero source is 28–232 KB depending on viewport and format; initial image transfer remains below the 500 KB target.
- Reuse the blog cover family instead of generating a unique image for every short note.
