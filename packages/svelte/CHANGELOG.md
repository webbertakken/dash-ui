# @w5-ui/svelte

## 0.9.0

### Minor Changes

- [#84](https://github.com/webbertakken/dash-ui/pull/84) [`29f6719`](https://github.com/webbertakken/dash-ui/commit/29f6719c5eb8a662e78a5e64ad62ce261466c902) Thanks [@webbertakken](https://github.com/webbertakken)! - feat(overlays): one canonical Tooltip / HoverCard / Popover terminology
  
  Three surfaces float next to a trigger, each with one job and one name:
  
  - **Tooltip**: the name of a control. Opens after **1 s** of hover, **instantly** on keyboard focus
    (`:focus-visible`) and on a 500 ms touch long-press. Closes on pointer leave, blur, `Escape` or
    pressing the control.
  - **HoverCard**: rich, non-essential content. Opens **instantly** on hover and keyboard focus.
  - **Popover**: click-opened, interactive. Unchanged.
  
  Tooltip and HoverCard now meet WCAG 1.4.13 (dismissible with `Escape`, hoverable, persistent),
  fade in 150 ms (none under reduced motion), cause no layout shift and use motif tokens. React,
  Svelte and the Web Components drive one shared controller, so all three behave identically.
  
  **Breaking changes (pre-1.0, so a minor):**
  
  - `Tooltip` waits 1 s on hover (it was instant via CSS `:hover`). A `delay` prop overrides it.
  - `Tooltip` no longer wires `aria-describedby`: the tooltip is the control's name. An icon-only
    control inside it with no name of its own is given `aria-label={label}`.
  - `HoverCard` opens instantly (`delay` default `300` → `0`). The card no longer has
    `role="tooltip"`, is always rendered (visibility toggles) and exposes `data-state`.
  - `Button` / `IconButton` no longer take `title` (React omits it from the props type; Svelte
    removes the prop), and `IconButton` no longer derives `aria-label` from `title`. Name an icon
    button with `aria-label` or wrap it in `<Tooltip label>`.
  - Built-in controls that used a native `title` (Topbar and TopbarActions icons, Drawer / Modal
    close, Banner / Alert dismiss, NotificationPanel "Mark as read", ColorPicker swatches) now show a
    `Tooltip`; the Svelte Topbar site switcher shows its status in a `HoverCard`.
  
  Migration:
  
  ```tsx
  // before
  <IconButton title="Zoom in"><PlusIcon /></IconButton>
  // after
  <Tooltip label="Zoom in"><IconButton><PlusIcon /></IconButton></Tooltip>
  ```
  
  **New:**
  
  - `@w5-ui/tokens`: `overlay` timing tokens (`tooltipOpenDelayMs`, `hoverCardOpenDelayMs`,
    `closeGraceMs`, `longPressMs`, `touchDismissMs`, `fadeMs`) and the framework-agnostic
    `createOverlayTrigger`, `isFocusVisible` and `ensureAccessibleName`.
  - `HoverCard` takes `heading` (bold) and `description`; `content` stays for rich extras. In Svelte
    the trigger may be the default slot, so `<uni-hover-card heading description>` now renders.
  
  **Fixed:**
  
  - The React tooltip bubble was transparent (`var(--bg-2)` does not exist; now `--depthBg-2`).
  - The React hover card was hard-coded dark in the light motif.

### Patch Changes

- [#116](https://github.com/webbertakken/dash-ui/pull/116) [`2f429cd`](https://github.com/webbertakken/dash-ui/commit/2f429cda8cef757ac8e57998f6618be46c5044be) Thanks [@webbertakken](https://github.com/webbertakken)! - Typecheck cleanly in consumers without `allowImportingTsExtensions`: relative imports drop their `.ts` suffix, and `Topbar` no longer imports `AppLogoKey` twice.

- [#85](https://github.com/webbertakken/dash-ui/pull/85) [`898b9ee`](https://github.com/webbertakken/dash-ui/commit/898b9ee5730f5259110a8754bbabe773c8505d1c) Thanks [@webbertakken](https://github.com/webbertakken)! - fix(wc): style every custom element inside its shadow root
  
  `uni-*` elements rendered with browser-default styling: the Svelte components are styled with
  Tailwind utilities, and page stylesheets never reach a shadow root. The bundle now compiles the
  components' CSS (Tailwind over the `@w5-ui/svelte` sources, with the dashboard chrome in
  `@layer base`) and adopts it into every shadow root as one shared constructable stylesheet, with a
  `<style>` fallback. Tailwind's `@property` rules are registered on the document once, and the
  cyclic `--x: var(--x)` theme bridge variables are dropped so page tokens (radius, fonts, easing)
  inherit into the elements. The bundle grows by about 30 kB gzipped.
  
  Also fixed, in `@w5-ui/svelte` and so in `uni-popover`:
  
  - `Popover` opened its panel at the top-left of the viewport: the default trigger lacked
    `aria-haspopup="dialog"`, which is how the panel finds its anchor. The trigger now also exposes
    `aria-expanded`.
  - Inside a shadow root, pressing within the popover panel closed it (the document sees the event
    retargeted to the host); outside-click detection now uses `composedPath()`.
  - `Pagination` painted the current page white on a transparent background (its idle
    `bg-transparent` won over `bg-brand-05`), invisible in the light motif. Idle and current styles are
    now exclusive.
  - The `portal` action keeps a node inside its enclosing shadow root by default, so portalled
    panels keep the element's styles. Outside shadow DOM it still portals to `document.body`.
- Updated dependencies [[`29f6719`](https://github.com/webbertakken/dash-ui/commit/29f6719c5eb8a662e78a5e64ad62ce261466c902), [`2b84e65`](https://github.com/webbertakken/dash-ui/commit/2b84e65c79cea508445bf491261939c43961c299)]:
  - @w5-ui/tokens@0.9.0

## 0.8.1

### Patch Changes

- [#89](https://github.com/webbertakken/dash-ui/pull/89) [`0b3c0b3`](https://github.com/webbertakken/dash-ui/commit/0b3c0b3cbede2eaf022d22912790f16966b7a889) Thanks [@webbertakken](https://github.com/webbertakken)! - ContextMenu stays inside the viewport whatever its labels: it is placed from its measured size, not a guessed 168px, and opens to the pointer's left or above it when it would cross an edge.

## 0.8.0

### Minor Changes

- [#87](https://github.com/webbertakken/dash-ui/pull/87) [`65f00e4`](https://github.com/webbertakken/dash-ui/commit/65f00e4862bdd05f9d7043a85c1a453b0c1f029a) Thanks [@webbertakken](https://github.com/webbertakken)! - Filled primary controls meet WCAG AA: white text on `brand-05` was 4.45:1 and on its `brand-06` hover 2.94:1. New tokens `--primary-fill` (brand-04, 5.83:1), `--primary-fill-hover` (brand-03), `--primary-fill-press` (brand-02) and `--primary-fill-fg`, as Tailwind colours and the `primaryFill` JS export. The primary Button and SplitButton, the info Badge, the active Stepper step and Pagination page, the selected date-picker days, the Sidebar and NotificationPanel count badges, the confirm dialog's info action and the SkipLink now use them.

  `--primary` stays brand-05 as the accent (focus rings, slider tracks). Breaking: `--primary-hover`, `--primary-press` and `--primary-fg` (and their `-hover` / `-press` / `-fg` Tailwind colours) are removed; use the `--primary-fill-*` tokens.

### Patch Changes

- Updated dependencies [[`65f00e4`](https://github.com/webbertakken/dash-ui/commit/65f00e4862bdd05f9d7043a85c1a453b0c1f029a)]:
  - @w5-ui/tokens@0.8.0

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
