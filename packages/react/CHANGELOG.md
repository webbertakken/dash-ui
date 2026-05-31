# @w5-ui/react

## 0.5.0

### Minor Changes

- [#37](https://github.com/webbertakken/dash-ui/pull/37) [`c87d128`](https://github.com/webbertakken/dash-ui/commit/c87d1289aa82912b3df766980342312837b21a71) Thanks [@webbertakken](https://github.com/webbertakken)! - feat(ContextMenu): `warning` tone for caution / heads-up items

  Adds an optional `warning?: boolean` to `ContextMenuItem` (React +
  Svelte), rendered via a `data-warning="true"` attribute and styled in
  yellow (`status-warning` token / amber `#f5a623`). Mirrors the existing
  `danger?: boolean` convention. Mutually exclusive with `danger`.

  Use case: surface a non-destructive but consequential action (e.g.
  "Mark older as completed", "Skip remaining steps") that should stand
  out without reading as a destructive red.

- [#46](https://github.com/webbertakken/dash-ui/pull/46) [`cf8fe45`](https://github.com/webbertakken/dash-ui/commit/cf8fe455761e8f6a539364e7aad7f44b941cf04f) Thanks [@webbertakken](https://github.com/webbertakken)! - feat(Modal): `size` prop for panel width

  Adds an optional `size?: ModalSize` (`'sm' | 'md' | 'lg' | 'xl' | '2xl'`)
  to `Modal` (React + Svelte, forwarded by the `uni-modal` custom element).
  `md` (520px) stays the default; the scale widens to 400 / 520 / 720 /
  960 / 1200px, always clamped to `90vw`.

  Svelte expresses the widths via pre-composed Tailwind utilities; the
  React sibling adds matching `.modal--sm|lg|xl|2xl` rules in
  `dashboard.css`. Suits data-dense or editor-style dialogs that need more
  room than the default.

### Patch Changes

- Updated dependencies [[`c87d128`](https://github.com/webbertakken/dash-ui/commit/c87d1289aa82912b3df766980342312837b21a71), [`cf8fe45`](https://github.com/webbertakken/dash-ui/commit/cf8fe455761e8f6a539364e7aad7f44b941cf04f)]:
  - @w5-ui/tokens@0.5.0

## 0.2.1

### Patch Changes

- [#16](https://github.com/webbertakken/dash-ui/pull/16) [`bff71e7`](https://github.com/webbertakken/dash-ui/commit/bff71e746dc631bdee61573cba0dfbcaeb951c0f) Thanks [@webbertakken](https://github.com/webbertakken)! - Fix `workspace:*` leak in published tarballs. `@w5-ui/svelte@0.2.0`,
  `@w5-ui/react@0.2.0` and `@w5-ui/wc@0.2.0` shipped with raw
  `workspace:*` deps on their `@w5-ui/*` siblings, which made them
  unresolvable outside this monorepo. The release pipeline now runs
  `scripts/release/substitute-workspace-deps.ts` between `changeset
version` and `changeset publish`, rewriting `workspace:*` /
  `workspace:^` / `workspace:~` to concrete `^X.Y.Z` ranges before
  the tarballs are packed.
- Updated dependencies [[`bff71e7`](https://github.com/webbertakken/dash-ui/commit/bff71e746dc631bdee61573cba0dfbcaeb951c0f)]:
  - @w5-ui/assets@0.2.1
  - @w5-ui/tokens@0.2.1

## 0.2.0

### Minor Changes

- [#14](https://github.com/webbertakken/dash-ui/pull/14) [`5f373a1`](https://github.com/webbertakken/dash-ui/commit/5f373a199ea59e86029764532631f316dd5a586f) Thanks [@webbertakken](https://github.com/webbertakken)! - Migrate `@w5-ui/svelte` to Svelte 5.

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

### Patch Changes

- Updated dependencies [[`5f373a1`](https://github.com/webbertakken/dash-ui/commit/5f373a199ea59e86029764532631f316dd5a586f)]:
  - @w5-ui/tokens@0.2.0
  - @w5-ui/assets@0.2.0
