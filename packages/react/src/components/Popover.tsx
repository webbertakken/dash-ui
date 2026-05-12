import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'bottom'

export interface PopoverProps {
  label: string
  variant?: 'ghost' | 'primary'
  title?: string
  children: ReactNode
  placement?: PopoverPlacement
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function Popover({
  label,
  variant = 'ghost',
  title,
  children,
  placement = 'bottom-start',
}: PopoverProps) {
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel)?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'Tab' && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (!items.length) {
          e.preventDefault()
          return
        }
        const first = items[0]!
        const last = items[items.length - 1]!
        const active = document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div ref={rootRef} className="popover-root">
      <button
        ref={triggerRef}
        type="button"
        className={`btn btn-${variant}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
          className={`popover popover-${placement}`}
          tabIndex={-1}
        >
          {title && (
            <div id={titleId} className="popover-h">
              {title}
            </div>
          )}
          <div className="popover-b">{children}</div>
        </div>
      )}
    </div>
  )
}
