# Codex Workflow

Use this workflow to keep future Codex-assisted development focused and auditable.

## Start With Project Context

Before implementation, read:

- `AGENTS.md`
- `docs/tasks.md`
- the specific planning document for the task

For example:

- Product or page scope: `docs/product.md`
- Visual work: `docs/design.md`
- Routing or build behavior: `docs/architecture.md`
- Blog or paper content: `docs/content-model.md`
- Paper dashboard behavior: `docs/paper-reading-system.md`
- Deployment: `docs/deployment.md`

## Work One Phase At A Time

Use `docs/tasks.md` as the project roadmap. Ask Codex to implement one phase or one coherent feature at a time.

Good prompts are specific:

- "Implement Phase 4 blog tag polish."
- "Add one paper tracker filter."
- "Create a project MDX collection and migrate project cards."

Avoid mixing unrelated work such as deployment, design refactors, and content changes in one prompt.

## Verification

After each implementation phase, run:

```bash
npm run check
npm run build
```

For UI changes, also run a dev or preview server and inspect the affected routes in a browser.

## Commits

Keep commits small and clear:

```bash
git add .
git commit -m "type: concise description"
git push
```

Use conventional commit prefixes when practical:

- `feat:`
- `fix:`
- `docs:`
- `ci:`
- `chore:`

## Blog Posts

Write blog posts as MDX files under:

```text
src/content/blog/
```

Use the frontmatter schema in `docs/content-model.md`. Keep drafts as `draft: true` until they should appear publicly.

## Paper Logs

Create paper logs with:

```bash
npm run paper:new
```

Then edit the generated draft under:

```text
src/content/papers/
```

Use the three-pass method from `docs/paper-reading-system.md`. Partial progress is valid.

## Projects

Keep lightweight project metadata structured in:

```text
src/data/projects.ts
```

Use `src/content/projects/` later for longer MDX writeups. Do not invent publications, awards, or achievements.

## Keep Data Structured

Prefer structured data and frontmatter over one-off hardcoded content. Reusable personal identity should stay in `src/data/profile.ts`.

## MCP-Assisted Development

MCP can help with GitHub, local docs, browser inspection, or repository search, but configuration must remain local.

- Safe example: `.codex/config.example.toml`
- Local config: `.codex/config.toml` or `~/.codex/config.toml`
- Never commit real MCP tokens, OAuth secrets, API keys, or credentials.

