/**
 * Pure positioning helper for `Popover.svelte`.
 *
 * Computes the viewport-coord `{ top, left }` for the panel given
 * the trigger geometry, panel size, viewport size, and placement.
 * Lives in its own module so the layout policy (which side wins on
 * tight viewports, how flips clamp to the margin, etc.) is unit-
 * testable without spinning up the Svelte component + jsdom.
 *
 * Auto-flip behaviour: the documented placements only mention
 * `bottom-*`, but when the trigger sits near the bottom of the
 * viewport (e.g. a pill on a session footer) the panel would open
 * off-screen. We treat the placement's `bottom` half as a HINT
 * rather than a hard rule \u2014 if the panel doesn't fit below AND
 * there's more room above than below, we flip the vertical anchor
 * to open upward. Horizontal alignment (`-start` / `-end` /
 * centred) is preserved across the flip.
 */

export interface TriggerRect {
  top: number
  bottom: number
  left: number
  right: number
  width: number
}

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'bottom'

export interface ComputePanelPositionInput {
  triggerRect: TriggerRect
  panelWidth: number
  panelHeight: number
  viewportWidth: number
  viewportHeight: number
  placement: PopoverPlacement
  /** Gutter between the panel and the viewport edge on every side. */
  margin: number
  /** Gap between the trigger edge and the panel edge along the axis. */
  offset: number
}

export interface PanelPosition {
  top: number
  left: number
}

export const computePanelPosition = (input: ComputePanelPositionInput): PanelPosition => {
  const {
    triggerRect,
    panelWidth,
    panelHeight,
    viewportWidth,
    viewportHeight,
    placement,
    margin,
    offset,
  } = input

  // Horizontal: align per placement, then clamp into the viewport so
  // edge-anchored triggers don't push the panel off-screen.
  let left: number
  if (placement === 'bottom-start') {
    left = triggerRect.left
  } else if (placement === 'bottom-end') {
    left = triggerRect.right - panelWidth
  } else {
    left = triggerRect.left + triggerRect.width / 2 - panelWidth / 2
  }
  left = Math.max(margin, Math.min(left, viewportWidth - panelWidth - margin))

  // Vertical: prefer below the trigger (documented behaviour). Flip
  // above when:
  //   1. the panel does NOT fit below (panel height + offset would
  //      cross the bottom margin), AND
  //   2. above has more room than below.
  // When neither side fully fits, we still prefer the side with more
  // breathing room \u2014 the panel then gets clamped to the viewport
  // margin so its content scrolls instead of clipping at the edge.
  const spaceBelow = viewportHeight - triggerRect.bottom - margin
  const spaceAbove = triggerRect.top - margin
  const fitsBelow = panelHeight + offset <= spaceBelow

  let top: number
  if (fitsBelow || spaceBelow >= spaceAbove) {
    top = triggerRect.bottom + offset
  } else {
    top = Math.max(margin, triggerRect.top - offset - panelHeight)
  }

  return { top, left }
}
