# Visual QA V3

> Historical production baseline. The Stage 1 media/icon redesign audit is documented in `media-and-icon-audit.md`. No candidate prepared there changes the production state described below until `media-approval.md` records explicit approved IDs.

## Deployment Verification

Pre-redesign source commit: `6d5dcd1b85cbc0a6bccf086d082a5e356189e767`.

The latest successful Pages run before this change was run `29109437172`, built from the same commit. GitHub Pages reported `build_type: workflow`, source `main:/`, custom domain `gnaroshi.dev`, and enforced HTTPS. The imported public feed commit was `919f37c82172b317e021fd1213dcaedb0866996f` in both the live meta tag and live build metadata.

The previous endpoint could not prove the website artifact because it omitted the website commit. V3 changes `/build-info.json` to expose:

```json
{
  "websiteCommit": "...",
  "contentFeedCommit": "...",
  "builtAt": "..."
}
```

The Pages workflow now verifies the live `websiteCommit` against `github.sha` after deployment. The final live commit is recorded after the PR is merged and the verification job succeeds.

## Routes Reviewed

English: `/`, `/research/`, `/projects/`, `/blog/`, `/papers/`, `/growth/`, `/about/`.

Korean: `/ko/`, `/ko/research/`, `/ko/projects/`, `/ko/blog/`, `/ko/papers/`, `/ko/growth/`, `/ko/about/`.

All 14 routes were reviewed in light and dark modes at 1440x1000, 1280x900, 1024x768, 768x1024, 430x932, 390x844, and 360x800.

## Screenshot Review

- Baseline: 196 Chromium full-page screenshots, manually reviewed through 14 contact sheets.
- Final Chromium: 196 exact-viewport screenshots, manually reviewed through 14 contact sheets.
- Final WebKit: 196 exact-viewport screenshots, manually reviewed through 14 contact sheets.
- WebKit exposed two test-specific issues: fixed-element duplication in full-page stitching and delayed smooth-scroll return. The final test captures exact viewports and forces automatic scroll only while loading lazy media.
- Ignored artifacts live under `artifacts/visual-audit-v3/`.

At 1440px, Research, Projects, Writing, and About titles all begin at Y=174px. Paper Lab and Growth both begin at Y=190px after the local application navigation. At 360px, those shell positions are Y=138px and Y=170px. Header heights are 68px desktop and 64px mobile. Every measured route reports zero horizontal overflow.

## Visual Results

- The brand now owns the Home link; primary navigation is Research, Projects, Writing, Paper Lab, and About.
- Growth, language, and theme are quiet utilities. The mobile drawer appears below 1024px before links can wrap.
- Unicode theme glyphs were replaced with 18px SVG icons centered inside 36px desktop and 40px touch targets. Measured center difference is at most 1px.
- Homepage content is limited to Hero, Selected Work, Latest Notes, and Research Loop.
- Current focus is part of the Hero; collaboration links remain in About and the footer.
- Research alternates three meaningful diagrams with concise question-led text.
- Projects use one evidence-backed featured case rather than treating internal tools as separate projects.
- Paper Lab and Growth use illustrations only in evidence-gated onboarding; real feed data replaces them when eligible.
- About uses an abstract monogram and does not invent a portrait.
- Korean headings, controls, and tags fit at 360px without forced English line-length rules.

## Accessibility

`npm run test:a11y` ran axe checks across 31 English and Korean routes with no automatically detectable violations. Keyboard focus, theme persistence, mobile drawer focus trapping, Escape handling, and focus return passed. A Tab-detected keyboard-navigation state keeps the skip link visible for keyboard users without exposing it during WebKit programmatic focus.

## Image Manifest

`src/data/mediaManifest.ts` contains route, purpose, localized alt text, aspect ratio, source, provenance, focal point, and loading priority. The asset system includes one original generated Hero, six explanatory diagrams, and four reusable blog cover family members. See `docs/image-system.md`.

## Performance

- No runtime dependency or chart library was added.
- Hero AVIF/WebP variants range from 24KB to 232KB; the normal desktop selection is the 768px source, about 68KB as AVIF.
- Only the Hero is preloaded. Other images are lazy-loaded with explicit dimensions.
- SVG diagrams are 4KB each and share one visual grammar.
- React islands remain limited to existing interactive tools and do not power the redesigned editorial pages.

## Remaining Owner Content

- The public feed currently contains no published writing or paper notes, so those pages intentionally show minimal evidence-gated states.
- A real owner-supplied portrait can replace the About monogram later; no synthetic likeness was created.
- Formal education, publications, and contact details remain absent until the owner supplies verified information.

## Media System V2 Stage 1

- Existing production media was inventoried before edits.
- Six ignored Hero candidates and four monochrome brand candidates are reviewed only through development routes.
- `/dev/media-review/hero/`, `/dev/media-review/icons/`, and `/dev/media-review/brand/` are omitted from production static output.
- Real project screenshots are specified in `docs/project-media/` and are not captured or integrated before approval.
- Current flat content SVGs, unused covers, duplicated project artwork, and Unicode icon debt are isolated in a Stage 1 policy allowlist. Stage 2 removes the allowlist entries together with the replaced production assets.

## Before And After

Before V3, the site was typographically clean but visually sparse, used inconsistent page-title offsets, exposed a six-item primary navigation, and relied on Unicode theme glyphs. Long Korean research content became a text wall while empty application pages had little visual orientation.

After V3, all pages share one gutter and shell system, navigation never wraps, titles align by mode, the Homepage introduces the person before the system, and media explains actual research structure. Dark mode has distinct background/surface/raised levels, restrained borders, and reduced-glare diagram surfaces.

## Commands

```bash
gh auth status
gh repo view Gnaroshi/gnaroshi.github.io --json nameWithOwner,defaultBranchRef,url,visibility
gh run list --repo Gnaroshi/gnaroshi.github.io --workflow deploy.yml --limit 5
gh api repos/Gnaroshi/gnaroshi.github.io/pages
curl -fsSL https://gnaroshi.dev/build-info.json
npm install
npm run content:check
npm run check
npm run check:i18n
npm run build
npm run check:links
npm run test:e2e
npm run test:a11y
npm run test:visual
PLAYWRIGHT_BROWSER=webkit VISUAL_SET=final-webkit2 npm run test:visual
```
