---
'@w5-ui/svelte': patch
---

Topbar: fit on phones (< md). The fixed-width app buttons used to overflow
the viewport on narrow screens. Below `md` the site-name label + caret are
hidden (the logo + health glow still identify the site), the app strip
collapses to icon-only and becomes a horizontally swipeable rail, and the
right-side actions stay pinned. Desktop layout is unchanged.
