---
'@w5-ui/svelte': minor
'@w5-ui/wc': minor
'@w5-ui/react': minor
'@w5-ui/tokens': minor
'@w5-ui/assets': minor
---

Migrate `@w5-ui/svelte` to Svelte 5.

- Peer dep bumped to `svelte: ^5`. Svelte 4 is no longer supported.
- All ~190 components rewritten to runes: `$props`, `$state`, `$derived`,
  `$effect`, `$bindable`, snippet children via `{@render children?.()}`.
- Public event API moves from `createEventDispatcher` / `on:event` to
  Svelte 5 callback props. Callers update:
  ```svelte
  <!-- before -->
  <Tabs on:change={(e) => handle(e.detail)} />
  <!-- after -->
  <Tabs onchange={(value) => handle(value)} />
  ```
- `Stat` named slot `value` → snippet prop `valueSlot` (avoided
  collision with the `value` prop in Svelte 5's unified namespace).
- `Sidebar` icon type: `ComponentType` → `Component<Record<string, unknown>>`.
- `Button`'s aria label prop is the kebab-case `aria-label` (consistent
  with the HTML attribute name), not `ariaLabel`.
- `@w5-ui/wc` custom-element wrappers regenerated for Svelte 5's CE
  compile output. Public `uni-*` tag names + attribute API unchanged.
- No legacy / compat shims left behind: `svelte/legacy` is not imported
  anywhere in the library.
