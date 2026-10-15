# Route Budget Report

Measured on the pinned public feed during content-led QA on 2026-10-15, after removing automatic introductory renderers and correcting Research's cold-load layout shift. Asset sizes come from `npm run performance:report`; unused CSS, LCP, and CLS come from Chromium route-budget tests. These are local synthetic results, not field measurements.

| Route | CSS gzip | Initial JS gzip | Eager image files | React islands | Unused CSS | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 11.0 KB | 4.3 KB | 7.6 KB | 0 | 60.3% | 52 ms | 0.000 |
| `/about/` | 7.8 KB | 4.1 KB | 291.8 KB | 0 | 57.5% | 48 ms | 0.000 |
| `/research/` | 9.0 KB | 11.0 KB | 7.6 KB | 0 | 49.4% | 48 ms | 0.000 |
| `/projects/` | 8.5 KB | 2.7 KB | 12.5 KB | 0 | 45.5% | 64 ms | 0.000 |
| `/blog/` | 6.4 KB | 2.7 KB | 7.6 KB | 0 | 67.5% | 36 ms | 0.000 |
| `/ko/research/` | 9.0 KB | 11.0 KB | 7.6 KB | 0 | 48.8% | 52 ms | 0.000 |
| `/growth/` | 8.1 KB | 2.7 KB | 7.6 KB | 0 | 70.8% | 72 ms | 0.000 |

Initial JS measures directly referenced scripts/module preloads, not lazy engine chunks. The core pages no longer import Three.js on entry; only the third explicit About identity activation requests it. Home uses native CSS perspective. Eager image-file totals are build-time declarations, not a complete browser network trace; Research requests responsive media separately, and Projects instantiates inactive scenario images only after selection. The empty Reading index is a compatibility redirect, so the Korean Research destination replaces it in the seven-route budget set.

## Runtime Boundaries

Browser request tracing checks dynamic imports as well as HTML script references. Ordinary entry to Home, About, Research and Projects does not request Three.js or initialize a canvas. Identical EN/KO routes reuse module URLs. Home's native CSS perspective has no engine or idle render loop; Projects fetches inactive captures only when requested. Inert template image declarations are excluded from eager-file totals because the browser does not instantiate them.

About's third explicit activation loads the approved identity relief and a separate large engine chunk. This remains an opt-in cost, not part of ordinary page entry. Its draw-call/DPR bounds, rest/offscreen stop and disposal remain tested. No remote scene assets, HDR maps, postprocessing, new animation library or core-page React island is added. See [the QA record](content-led-qa-2026-10-15.md) for development/production input-work comparisons and their limitations; a frame cap is not used as proof of optimization.

Unused CSS was measured with Chromium coverage; rerun the browser checks when route composition changes. No blanket budget increase was made to hide a failure.
LCP and CLS are synthetic local checks. The 200 ms INP value remains a field target because a static build cannot produce representative real-user INP.
