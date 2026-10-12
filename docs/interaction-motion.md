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

### Opt-in identity interaction

About renders the existing approved full-face logo, not a replacement asset or portrait. Clicks one and two give a short press/rotation response. Click three loads a Three.js relief reconstructed from the approved raster. Clicks four and five produce rotational impulses; click six adds a view-dependent prismatic foil shader. Later clicks repeat the response without adding a timer loop. The effect is personal identity, not evidence of a product or achievement; no commercial trading-card artwork is used.

Pointer position and arrow keys change the relief angle. Enter/Space activate the same click sequence. Reset returns focus to the logo and disposes the renderer; pause stops motion. Reduced-motion preserves all six state changes with immediate rendering. Failed WebGL/import leaves the approved original visible with an honest unavailable state.

The engine is dynamically imported only on click three, never on Home, Research, Projects, or initial About. One instanced draw call uses a 64×64 raster grid. Pixel ratio is capped at 1.5; rendering stops after an interaction settles, while paused, offscreen, or in a hidden document. Page exit releases geometry/material/WebGL resources; history restoration safely reconstructs the view. No React island or external texture request is introduced.

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

Scroll-driven progress, `@starting-style`, and intrinsic-size disclosure transitions are progressive enhancements. Unsupported browsers keep normal navigation, a static header, and immediate state changes. Three.js is required only for the explicitly requested, opt-in About object; ordinary page interaction needs no animation library.

References:

- [MDN: Using the View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [MDN: Scroll-driven animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines)
- [Chrome: intrinsic-size animation](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)
- [Chrome: Web UI at I/O 2026](https://developer.chrome.com/blog/new-in-web-ui-io26)
- [Linear: March 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Chrome: snapshot cross-fade and blending behavior](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
- [Three.js: ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html)

## Review Checklist

- Does the motion explain destination, progress, or state?
- Does the interface remain clear in a still screenshot?
- Does keyboard activation produce the same result as pointer activation?
- Is exactly one item current within each navigation scope?
- Does the interaction preserve focus and sticky-header offset?
- Does reduced-motion remove the effect without removing feedback?
- Is mobile horizontal navigation discoverable and is the active item fully visible?
- Can a reviewer perceive each intended effect at normal speed without being told where to look?
