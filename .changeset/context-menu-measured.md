---
'@w5-ui/svelte': patch
'@w5-ui/react': patch
---

ContextMenu stays inside the viewport whatever its labels: it is placed from its measured size, not a guessed 168px, and opens to the pointer's left or above it when it would cross an edge.
