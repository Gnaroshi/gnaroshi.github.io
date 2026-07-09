# Paper Reading System

## Purpose

The paper reading tracker should make daily paper reading visible, searchable, and useful. It should reward consistent engagement and partial progress, not only polished summaries or completed deep reads.

The tracker is a personal research memory system. It should help answer:

- What have I been reading?
- What did I understand?
- What should I revisit?
- Which papers became implementations or experiments?
- Which areas am I spending attention on?

## Three-Pass Method

The system is based on a three-pass reading method.

### Pass 1: Skim And Decide Relevance

Goal:

- Understand the paper's topic, claim, and relevance.
- Decide whether to continue.

Capture:

- Why this paper was opened.
- Abstract-level summary.
- Main problem.
- Claimed contribution.
- Immediate relevance.
- Initial questions.

This pass counts as valid progress.

### Pass 2: Understand Core Structure

Goal:

- Understand the method, experiments, and argument structure.

Capture:

- Method overview.
- Key assumptions.
- Main figures and tables.
- Experimental setup.
- Baselines.
- Strengths and weaknesses.
- Related papers to follow.

This pass should make the paper explainable to another researcher at a high level.

### Pass 3: Deep Dive

Goal:

- Understand details deeply enough to derive, reproduce, implement, or critique.

Capture:

- Derivations.
- Formula walkthroughs.
- Implementation details.
- Reproduction notes.
- Failure modes.
- Code links.
- Extension ideas.

Pass 3 is not required for every paper.

## Status Model

Allowed statuses:

- `queued`: saved for later.
- `pass-1`: skimmed or currently skimming.
- `pass-2`: structure-level reading.
- `pass-3`: deep reading.
- `paused`: intentionally stopped for now.
- `done`: reading goal completed.
- `revisit`: needs another pass later.

Status should reflect current state, not prestige.

## Depth Model

Depth is numeric so it can drive sorting and stats:

- `0`: queued or metadata only.
- `1`: pass 1 skim.
- `2`: pass 2 structure understanding.
- `3`: pass 3 deep dive.
- `4`: implemented, reproduced, or extended.

Depth should generally increase over time, but revisits are allowed.

## What Counts As Activity

A day counts as active if at least one paper log has reading activity on that date.

Possible sources:

- `readStartedAt`
- `lastReadAt`
- future optional `sessions` array

For MVP, use `lastReadAt` as the primary activity date. If a future schema adds sessions, prefer session dates for heatmap precision.

## Rewarded Behaviors

The tracker should reward:

- Consistency.
- Partial progress.
- Good questions.
- Revisiting important papers.
- Implementation attempts.
- Reproduction attempts.
- Linking papers into a research map.

Avoid implying that only finished papers matter.

## Dashboard Features

The `/papers` dashboard should include:

- Daily contribution heatmap.
- Current streak.
- Longest streak.
- Papers this week.
- Papers this month.
- Papers this year.
- Deep reads.
- Implemented or reproduced papers.
- Search by title, author, tag, venue, and summary.
- Filter by status.
- Filter by depth.
- Filter by tag.
- Filter by year.
- Filter by difficulty.
- Sort by latest, difficulty, reading time, and depth.

All dashboard values should be computed from static content.

## Heatmap Rules

Default heatmap range:

- Last 365 days.

Activity level:

- `0`: no paper activity.
- `1`: one paper touched.
- `2`: two papers touched.
- `3`: three papers touched.
- `4`: four or more papers touched, or one deep/implementation session if session data exists later.

For MVP, level can be based on count of paper logs whose `lastReadAt` is that day.

## Streak Rules

Current streak:

- Count consecutive days ending today if today has activity.
- If today has no activity, count consecutive days ending yesterday.

Longest streak:

- Longest consecutive run of days with activity in the available data.

Use local dates consistently. The implementation should not mix UTC and local dates in a way that shifts activity across days.

## Search Rules

Search should match:

- Title.
- Authors.
- Venue.
- Year.
- Tags.
- Summary.
- Key takeaway.

Search can be client-side for MVP because content volume is expected to be manageable.

## Filter Rules

Filters should compose. For example, a query can show:

- status = `pass-2`
- tag = `robot-learning`
- difficulty >= `3`

The UI should make it easy to reset filters.

## Individual Paper Page

Each paper page should include:

- Title.
- Authors.
- Venue and year.
- External links.
- Tags.
- Status.
- Depth.
- Difficulty.
- Reading minutes.
- Last read date.
- Summary.
- Key takeaway.
- Three-pass notes.
- Questions.
- Implementation notes.
- Related papers if manually listed later.

## Future Extensions

Possible later additions:

- Session-level reading logs.
- Paper graph or reading map.
- BibTeX export.
- Related-paper recommendations from tags.
- Local full-text search index.
- Charts by topic over time.

Do not add these before MVP unless explicitly requested.

## Acceptance Criteria

The paper system is implemented well when:

- Adding one paper MDX file updates the dashboard.
- Partial paper progress appears in stats.
- The heatmap is understandable and visually similar to contribution activity.
- Search and filters work without backend services.
- Individual paper pages preserve messy research notes without forcing them to become polished posts.
