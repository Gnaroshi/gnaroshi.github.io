# Repository Split Rollback Plan

## Safety References

- Source commit: `42ad8002c99a1bd09e059519d684620f87a432a6`
- Annotated tag: `pre-repository-split-2026-07`
- Backup branch: `backup/pre-repository-split-2026-07`

Both references are pushed to `origin` and resolve to the source commit.

## Snapshot-Phase Rollback

This phase does not change website runtime behavior or remove source files. To abandon the split:

1. Stop work in the five new repositories.
2. Keep them private or archive them; do not delete them until their audit value is no longer needed.
3. Revert only the documentation commit in `gnaroshi.github.io` if the repository map should no longer be advertised.
4. Leave the safety tag and backup branch intact.

## Restore A Working Branch From The Checkpoint

Use a non-destructive restore branch:

```bash
git fetch origin --tags
git switch -c restore/pre-repository-split-2026-07 pre-repository-split-2026-07
npm install
npm run build
```

Equivalent branch reference:

```bash
git switch -c restore/pre-repository-split-branch origin/backup/pre-repository-split-2026-07
```

Do not force-push the checkpoint over `main` without reviewing later commits. Prefer a revert or a restore pull request.

## Future Cutover Rollback

If a later feed-backed cutover fails:

1. Revert the website adapter/cutover commit.
2. Restore direct `src/content/` and `src/generated/` loading from the checkpoint or the last dual-read commit.
3. Build and run public-copy, content-metric, i18n, links, E2E, accessibility, and visual checks.
4. Push the revert through normal review and redeploy GitHub Pages.
5. Keep canonical private repositories unchanged; publication failures must never rewrite their history.

## Verification Commands

```bash
git ls-remote origin refs/heads/backup/pre-repository-split-2026-07
git ls-remote origin 'refs/tags/pre-repository-split-2026-07*'
git rev-parse pre-repository-split-2026-07^{}
git rev-parse backup/pre-repository-split-2026-07
```

Both final `rev-parse` commands must return `42ad8002c99a1bd09e059519d684620f87a432a6`.
