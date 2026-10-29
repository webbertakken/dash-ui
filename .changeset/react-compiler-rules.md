---
'@w5-ui/react': patch
---

Keep renders pure: date pickers, `CalendarHeatmap`, `Donut`, `CountUp`, `ContextMenu`, `CommandPalette` and the tooltip trigger no longer mutate during render or set state from effects.
