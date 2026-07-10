# Paper To Blog Promotion

Paper logs are structured research notes. Blog posts are public explanations intended for a wider technical reader.

The promotion script creates a draft blog post from a paper note so the writing can start from the existing reading structure without copying everything by hand.

## Command

```bash
npm run paper:promote -- --slug <paper-slug>
```

The script creates:

```text
src/content/blog/YYYY-MM-DD-<paper-slug>-notes.mdx
```

It never overwrites an existing file unless `--force` is provided:

```bash
npm run paper:promote -- --slug <paper-slug> --force
```

## Generated Draft

The draft uses:

- `draft: true`
- `visibility: "hidden"`
- `series: "Paper Notes"`
- `sourcePaper: "<paper-slug>"`

It also includes a backlink to the source paper page.

## Outline

Generated sections:

- `Why This Paper Matters`
- `Core Idea`
- `Method`
- `Formula Intuition`
- `Experiments`
- `What I Learned`
- `Open Questions`

Before publishing, rewrite the draft as a real post. Do not publish copied abstract text or unverified claims.
