---
'@w5-ui/tokens': minor
---

feat(tokens): self-host Inter and JetBrains Mono

`tokens.css` loaded both fonts with a Google Fonts `@import url()`. Tailwind consumers (including
anyone importing `@w5-ui/tokens/tailwind.css`) never got them: Tailwind inlines the local imports,
the remote `@import` ends up mid-file, and browsers drop it, so text fell back to system fonts such
as Noto Sans and DejaVu Sans Mono. Everyone else sent every visitor's IP address to Google.

The tokens now ship the variable fonts themselves (from `@fontsource-variable/*` 5.3.0, SIL OFL
1.1) through a new `@w5-ui/tokens/fonts.css`, imported first by `tokens.css` so every bundler
inlines it. Each script subset downloads only when used (about 48 kB per font for Latin), with
`font-display: swap`. The files are exported as `@w5-ui/tokens/fonts/*` for preloading. No request
goes to a third party any more; a CSP of `font-src 'self'` is now enough.
