---
'@w5-ui/react': patch
---

Type-check under React 19: `Callout` no longer relies on the global `JSX` namespace, and `TreeBrowser` omits the native `onToggle` attribute so its `onToggle(id)` callback no longer clashes with React 19's `ToggleEventHandler`.
