---
'@w5-ui/wc': minor
'@w5-ui/svelte': patch
---

fix(wc): style every custom element inside its shadow root

`uni-*` elements rendered with browser-default styling: the Svelte components are styled with
Tailwind utilities, and page stylesheets never reach a shadow root. The bundle now compiles the
components' CSS (Tailwind over the `@w5-ui/svelte` sources, with the dashboard chrome in
`@layer base`) and adopts it into every shadow root as one shared constructable stylesheet, with a
`<style>` fallback. Tailwind's `@property` rules are registered on the document once, and the
cyclic `--x: var(--x)` theme bridge variables are dropped so page tokens (radius, fonts, easing)
inherit into the elements. The bundle grows by about 30 kB gzipped.

Also fixed, in `@w5-ui/svelte` and so in `uni-popover`:

- `Popover` opened its panel at the top-left of the viewport: the default trigger lacked
  `aria-haspopup="dialog"`, which is how the panel finds its anchor. The trigger now also exposes
  `aria-expanded`.
- Inside a shadow root, pressing within the popover panel closed it (the document sees the event
  retargeted to the host); outside-click detection now uses `composedPath()`.
- `Pagination` painted the current page white on a transparent background (its idle
  `bg-transparent` won over `bg-brand-05`), invisible in the light motif. Idle and current styles are
  now exclusive.
- The `portal` action keeps a node inside its enclosing shadow root by default, so portalled
  panels keep the element's styles. Outside shadow DOM it still portals to `document.body`.
