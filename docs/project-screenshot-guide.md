# Project Screenshot Guide

Project media must show evidence from the project itself. Generated covers, fake terminals, invented benchmark charts, and unrelated Research artwork are prohibited.

## Capture Rules

- Capture interfaces at 2× device scale without browser chrome or personal profile data.
- Use actual repository files, commands, manifests, and outputs.
- Record the source repository and commit.
- Redact usernames, absolute local paths, tokens, private repository names, private browser data, and unreviewed results.
- Label redactions explicitly; never replace them with plausible fake values.
- Do not present a schema example as a completed experiment.
- Do not present a lightweight sanity check as a benchmark result.

## gnaroshi_vla

`media-sources/evidence/gnaroshi-vla/` records public source commit `5dfa260ae47371b4b63545ba8e1c20b7817b231f`. A temporary clean clone ran the repository's lightweight `sanity` action. The 16:10 composition combines a real tree excerpt, actual configuration, the generated run manifest, and verified terminal output. Local paths and interpreter locations are explicitly redacted.

Editable composition: `media-sources/project-evidence/gnaroshi-vla.html`.

## gnaroshi.dev

Run the local site and capture it with:

```bash
npm run dev -- --host 127.0.0.1 --port 4331
MEDIA_REVIEW_BASE_URL=http://127.0.0.1:4331 npm run media:capture
npm run media:build
```

The composition uses the actual English desktop homepage, Korean 390 × 844 mobile homepage, and a sanitized `/build-info.json` excerpt.

Editable composition: `media-sources/project-evidence/gnaroshi-dev.html`.
