# AI Paper Review

The AI paper review system evaluates evidence in a written paper note. It is meant to support reflection, motivation, and better paper-reading habits.

It does not measure intelligence, IQ, talent, or true understanding. The review only sees the paper frontmatter, the MDX body, optional `abstract`, and optional `sourceExcerpt`. If those source fields are missing, the reviewer must not claim it independently verified the paper.

The CLI uses the OpenAI Responses API with Structured Outputs JSON schema formatting. Reference: `https://platform.openai.com/docs/guides/structured-outputs`.

## What The Score Means

The score is a reading process score from 0 to 100.

It asks:

- Did the note explain the problem?
- Did it capture the core idea in my own words?
- Did it follow the intended three-pass reading depth?
- Did it record useful evidence, questions, gaps, and next actions?
- Could I retrieve the paper later from this note?

Score levels:

- `seed`: 0-39
- `developing`: 40-59
- `solid`: 60-74
- `strong`: 75-89
- `excellent`: 90-100

## Dimensions

Each dimension receives a 0-10 score:

- `problemFraming`: problem and importance.
- `coreIdea`: central idea in my own words.
- `methodUnderstanding`: input, output, structure, objective, training/evaluation flow, or change from prior work.
- `formulaUnderstanding`: main formula/objective/loss in plain language.
- `experimentUnderstanding`: result that supports the central claim.
- `criticalThinking`: limitations, doubts, assumptions, or missing ablations.
- `researchConnection`: connection to my research, projects, or reading path.
- `retrievalReadiness`: whether I can explain the paper later from the note.
- `threePassDiscipline`: whether the note matches its declared status/depth.
- `noteQuality`: clarity, structure, specificity, and originality.

`overallScore` is the rounded average of the 10 dimensions multiplied by 10.

## Local Review

Create `.env.local` locally:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

Do not commit `.env.local`.

Review one paper:

```bash
npm run paper:review -- --slug example-paper
```

Force re-review and preserve score history:

```bash
npm run paper:review -- --slug example-paper --force
```

Review all non-draft, unreviewed papers:

```bash
npm run paper:review:all
```

Preview batch targets without calling the API:

```bash
npm run paper:review:all -- --dry-run
```

Review changed paper logs:

```bash
npm run paper:review:changed
```

Generated review files are written to:

```text
src/generated/paper-reviews/
```

## Paper Frontmatter Fields

Optional review fields:

```yaml
abstract: ""
sourceExcerpt: ""
selfScore:
selfReflection: ""
reviewVisibility: "public"
```

Use `abstract` or `sourceExcerpt` when you want the reviewer to compare the note against source text. The script does not fetch PDFs or scrape paper URLs.

Use `reviewVisibility: "hidden"` to generate a review JSON file without rendering it publicly. Hidden reviews are excluded from public score averages.

## GitHub Actions

The manual workflow lives at:

```text
.github/workflows/review-papers.yml
```

Repository secrets required:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Manual run:

1. Open GitHub repository Actions.
2. Choose `Review Papers with AI`.
3. Run workflow.
4. Choose `changed` or `all`.
5. Choose whether to force re-review.

In manual `changed` mode, the workflow compares the latest commit against the previous commit. Use `all` when you want to review every non-draft paper that does not already have a review.

The workflow commits generated review JSON back with:

```text
chore: update AI paper reviews [skip ci]
```

Push-triggered automation is intentionally disabled by default to avoid accidental API spend. The workflow file includes commented YAML showing how to enable it later.

## Improving Scores Over Time

The fastest way to improve the score is not to write longer notes. It is to add better evidence:

- Rewrite the core idea without copying paper phrasing.
- Add the main objective or loss in plain language.
- Name the experiment that supports the central claim.
- Record a weakness, missing ablation, or assumption.
- Add a future connection to a project or research question.
- Add retrieval questions for tomorrow.
- Match the note depth honestly: a clear pass1 note is better than an empty pass3 note.

## Good Paper Note Example

A good pass1 note can be short:

- Why I opened the paper.
- What problem it solves.
- The central claim.
- Why it may or may not matter to my work.
- Two questions for pass2.

A good pass2 note adds:

- Method structure.
- Training/evaluation flow.
- Main experiment and result.
- Strengths and weaknesses.

A good pass3 note adds:

- Formula walkthrough.
- Reproduction or implementation notes.
- Failure modes.
- Concrete extension ideas.
