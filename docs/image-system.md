# Image System

The previous abstract artwork system is retired. See:

- `docs/media-principles.md` for permanent selection rules.
- `docs/media-rebuild-audit.md` for the legacy asset inventory.
- `docs/generated-image-prompts.md` for the two allowed concept-scene prompts.
- `docs/technical-diagrams.md` for editable diagram sources and exports.
- `docs/project-screenshot-guide.md` for real-evidence capture rules.
- `docs/image-semantic-review.md` for scores and approval state.

Stage 1 candidates live outside `public/` in `media-sources/`. They are available only through `/dev/media-review/` during development. They must not be imported by public pages until explicit approval.

The future production image component must provide explicit width and height, AVIF/WebP `srcset`, `sizes`, localized concrete alt text, focal point, loading mode, and no layout shift. Technical diagrams require locale-specific files because labels are part of the raster export.
