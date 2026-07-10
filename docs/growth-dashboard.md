# Growth Dashboard

## Route

`/growth` is the public research momentum dashboard. It renders statically during the Astro build and does not call a backend, GitHub API, or AI API in the browser.

After public score eligibility, the page shows:

- Research Momentum Score v2 and level.
- Separate confidence score and reasons.
- Six-component score breakdown.
- Component evidence and component confidence.
- Integrity flags when volume, burstiness, or depth claims need capping.
- Missing evidence without converting it to hidden zeroes.
- Up to three concrete next actions.
- An expandable calculation summary.

Before eligibility it instead shows:

- `Collecting evidence`;
- progress toward five events, three dates, two categories, and one core research-loop category;
- Read / Recall / Build / Write paths;
- up to three evidence-producing next actions;
- no numeric score or level.

## Data Flow

`src/utils/momentumData.ts` assembles build-time public data from:

- public, non-draft paper logs;
- public AI paper reviews mapped to public papers;
- generated oral exam JSON;
- optional day-level GitHub contribution JSON;
- public blog posts;
- public projects and dated project updates;
- public implementation attempts;
- paper review schedules and committed review history;
- generated formula recall scores;
- committed question-bank practice state.

The normalized input is passed to `computeResearchMomentum()` in `src/utils/momentumScore.ts`.

## Visibility

Public aggregate rules are strict:

- `public` content can contribute.
- `unlisted` content can have a detail page but does not contribute to public growth aggregates.
- `hidden` content does not contribute.
- Draft paper and blog content does not contribute.
- A public AI review must map to a public paper log.
- `contentStage: "seed"` never contributes.
- `metricEligible: false` never contributes.

Visibility is not privacy. Never commit confidential research data to this public repository.

## Missing Sources

Empty source arrays mean no usable public evidence. The score engine marks a whole component unavailable when it has no usable sub-source. If one output sub-source exists and another is missing, the available output sub-scores are reweighted within the component and confidence is reduced.

This prevents an unconfigured GitHub import or an early lack of oral exams from pretending to be poor performance.

## Verification

Run:

```bash
npm run score:test
npm run check
npm run build
```

The score tests cover no data, paper-only evidence, commit spam, distributed reading, a balanced loop, unsupported deep labels, mature logs without oral exams, and improvement in a weak retrieval dimension.
