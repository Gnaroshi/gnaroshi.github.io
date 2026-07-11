# Route Budget Report

Generated from the production `dist/` artifact by `npm run performance:report`.

| Route | Kind | CSS gzip | JS gzip | Initial images | Islands | Unused CSS baseline | Stylesheets |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | home | 4.1 KB | 0.0 KB | 131.8 KB | 0 | 47% | BaseLayout.DX3VdqqX.css |
| `/about/` | editorial | 4.1 KB | 0.0 KB | 0.0 KB | 0 | 46.3% | BaseLayout.DX3VdqqX.css |
| `/research/` | editorial | 4.1 KB | 0.0 KB | 0.0 KB | 0 | 46.9% | BaseLayout.DX3VdqqX.css |
| `/projects/` | editorial | 4.1 KB | 0.0 KB | 0.0 KB | 0 | 47.3% | BaseLayout.DX3VdqqX.css |
| `/blog/` | editorial | 4.1 KB | 0.0 KB | 0.0 KB | 0 | 60.1% | BaseLayout.DX3VdqqX.css |
| `/papers/` | application-empty | 7.1 KB | 0.0 KB | 0.0 KB | 0 | 64.8% | BaseLayout.DX3VdqqX.css, papers.C6xq53VY.css |
| `/growth/` | application-empty | 5.8 KB | 0.0 KB | 0.0 KB | 0 | 60.5% | BaseLayout.DX3VdqqX.css, insights.DA561tOH.css |

Unused CSS baselines were measured with Chromium coverage in `npm run test:performance`; rerun that command when route composition changes.
LCP and CLS are synthetic local checks. The 200 ms INP value remains a field target because a static build cannot produce representative real-user INP.
