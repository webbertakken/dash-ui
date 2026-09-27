---
'@w5-ui/react': minor
'@w5-ui/svelte': minor
'@w5-ui/wc': minor
'@w5-ui/tokens': minor
---

feat(overlays): one canonical Tooltip / HoverCard / Popover terminology

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
