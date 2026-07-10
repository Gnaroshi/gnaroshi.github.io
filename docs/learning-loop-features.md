# Learning Loop Features

This document describes the research cockpit features that turn the Paper Log into a daily learning system.

The implementation is static-first. Content is committed as Markdown/MDX, generated artifacts are committed as JSON, and browser interactions use localStorage only for temporary drafts. No browser code calls an AI API or needs a secret.

## Paper Reading Queue

Queue items live in:

```text
src/content/queue/
```

Use queue notes for papers that look important but are not full paper logs yet. The queue supports:

- `/queue`
- `/queue/[slug]`
- priority, source, status, topic, tag, and text filters
- a copyable conversion command

Convert a queue item into a draft paper log with:

```bash
npm run paper:from-queue -- --slug <queue-slug>
```

This creates:

```text
src/content/papers/YYYY-MM-DD-<queue-slug>.mdx
```

The script never overwrites existing files. To mark the queue item as converted after creating the paper log:

```bash
npm run paper:from-queue -- --slug <queue-slug> --mark-converted
```

## Review Due System

Review due metadata lives in paper frontmatter:

```yaml
reviewSchedule:
  - 1
  - 7
  - 30
lastReviewed:
reviewHistory:
  - date: 2026-07-09
    type: "manual"
    note: "Recalled core idea."
```

If `reviewSchedule` is missing, the site derives a default schedule from status and depth:

- `pass1`: `[1, 7]`
- `pass2`: `[1, 7, 30]`
- `pass3`, `deep`, or `implemented`: `[1, 7, 30, 90]`

Routes:

- `/reviews`
- `/reviews/due`

The review UI lets the reader recall the one-line summary, main formula, and a retrieval question. "Mark reviewed locally" stores a temporary browser draft and shows a Markdown snippet to paste into the paper note. It does not write to GitHub.

## Formula Recall Trainer

Paper notes can include:

```yaml
mainFormula: ""
formulaInterpretation: ""
formulaTerms:
  - symbol: "Q"
    meaning: "Query matrix"
formulaRecallPrompts:
  - "Write the main objective from memory."
```

Routes:

- `/formula`
- `/papers/[slug]/formula`

The trainer hides the saved formula until the reader writes a recall attempt. Attempts are local-only unless exported as JSON and committed under:

```text
src/generated/formula-recall/
```

Optional local scoring:

```bash
npm run formula:score -- --slug <paper-slug> --file attempt.json
```

The scorer is heuristic and API-free. It compares recall text against the committed formula and interpretation.

## Explain To Future Me

Paper notes can include:

```yaml
futureMe:
  oneThingToRemember: ""
  whyItMatters: ""
  whenToUseThis: ""
  whatToRevisit: ""
  warning: ""
```

When populated, `/papers/[slug]` shows a highlighted "For Future Me" card. Paper cards show a short excerpt when available.

For papers marked `pass2`, `pass3`, `read`, or `implemented`, the build emits a non-blocking warning if the public paper has no `futureMe` content.

## AI Question Bank

Question bank data lives in:

```text
src/generated/question-bank/question-bank.json
```

Build it with:

```bash
npm run questions:build
```

The builder extracts:

- `retrievalQuestions` from public AI paper reviews
- `followUpQuestion` and `missedSignals` from oral exam JSON files
- `formulaRecallPrompts` from non-draft paper notes

Existing question-bank JSON is not overwritten if content changes unless `--force` is passed:

```bash
npm run questions:build -- --force
```

Routes:

- `/questions`
- `/questions/[id]`

The dashboard includes weak questions, formula questions, due questions, random practice, local scoring, and a copyable manual AI quiz prompt.

## LocalStorage Limitations

Local review, formula, and question practice state is browser-local:

- it does not sync across devices
- it is not committed
- it can be cleared by the browser
- it is not visible in GitHub Pages builds

Permanent state should be copied into Markdown/MDX frontmatter or committed generated JSON.

## Security

- No API keys are used in browser code.
- No OpenAI requests are made from the static site.
- AI extension points should use local CLI scripts, GitHub Actions, or manual copy/paste workflows.
