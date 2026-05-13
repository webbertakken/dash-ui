---
'@w5-ui/assets': patch
'@w5-ui/react': patch
'@w5-ui/svelte': patch
'@w5-ui/tokens': patch
'@w5-ui/wc': patch
---

Fix `workspace:*` leak in published tarballs. `@w5-ui/svelte@0.2.0`,
`@w5-ui/react@0.2.0` and `@w5-ui/wc@0.2.0` shipped with raw
`workspace:*` deps on their `@w5-ui/*` siblings, which made them
unresolvable outside this monorepo. The release pipeline now runs
`scripts/release/substitute-workspace-deps.ts` between `changeset
version` and `changeset publish`, rewriting `workspace:*` /
`workspace:^` / `workspace:~` to concrete `^X.Y.Z` ranges before
the tarballs are packed.
