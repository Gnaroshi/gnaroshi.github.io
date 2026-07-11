# Technical Diagrams

Technical relationships are authored in HTML/CSS and then exported. Image generation is prohibited for labels, arrows, formulas, architecture, and execution paths.

## Efficient Execution

- Editable source: `media-sources/diagrams/efficient-execution.html`
- English export: `media-sources/exports/efficient-execution-en.{png,avif,webp}`
- Korean export: `media-sources/exports/efficient-execution-ko.{png,avif,webp}`
- Canvas: 1600 × 1200

The source uses a locale query parameter. It compares full recomputation with a state-reuse path using previous observations, a new observation, a shared model, cached state, a lightweight update, and an action. It avoids decorative nodes, hardware stock imagery, and unsupported performance numbers.

## Research Workflow

- Editable source: `media-sources/diagrams/research-workflow.html`
- English export: `media-sources/exports/research-workflow-en.{png,avif,webp}`
- Korean export: `media-sources/exports/research-workflow-ko.{png,avif,webp}`
- Canvas: 1600 × 1200

The five explicit stages are Read, Explain from memory, Check what was missed, Revisit, and Implement or write. Paper, speech, comparison, note, and code symbols make the sequence recognizable without an abstract ribbon.

## Commands

```bash
npm run media:build
npm run media:check
```

The Stage 1 exports are review sources. Stage 2 may create 480, 768, 1200, and 1600 pixel production variants only after approval. The diagrams should occupy enough page width for labels to remain readable; they must not be squeezed into the former half-width artwork slot.
