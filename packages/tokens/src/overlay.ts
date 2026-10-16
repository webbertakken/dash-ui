/**
 * Framework-agnostic open/close controller for pointer- and focus-driven
 * overlays (Tooltip, HoverCard). React, Svelte and the Web Components all
 * drive this one state machine, so the three builds behave identically.
 *
 * Popover is click-opened and does not use this controller.
 */

/**
 * Overlay timings shared by Tooltip, HoverCard and Popover in every framework.
 *
 * - Tooltip: the NAME of a control. Opens after `tooltipOpenDelayMs` of hover,
 *   instantly on keyboard focus, and on a `longPressMs` touch press.
 * - Hover card: rich, non-essential content. Opens instantly on hover and focus.
 * - `closeGraceMs` lets the pointer cross the gap onto the surface (WCAG 1.4.13).
 * - `fadeMs` mirrors `--dur-base`; reduced motion drops the transition.
 */
export const overlay = {
  tooltipOpenDelayMs: 1000,
  hoverCardOpenDelayMs: 0,
  closeGraceMs: 100,
  longPressMs: 500,
  touchDismissMs: 1500,
  fadeMs: 150,
} as const

export interface OverlayTriggerOptions {
  /** Hover delay before opening. `0` opens synchronously. */
  openDelayMs: number
  /** Close when the trigger is pressed with a mouse or pen (Tooltip: yes, HoverCard: no). */
  closeOnPress: boolean
  /** Touch press duration that opens the overlay; `null` ignores touch. */
  longPressMs: number | null
  /** Delay between the pointer leaving and the overlay closing, so it can be hovered. */
  closeGraceMs?: number
  /** How long a long-press overlay lingers after the finger lifts. */
  touchDismissMs?: number
  onOpenChange: (open: boolean) => void
}

export interface OverlayTrigger {
  readonly open: boolean
  pointerEnter(pointerType: string | undefined): void
  pointerLeave(pointerType: string | undefined): void
  pointerDown(pointerType: string | undefined): void
  pointerUp(pointerType: string | undefined): void
  /** `visible` is whether the focus is keyboard-initiated (`:focus-visible`). */
  focus(visible: boolean): void
  blur(): void
  /** Dismisses the overlay; returns whether it was open. */
  escape(): boolean
  setOpenDelay(ms: number): void
  destroy(): void
}

type Timer = ReturnType<typeof setTimeout> | null

export function createOverlayTrigger(options: OverlayTriggerOptions): OverlayTrigger {
  const closeGraceMs = options.closeGraceMs ?? overlay.closeGraceMs
  const touchDismissMs = options.touchDismissMs ?? overlay.touchDismissMs
  let openDelayMs = options.openDelayMs
  let open = false
  let hovered = false
  let keyboardFocused = false
  /** Set by Escape or a press; cleared when the pointer or focus leaves. */
  let suppressed = false
  let openTimer: Timer = null
  let closeTimer: Timer = null
  let pressTimer: Timer = null

  const isTouch = (pointerType: string | undefined) => pointerType === 'touch'

  function set(next: boolean) {
    if (open === next) return
    open = next
    options.onOpenChange(next)
  }

  function clear(timer: Timer): null {
    if (timer) clearTimeout(timer)
    return null
  }

  function clearAll() {
    openTimer = clear(openTimer)
    closeTimer = clear(closeTimer)
    pressTimer = clear(pressTimer)
  }

  return {
    get open() {
      return open
    },

    pointerEnter(pointerType) {
      if (isTouch(pointerType)) return
      hovered = true
      closeTimer = clear(closeTimer)
      if (suppressed || open || openTimer) return
      if (openDelayMs <= 0) {
        set(true)
        return
      }
      openTimer = setTimeout(() => {
        openTimer = null
        set(true)
      }, openDelayMs)
    },

    pointerLeave(pointerType) {
      if (isTouch(pointerType)) return
      hovered = false
      openTimer = clear(openTimer)
      if (keyboardFocused) return
      suppressed = false
      if (!open) return
      if (closeGraceMs <= 0) {
        set(false)
        return
      }
      closeTimer = clear(closeTimer)
      closeTimer = setTimeout(() => {
        closeTimer = null
        set(false)
      }, closeGraceMs)
    },

    pointerDown(pointerType) {
      if (isTouch(pointerType)) {
        if (options.longPressMs === null) return
        closeTimer = clear(closeTimer)
        pressTimer = clear(pressTimer)
        pressTimer = setTimeout(() => {
          pressTimer = null
          set(true)
        }, options.longPressMs)
        return
      }
      if (!options.closeOnPress) return
      openTimer = clear(openTimer)
      closeTimer = clear(closeTimer)
      suppressed = hovered || keyboardFocused
      set(false)
    },

    pointerUp(pointerType) {
      if (!isTouch(pointerType)) return
      pressTimer = clear(pressTimer)
      if (!open) return
      closeTimer = clear(closeTimer)
      closeTimer = setTimeout(() => {
        closeTimer = null
        set(false)
      }, touchDismissMs)
    },

    focus(visible) {
      if (!visible) return
      keyboardFocused = true
      if (suppressed) return
      openTimer = clear(openTimer)
      closeTimer = clear(closeTimer)
      set(true)
    },

    blur() {
      keyboardFocused = false
      if (hovered) return
      suppressed = false
      clearAll()
      set(false)
    },

    escape() {
      const wasOpen = open
      clearAll()
      suppressed = hovered || keyboardFocused
      set(false)
      return wasOpen
    },

    setOpenDelay(ms) {
      openDelayMs = ms
    },

    destroy() {
      clearAll()
    },
  }
}

/** Whether focus on `target` is keyboard-initiated. Engines without
 *  `:focus-visible` support are treated as keyboard focus (fail open). */
export function isFocusVisible(target: EventTarget | null): boolean {
  const el = target as Element | null
  if (!el || typeof el.matches !== 'function') return false
  try {
    return el.matches(':focus-visible')
  } catch {
    return true
  }
}

const INTERACTIVE =
  'button, a[href], input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [role]:not([role="presentation"]):not([role="none"])'
const NAMED_CONTENT = 'img[alt]:not([alt=""]), [aria-label], [aria-labelledby], svg title'
/** Marks an `aria-label` the tooltip set, so a label change can follow it. */
const OWNED = 'data-w5-tooltip-name'

/** Children in the flattened tree: a slot yields its assigned elements, a
 *  custom element with an open shadow root (e.g. `uni-icon-button`) its shadow. */
function childrenOf(el: Element | ShadowRoot): Element[] {
  if ('localName' in el && el.localName === 'slot' && 'assignedElements' in el) {
    const assigned = (el as HTMLSlotElement).assignedElements({ flatten: true })
    if (assigned.length) return assigned
  }
  if ('shadowRoot' in el && el.shadowRoot) return Array.from(el.shadowRoot.children)
  return Array.from(el.children)
}

function findInteractive(el: Element | ShadowRoot): Element | null {
  for (const child of childrenOf(el)) {
    if (child.matches(INTERACTIVE)) return child
    const nested = findInteractive(child)
    if (nested) return nested
  }
  return null
}

function hasAccessibleName(el: Element): boolean {
  if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return true
  if ((el.textContent ?? '').trim()) return true
  if (el.querySelector(NAMED_CONTENT)) return true
  const labels = (el as HTMLInputElement).labels
  return !!labels && labels.length > 0
}

/**
 * A tooltip is the NAME of its control and never its only carrier. When the
 * wrapped control is icon-only (no text, no label), name it after the tooltip.
 * Controls that already have a name keep it.
 */
export function ensureAccessibleName(root: Element | null | undefined, label: string): void {
  if (!root) return
  const target = findInteractive(root)
  if (!target) return
  if (target.hasAttribute(OWNED)) {
    target.setAttribute('aria-label', label)
    return
  }
  if (hasAccessibleName(target)) return
  target.setAttribute('aria-label', label)
  target.setAttribute(OWNED, '')
}
