# @w5-ui/svelte

## 0.6.0

### Minor Changes

- [#58](https://github.com/webbertakken/dash-ui/pull/58) [`6936230`](https://github.com/webbertakken/dash-ui/commit/69362300a38ae641898d7d15bd644909d745083d) Thanks [@webbertakken](https://github.com/webbertakken)! - Popover: add `width` prop (`sm` | `md` | `lg` | `xl`) to control the panel
  max-width. Defaults to `sm` (320px), matching the previous behaviour. Mirrors
  `Modal`'s `size` scale for content-dense panels.

### Patch Changes

- [#59](https://github.com/webbertakken/dash-ui/pull/59) [`26be749`](https://github.com/webbertakken/dash-ui/commit/26be74913718c2e2084e303bdd9f1814946b7e6e) Thanks [@webbertakken](https://github.com/webbertakken)! - Topbar: fit on phones (< md). The fixed-width app buttons used to overflow
  the viewport on narrow screens. Below `md` the site-name label + caret are
  hidden (the logo + health glow still identify the site), the app strip
  collapses to icon-only and becomes a horizontally swipeable rail, and the
  right-side actions stay pinned. Desktop layout is unchanged.

## 0.5.0

### Minor Changes

- [#48](https://github.com/webbertakken/dash-ui/pull/48) [`ede202f`](https://github.com/webbertakken/dash-ui/commit/ede202f5f0b8d4d60ab4e0239d8a4105081d13e9) Thanks [@webbertakken](https://github.com/webbertakken)! - feat(ContextMenu): inline `pill` badge via a `{pill}` label slot

  Adds an optional `pill?: { text: string; variant?: PillVariant }` to the
  Svelte `ContextMenuItem`. When the item's `label` contains a `{pill}`
  placeholder, the menu renders a real inline `Pill` in its place (dotless,
  compact) between the surrounding copy; without a `pill` the raw label is
  shown verbatim.

  Use case: a kind badge inside an action, e.g. "Archive this {pill} and
  older" rendering the info "R" routine pill or a neutral "S" session pill.

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

## 0.4.0

### Minor Changes

- [#35](https://github.com/webbertakken/dash-ui/pull/35) [`d9d5558`](https://github.com/webbertakken/dash-ui/commit/d9d5558ee05e29ff4e6e10a1fb5ae42859ed049d) Thanks [@webbertakken](https://github.com/webbertakken)! - Add a `portal` Svelte action and wire it into `Popover`: the panel is now rendered inside `document.body` instead of as an inline sibling of the trigger. This makes the popover immune to ancestor `overflow: hidden`, `transform`-based containing blocks, and stacking-context traps — the panel's `position: fixed` + `z-index` always escape to the viewport.

  Click-outside detection now treats the portalled panel as "inside" so clicks within the panel no longer dismiss it.

  The `portal` action is also exported from the package root for use by consumer floating-UI primitives that want the same behaviour.

- [#35](https://github.com/webbertakken/dash-ui/pull/35) [`d9d5558`](https://github.com/webbertakken/dash-ui/commit/d9d5558ee05e29ff4e6e10a1fb5ae42859ed049d) Thanks [@webbertakken](https://github.com/webbertakken)! - `Topbar` accepts an optional `siteLogo: AppLogo` prop. When set, the site-name area renders a 24x24 logo image in place of the classic status dot + halo; the status colour becomes a thin `ring-2 ring-inset ring-status-*` AROUND the logo so the health signal stays visible. The dot + halo layout still applies as a fallback when `siteLogo` is undefined, so existing consumers keep their look without changes.

  A `title` attribute on the site-name wrapper exposes the textual status (e.g. `"Spinner — status: ok"`) for hover-tooltip provenance.

- [#35](https://github.com/webbertakken/dash-ui/pull/35) [`d9d5558`](https://github.com/webbertakken/dash-ui/commit/d9d5558ee05e29ff4e6e10a1fb5ae42859ed049d) Thanks [@webbertakken](https://github.com/webbertakken)! - `Topbar` widens `AppLogo` from `AppLogoKey` to `AppLogoKey | (string & {})` so consumers can pass a raw image URL as `AppDef.logo` and brand an app entry with their own glyph without upstreaming an asset into `@w5-ui/assets`. Known keys still resolve through the bundled `appLogos` map; unknown values are used directly as the `<img src>`. The `(string & {})` trick keeps autocomplete working for the known keys while accepting any other string.

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
