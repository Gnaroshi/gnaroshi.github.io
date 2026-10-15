# Interaction And Motion

This site uses motion to manipulate real project evidence, research figures, and the approved personal identity. Content, routes, and controls remain complete without motion or JavaScript. The owner rejected the repeated abstract introductory scenes on 2026-10-15 because they were unrelated to the content and expensive during ordinary pointer input. Their older QA records are historical, not current acceptance.

## Current Approach

### Content before effects

The four core pages do not mount WebGL on entry. Compact introductions lead directly to their actual material: project evidence on Home, question-linked figures on Research, purpose-filtered projects and named demo stages on Projects, and the approved logo on About. No blank scene reservation, contour backdrop, or generic construction geometry remains.

Each direct manipulation changes existing content or its inspection state. Keyboard alternatives, static HTML, reduced-motion behavior, meaningful image alternatives, and visible provenance are required. About's personal relief is an explicit opt-in exception; its approved identity is not substituted with new artwork.

Startup bytes and main-thread work during identical throttled input are measured before and after changes in both development and production. FPS caps and bounded timers do not by themselves prove responsiveness. See the current content-led QA record for conditions, actual results, and limitations.

The request for a creative interactive site is not reduced to hover styling: evidence selection, direct dragging, zoom/pan, purpose filtering, captured workflow steps, and the opt-in relief have distinct outcomes. No custom cursor, scroll hijacking, snapshot transitions, invented activity, or generated application screenshot is added.

### Document navigation without snapshot ghosts

Pages use ordinary Astro multi-page navigation. Cross-document bitmap transitions are explicitly disabled: the previous implementation left outgoing text at 35% opacity, while incoming text and the browser's root transition were also visible. A revised snapshot wipe also blocked rapid navigation into scroll-animated pages in browser testing. It was rejected rather than shipped.

Neither outgoing nor incoming content receives a document-wide transition. The former 280ms root clip hid lower sections on long pages, and staggered horizontal text entry briefly clipped leading characters. Both are removed. Required text is readable in its final position from first paint, while explicit artifact interactions retain their own bounded transitions.

Locale changes, direct loads, history, and rapid repeated navigation follow the same complete document lifecycle. No client router or animation runtime intercepts route changes.

Astro's built-in intent prefetch warms only marked public navigation/hero destinations on deliberate hover/focus, or tap on mobile. It does not preload all routes, assets, or the 3D engine, and uses Astro's data-saver/slow-connection fallback. See [Astro prefetch](https://docs.astro.build/en/guides/prefetch/).

### Page and section entry

Page headers draw their identity rail without moving the heading. Home text does not stagger, translate or wait behind a reveal. Editorial sections and sticky indexes never translate during scrolling: spacing is identical with ordinary and reduced motion. There are no blank heading spacer rows or body-wide clipping layers.

### Long-page progress

Research, Projects, and project detail pages show a four-pixel, two-color reading-progress line at the bottom of the sticky header. It uses a CSS scroll progress timeline, so progress follows the visitor's scroll without a JavaScript scroll listener.

### Section indexes

Research, Projects, and the long `gnaroshi.dev` case study use compact sticky indexes. The index:

- names real destinations instead of generic sequence labels;
- keeps exactly one current section;
- follows hash navigation, direct loads, history, keyboard activation, and scrolling;
- moves the active item into view on narrow screens;
- leaves the full section content in the document.

### State transitions

Actions change color and shadow without lifting their hit targets. Linked evidence images retain their readable size and crop; a bottom rail identifies the destination on hover or focus. Section indexes animate their current underline. Theme state, mobile menus, and media dialogs retain native state transitions.

The optional personal reading checklist starts collapsed. Browsers supporting `interpolate-size` animate its requested disclosure; others open it immediately. The system explorer traces downstream connections once after a selection. It does not simulate live publishing or run a loop. Mobile workflow controls reserve the same border width in every state.

Pointer presses on commands and project links produce a short pixel-corner pulse without moving the target. Application role icons respond to hover/focus; evidence screenshots remain unscaled. Research question lenses switch between the existing hypothesis and uncertainty, with one selected tab, arrow-key navigation, stable panel height, and a no-JavaScript reading fallback.

Palette changes are immediate on text-bearing buttons/surfaces. Interpolating light and dark button backgrounds created a gray midpoint with insufficient text contrast; shadow, border, icon, and press feedback carry motion instead of blending foreground/background palettes.

### Discoverable project desk

Home now places a three-project desk immediately after the compact personal introduction, before research questions. It is a content exploration surface, not another hover effect: project selection rearranges the evidence sheets and replaces the title, summary, limitations, disclosure, and detail destination. Horizontal dragging selects the next or previous project; clicking the active sheet or the workflow control turns it over to the existing example workflow. Arrow keys and Space provide equivalent input. Reset returns to the first front-facing project.

The sources are the already-approved VLA repository evidence, Studio managed-app screen, and PaperFlow plan-review screen. No replacement screenshot or new achievement is generated. Demo disclosure stays visible, and the selected image receives its localized alternative. Inactive sheets are decorative previews with empty alt; their story and focus targets are inert. The readable workflow is outside the perspective scene, so its text is never available only as a rotated visual.

Native CSS perspective and transforms supply depth to ordinary DOM evidence. The small controller changes CSS variables only after selection or coalesced drag input; it has no render loop, WebGL context, texture copies, engine, or React hydration. Reduced-motion keeps selection/workflow controls with immediate flat views. Without JavaScript, the first approved evidence and case-study link remain readable.

The evidence stage and controls retain fixed geometry across selection and turning. Only the chosen story participates in layout; inactive workflows no longer reserve a large blank below short summaries. Explicit selection can change the following document height, without moving the controls. Mobile choices use three stable columns, and dragging never captures a vertical scrolling gesture. DOM screenshot pixel checks and input/state tests verify the scene; canvas pixel checks apply separately to About's WebGL identity.

Detected pinch zoom or pixel-ratio changes restore the flat DOM view, preserving the selected story. Lucide controls are server-rendered SVGs with local ISC/Feather MIT attribution; no icon client runtime is hydrated.

### Opt-in identity interaction

About renders the existing approved full-face logo, not a replacement asset or portrait. Clicks one and two give a short press/rotation response. Click three loads a Three.js relief reconstructed from the approved raster. Clicks four and five produce rotational impulses; click six adds a view-dependent prismatic foil shader. Later clicks repeat the response without adding a timer loop. The effect is personal identity, not evidence of a product or achievement; no commercial trading-card artwork is used.

After 3D activation, mouse/pen position anywhere in the page changes the relief angle, normalized around the logo and clamped to the existing bounded tilt. The logo never follows the pointer by moving its layout position. Input is coalesced to one update per frame; touch scrolling does not drive tilt. Enter/Space activate the same click sequence, and arrow keys change the angle. On the focused logo, Escape resets/disposes and P pauses/resumes. The visible identity caption, click indicators, and control row are removed at the owner's request; an offscreen localized status and accessible keyboard shortcuts remain. Reduced-motion disables passive pointer tracking while preserving explicit state changes and keyboard input. Failed WebGL/import leaves the approved original visible with an honest accessible unavailable state.

The identity-specific relief engine and Three.js core are dynamically imported only on click three. One instanced draw call uses a 64×64 raster grid. Pixel ratio is capped at 1.5; rendering stops after an interaction settles, while paused, offscreen, or in a hidden document. Fresh viewport geometry governs resumed input. A resized backing buffer receives one static repaint; there is no offscreen animation loop. Page exit releases geometry/material/WebGL resources; history restoration reconstructs the view. No React island or external texture request is introduced.

### Content-led About, Research, and Projects

The three editorial routes do not repeat the Home flip interaction:

- About connects a selected technology to the public projects whose verified `techStack` includes it. Desktop draws only those relationships in the reserved column gutter; mobile shows the matching project links without connectors. Arrow keys and ordinary buttons use the same selection. This is a view of project technologies, not a skill score or a claim of mastery. The introduction and existing biography share one column beside the approved identity. The owner removed the generic Skills and tools lists and the map's redundant count/explanatory copy; the verified connection map remains a compact independent section.
- Research offers a directly draggable image explorer, not a framed card with hover effects. Embla 8.6.0 (MIT, bundled locally) provides bounded drag/snap physics without a React wrapper or autoplay plugin. Dragging an existing image changes its question, explanation, selected thumbnail, provenance caption, and hash together. Arrow buttons and Arrow/Home/End keys provide equivalent input. The question stays in its original article; nested CSS subgrids align the separate figure without moving the heading after first paint. Mobile places the viewer above longer copy. Inactive slides are inert and have empty image alternatives; the active image remains meaningful. Native focus-scroll offsets are reset without changing engine position. Existing question links reveal the target before focus. All questions restores complete static articles. No-JavaScript retains all three questions and both positions. Reduced motion snaps immediately, and no idle animation runs. The lens compares hypothesis and uncertainty without moving a pointer hit target during focus. Explicit zoom/pan inspects the actual figure and cannot trigger slide dragging.
- Projects lets visitors scrub three approved demo captures for each featured application. A native range, previous/next controls, and the matching scenario description change together. The expand link opens the selected approved original for reading small application text. Only captured steps appear; missing captures are not fabricated or inferred. Product status, source provenance, and demo disclosure are unchanged. App identity and summary precede the viewer on narrow/paired layouts. Without JavaScript the approved primary screen and ordinary detail link remain useful.

Selection changes use bounded, input-driven motion, not idle loops. Content uses static Astro and route-local DOM controllers without React hydration. Research's small drag/snap engine is the only new dependency in this revision, loaded only on Research. Focus on reading lenses and app controls stays visible after state changes. Scroll margins reserve the actual header/local-navigation boundary. Reduced-motion retains every state without the trace.

QA measures adjacent block gaps in a single browser frame, checks focused-control hit testing, inspects full-page and detailed captures, and verifies normal/reduced-motion geometry. Below-fold media is deliberately scrolled into view before full-page QA capture; a screenshot of an unrequested lazy image is not treated as a broken public image. See [the content interaction QA record](content-interactions-qa-2026-10-13.md).

## Constraints

- No custom cursor.
- No automatic introductory render loop.
- Passive pointer tracking is limited to the explicitly activated About identity.
- No animation that hides required content before JavaScript runs.
- No transform that changes layout dimensions.
- No scroll transform that creates visual gaps between otherwise adjacent content.
- No hover zoom or inset ornament that crops meaningful screenshot evidence.
- No motion-only status communication.
- No animation framework for effects supported by native CSS.
- `prefers-reduced-motion: reduce` disables page, control, dialog, menu, and media motion.

## Browser Strategy

Scroll-driven progress, `@starting-style`, and intrinsic-size disclosure transitions are progressive enhancements. Unsupported browsers keep normal navigation and immediate state changes. Three.js is exclusive to the opt-in About relief. Home uses native CSS. Research retains its small bounded Embla controller. Ordinary navigation and reading need no animation library. The current research and self-applied prompt are in [content-led-interaction-brief.md](content-led-interaction-brief.md).

References:

- [Arnaud Rocca](https://arnaudrocca.fr) and [the author's implementation case study](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/): reviewed the loaded full-bleed scene after the initial loader; informed directly manipulable surfaces, not copied assets or code.
- [Bruno Simon](https://bruno-simon.com) and [Lusion](https://lusion.co): reviewed as references, but the captured sessions remained at splash/loading screens. Those captures are not proof that the full experiences were tested. No third-party graphics were imported.
- [Swiss-inspired WebGL portfolio case study](https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/): editorial hierarchy paired with expressive geometry, rather than adding the same effect to every article.

- [Codrops: interactive stamp collection, June 2026](https://tympanus.net/codrops/2026/06/09/building-an-interactive-digital-stamp-collection-with-shaders-postcards-and-playful-inspection/): inspiration for direct manipulation of meaningful artifacts, not copied artwork, shaders, or a repeated card flip.
- [Embla Carousel source](https://github.com/davidjerleke/embla-carousel): the bounded drag/snap engine; exact 8.6.0 MIT attribution is bundled at `public/licenses/embla-carousel.txt`.

- [MDN: Using the View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [MDN: Scroll-driven animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines)
- [Chrome: intrinsic-size animation](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)
- [Chrome: Web UI at I/O 2026](https://developer.chrome.com/blog/new-in-web-ui-io26)
- [Linear: March 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Chrome: snapshot cross-fade and blending behavior](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [Three.js: ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)
- [Three.js: CSS3DRenderer](https://threejs.org/docs/pages/CSS3DRenderer.html)
- [Three.js: rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html)

## Review Checklist

- Does the motion explain destination, progress, or state?
- Does the interface remain clear in a still screenshot?
- Does keyboard activation produce the same result as pointer activation?
- Is exactly one item current within each navigation scope?
- Does the interaction preserve focus and sticky-header offset?
- Does reduced-motion remove the effect without removing feedback?
- Is mobile horizontal navigation discoverable and is the active item fully visible?
- Can a reviewer perceive each intended effect at normal speed without being told where to look?
