# Projects editorial rules

## Index copy

- Use one sentence for `cardSummary`.
- Describe what the project lets a person do; omit architecture and internal integration detail.
- Aim for 90-160 English characters and 45-90 Korean characters where natural.
- Show product status, never Studio integration state, as the primary status.
- Do not show a routine updated date on application cards.
- Show at most four verified technologies on selected and featured cards, and three on supporting cards.

## Detail copy

- `heroSummary` is no more than two sentences and explains user value.
- Separate working behavior, unfinished behavior, and next milestones.
- Every project has one 3-5 step scenario.
- Synthetic scenarios use the visible `Example workflow` / `예시 흐름` label and a direct demo-data disclosure.
- Never present fixture counts, paper candidates, runs, host values, or playback sessions as personal activity.
- Keep private URLs, local paths, credentials, unpublished results, and raw transcripts out of public prose and media.

Research pages lead with the question and evidence limits. Application pages lead with the working user flow and privacy boundary. Infrastructure pages lead with the public workflow, repository boundaries, and deployment evidence.

Run `npm run check:project-copy`, `npm run check:project-readiness`, and the project E2E tests after editing project copy.
