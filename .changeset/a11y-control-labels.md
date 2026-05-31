---
'@w5-ui/react': patch
---

fix(a11y): give controls accessible labels (oxlint 1.66 jsx-a11y)

Resolves `jsx-a11y/control-has-associated-label` and
`no-noninteractive-element-interactions` flagged by oxlint 1.66:

- `aria-label` on the `ColumnToggle`, `NumberInput`, `PasswordInput`
  controls and `aria-labelledby` on `RadioGroup` options.
- `CommandPalette` combobox labelled by its placeholder.
- `ExpandableRow` toggle button gains an Expand/Collapse label.
- `ContextMenu` decorative separators marked `aria-hidden`.
- `DateRangePicker` Escape handling moved to a document listener (off
  the non-interactive dialog element); `TagInput` click-to-focus moved
  to the presentational wrapper.
