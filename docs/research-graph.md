# Research Graph

The research graph connects public research outputs into a static knowledge map.

## Route

- `/graph`: searchable graph explorer.
- `/graph/[nodeType]/[slug]`: static detail page for each generated node.

## Generated File

```text
src/generated/research-graph.json
```

Build it with:

```bash
npm run graph:build
```

Use `--force` only when content changed and the generated JSON should be overwritten:

```bash
npm run graph:build -- --force
```

## Node Types

- `paper`
- `blog`
- `project`
- `implementation`
- `question`
- `topic`
- `formula`
- `weekly-review`

## Edge Types

- `cites`
- `inspires`
- `contradicts`
- `extends`
- `implements`
- `explains`
- `critiques`
- `depends-on`
- `revisits`
- `belongs-to-topic`
- `promoted-to-blog`

## Inputs

The build script reads:

- public paper logs from `src/content/papers/`
- public blog posts from `src/content/blog/`
- project cards from `src/data/projects.ts`
- public project writeups from `src/content/projects/`
- public implementation attempts from `src/content/implementations/`
- weekly review JSON from `src/generated/weekly-reviews/`
- manual edges from `src/data/researchGraph.manual.ts`

Draft, hidden, and unlisted content is not included in the public graph.

## Manual Edges

Manual edges live in:

```text
src/data/researchGraph.manual.ts
```

Add edges only between nodes that exist in the generated graph. The build script skips manual edges whose source or target is missing.

## Inferred Edges

The script infers:

- item to topic edges from tags and related topics
- blog to paper edges when a blog body references a paper slug
- paper to blog `promoted-to-blog` edges when a blog has `sourcePaper`
- implementation to paper edges from `relatedPapers`
- implementation to project edges from `relatedProjects`
- project to paper edges when both link the same paper URL
