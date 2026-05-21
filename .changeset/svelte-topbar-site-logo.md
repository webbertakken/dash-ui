---
"@w5-ui/svelte": minor
---

`Topbar` accepts an optional `siteLogo: AppLogo` prop. When set, the site-name area renders a 24x24 logo image in place of the classic status dot + halo; the status colour becomes a thin `ring-2 ring-inset ring-status-*` AROUND the logo so the health signal stays visible. The dot + halo layout still applies as a fallback when `siteLogo` is undefined, so existing consumers keep their look without changes.

A `title` attribute on the site-name wrapper exposes the textual status (e.g. `"Spinner — status: ok"`) for hover-tooltip provenance.
