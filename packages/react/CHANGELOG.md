# @w5-ui/react

## 0.7.0

### Minor Changes

- [#63](https://github.com/webbertakken/dash-ui/pull/63) [`25c2bdb`](https://github.com/webbertakken/dash-ui/commit/25c2bdbd12325e24bd4bd402971251a63f63d7a8) Thanks [@webbertakken](https://github.com/webbertakken)! - Add `TreeBrowser` component (instructure `ui-tree-browser`, medium size,
  folderTree variant). A folder/file tree over an id-keyed
  `collections` + `items` + `rootId` model with controlled and uncontrolled
  expansion, `topLevelIds` helper, roving-tabindex keyboard navigation, per-row
  icon and trailing-badge slots, and zero-CLS fixed-height rows. Mirrored across
  Svelte, React and Web Components, with shared `.tree-browser` styling in
  `@w5-ui/tokens/dashboard.css`.

### Patch Changes

- Updated dependencies [[`25c2bdb`](https://github.com/webbertakken/dash-ui/commit/25c2bdbd12325e24bd4bd402971251a63f63d7a8)]:
  - @w5-ui/tokens@0.7.0

## 0.5.1

### Patch Changes

- [#49](https://github.com/webbertakken/dash-ui/pull/49) [`f1bd2e8`](https://github.com/webbertakken/dash-ui/commit/f1bd2e8b5af76db1eb34fd3a76a96d69431f7c50) Thanks [@webbertakken](https://github.com/webbertakken)! - fix(a11y): give controls accessible labels (oxlint 1.66 jsx-a11y)

  Resolves `jsx-a11y/control-has-associated-label` and
  `no-noninteractive-element-interactions` flagged by oxlint 1.66:

  - `aria-label` on the `ColumnToggle`, `NumberInput`, `PasswordInput`
    controls and `aria-labelledby` on `RadioGroup` options.
  - `CommandPalette` combobox labelled by its placeholder.
  - `ExpandableRow` toggle button gains an Expand/Collapse label.
  - `ContextMenu` decorative separators marked `aria-hidden`.
  - `DateRangePicker` Escape handling moved to a document listener (off
    the non-interactive dialog element); `TagInput` click-to-focus moved
    to the presentational wrapper.

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
