# Repository Security Boundaries

## Visibility Model

| Boundary | Visibility | Security posture |
| --- | --- | --- |
| Website | Public | Assume every committed file is readable; consume public projection only |
| Paper Lab | Private | Canonical research notes and evidence; private by default |
| Writing | Private | Drafts and canonical writing; private by default |
| Content Feed | Public | Generated allowlist projection; never a private-source mirror |
| Studio | Private | Authoring tools and local integrations; secrets remain untracked |
| API | Private | Runtime implementation; production values live in Cloudflare secrets |

Repository visibility is not the only control. Private repositories must still avoid credentials, paper PDFs, personal data not required for the workflow, and unrestricted raw transcripts.

## Secret Rules

- Never commit `.env`, `.env.local`, `.dev.vars`, API keys, tokens, OAuth secrets, cookies, private keys, or personal credentials.
- `.dev.vars.example` may contain names and non-secret placeholders only.
- `OPENAI_API_KEY` belongs only in local untracked configuration or Cloudflare Worker secrets.
- The website may receive only an optional public API base URL. It must never receive long-lived credentials.
- Cross-repository automation must use least-privilege, short-lived credentials. No such automation is introduced during the snapshot phase.

## Content Publication Boundary

The public feed uses an allowlist model:

1. Canonical source is private.
2. Studio validates schema, visibility, locale pairing, links, and evidence eligibility.
3. Studio removes private-only fields and rejects secret-like values.
4. Studio excludes `draft`, `hidden`, `sample`, `seed`, `demo`, and `meta-only` records unless a human explicitly reclassifies them.
5. Generated output is reviewed before it reaches the public feed.

Raw AI prompts, full oral-exam transcripts, private questions, self-assessment notes, and hidden reviews are private unless a dedicated public schema explicitly permits a summarized field.

## Binary And Third-Party Material

- Do not copy or commit paper PDFs.
- Store links and bibliographic metadata instead of copyrighted paper binaries.
- Writing assets require ownership or a compatible license before projection.
- A license decision placeholder is included in every new repository; it does not grant a license.

## API Boundary

- CORS remains restricted to configured Gnaroshi origins.
- Rate limiting, request validation, and safe error responses remain mandatory.
- Realtime credentials are short-lived and minted server-side.
- API downtime must not break static pages or manual review and text-practice fallbacks.
- Request and transcript persistence remains disabled unless separately designed and approved.

## Snapshot Audit

Snapshots are built only from tracked paths at source commit `42ad8002c99a1bd09e059519d684620f87a432a6`. Local `.env` and `.dev.vars` files, build outputs, caches, `node_modules`, PDFs, and machine-specific files are excluded.
