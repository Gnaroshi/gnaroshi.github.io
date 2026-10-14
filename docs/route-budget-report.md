# Route Budget Report

Measured on the selected public feed during immersive-scene QA on 2026-10-15. Asset sizes come from `npm run performance:report`; unused CSS, LCP, and CLS come from `npm run test:performance`. These are local synthetic results, not field measurements.

| Route | CSS gzip | Initial JS gzip | Eager image files | React islands | Unused CSS | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 11.2 KB | 6.0 KB | 7.6 KB | 0 | 59.3% | 40 ms | 0.000 |
| `/about/` | 7.8 KB | 5.9 KB | 291.8 KB | 0 | 56.4% | 28 ms | 0.000 |
| `/research/` | 8.8 KB | 12.6 KB | 7.6 KB | 0 | 50.4% | 32 ms | 0.000 |
| `/projects/` | 8.4 KB | 4.3 KB | 12.5 KB | 0 | 47.3% | 48 ms | 0.000 |
| `/blog/` | 6.4 KB | 2.7 KB | 7.6 KB | 0 | 67.5% | 32 ms | 0.000 |
| `/ko/research/` | 8.8 KB | 12.6 KB | 7.6 KB | 0 | 49.7% | 28 ms | 0.000 |
| `/growth/` | 8.1 KB | 2.7 KB | 7.6 KB | 0 | 70.8% | 60 ms | 0.000 |

Initial JS measures directly referenced scripts/module preloads, not lazy engine chunks. The four core spatial scenes now import Three.js when visible; the separate About identity renderer initializes after the third explicit activation and shares that engine chunk. Eager image-file totals are build-time declarations, not a complete browser network trace; Research requests the selected responsive media separately. The empty Reading index is a compatibility redirect, so the Korean Research destination replaces it in the seven-route budget set.

## Actual First-Viewport JS

At 390 x 844, browser request tracing includes the dynamically imported renderer and shared Three.js engine, not only HTML script references. Identical EN/KO routes reuse identical module URLs. Gzip below is a local estimate from requested built files, not a claim about CDN transfer encoding or cache hits.

| Core route, either locale | Requested JS raw | Gzip estimate | Modules | Scene draw calls |
| --- | ---: | ---: | ---: | ---: |
| Home | 557.6 KB | 143.0 KB | 9 | 7 |
| Research | 569.2 KB | 147.3 KB | 8 | 3 |
| Projects | 548.0 KB | 139.0 KB | 7 | 7 |
| About | 551.4 KB | 140.6 KB | 8 | 1 |

This cost is an explicit tradeoff for the owner's requested real 3D interaction. There are no remote scene assets, HDR maps, postprocessing, added animation libraries, or core-page React islands. Long-form and tool routes do not import this scene. Rendering uses 24 FPS desktop / 20 FPS mobile, capped DPR, bounded introductory/input motion, persistent pause, offscreen/background stop, and disposal on navigation. No GPU or reduced-motion fallbacks remain complete.

Unused CSS was measured with Chromium coverage; rerun the browser checks when route composition changes. No blanket budget increase was made to hide a failure.
LCP and CLS are synthetic local checks. The 200 ms INP value remains a field target because a static build cannot produce representative real-user INP.
