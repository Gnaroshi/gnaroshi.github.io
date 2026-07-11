# gnaroshi-writing Audit

Expected owner: canonical private Blog and long-form writing, translations, and source assets.

## Content Model

- Six source MDX records are arranged as three EN/KO pairs. All are imported seed writing, remain non-publishable by default, and have no future publish dates.
- Records carry stable IDs, version, timestamps, visibility, evidence eligibility, category, locale, translation key, title, description, publish date, tags, optional series data, assets, draft state, and private notes.
- `posts/`, `drafts/`, `assets/`, `series/`, `config/`, and `docs/` establish a clear canonical-source layout.
- **P1 - canonical URL identity is still coupled to record ID.** None of the current MDX files stores `canonicalSlug`, `aliases`, or `translationStatus`; Studio derives defaults. Renaming a public URL safely therefore depends on unpublished Studio behavior rather than source history.
- **P2 - source and publication metadata are split without repository validation.** Translation state lives in `config/translations/`, while locale records carry only `translationKey`. This is workable, but stale pair metadata is not caught locally.

## Translation Model

- Every current translation key has exactly two locale records, and all three pair records are marked complete.
- Source and target use distinct files and locales; there is no silent English fallback at a Korean path.
- **P2 - complete currently means structurally paired, not editorially approved.** Imported seed classification correctly blocks publication, but a future validation rule should distinguish translated, reviewed, and publish-ready.
- **P2 - alias parity across translated slug changes is undefined.** Decide whether aliases are locale-specific and how a language switch resolves renamed paired routes.

## Asset Ownership

- Writing owns dedicated `assets/` and `series/` directories, and Studio contracts support per-asset visibility, alt text, and content hashing.
- No real asset or series record is present, so provenance, optimization, hero/OG selection, and translation-specific image behavior have not been exercised on canonical data.
- **P1 - no source-asset provenance schema exists in this repository.** Before adding media, record origin, license, creator/generator, edit history, and allowed public uses.

## Publishing Readiness

- Paper-to-Blog promotion is documented as an allowlisted Studio operation that creates a private draft only.
- No Paper database, website component, feed output, deployment code, credential, PDF, local path, or API secret was found.
- **P1 - repository-local validation and CI are absent.** Direct editor changes can bypass MDX/frontmatter, pair, private-field, link, asset, and future-date checks until Studio is run.
- **P2 - local preview requires Studio.** Plain MDX remains editable, but there is no lightweight command here to render or validate a single article without the full app workspace.
- **P2 - the license decision is pending.** Private drafts are reserved, but source assets and any future released writing need explicit terms.

## Top Improvements

1. P1: add canonical slug and alias history to source records.
2. P1: add repository-local validation backed by Studio contracts.
3. P1: add private CI for schema, links, translation pairs, secrets, and future dates.
4. P1: define source-asset provenance and licensing metadata.
5. P2: formalize translation lifecycle states: draft, translated, reviewed, publish-ready.
6. P2: define locale-specific alias and language-switch behavior.
7. P2: add a lightweight single-post validation/preview command.
8. P2: test a real private asset and series fixture end to end without publishing it.
9. P2: separate migration seed records from future active posts after editorial disposition.
10. P2: decide writing and asset licenses.

## Files Involved

`posts/en/`, `posts/ko/`, `drafts/`, `assets/`, `series/`, `config/import-manifest.json`, `config/translations/`, `docs/content-model.md`, `docs/paper-to-blog.md`, `.gitignore`, `LICENSE`.
