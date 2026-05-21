---
"@w5-ui/svelte": minor
---

Add a `portal` Svelte action and wire it into `Popover`: the panel is now rendered inside `document.body` instead of as an inline sibling of the trigger. This makes the popover immune to ancestor `overflow: hidden`, `transform`-based containing blocks, and stacking-context traps — the panel's `position: fixed` + `z-index` always escape to the viewport.

Click-outside detection now treats the portalled panel as "inside" so clicks within the panel no longer dismiss it.

The `portal` action is also exported from the package root for use by consumer floating-UI primitives that want the same behaviour.
