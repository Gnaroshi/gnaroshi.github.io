# Public Deployment Rollback

Rollback changes only the public website presentation and public content-feed projection. It never changes paper-lab, writing, Studio, API, or any private source repository.

The active recovery path is local validation followed by static `gh-pages:/` publication. Repository Actions remain disabled; the retained `rollback.yml` workflow is inactive. Do not dispatch or rerun it.

## Select A Verified Release

Read live provenance and inspect the public deployment branch history:

```bash
curl -fsSL https://gnaroshi.dev/build-info.json
git log origin/gh-pages
git show <VERIFIED_DEPLOYMENT_SHA>:build-info.json
```

Select a previously verified static artifact or an immutable website/public-feed input pair from a verified release. The source SHA in `build-info.json` is distinct from the `gh-pages` commit; later documentation/verification-tooling changes do not alter that artifact's source identity.

## Prepare Recovery Locally

- **Restore an artifact:** copy the selected verified deployment tree into an isolated checkout based on current `gh-pages`. Preserve static bytes and original build provenance. Record recovery as a new commit; never reset or force-push branch history.
- **Rebuild an input pair:** check out the selected website and public feed SHAs in clean isolated paths. Verify both exact SHAs, feed schema, and content hash, then follow the local production validation/build steps in [deployment](deployment.md). The selected source must build with the supported toolchain and emit schema-v1 provenance. If not, stop rather than fabricate metadata or invoke Actions.

For either path, inspect the complete public tree. Confirm root `.nojekyll`, `CNAME` containing `gnaroshi.dev`, and absence of source, private inputs, credentials, or development diagnostics. Validate core and affected routes against the selected feed. Do not claim a new build time when restoring an unchanged historical artifact.

## Publish And Verify

1. Confirm repository Actions remain disabled and Pages still points to `gh-pages:/`; preserve the domain and HTTPS.
2. Recheck remote `gh-pages`. If it advanced during preparation, stop and reconcile the competing release.
3. Push the new recovery commit normally, following the branch-publication steps in [deployment](deployment.md).
4. Verify exact live website/feed SHAs, content hash, schema, environment, and run fields against the selected artifact, plus core and affected routes. Fresh local builds use `local` / `0`; restored historical artifacts retain their original run fields.
5. Record the new deployment commit and verified input pair; confirm Actions remain disabled afterward.

## Recovery Cases

- Local validation failure: do not publish; fix the selected public input pair or choose an earlier verified artifact.
- Push or Pages publication failure: inspect ordinary Git/Pages metadata and the live endpoint. Do not assume the new artifact is live or enable Actions as a workaround.
- Live verification failure: treat the release as unverified even if Pages accepted it. Prepare a new normal recovery commit from the last known-good artifact or input pair.
- New content is bad but presentation is good: retain the website SHA and rebuild with an earlier exact feed SHA.
- Presentation is bad but content is good: rebuild an earlier website SHA with the current feed SHA only if schema-compatible.

Never force-push, reset private sources, delete local changes, or edit generated feed records as part of rollback.
