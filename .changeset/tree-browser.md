---
'@w5-ui/svelte': minor
'@w5-ui/react': minor
'@w5-ui/wc': minor
'@w5-ui/tokens': minor
---

Add `TreeBrowser` component (instructure `ui-tree-browser`, medium size,
folderTree variant). A folder/file tree over an id-keyed
`collections` + `items` + `rootId` model with controlled and uncontrolled
expansion, `topLevelIds` helper, roving-tabindex keyboard navigation, per-row
icon and trailing-badge slots, and zero-CLS fixed-height rows. Mirrored across
Svelte, React and Web Components, with shared `.tree-browser` styling in
`@w5-ui/tokens/dashboard.css`.
