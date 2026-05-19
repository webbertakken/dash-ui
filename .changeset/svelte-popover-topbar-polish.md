---
"@w5-ui/svelte": minor
---

Popover: `open` is now bindable, accepts a custom `trigger` snippet, and the panel is rendered with `position: fixed` and clamped inside the viewport on open + resize so it can no longer overflow when its trigger sits near a screen edge.

Topbar: visual polish on the header chrome and active tab treatment (flatter surfaces on `--bg-1`, no bottom border, no active underline). Pure styling, no API change.
