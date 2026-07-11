# Screenshot Guidelines

## Capture

- Capture a real application, website, terminal, configuration, architecture tree, or result artifact.
- Use Retina resolution and preserve a truthful native UI crop.
- Default project aspect ratio is 16:10.
- Do not place captures in fake laptop, phone, browser, or 3D frames.
- Do not generate screenshots or reconstruct a UI in design software.

## Redaction

Before capture, remove or mask:

- tokens, keys, cookies, credentials, and environment values;
- local usernames, absolute paths, hostnames, and machine identifiers;
- private repository names and unreviewed private branches;
- dataset mounts and unpublished project details;
- unreviewed benchmark numbers or claims;
- unrelated notifications and personal information.

Redaction must not alter the meaning of the visible result. Prefer recapturing a sanitized state over painting over sensitive text.

## Export

- Keep a private lossless source outside production.
- Export 1200px AVIF and WebP variants plus a suitable fallback.
- Strip metadata and verify dimensions and byte budget.
- Do not recolor raster screenshots in dark mode.

## Accessibility

Alt text describes the UI state and why it matters, not every pixel. Captions may provide project context. Do not repeat an adjacent visible title verbatim.

## Approval

Record capture date, source repository/route, crop, redactions, privacy reviewer, localized alt, and final route usage in the project media brief before adding the asset to the production manifest.
