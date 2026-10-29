# @w5-ui/react

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

- [#108](https://github.com/webbertakken/dash-ui/pull/108) [`9c8d32c`](https://github.com/webbertakken/dash-ui/commit/9c8d32cb92ff6ec1a1c3dbaed2aefa3058551be2) Thanks [@runa-takken](https://github.com/apps/runa-takken)! - Type-check under React 19: `Callout` no longer relies on the global `JSX` namespace, and `TreeBrowser` omits the native `onToggle` attribute so its `onToggle(id)` callback no longer clashes with React 19's `ToggleEventHandler`.

- [#118](https://github.com/webbertakken/dash-ui/pull/118) [`f23ed5f`](https://github.com/webbertakken/dash-ui/commit/f23ed5f2df57cf54e382a14b7738aca028c3ad54) Thanks [@runa-takken](https://github.com/apps/runa-takken)! - Keep renders pure: date pickers, `CalendarHeatmap`, `Donut`, `CountUp`, `ContextMenu`, `CommandPalette` and the tooltip trigger no longer mutate during render or set state from effects.
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
