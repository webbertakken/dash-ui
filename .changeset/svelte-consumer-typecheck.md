---
'@w5-ui/svelte': patch
---

Typecheck cleanly in consumers without `allowImportingTsExtensions`: relative imports drop their `.ts` suffix, and `Topbar` no longer imports `AppLogoKey` twice.
