# gnaroshi-api Audit

Expected owner: optional Cloudflare Worker for AI-backed review, exam, realtime, transcription, and speech.

## Endpoint Inventory

| Method | Path | Status in source |
| --- | --- | --- |
| GET | `/v1/health` | Implemented and tested |
| GET | `/v1/config` | Implemented and tested |
| POST | `/v1/realtime/session` | Implemented; requires Worker secret |
| POST | `/v1/exams/generate` | Implemented; Studio uses text generation |
| POST | `/v1/exams/score` | Implemented; no current Studio call path |
| POST | `/v1/reviews/score` | Implemented; no current Studio call path |
| POST | `/v1/audio/transcribe` | Implemented; no current Studio call path |
| POST | `/v1/speech/synthesize` | Implemented; no current Studio call path |

Typecheck, nine tests, and Wrangler dry-run pass. The dry-run bundle is about 45 KB before gzip. The configured custom domain did not resolve during the audit, and this repository has no deployment workflow or Actions history.

## Findings

### Security And Cost Controls

- CORS uses an exact origin allowlist, response caching is disabled, client IPs are hashed, OpenAI keys remain Worker secrets, and realtime returns only an ephemeral client credential.
- JSON is limited to 128 KiB, audio to 20 MiB, transcripts to a configured character limit, and speech text to 4,000 characters.
- **P1 - production abuse protection is not globally hourly.** Cloudflare bindings enforce per-minute burst limits, while hourly limits live in isolate memory. CORS is not authentication and non-browser callers can supply an Origin. Public deployment can incur OpenAI cost beyond the intended hourly limits.
- **P1 - optional shared-secret protection is unusable for a public browser.** The documentation says this correctly. Production needs Cloudflare rate-limiting rules, Turnstile/App Check style abuse controls, a Durable Object, or another reviewed public-client policy.
- **P2 - multipart size is fully known only after `formData()` parsing when Content-Length is absent.** Cloudflare platform limits help, but stream/bound the upload before allocation where practical.
- **P2 - audio duration is caller-supplied metadata.** The endpoint cannot enforce exam duration when the field is omitted or false.

### API Contract

- Structured output schemas constrain OpenAI requests and errors use a stable `{ error: { code, message } }` envelope.
- **P1 - API review/exam schemas do not match Studio canonical records.** API uses schema version `1.0.0`, `paperSlug`, hidden response fields, and dimension objects; Studio canonical contracts use numeric version `1`, `paperId`, BaseRecord metadata, and different result shapes. No explicit adapter owns the conversion.
- **P1 - model output is trusted after JSON parse.** `createStructuredResponse<T>()` relies on provider structured-output guarantees but does not runtime-validate the returned object before it is sent to the client.
- **P2 - manual request parsers ignore unknown properties.** The exported JSON schemas declare `additionalProperties: false`, but runtime request parsing does not reject extras, so documented and actual strictness differ.
- **P2 - model names are configured as current literals without compatibility tests.** A provider rename or unsupported model yields only a generic upstream error.

### Privacy And Logging

- Requests use `store: false`; the Worker has no database, transcript persistence, canonical content, or Git publishing code.
- Error responses do not include upstream bodies or credentials.
- **P2 - logging redaction is not connected to an actual structured logger.** `redactHeaders()` exists but is unused. Cloudflare observability is enabled, so define and test exactly what metadata is emitted.
- **P2 - provider retention and data-processing expectations are not recorded as an operator checklist.** The Worker does not persist data, but submitted note excerpts, audio, and transcripts still go to OpenAI.

### Operational Readiness

- **P1 - the API is not deployed/reachable.** `api.gnaroshi.dev` returned DNS resolution failure, and there is no CI/deploy workflow.
- **P1 - most endpoints are unused by current clients.** Studio only calls `/v1/exams/generate`; the static website has no API dependency. Unused endpoints expand cost and security surface.
- **P2 - no `build` script exists.** Wrangler dry-run works through `npm exec`, but standard repository automation cannot run `npm run build`.
- **P2 - health reports process health, not provider readiness.** `/v1/config` exposes feature availability, which is useful; operations still need an authenticated synthetic check or dashboard.

## Top Improvements

1. P1: implement globally reliable production rate/cost controls before deployment.
2. P1: define a versioned Studio-to-API adapter for every result type.
3. P1: runtime-validate OpenAI structured output before returning it.
4. P1: deploy only the endpoints currently used, or feature-flag the rest off.
5. P1: add a reviewed Cloudflare deployment workflow and DNS verification.
6. P2: reject unknown request fields consistently.
7. P2: enforce or independently inspect audio duration.
8. P2: wire a redacted structured logger and document observability fields.
9. P2: add explicit provider privacy/retention operator documentation.
10. P2: add `build` as Wrangler dry-run and CI for typecheck/test/build.

## Files Involved

`src/index.ts`, `src/lib/openai.ts`, `src/lib/rateLimit.ts`, `src/lib/security.ts`, `src/lib/validation.ts`, `src/lib/cors.ts`, `src/routes/`, `src/schemas/`, `wrangler.jsonc`, `.dev.vars.example`, `docs/cloudflare-worker-api.md`, `package.json`.
