# @w5-ui/svelte

## 0.3.0

### Minor Changes

- [#24](https://github.com/webbertakken/dash-ui/pull/24) [`16ea623`](https://github.com/webbertakken/dash-ui/commit/16ea6232315cf6aec6d81ee00e7a0ce8bdcba404) Thanks [@webbertakken](https://github.com/webbertakken)! - Motif-aware chrome: Topbar, Sidebar, Card, Pill, IconButton, Button, CopyButton, RowToggle, EmptyState, SegmentedControl, Input, Textarea, AccordionItem, KVTable, and Stat now resolve their surfaces and text via the motif tokens (`--bg-page`, `--depthBg-1`, `--text-1..4`, `--border-1..2`, `--row-hover`, `--row-active`) instead of hard-coded `#0a0a0b` / `[#141415](https://github.com/webbertakken/dash-ui/issues/141415)` / `text-white` / `text-neutral-04` literals. Dark motif renders pixel-identically to before; light motif now produces a proper light chrome (white surfaces, dark text, brand-blue active rows). The `dark:` Tailwind variant is used in two places (`Topbar` active-tab logo brightness, `SegmentedControl` active shadow) where the visual treatment genuinely differs per motif.

  The Pill `neutral` variant now sits on `--row-active` (subtle brand-blue tint) so it stays visible on a white page bg, replacing the previous `bg-white/[0.06]` literal. Status-variant text colours switched from hand-tuned hex (`#5ddb9f`, `#f5c26b`, `#ff7b7b`, `#7fb6ff`) to the semantic `--status-{success|warning|danger|info}` tokens.

  Breaking-ish (caught by tests): if a consumer asserted `bg-white` on a neutral Pill, update to `bg-row-active`.

- [#32](https://github.com/webbertakken/dash-ui/pull/32) [`079f5a2`](https://github.com/webbertakken/dash-ui/commit/079f5a2b953822a01b48339ecc9c5286a836dbf6) Thanks [@webbertakken](https://github.com/webbertakken)! - Popover: `open` is now bindable, accepts a custom `trigger` snippet, and the panel is rendered with `position: fixed` and clamped inside the viewport on open + resize so it can no longer overflow when its trigger sits near a screen edge.

  Topbar: visual polish on the header chrome and active tab treatment (flatter surfaces on `--bg-1`, no bottom border, no active underline). Pure styling, no API change.

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
