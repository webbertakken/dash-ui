---
'@w5-ui/react': minor
'@w5-ui/svelte': minor
'@w5-ui/tokens': minor
'@w5-ui/wc': minor
---

feat(Modal): `size` prop for panel width

Adds an optional `size?: ModalSize` (`'sm' | 'md' | 'lg' | 'xl' | '2xl'`)
to `Modal` (React + Svelte, forwarded by the `uni-modal` custom element).
`md` (520px) stays the default; the scale widens to 400 / 520 / 720 /
960 / 1200px, always clamped to `90vw`.

Svelte expresses the widths via pre-composed Tailwind utilities; the
React sibling adds matching `.modal--sm|lg|xl|2xl` rules in
`dashboard.css`. Suits data-dense or editor-style dialogs that need more
room than the default.
