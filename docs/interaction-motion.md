# Interaction And Motion

This site uses motion to explain navigation, reading progress, and available actions. Motion is progressive enhancement: content, routes, and controls remain complete when a browser does not support a feature or when the visitor requests reduced motion.

## Current Approach

### Document navigation without snapshot ghosts

Pages use ordinary Astro multi-page navigation. Cross-document bitmap transitions are explicitly disabled: the previous implementation left outgoing text at 35% opacity, while incoming text and the browser's root transition were also visible. A revised snapshot wipe also blocked rapid navigation into scroll-animated pages in browser testing. It was rejected rather than shipped.

Only the incoming `main` receives a 280ms clip reveal. The header remains outside that animation, no outgoing snapshot exists, and the clip is removed when the animation ends. Content remains at full contrast, geometry never moves, and the next navigation remains operable. Reduced-motion makes entry immediate.

Locale changes, direct loads, history, and rapid repeated navigation follow the same complete document lifecycle. No client router or animation runtime intercepts route changes.

Astro's built-in intent prefetch warms only marked public navigation/hero destinations on deliberate hover/focus, or tap on mobile. It does not preload all routes, assets, or the 3D engine, and uses Astro's data-saver/slow-connection fallback. See [Astro prefetch](https://docs.astro.build/en/guides/prefetch/).

### Page and section entry

Page headers draw their identity rail without moving the heading. Home uses one-time, 12px staggered copy entry and a contained 3.5% image entry. Text remains at full contrast. Editorial sections and sticky indexes never translate during scrolling: their spacing is identical with ordinary and reduced motion. There are no blank heading spacer rows.

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

Three.js `CSS3DRenderer` supplies actual perspective to ordinary DOM evidence. It needs no WebGL canvas, texture copies, continuously running GPU renderer, or React hydration. The engine loads when the desk approaches the viewport; it is not globally loaded. Motion settles after 850ms, stops offscreen/background, and tears down on page exit. Reduced-motion avoids the engine and keeps the same selection/workflow controls with immediate flat views. Without JavaScript, the first approved evidence and case-study link remain readable. A failed engine import keeps every ordinary selection available.

The desk reserves its story geometry across selection and turning. The front uses that space for existing limitations rather than leaving a hidden-workflow-sized blank. Mobile choices use three stable columns, and dragging never captures a vertical scrolling gesture. DOM screenshot pixel checks, input/state tests, and the complete EN/KO light/dark viewport matrix verify the scene; canvas pixel checks still apply separately to About's WebGL identity.

`CSS3DRenderer` documents a 100% zoom limit. Detected pinch zoom or a pixel-ratio change therefore restores the flat DOM view, preserving the selected story, and restores perspective when the zoom returns. Lucide controls are server-rendered SVGs with local ISC/Feather MIT attribution; no icon client runtime is hydrated.

### Opt-in identity interaction

About renders the existing approved full-face logo, not a replacement asset or portrait. Clicks one and two give a short press/rotation response. Click three loads a Three.js relief reconstructed from the approved raster. Clicks four and five produce rotational impulses; click six adds a view-dependent prismatic foil shader. Later clicks repeat the response without adding a timer loop. The effect is personal identity, not evidence of a product or achievement; no commercial trading-card artwork is used.

Pointer position and arrow keys change the relief angle. Enter/Space activate the same click sequence. Reset returns focus to the logo and disposes the renderer; pause stops motion. Reduced-motion preserves all six state changes with immediate rendering. Failed WebGL/import leaves the approved original visible with an honest unavailable state.

The engine is dynamically imported only on click three, never on Home, Research, Projects, or initial About. One instanced draw call uses a 64×64 raster grid. Pixel ratio is capped at 1.5; rendering stops after an interaction settles, while paused, offscreen, or in a hidden document. Page exit releases geometry/material/WebGL resources; history restoration safely reconstructs the view. No React island or external texture request is introduced.

### Content-led About, Research, and Projects

The three editorial routes do not repeat the Home flip interaction:

- About connects a selected technology to the public projects whose verified `techStack` includes it. Desktop draws only those relationships in the reserved column gutter; mobile shows the matching project links without connectors. Arrow keys and ordinary buttons use the same selection. This is a view of project technologies, not a skill score or a claim of mastery. The introduction and existing biography share one column beside the approved identity, avoiding a separate sparse biography band.
- Research offers a focused question view and an explicit complete view. The existing question links and hashes select the relevant topic before the shared anchor controller focuses it. Direct loads, history, and scrolling retain one current navigation item. The selected reading lens can compare the existing hypothesis and uncertainty side by side; comparison expands naturally on narrow screens rather than leaving a large reserved blank region. Same-document navigation preserves an explicit complete-view choice. No-JavaScript keeps all three questions and both positions readable.
- Projects lets visitors scrub three approved demo captures for each featured application. A native range, previous/next controls, and the matching scenario description change together. The expand link opens the selected approved original for reading small application text. Only captured steps appear; missing captures are not fabricated or inferred. Product status, source provenance, and demo disclosure are unchanged. App identity and summary precede the viewer on narrow/paired layouts. Without JavaScript the approved primary screen and ordinary detail link remain useful.

Selection changes use one-time connector or incoming-image traces, not idle loops. All new content uses static Astro and route-local DOM controllers, with no new dependency or React hydration. Focus on the reading lenses and app controls is made visible immediately instead of waiting for a long page-scroll animation. Scroll margins reserve the actual header/local-navigation boundary. Reduced-motion retains every state without the trace.

QA measures adjacent block gaps in a single browser frame, checks focused-control hit testing, inspects full-page and detailed captures, and verifies normal/reduced-motion geometry. Below-fold media is deliberately scrolled into view before full-page QA capture; a screenshot of an unrequested lazy image is not treated as a broken public image. See [the content interaction QA record](content-interactions-qa-2026-10-13.md).

## Constraints

- No custom cursor.
- No automatic looping animation.
- No parallax or decorative scroll choreography.
- No animation that hides required content before JavaScript runs.
- No transform that changes layout dimensions.
- No scroll transform that creates visual gaps between otherwise adjacent content.
- No hover zoom or inset ornament that crops meaningful screenshot evidence.
- No motion-only status communication.
- No animation framework for effects supported by native CSS.
- `prefers-reduced-motion: reduce` disables page, control, dialog, menu, and media motion.

## Browser Strategy

Scroll-driven progress, `@starting-style`, and intrinsic-size disclosure transitions are progressive enhancements. Unsupported browsers keep normal navigation, a static header, and immediate state changes. Three.js is route-owned: Home uses its DOM renderer for project exploration, while About loads the WebGL identity only on the third click. Ordinary navigation and reading interaction need no animation library.

References:

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
