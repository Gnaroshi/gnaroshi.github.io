# Scientific Figure Art Direction

## Purpose

This is the living visual reference for scientific figures associated with Gnaroshi. It covers paper figures, research diagrams, method overviews, experiment illustrations, data visualizations, and presentation graphics.

This document defines art direction, not research content. Paper-specific facts, labels, equations, relationships, and claims belong to the task that creates each figure. Do not turn one paper's structure into a permanent template here.

The goal is not to decorate a conventional academic diagram with Gnaroshi colors. A successful figure should carry the same authorship as `gnaroshi.dev` through hierarchy, composition, typography, geometry, color, and restraint while remaining credible in a paper.

## Agent Contract

Before creating or revising a scientific figure:

1. Read this document completely.
2. Inspect the current visual references rather than relying on a prose summary.
3. Separate the figure's scientific purpose from its visual direction.
4. Explore composition before selecting a production medium.
5. Review the rendered result at publication size, thumbnail size, and in grayscale.
6. Treat every new output as a candidate until it passes visual review.

When the owner approves or rejects a reusable visual decision, update this document in the same change. Record the decision in the log at the end. Do not record transient task details, private research content, paper-specific claims, or temporary implementation problems.

This guide does not mandate HTML, CSS, SVG, Figma, image generation, or any other construction method. The medium is an implementation choice and must not determine the design.

## Reference Board

Inspect these references visually before proposing a direction:

| Reference | Role | What to study | What not to inherit |
| --- | --- | --- | --- |
| `media-sources/evidence/gnaroshi-dev/home-desktop.png` | Primary editorial reference | Large type, dark and light contrast, confident hierarchy, square controls, broad whitespace | Page copy, navigation labels, or the literal webpage layout |
| The current rendered home and Research pages | Current site authority | Present typography, spacing, rhythm, image treatment, and responsive behavior | Stale content from an older screenshot |
| `media-sources/contact-sheets/technical-diagrams.png` | Diagram baseline | Quiet surfaces, readable grouping, short labels, simple paths, restrained green | Its exact composition as a universal template |
| `src/styles/tokens.css` | Canonical token source | Exact palette, font stacks, spacing steps, borders, hard shadows | UI-specific density that harms publication readability |
| `docs/design.md` | Site design intent | Academic/editorial identity, minimal chrome, pixel boundary, media roles | Application UI patterns that do not serve a figure |
| `docs/site-identity.md` | Identity boundary | Teal/orange ownership cues, angular and hard-edged character | Pasting the mascot into technical figures |
| `media-sources/identity/gnaroshi-site-v1/gnaroshi-site-mark-v1.png` | Shape and color reference | Sharp silhouette, bold outline, orange/teal tension, visual confidence | Literal ears, eyes, teeth, armor, or logo fragments |
| Approved Research concept scenes | Illustration reference | Concrete research activity, one recognizable subject, believable material | Fabricated evidence or a mandatory photographic style |

The reference board is not a mood board of interchangeable images. Each reference has a defined role. Current rendered pages and tokens override stale screenshots.

## The Gnaroshi Signature

Gnaroshi scientific figures should feel:

- academic, but not institutional;
- technical, but not diagram-software default;
- personal, but not decorated with a personal logo;
- bold, but not promotional;
- dense where the idea requires density, but never cramped;
- angular and precise, but not retro pixel art;
- contemporary, but not futuristic AI marketing.

The signature comes from six recurring properties.

### 1. Editorial hierarchy

The main argument is visually dominant. Large, decisive type and strong contrast establish the reading order before the reader follows small connectors or annotations.

A figure must not assign equal visual weight to every panel merely because the source material has several sections. Give the contribution, transition, result, or central comparison the space it needs.

### 2. Warm neutral field

Use warm off-white and near-black as the visual foundation. Most of the canvas should remain neutral. Accent colors explain ownership, state, or emphasis; they do not fill empty space.

### 3. Restrained green path

Deep green is the primary semantic accent. It may identify the main path, active state, contribution, or selected result. It should not outline every module.

### 4. Teal and orange tension

Teal and orange are small identity cues. Their contrast reflects the Gnaroshi mark without reproducing it. They work best as a short rule, square marker, endpoint, corner step, selected datum, or rare callout.

Orange is not a default highlight color. It should usually occupy less visual area than teal and far less than green.

### 5. Square, hard-edged geometry

Use square corners, crisp boundaries, integer-aligned shapes, and occasional short hard shadows. Rounded cards, blur shadows, pills, and soft floating surfaces weaken the identity.

### 6. Normal rendering for scientific content

Text, mathematics, charts, photographs, equipment, screenshots, and diagrams remain normally rendered. The pixel layer appears only in small boundaries, markers, or stepped details. Never pixelate the figure.

## Visual Foundation

### Color roles

Use the canonical values from `src/styles/tokens.css`. The following table describes their role in figures.

| Role | Token value | Typical use |
| --- | --- | --- |
| Page field | `#f4f5f2` | Outer canvas or surrounding editorial field |
| Figure surface | `#fcfdfb` | Main drawing surface |
| Raised surface | `#ffffff` | A necessary foreground plane, not every node |
| Quiet surface | `#eef1ec` | Secondary group or contextual band |
| Primary ink | `#18201c` | Titles, important labels, strong rules, primary connectors |
| Secondary ink | `#3f4943` | Normal labels and descriptions |
| Muted ink | `#5f6b63` | Metadata, context, secondary annotations |
| Border | `#d5dbd4` | Quiet dividers and low-emphasis boundaries |
| Strong border | `#aab5ac` | Structural boundaries |
| Primary green | `#126954` | Main semantic path or selected result |
| Dark green | `#084b3c` | Strong green text or high-contrast green edge |
| Soft green | `#dcebe5` | Limited highlighted surface |
| Identity teal | `#3fa6a0` | State, endpoint, short rule, ownership detail |
| Identity orange | `#e88945` | Rare counter-accent or small signature marker |
| Supporting blue | `#315f7e` | A genuinely separate information family when green and form are insufficient |
| Warm analytic | `#a6651d` | A genuine warm data category, not decoration |

Do not default to the familiar royal-blue-and-green palette of generic ML figures. Supporting blue is available, but it must have a semantic job.

As a starting balance:

- 70–85% neutral field and surfaces;
- 10–20% primary ink and green structure;
- less than 10% combined identity and secondary accents.

These are compositional checks, not automatic quotas.

### Typography

Typography should recall the site's editorial confidence without turning the figure into a webpage.

- Use the site sans-serif stack for titles and labels.
- Use the site monospace stack only for short indices, variables, technical identifiers, or metadata.
- Use mathematical typesetting for equations and symbols.
- Prefer sentence case.
- Keep headings short and direct.
- Let size, weight, alignment, and whitespace build hierarchy together.
- Avoid condensed type, outline type, excessive bold, negative tracking, and tiny explanatory copy.

At final publication size, ordinary labels should generally remain near 8 pt or larger. Conference or journal requirements override this target.

### Lines and edges

- Use a consistent stroke family.
- Quiet dividers should be lighter than causal connectors.
- Primary paths should be stronger than contextual relationships.
- Arrowheads should remain visible after reduction.
- Dashed and solid relationships must be distinguishable in grayscale.
- Reorder elements before allowing connectors to cross.
- Do not route connectors through text or around the entire figure when a closer relationship is possible.

### Spacing

Use the site's 4 px and 8 px rhythm as a family resemblance, then scale it for the final canvas. Spacing communicates relationships:

- close spacing means one unit;
- larger spacing means a conceptual boundary;
- whitespace should separate groups before a box does;
- a divider is justified only when whitespace is insufficient;
- outer safe margins must survive crop and publication placement.

## Composition

### Start with the visual argument

Before drawing, state the figure's purpose as one short sentence:

> This figure makes it immediately clear that …

If the sentence contains several unrelated claims, split the figure or establish a dominant claim with supporting panels.

### Build one focal hierarchy

Every figure needs:

1. one primary reading;
2. one supporting structure;
3. optional detail for close inspection.

The reader should understand the first level at thumbnail size. Small labels and technical annotations belong to the third level.

### Prefer asymmetric editorial layouts

Do not default to equal-width panels, a card grid, or a centered stack of boxes. Choose proportions that reflect importance and complexity.

Useful structures include:

- a dominant center with quieter input and outcome regions;
- a wide main method beside a narrow baseline;
- a top-level argument with details arranged below;
- a single continuous path with changes in density;
- a large result paired with a compact explanation;
- an asymmetric multi-panel spread with one anchor panel.

Symmetry is acceptable when the scientific comparison itself requires equal treatment.

### Use panels deliberately

Panel letters are publication navigation, not design. Keep them small and consistent. Do not combine them with oversized title bullets or use a full-height border around every panel by default.

Avoid bottom slogan boxes that repeat the caption. A short takeaway may sit on a rule, in a quiet footer line, or in the surrounding caption when needed.

### Use dark fields selectively

A dark ink field with large light typography is one of the strongest connections to the home hero. It can work for:

- an overview figure;
- a figure title band;
- a cover or poster figure;
- a high-level conceptual split.

It is not mandatory. Dense data figures and small paper panels may carry the identity through typography, geometry, color, and spacing instead. Always test the cost of a dark field in grayscale and print.

## Figure Families

### Conceptual editorial illustration

Use for a recognizable research activity, experimental setting, or broad scientific idea.

- Show one primary subject and one action.
- Make the subject clear within two seconds.
- Use believable equipment, material, scale, and lighting.
- Keep the composition editorial rather than cinematic.
- Use Gnaroshi colors through selected objects, framing, or environmental cues.
- Do not add abstract AI glow, floating interfaces, random equations, or decorative node clouds.

### Method or architecture figure

Use for modules, transformations, state, supervision, or system relationships.

- Make the central contribution visibly dominant.
- Separate context, operation, and result through hierarchy rather than repeated cards.
- Use restrained shapes and direct labels.
- Group repeated elements instead of duplicating a large box for each time step.
- Give frozen, optional, repeated, or inferred relationships a distinct form in addition to color.
- Do not make the figure look like a software dashboard.

### Process or workflow

Use for ordered research, reading, execution, or publication stages.

- Establish a visible start, progression, and outcome.
- Use numbering when it improves reading without connectors.
- Give each stage one action.
- Show a loop only when recurrence is part of the meaning.
- Avoid decorative circular flows and ribbon diagrams.

### Data visualization

Data integrity takes precedence over the house style.

- Use real values and named units.
- Use direct labels when they reduce legend lookup.
- Combine color with line style, marker, pattern, position, or annotation.
- Keep grid lines and framing quiet.
- Avoid 3D charts, truncated visual exaggeration, decorative backgrounds, and color ramps with no data meaning.
- Apply Gnaroshi identity mainly through typography, ink, spacing, annotations, and a restrained selected series.

### Experimental apparatus or scene

Use when physical arrangement matters.

- Prefer a clear view of the actual or credible apparatus.
- Show the spatial relationship among sensors, task objects, agents, and outputs.
- Use callouts only where the image alone cannot explain the setup.
- Keep labels outside important visual evidence.
- Do not turn an apparatus image into a busy catalog of outlined parts.

### Hybrid figure

A hybrid figure may combine a scene, diagram, plot, and annotation.

- Choose one visual anchor.
- Make the change in media type deliberate.
- Align type, color, and spacing across media.
- Do not force every element into the same card treatment.
- Do not use generated visuals as experimental evidence.

## Identity Motifs

Choose a small subset of these motifs for each figure. Using all of them at once creates a theme rather than an identity.

- a large editorial heading;
- a near-black field or rule;
- a short green emphasis path;
- a small teal endpoint;
- a rare orange square or corner;
- a monospaced section index;
- a stepped 2 px corner;
- a short hard shadow on one focal element;
- an angular crop or silhouette;
- a long quiet divider with generous whitespace.

Two or three well-placed motifs are usually enough.

Do not use literal mascot features in a scientific figure. The identity mark is a reference for confidence, angularity, outline strength, and color tension—not a source of decorative ears, eyes, teeth, or armor.

## Production Medium

Select the medium after the composition direction is clear.

### Do not default to code

HTML/CSS, Canvas, SVG, and programmatic drawing can produce exact and repeatable geometry, but convenience is not visual quality. Do not choose code merely because Codex can generate it.

Code is appropriate only when:

- precise data or reproducibility materially benefits the figure;
- the approved composition can be reproduced without flattening its visual character;
- the renderer supports the required typography, imagery, and geometry;
- the rendered result passes the same visual review as any other medium.

Code is not the fallback for a figure whose art direction has not been solved.

Mermaid output is planning material, not a publication figure.

### Do not default to image generation

Image generation is appropriate for raster illustrations, scenes, visual metaphors, textures, and candidate directions. It is unreliable for exact labels, equations, charts, architecture, or dense relationships.

A generated visual may become one layer in a hybrid composition. It must not supply scientific text, data, evidence, or diagram logic.

### Use the strongest available craft path

Figma, illustration software, slide tools, drawing tools, image generation, manual composition, and programmatic rendering are all acceptable when they serve the approved direction.

Unless the owner explicitly asks for vector output, full-color generated visuals and final review candidates are raster. Keep the best available editable source when the workflow produces one.

## Failure Modes

Reject a candidate when it exhibits any of the following:

- generic PowerPoint academic styling;
- three or more equal bordered panels without a scientific reason;
- a grid of repeated rounded cards;
- generic royal blue used as the automatic technical color;
- every module outlined in an accent color;
- weak hierarchy in which titles, nodes, annotations, and outcomes compete;
- cramped connectors and small labels;
- large empty areas filled with icons, slogans, gradients, or decoration;
- boxed footer slogans that repeat the caption;
- lock, brain, robot-head, sparkle, or circuit icons used as generic shorthand;
- a dashboard or product UI appearance;
- corporate infographic polish;
- neon, glass, glow, soft blur, glossy 3D, or isometric decoration;
- full-image pixel treatment or bitmap typography;
- a pasted logo or mascot used to manufacture identity;
- a code-generated look with mechanical boxes and no editorial composition;
- technically neat output that does not feel authored.

Correctness and cleanliness are necessary but not sufficient. A figure can be perfectly aligned and still fail because it is anonymous.

## Review Loop

### 1. Direction pass

Create several meaningfully different composition directions before polishing. They must differ in hierarchy and spatial argument, not just color.

Compare candidates at low detail. If they all look like the same panel grid, the exploration failed.

### 2. Reference comparison

Place the candidate beside the home screenshot, the current site, and the technical-diagram contact sheet.

Ask:

- Does the typography have the site's confidence?
- Is the background warm and the ink deep?
- Is there a clear editorial focal point?
- Are accents restrained but recognizable?
- Does the geometry feel square, crisp, and intentional?
- Is the result still a serious scientific figure?

### 3. Reduction pass

Remove:

- boxes that do not define a real boundary;
- arrows that repeat spatial order;
- labels already supplied by the caption;
- repeated icons;
- decorative frames;
- weak secondary accents;
- equal sizing that hides importance.

### 4. Scale tests

Review at:

- full working size;
- expected paper size;
- 160 px thumbnail;
- grayscale;
- light and dark surrounding pages when relevant.

### 5. Score

Score each candidate from 0 to 5:

| Dimension | Question |
| --- | --- |
| Semantic clarity | Is the broad subject or argument immediate? |
| Hierarchy | Is the most important idea visibly dominant? |
| Gnaroshi distinctiveness | Could this plausibly belong to another generic ML paper? |
| Scientific credibility | Does the treatment feel precise and serious? |
| Craft | Are typography, spacing, lines, crops, and alignment controlled? |
| Restraint | Has decoration been kept subordinate to meaning? |
| Publication fitness | Does it survive scale, grayscale, and surrounding copy? |

A candidate fails when Gnaroshi distinctiveness, hierarchy, or scientific credibility is below 4. Numeric passage does not equal approval.

### 6. Record durable decisions

After owner review:

- add reusable approvals or rejections to the decision log;
- update the relevant rule when the decision changes the system;
- keep rejected candidates outside production;
- do not turn paper-specific feedback into a global rule without evidence that it recurs.

## Figure Brief

A figure task should provide a compact brief separate from this art direction:

- purpose;
- one-sentence visual argument;
- audience and publication context;
- figure family;
- required concepts or data;
- language;
- expected placement and size;
- available references or evidence;
- output format;
- accessibility or print constraints.

The art direction should remain stable while the brief changes from figure to figure.

## Decision Log

### 2026-07-19 — Reject generic academic-template output

Rejected characteristics:

- equal-width, full-height bordered panels;
- generic blue/green module styling;
- weak editorial hierarchy;
- dense repeated boxes;
- lock icons and other generic technical shorthand;
- boxed summary slogans;
- visual anonymity despite technically complete content.

### 2026-07-19 — Reject code-first art direction

Code is no longer the default response to technical-figure work. Composition and visual authorship must be established before a production medium is selected. Programmatic rendering remains available when it can execute an approved direction with sufficient craft.

### 2026-07-19 — Strengthen homepage-derived authorship

Future directions should draw more clearly from the site's large editorial typography, warm neutral field, deep ink, asymmetric hierarchy, restrained green path, square hard edges, and small teal/orange ownership cues. The mascot itself remains outside ordinary scientific figures.
