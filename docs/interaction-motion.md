# Interaction And Motion

This site uses motion to explain navigation, reading progress, and available actions. Motion is progressive enhancement: content, routes, and controls remain complete when a browser does not support a feature or when the visitor requests reduced motion.

## Current Approach

### Cross-document navigation

Same-origin page changes opt into the CSS View Transition API with `@view-transition { navigation: auto; }`. Supporting browsers use a 480-millisecond opacity transition without displacing content. Other browsers perform normal Astro multi-page navigation.

The site mark has a stable transition identity so the persistent brand does not appear to jump between pages.

Locale switches opt out before navigation. This avoids carrying a document snapshot across different `lang` trees and keeps reload, focus, and mobile-menu behavior deterministic.

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

View Transitions, scroll-driven progress, `@starting-style`, and intrinsic-size disclosure transitions are progressive enhancements. Unsupported browsers keep normal navigation, a static header, and immediate state changes. No runtime animation library is required.

References:

- [MDN: Using the View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [MDN: Scroll-driven animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines)
- [Chrome: intrinsic-size animation](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)
- [Chrome: Web UI at I/O 2026](https://developer.chrome.com/blog/new-in-web-ui-io26)
- [Linear: March 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh)

## Review Checklist

- Does the motion explain destination, progress, or state?
- Does the interface remain clear in a still screenshot?
- Does keyboard activation produce the same result as pointer activation?
- Is exactly one item current within each navigation scope?
- Does the interaction preserve focus and sticky-header offset?
- Does reduced-motion remove the effect without removing feedback?
- Is mobile horizontal navigation discoverable and is the active item fully visible?
- Can a reviewer perceive each intended effect at normal speed without being told where to look?
