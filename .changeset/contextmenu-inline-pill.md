---
'@w5-ui/svelte': minor
---

feat(ContextMenu): inline `pill` badge via a `{pill}` label slot

Adds an optional `pill?: { text: string; variant?: PillVariant }` to the
Svelte `ContextMenuItem`. When the item's `label` contains a `{pill}`
placeholder, the menu renders a real inline `Pill` in its place (dotless,
compact) between the surrounding copy; without a `pill` the raw label is
shown verbatim.

Use case: a kind badge inside an action, e.g. "Archive this {pill} and
older" rendering the info "R" routine pill or a neutral "S" session pill.
