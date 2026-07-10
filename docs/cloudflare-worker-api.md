# Cloudflare Voice Oral Exam API

## Purpose

The optional research API powers live voice and text oral exams without turning the Astro site into a server application. `gnaroshi.dev` remains a static GitHub Pages site. `api.gnaroshi.dev` is a separately deployed Cloudflare Worker.

The site still builds and its manual oral-exam prompt still works when the Worker URL is not configured.

## Architecture

```text
Browser at gnaroshi.dev
  |-- POST /v1/realtime/session --> Cloudflare Worker at api.gnaroshi.dev
  |                                  |-- OpenAI API key from Worker secret
  |                                  `-- short-lived Realtime client secret
  |<---------------- ephemeral credential -----------------------------|
  |
  |-- WebRTC + ephemeral credential --> OpenAI Realtime
  |<---------------- voice and transcript events ----------------------|
  |
  `-- POST /v1/exams/score ------> Cloudflare Worker --> structured score
                                      |
                                      `-- no persistent transcript storage
```

The browser never receives `OPENAI_API_KEY`. It receives only a short-lived Realtime credential for the direct WebRTC connection. Question generation, transcript scoring, transcription, and speech synthesis stay behind the Worker.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/v1/health` | Safe service health metadata |
| `GET` | `/v1/config` | Public feature availability and limits |
| `POST` | `/v1/realtime/session` | Create a short-lived Realtime client secret |
| `POST` | `/v1/exams/generate` | Generate a structured text oral exam |
| `POST` | `/v1/exams/score` | Score submitted answers and transcript evidence |
| `POST` | `/v1/audio/transcribe` | Transcribe a bounded audio upload without persistence |
| `POST` | `/v1/speech/synthesize` | Generate an AI examiner voice fallback |

Errors use this shape:

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Try again later."
  }
}
```

## Local Development

```bash
cd apps/api
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Keep `OPENAI_API_KEY` blank to use deterministic development mocks for question generation and scoring. Realtime, transcription, and speech stay disabled without a key; the Worker never returns a fake Realtime credential.

Run checks with:

```bash
npm run typecheck
npm test
npx wrangler deploy --dry-run
```

Run the Astro frontend separately:

```bash
PUBLIC_AI_API_BASE_URL=http://localhost:8787 npm run dev
```

`http://localhost:4321` and `http://localhost:8787` are in the default local CORS allowlist.

## Configuration

Worker secret:

```bash
cd apps/api
npx wrangler secret put OPENAI_API_KEY
```

Never add the key to `wrangler.jsonc`, `.dev.vars.example`, GitHub Pages variables, client-side code, or committed files.

Worker vars in `wrangler.jsonc`:

- `OPENAI_REALTIME_MODEL`
- `OPENAI_SCORING_MODEL`
- `OPENAI_TRANSCRIBE_MODEL`
- `OPENAI_TTS_MODEL`
- `ALLOWED_ORIGINS`
- `API_ENV`
- `MAX_EXAM_MINUTES`
- `MAX_TRANSCRIPT_CHARS`

`ORAL_EXAM_API_SHARED_SECRET` is optional and is only a local/testing guard. A value embedded in a public frontend is not a secret and is not authentication; do not configure this guard for a public browser deployment unless another trusted proxy supplies it.

## Deployment

Authenticate Wrangler, register the secret, then deploy:

```bash
cd apps/api
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```

`apps/api/wrangler.jsonc` declares `api.gnaroshi.dev` as a custom domain. Confirm the custom domain and DNS record in Cloudflare after deployment.

In GitHub repository Settings -> Secrets and variables -> Actions -> Variables, add:

```text
PUBLIC_AI_API_BASE_URL=https://api.gnaroshi.dev
```

This value is public configuration, not a secret. Push or rerun the Pages workflow after setting it. If it is omitted, the frontend renders the manual no-API workflow and sends no Worker request.

## CORS And Request Security

- `ALLOWED_ORIGINS` is parsed as an exact comma-separated allowlist.
- Browser preflight requires an allowed `Origin`.
- Disallowed browser origins receive a structured `403`.
- JSON requests are capped at 128 KiB.
- Audio files are capped at 20 MiB and checked against the configured exam duration when duration metadata is supplied.
- Transcripts are capped by `MAX_TRANSCRIPT_CHARS`.
- Speech input is capped at 4,000 characters and voices are allowlisted.
- IP addresses are hashed before use as rate-limit and OpenAI safety identifiers.
- Authorization and client-guard headers are redacted by the logging helper.
- API responses and synthesized audio use `Cache-Control: no-store`.

## Rate Limiting

The requested per-IP hourly policies are:

- Realtime session: 10/hour
- Exam generation: 20/hour
- Exam scoring: 20/hour
- Transcription: 10/hour
- Speech synthesis: 20/hour

Cloudflare Worker Rate Limiting bindings currently support 10-second or 60-second periods, so the checked-in bindings provide distributed burst protection. The Worker also applies best-effort hourly counters inside each isolate for local development and light traffic. Isolate memory is not a globally exact hourly store. Use Cloudflare rate-limiting rules or a bound Durable Object before treating the hourly limit as globally strict.

The `ExamSession` Durable Object file is a design scaffold only and is not bound in MVP. Direct browser WebRTC avoids proxying live media through the Worker. An outgoing WebSocket would also keep the object active; Durable Object hibernation is most useful when the object accepts incoming WebSockets.

## Privacy

- The frontend requests microphone access only after the user starts a live exam.
- Audio goes directly from the browser to OpenAI in Realtime WebRTC mode.
- Transcript events remain in the current browser tab until the user submits them for scoring.
- The Worker does not persist audio, transcript, session, or score data.
- Exported transcript and score files stay local until deliberately committed.
- A public Git repository is not private storage. Review exported data before committing it.
- The UI discloses that the examiner voice is AI-generated.

## Cost Notes

Realtime audio, transcription, text generation/scoring, and speech synthesis can all incur OpenAI usage charges. Cloudflare Worker requests can also count against the account plan. Keep model names, exam duration, output-token limits, input sizes, and rate limits bounded. Review provider usage dashboards after enabling production traffic.

## Failure Modes

- `503 realtime_unavailable`: `OPENAI_API_KEY` is absent or Realtime is unavailable. Use text/manual practice.
- `403 origin_not_allowed`: add the exact frontend origin to `ALLOWED_ORIGINS` and redeploy.
- `429 rate_limited`: wait for the limiter window before retrying.
- `413 request_too_large`, `audio_too_large`, or `audio_too_long`: reduce the submitted payload.
- `502 openai_upstream_error`: OpenAI rejected or failed the upstream request; retry later and inspect redacted Worker logs.
- WebRTC connection failure: verify browser microphone permission, ephemeral-token expiry, and network support; use text/manual fallback.
- Frontend stays manual-only: set the GitHub Actions variable and rebuild Pages after the Worker is healthy.

## Source Map

- Worker router: `apps/api/src/index.ts`
- OpenAI adapter: `apps/api/src/lib/openai.ts`
- Validation and security: `apps/api/src/lib/validation.ts`, `apps/api/src/lib/security.ts`
- API tests: `apps/api/src/index.test.ts`
- Frontend API client: `src/utils/researchApiClient.ts`
- Live exam island: `src/components/exams/LiveOralExam.tsx`
- Static route: `src/pages/papers/[slug]/exam/live.astro`
