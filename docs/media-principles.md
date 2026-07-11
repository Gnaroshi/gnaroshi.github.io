# Media Principles

## Meaning Before Decoration

Simple means one clear message, not abstract emptiness. A large image must communicate its broad subject within two seconds, before the visitor reads adjacent copy or alt text.

Use the media type that explains the content most clearly:

1. **Concept scene:** generated only for a concrete, recognizable activity such as the Home Hero or one broad Research introduction.
2. **Technical explanation:** a labeled HTML/CSS, Canvas, or Figma diagram exported to raster formats. Never use an image model for architecture text, arrows, formulas, or system relationships.
3. **Real project evidence:** an actual screenshot, repository excerpt, run manifest, terminal result, result artifact, or reviewed graph. Project art cannot reuse an unrelated Research image.
4. **Functional icon:** a small SVG for navigation, state, or action.

Every public visual belongs to exactly one category.

## Selection Rules

- Generated images require one concrete subject and believable context.
- Technical concepts use labeled technical diagrams.
- Projects use real screenshots and artifacts.
- Empty states usually use no large image.
- Rich detail is acceptable when it improves semantic clarity.
- A visually attractive but semantically ambiguous image is rejected.
- Images must remain understandable in desktop, tablet, mobile, and 160px thumbnail crops.
- Generated writing, fake code, fabricated terminal output, private paths, and unsupported benchmark claims are prohibited.

## Cohesion

A coherent site may combine a generated Hero illustration, precise raster diagrams, real interface screenshots, and simple SVG controls. Cohesion comes from typography, spacing, color, framing, and honest subject matter, not identical composition.

## Alt Text

Alt text describes what the image actually shows and identifies generated concept scenes as illustrations. It does not restate the abstract page theme.

- English VLA example: "An illustration of a tabletop robot arm reaching for a red block using an overhead camera and a visual language instruction."
- Korean VLA example: "비전-언어-행동 실험을 표현한 일러스트레이션으로, 카메라와 지시 화면을 참고해 로봇 팔이 빨간 블록을 집으려는 장면."

Project evidence alt text must name the real screenshots or artifacts in the composition. Decorative functional icons use `aria-hidden="true"` when adjacent text already supplies the label.

## Stage Gate

Candidate preparation does not authorize production use. An owner must name approved candidate IDs before responsive production variants are generated and `src/data/mediaManifest.ts` is changed.
