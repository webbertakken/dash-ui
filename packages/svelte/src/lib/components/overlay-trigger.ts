/**
 * Svelte binding of the shared `createOverlayTrigger` controller from
 * `@w5-ui/tokens` (Tooltip, HoverCard). The React build binds the same
 * controller, so both frameworks and the Web Components behave identically.
 */

import { isFocusVisible, type OverlayTrigger } from '@w5-ui/tokens'

/** Event handlers to spread onto the overlay's wrapper element. */
export function overlayHandlers(trigger: OverlayTrigger) {
  return {
    onpointerenter: (e: PointerEvent) => trigger.pointerEnter(e.pointerType),
    onpointerleave: (e: PointerEvent) => trigger.pointerLeave(e.pointerType),
    onpointerdown: (e: PointerEvent) => trigger.pointerDown(e.pointerType),
    onpointerup: (e: PointerEvent) => trigger.pointerUp(e.pointerType),
    onpointercancel: (e: PointerEvent) => trigger.pointerUp(e.pointerType),
    onfocusin: (e: FocusEvent) => trigger.focus(isFocusVisible(e.target)),
    onfocusout: (e: FocusEvent) => {
      const wrapper = e.currentTarget as Node
      if (!wrapper.contains(e.relatedTarget as Node | null)) trigger.blur()
    },
  }
}

/** Dismisses the overlay on Escape; returns the cleanup. */
export function listenForEscape(trigger: OverlayTrigger): () => void {
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') trigger.escape()
  }
  document.addEventListener('keydown', onKey)
  return () => document.removeEventListener('keydown', onKey)
}
