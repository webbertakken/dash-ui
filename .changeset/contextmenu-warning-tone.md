---
'@w5-ui/react': minor
'@w5-ui/svelte': minor
'@w5-ui/tokens': minor
'@w5-ui/wc': minor
---

feat(ContextMenu): `warning` tone for caution / heads-up items

Adds an optional `warning?: boolean` to `ContextMenuItem` (React +
Svelte), rendered via a `data-warning="true"` attribute and styled in
yellow (`status-warning` token / amber `#f5a623`). Mirrors the existing
`danger?: boolean` convention. Mutually exclusive with `danger`.

Use case: surface a non-destructive but consequential action (e.g.
"Mark older as completed", "Skip remaining steps") that should stand
out without reading as a destructive red.
