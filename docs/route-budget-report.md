# Route Budget Report

Measured on the selected public feed during the owner-feedback QA on 2026-10-14. Asset sizes come from `npm run performance:report`; unused CSS, LCP, and CLS come from `npm run test:performance`. These are local synthetic results, not field measurements.

| Route | CSS gzip | Initial JS gzip | Eager image files | React islands | Unused CSS | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 11.1 KB | 4.4 KB | 124.5 KB | 0 | 59.3% | 44 ms | 0.000 |
| `/about/` | 7.7 KB | 4.2 KB | 291.8 KB | 0 | 57.7% | 28 ms | 0.000 |
| `/research/` | 8.6 KB | 10.9 KB | 7.6 KB | 0 | 51.6% | 48 ms | 0.087 |
| `/projects/` | 8.2 KB | 2.7 KB | 12.5 KB | 0 | 47.7% | 56 ms | 0.000 |
| `/blog/` | 6.4 KB | 2.7 KB | 7.6 KB | 0 | 67.5% | 36 ms | 0.000 |
| `/ko/research/` | 8.6 KB | 10.9 KB | 7.6 KB | 0 | 50.9% | 40 ms | 0.074 |
| `/growth/` | 8.1 KB | 2.7 KB | 7.6 KB | 0 | 70.8% | 68 ms | 0.000 |

Initial JS measures directly referenced scripts/module preloads, not lazy engine chunks. About's Three.js identity engine still loads only after the third explicit activation. Eager image-file totals are build-time declarations, not a complete browser network trace; Research requests the selected responsive media separately. The empty Reading index is now a compatibility redirect, so the Korean Research destination replaces it in the seven-route budget set.

Unused CSS was measured with Chromium coverage; rerun the browser checks when route composition changes. No blanket budget increase was made to hide a failure.
LCP and CLS are synthetic local checks. The 200 ms INP value remains a field target because a static build cannot produce representative real-user INP.
