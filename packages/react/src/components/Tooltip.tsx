import { ensureAccessibleName, overlay } from '@w5-ui/tokens'
import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { useOverlayTrigger } from './overlay-trigger.js'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** The control's name: short plain text. An icon-only control is named after it. */
  label: string
  children: ReactNode
  placement?: TooltipPlacement
  /** Hover delay in ms; defaults to `overlay.tooltipOpenDelayMs` (1 s). Keyboard focus is always instant. */
  delay?: number
  className?: string
}

/**
 * Tooltip: the NAME of a control, never its only carrier of meaning.
 * Opens after 1 s of hover, instantly on keyboard focus, and on touch long-press;
 * dismissible with Escape and hoverable (WCAG 1.4.13). Rich content belongs in a
 * `HoverCard`; click-opened interactive surfaces in a `Popover`.
 */
export function Tooltip({
  label,
  children,
  placement = 'top',
  delay = overlay.tooltipOpenDelayMs,
  className = '',
}: TooltipProps) {
  const id = useId()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const { open, handlers } = useOverlayTrigger({
    openDelayMs: delay,
    closeOnPress: true,
    longPressMs: overlay.longPressMs,
  })

  useEffect(() => {
    ensureAccessibleName(triggerRef.current, label)
  })

  return (
    <span
      className={`tooltip-wrapper tooltip-${placement} ${className}`.trim()}
      data-state={open ? 'open' : 'closed'}
      {...handlers}
    >
      <span ref={triggerRef} className="tooltip-trigger">
        {children}
      </span>
      <span id={id} role="tooltip" className="tooltip-content">
        {label}
      </span>
    </span>
  )
}
