---
'@w5-ui/svelte': minor
---

Motif-aware chrome: Topbar, Sidebar, Card, Pill, IconButton, Button, CopyButton, RowToggle, EmptyState, SegmentedControl, Input, Textarea, AccordionItem, KVTable, and Stat now resolve their surfaces and text via the motif tokens (`--bg-page`, `--depthBg-1`, `--text-1..4`, `--border-1..2`, `--row-hover`, `--row-active`) instead of hard-coded `#0a0a0b` / `#141415` / `text-white` / `text-neutral-04` literals. Dark motif renders pixel-identically to before; light motif now produces a proper light chrome (white surfaces, dark text, brand-blue active rows). The `dark:` Tailwind variant is used in two places (`Topbar` active-tab logo brightness, `SegmentedControl` active shadow) where the visual treatment genuinely differs per motif.

The Pill `neutral` variant now sits on `--row-active` (subtle brand-blue tint) so it stays visible on a white page bg, replacing the previous `bg-white/[0.06]` literal. Status-variant text colours switched from hand-tuned hex (`#5ddb9f`, `#f5c26b`, `#ff7b7b`, `#7fb6ff`) to the semantic `--status-{success|warning|danger|info}` tokens.

Breaking-ish (caught by tests): if a consumer asserted `bg-white` on a neutral Pill, update to `bg-row-active`.
