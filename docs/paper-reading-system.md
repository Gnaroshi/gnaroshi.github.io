# Paper Reading System

> Migration reference: paper authoring and reading workflow commands moved to `Gnaroshi/gnaroshi-studio` and are not runnable in the website repository.

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

- `planned`: saved for later and not counted as active reading.
- `pass1`: skimmed or currently skimming.
- `pass2`: structure-level reading.
- `pass3`: deep reading.
- `read`: reading goal completed.
- `implemented`: implemented, reproduced, or extended.
- `abandoned`: intentionally stopped and not counted as active reading.

Status should reflect current state, not prestige.

## Depth Model

Depth is a string so it remains readable in frontmatter:

- `skim`: pass 1 relevance and summary.
- `understand`: pass 2 structure understanding.
- `deep`: pass 3 detailed reading.
- `reproduce`: reproduction-oriented read.
- `implement`: implementation or extension attempt.

Depth should generally increase over time, but revisits are allowed.

## What Counts As Activity

A day counts as active if at least one non-draft paper log has:

- `readDate` equal to that date.
- `status` not equal to `planned`.
- `status` not equal to `abandoned`.

Dates are normalized to local `YYYY-MM-DD` strings without adding a timezone dependency.

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

For MVP, level can be based on count of active paper logs whose `readDate` is that day.

## Streak Rules

Current streak:

- Count consecutive days ending today if today has activity.
- If today has no activity, count consecutive days ending yesterday.

Longest streak:

- Longest consecutive run of days with activity in the available data.

Use local date strings consistently. The implementation should not mix date formats in a way that shifts activity across days.

## Adding Paper Logs

Paper logs live in:

```text
src/content/papers/
```

Create a draft log with:

```bash
npm run paper:new
```

The helper creates:

```text
src/content/papers/YYYY-MM-DD-untitled-paper.mdx
```

If that file exists, it appends `-2`, `-3`, etc. It never overwrites an existing file.

Generated logs default to `draft: true`. Change `draft` to `false` only when the note should appear on the public site.

## Frontmatter Fields

Use the schema in `docs/content-model.md`. Important fields:

- `status`: `planned`, `pass1`, `pass2`, `pass3`, `read`, `implemented`, or `abandoned`.
- `depth`: `skim`, `understand`, `deep`, `reproduce`, or `implement`.
- `priority`: `low`, `medium`, or `high`.
- `difficulty`: integer from `1` to `5`.
- `readingTimeMinutes`: non-negative integer.
- `readDate`: required unless `status` is `planned`.

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

## AI-Assisted Review

Paper notes can optionally receive an AI-assisted review generated by local CLI or GitHub Actions. The review scores evidence in the written note, not intelligence or true understanding.

Generated reviews live under:

```text
src/generated/paper-reviews/
```

Run:

```bash
npm run paper:review -- --slug <paper-slug>
npm run paper:review:all -- --dry-run
npm run paper:review:validate
```

Reviews use `OPENAI_API_KEY` and `OPENAI_MODEL` only in Node scripts or GitHub Actions. The static site never calls the API from the browser.

Set `reviewVisibility: "hidden"` in paper frontmatter to keep a generated review out of public pages and dashboard averages.

See `docs/ai-paper-review.md` for the score dimensions, limitations, and workflow. See `docs/ai-review-rubric-examples.md` for score calibration examples.

Do not add these before MVP unless explicitly requested.

## Connected Research Outputs

Paper logs can now feed several downstream outputs:

- Implementation attempts in `src/content/implementations/` can link back through `relatedPapers`.
- The research graph connects public paper notes, topics, questions, formulas, blog posts, projects, implementations, and weekly reviews.
- Weekly reviews count only public paper activity and public reviews that map to public paper logs.
- `npm run paper:promote -- --slug <paper-slug>` creates a hidden draft blog post with `sourcePaper`.

Useful commands:

```bash
npm run graph:build
npm run week:build
npm run paper:promote -- --slug <paper-slug>
```

See `docs/research-graph.md`, `docs/weekly-review.md`, `docs/implementation-tracker.md`, `docs/visibility.md`, and `docs/paper-to-blog.md`.

## Learning Loop Extensions

The research cockpit now includes static-first learning-loop features:

- `/queue`: triage papers before they become full logs.
- `/reviews` and `/reviews/due`: spaced review from `reviewSchedule`, `lastReviewed`, and `reviewHistory`.
- `/formula` and `/papers/[slug]/formula`: local formula recall attempts.
- Future Me fields on paper notes for six-month recall.
- `/questions`: reusable question bank generated from reviews, oral exams, and formula prompts.

See `docs/learning-loop-features.md` for schemas, routes, scripts, and localStorage limitations.

## Acceptance Criteria

The paper system is implemented well when:

- Adding one paper MDX file updates the dashboard.
- Partial paper progress appears in stats.
- The heatmap is understandable and visually similar to contribution activity.
- Search and filters work without backend services.
- Individual paper pages preserve messy research notes without forcing them to become polished posts.
