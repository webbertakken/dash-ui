import { overlay } from '@w5-ui/tokens'
import { useId, type ReactNode } from 'react'
import { useOverlayTrigger } from './overlay-trigger.js'

export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface HoverCardProps {
  /** Bold title line. */
  heading?: string
  /** Supporting text under the heading. */
  description?: string
  /** Rich content (preview, key/value rows), rendered after heading and description. */
  content?: ReactNode
  children: ReactNode
  placement?: HoverCardPlacement
  /** Hover delay in ms; defaults to `overlay.hoverCardOpenDelayMs` (instant). */
  delay?: number
  className?: string
}

/**
 * Hover card: rich, non-essential content about its trigger. Opens instantly on
 * hover and keyboard focus; dismissible with Escape and hoverable (WCAG 1.4.13).
 * A control's name belongs in a `Tooltip`; interactive surfaces in a `Popover`.
 */
export function HoverCard({
  heading,
  description,
  content,
  children,
  placement = 'bottom',
  delay = overlay.hoverCardOpenDelayMs,
  className = '',
}: HoverCardProps) {
  const id = useId()
  const { open, handlers } = useOverlayTrigger({
    openDelayMs: delay,
    closeOnPress: false,
    longPressMs: null,
  })

  return (
    <div
      className={`hovercard-wrapper hovercard-${placement} ${className}`.trim()}
      data-state={open ? 'open' : 'closed'}
      {...handlers}
    >
      <div className="hovercard-trigger" aria-describedby={open ? id : undefined}>
        {children}
      </div>
      <div id={id} className="hovercard">
        {heading && <p className="hovercard-title">{heading}</p>}
        {description && <p className="hovercard-description">{description}</p>}
        {content}
      </div>
    </div>
  )
}
