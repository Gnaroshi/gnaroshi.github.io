# Icon System

## Visual Language

- 24x24 viewBox.
- 1.8 stroke width.
- Round caps and joins.
- `currentColor`; no hardcoded color, fill, gradient, shadow, or multicolor treatment.
- Two to four paths where practical.
- Shared optical center and baseline behavior.
- Sizes: 16 metadata, 18 inline links, 20 buttons, 24 navigation/empty-state lead, 32 maximum.

Functional icons use SVG. Content imagery and data visualization follow their own rules.

## Usage

- Desktop primary navigation remains text-only.
- Important commands keep visible text. An icon supports the label rather than replacing it.
- Icon-only buttons require a localized accessible name and at least a 44x44 touch target.
- Decorative icons use `aria-hidden="true"`.
- External links, copy, checks, warnings, and information use their specific icon.
- Paper Lab may use Paper, Review, Formula, Microphone, and Code where they improve scanning.
- Growth uses icons only beside real metrics. Trophy, fire, lightning, medal, and other gamification symbols are prohibited.

## Candidate Review

`/dev/media-review/icons/` displays the candidate registry at 16, 20, and 24 pixels in light/dark, button, link, navigation, and disabled contexts with bounding, center, and baseline guides.

The current production Sun/Moon pair is the optical baseline. Mobile CSS glyphs and the Unicode external-link arrow remain legacy exceptions until Stage 2; replacing them before review would bypass the approval gate.

## Registry Contract

Candidate registry fields are `name`, `purpose`, `usedBy`, `decorativeAllowed`, and `accessibleLabelRequired`. Stage 2 converts only approved, actually used candidates into production Astro components and removes any unused component.
