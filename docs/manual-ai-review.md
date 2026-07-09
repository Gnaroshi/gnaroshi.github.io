# Manual AI Review Workflow

Use manual review when `OPENAI_API_KEY` is not configured, when you want to use ChatGPT directly, or when you want to inspect the prompt before generating a review.

This workflow does not call an API from the browser. It creates a prompt on the static paper detail page and lets you paste it into a model manually.

## Copy The Prompt

1. Open a paper detail page.
2. Find the AI Review section.
3. If no review exists, use `Or copy manual review prompt`.
4. If a review already exists, click `Re-review manually`.
5. Click `Copy AI Review Prompt`.
6. Paste the prompt into ChatGPT or another model.
7. Ask the model to return only JSON.

The prompt includes:

- Paper metadata.
- Paper note body.
- Score rubric.
- Exact JSON schema.
- Instructions to avoid overclaiming correctness.
- Instructions to evaluate evidence of understanding.
- Instructions to give constructive next actions.

## Save The Returned JSON

Save the model's JSON response to a local file, for example:

```text
/tmp/review.json
```

Then import it:

```bash
npm run paper:review:import -- --slug <paper-slug> --file /tmp/review.json
```

If a review already exists, the import script asks for confirmation before overwriting. To skip the prompt:

```bash
npm run paper:review:import -- --slug <paper-slug> --file /tmp/review.json --force
```

The import script:

- Validates and normalizes the JSON.
- Ensures `paperSlug` matches the slug.
- Writes `src/generated/paper-reviews/<slug>.json`.
- Preserves existing score history.
- Refuses to overwrite existing reviews without confirmation or `--force`.

## Validate

Run:

```bash
npm run paper:review:validate
```

This checks schema shape, score ranges, slug mapping, self-score comparison, and hidden review handling.

## Rebuild

After importing a review:

```bash
npm run build
```

Commit the generated JSON when the build passes.
