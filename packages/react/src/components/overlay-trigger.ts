import { createOverlayTrigger, isFocusVisible, type OverlayTrigger } from '@w5-ui/tokens'
import { useEffect, useState, type FocusEvent, type PointerEvent as ReactPointerEvent } from 'react'

export interface UseOverlayTriggerOptions {
  openDelayMs: number
  closeOnPress: boolean
  longPressMs: number | null
}

/** React binding of the shared `createOverlayTrigger` controller (Tooltip, HoverCard). */
export function useOverlayTrigger({
  openDelayMs,
  closeOnPress,
  longPressMs,
}: UseOverlayTriggerOptions) {
  const [open, setOpen] = useState(false)
  const [trigger] = useState<OverlayTrigger>(() =>
    createOverlayTrigger({
      openDelayMs,
      closeOnPress,
      longPressMs,
      onOpenChange: setOpen,
    }),
  )

  useEffect(() => {
    trigger.setOpenDelay(openDelayMs)
  }, [trigger, openDelayMs])

  useEffect(() => () => trigger.destroy(), [trigger])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') trigger.escape()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, trigger])

  const handlers = {
    onPointerEnter: (e: ReactPointerEvent) => trigger.pointerEnter(e.pointerType),
    onPointerLeave: (e: ReactPointerEvent) => trigger.pointerLeave(e.pointerType),
    onPointerDown: (e: ReactPointerEvent) => trigger.pointerDown(e.pointerType),
    onPointerUp: (e: ReactPointerEvent) => trigger.pointerUp(e.pointerType),
    onPointerCancel: (e: ReactPointerEvent) => trigger.pointerUp(e.pointerType),
    onFocus: (e: FocusEvent) => trigger.focus(isFocusVisible(e.target)),
    onBlur: (e: FocusEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) trigger.blur()
    },
  }

  return { open, handlers }
}
