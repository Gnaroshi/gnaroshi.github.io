# Research Momentum Score v2

## Meaning

Research Momentum Score v2 is a directional summary of the public research loop recorded on `gnaroshi.dev`. It asks whether reading, understanding, retrieval, output, and revisiting are moving together over time.

The score measures research momentum. It does not measure intelligence, talent, employability, research potential, or personal worth. A low score can simply mean that evidence is private, unrecorded, old, or not yet available. Confidence must always be read next to the score.

The implementation is a pure TypeScript function:

```ts
computeResearchMomentum(input: MomentumInput): MomentumResult
```

It lives in `src/utils/momentumScore.ts`. Input and result types live in `src/types/momentum.ts`.

## Overall Formula

The six component weights total 100:

| Component | Weight |
| --- | ---: |
| Reading consistency | 25 |
| Understanding quality | 20 |
| Retrieval strength | 20 |
| Research output | 15 |
| Revisit discipline | 10 |
| Balance and integrity | 10 |

The overall score is the weighted average of available components. An unavailable component is not converted to zero. It is removed from the score denominator, added to `missingEvidence`, and reflected in lower confidence.

Confidence is calculated separately and never multiplied into the score.

Levels:

| Score | Level |
| --- | --- |
| 0-39 | seed |
| 40-59 | building |
| 60-74 | steady |
| 75-89 | strong |
| 90-100 | compounding |

## Reading Consistency

Primary window: 28 days. Secondary stability window: 90 days.

```text
45% active days
25% current streak
20% weekly distribution
10% depth appropriateness
```

- An active day requires at least one public, non-draft paper with a read date and a status other than `planned` or `abandoned`.
- The 28-day target is 20 active days.
- The streak contribution is capped at 14 days.
- Weekly distribution uses four seven-day buckets and rewards activity across weeks.
- Same-day paper volume above two is flagged and cannot create extra consistency credit.
- Pass 1 and skim are valid depth choices. The score rewards an honest status/depth match instead of demanding every paper become a deep read.

## Understanding Quality

The component uses the last 10 public AI reviews, weighted toward recent reviews.

```text
60% recent review average
20% depth-aware dimension coverage
10% difficulty-adjusted effort
10% self-score calibration
```

- Pass 1 reviews require problem framing, core idea, three-pass discipline, and note quality evidence. Missing formulas do not create a pass 3 penalty for an intentional skim.
- Pass 2 adds method and experiment evidence.
- Pass 3/deep work adds formula, critical thinking, research connection, and retrieval readiness.
- Hard papers can receive a small difficulty adjustment. Easy papers are not punished.
- Self-score calibration rewards closeness between self-assessment and AI review, not a high self-score by itself.
- Deep labels with weak method/formula evidence receive a mismatch penalty.
- High review scores attached to very thin notes are flagged.

Maturity rule:

- Fewer than five paper logs and no public reviews: unavailable; confidence only is reduced.
- Five or more paper logs and no public reviews: a low-confidence note-completeness estimate is used when possible, with a strong missing-evidence warning.

## Retrieval Strength

The component uses the last seven public oral exams, weighted toward recent exams.

```text
55% recent oral exam average
20% completion rate
15% improvement in weak question types
10% uncertainty quality
```

- Retrieval, explanation, and precision scores are used when an overall score is absent.
- Scores recorded on a 0-10 scale are normalized to 0-100.
- Honest uncertainty is rewarded through `uncertaintyScore`; saying “I do not know yet” is not treated as a failure by itself.
- Repeated question-type scores can demonstrate improvement in a previously weak dimension.
- With no oral exams the component is unavailable.
- At ten or more paper logs, missing oral exam evidence significantly lowers confidence.

## Research Output

Research output combines independently available sub-sources. A missing GitHub import does not silently become zero when writing or implementation evidence exists.

```text
35% GitHub active days
25% implementation and dated project updates
20% public writing
20% paper-to-output connections
```

- GitHub uses active days in the last 28 days, not raw commits.
- Contribution count is capped at four units per day and square-root scaled.
- A 20-commit day cannot become 20 times stronger than a one-commit day.
- Public posts in the last 90 days count as writing. A paper-to-blog promotion receives a small connection bonus.
- Implementation attempts in the last 90 days count when they record a result or lesson, including failed attempts.
- Explicit paper/project/blog/implementation links reward a connected research loop.

Optional static GitHub contribution data can be committed under `src/generated/github-contributions/`:

```json
{
  "days": [
    { "date": "2026-07-10", "count": 3, "visibility": "public" }
  ]
}
```

No GitHub token or browser API call is required by the dashboard.

## Revisit Discipline

```text
45% due-review completion
25% formula recall activity
20% question practice activity
10% overdue recovery
```

- A scheduled review with no due date yet receives a neutral provisional value rather than a harsh penalty.
- Incomplete overdue reviews lower the component.
- Completing an overdue item earns recovery credit.
- Formula recall and question practice use a 28-day activity window.
- If none of these sources has committed evidence, the component is unavailable.

## Balance And Integrity

This component prevents one metric from dominating.

```text
35% activity diversity
25% depth honesty
20% anti-burst distribution
20% evidence completeness
```

The six activity categories are reading, AI review, oral exam, revisit, implementation, and writing. Activity is counted as category-days, so a large number of same-category events on one day cannot overwhelm the calculation.

## Anti-Gaming Rules

The result exposes `antiGamingFlags` when relevant:

- More than two paper logs on one day are capped for consistency.
- More than four GitHub contribution units on one day are capped and square-root scaled.
- More than half of recent category activity on one day is marked as bursty.
- Deep labels without matching method, formula, or note evidence are discounted.
- High AI scores with thin written evidence are flagged.
- Hidden and unlisted reviews are excluded from public aggregate scoring.

Flags are evidence-quality notes, not accusations. They make score adjustments inspectable.

## Confidence Model

```text
35% evidence coverage
25% recency coverage
20% activity diversity coverage
20% sample size coverage
```

Labels:

- `low`: 0-49
- `medium`: 50-74
- `high`: 75-100

Confidence is reduced further when:

- five or more paper logs exist without public AI reviews;
- ten or more paper logs exist without oral exam evidence;
- anti-gaming flags show that raw evidence needed capping or mismatch penalties.

## Examples

| Evidence pattern | Expected interpretation |
| --- | --- |
| No data | Score 0, low confidence, all core components unavailable |
| Four reading days, no reviews or exams | Provisional reading signal with low confidence |
| One day with 40 commits | GitHub volume capped; output and confidence remain low |
| Distributed reading only | Reading can be strong, but missing retrieval/output keeps confidence low |
| Balanced reading, review, oral exam, revisit, writing, and implementation | Strong score with high confidence when samples are sufficient |
| Deep labels with shallow method/formula evidence | Mismatch flag and lower understanding/integrity |

Run the deterministic scenarios with:

```bash
npm run score:test
```

## Improving The Score Meaningfully

- Spread paper passes across days instead of adding same-day volume.
- Keep pass depth honest; a useful Pass 1 is better evidence than an unsupported deep label.
- Explain one method, formula, or experiment with exact evidence from the note.
- Practice closed-book retrieval and record uncertainty.
- Turn one paper into a small implementation attempt or public technical note.
- Clear the oldest due review and record what was remembered or missed.
- Add missing evidence to a weak research-loop category instead of maximizing the strongest category.

The dashboard returns at most three `nextActions`, prioritizing missing mature evidence, integrity repairs, and the weakest available component.
