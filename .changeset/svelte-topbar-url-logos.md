---
"@w5-ui/svelte": minor
---

`Topbar` widens `AppLogo` from `AppLogoKey` to `AppLogoKey | (string & {})` so consumers can pass a raw image URL as `AppDef.logo` and brand an app entry with their own glyph without upstreaming an asset into `@w5-ui/assets`. Known keys still resolve through the bundled `appLogos` map; unknown values are used directly as the `<img src>`. The `(string & {})` trick keeps autocomplete working for the known keys while accepting any other string.
