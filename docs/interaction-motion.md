# Interaction And Motion

This site uses motion to explain navigation, reading progress, and available actions. Motion is progressive enhancement: content, routes, and controls remain complete when a browser does not support a feature or when the visitor requests reduced motion.

## Current Approach

### Cross-document navigation

Same-origin page changes opt into the CSS View Transition API with `@view-transition { navigation: auto; }`. Supporting browsers use a short opacity and vertical-position transition. Other browsers perform normal Astro multi-page navigation.

The site mark has a stable transition identity so the persistent brand does not appear to jump between pages.

Locale switches opt out before navigation. This avoids carrying a document snapshot across different `lang` trees and keeps reload, focus, and mobile-menu behavior deterministic.

### Long-page progress

Research, Projects, and project detail pages show a two-pixel reading-progress line at the bottom of the sticky header. It uses a CSS scroll progress timeline, so progress follows the visitor's scroll without a JavaScript scroll listener.

### Section indexes

Research, Projects, and the long `gnaroshi.dev` case study use compact sticky indexes. The index:

- names real destinations instead of generic sequence labels;
- keeps exactly one current section;
- follows hash navigation, direct loads, history, keyboard activation, and scrolling;
- moves the active item into view on narrow screens;
- leaves the full section content in the document.

### State transitions

Buttons, linked evidence media, theme state, the mobile menu, and media dialogs use short transitions. These transitions identify an available action or a state change; they do not run on a loop.

## Constraints

- No custom cursor.
- No automatic looping animation.
- No parallax or decorative scroll choreography.
- No animation that hides required content before JavaScript runs.
- No transform that changes layout dimensions.
- No motion-only status communication.
- No animation framework for effects supported by native CSS.
- `prefers-reduced-motion: reduce` disables page, control, dialog, menu, and media motion.

## Browser Strategy

View Transitions, scroll-driven animations, and `@starting-style` are used only as progressive enhancements. Unsupported browsers keep normal navigation, a static header, and immediately visible menus and dialogs.

References:

- [MDN: Using the View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [MDN: Scroll-driven animation timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines)

## Review Checklist

- Does the motion explain destination, progress, or state?
- Does the interface remain clear in a still screenshot?
- Does keyboard activation produce the same result as pointer activation?
- Is exactly one item current within each navigation scope?
- Does the interaction preserve focus and sticky-header offset?
- Does reduced-motion remove the effect without removing feedback?
- Is mobile horizontal navigation discoverable and is the active item fully visible?
