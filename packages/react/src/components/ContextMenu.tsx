import { useState, useRef, useEffect, useId } from 'react'
import type { KeyboardEvent } from 'react'

export interface ContextMenuItem {
  id: string
  label: string
  /** Red tone (destructive). Mutually exclusive with `warning`. */
  danger?: boolean
  /** Yellow tone (caution / heads-up). Mutually exclusive with `danger`. */
  warning?: boolean
  disabled?: boolean
}

export type ContextMenuEntry = ContextMenuItem | { separator: true }

export interface ContextMenuProps {
  items: ContextMenuEntry[]
  x: number
  y: number
  open: boolean
  onClose: () => void
  onAction: (id: string) => void
  label?: string
}

export function ContextMenu({
  items,
  x,
  y,
  open,
  onClose,
  onAction,
  label = 'Context menu',
}: ContextMenuProps) {
  const uid = useId()
  const menuId = `${uid}-ctxmenu`
  const [activeIdx, setActiveIdx] = useState(0)
  const menuRef = useRef<HTMLUListElement>(null)

  const actionItems = items.reduce<ContextMenuItem[]>((acc, e) => {
    if (!('separator' in e)) acc.push(e)
    return acc
  }, [])

  useEffect(() => {
    if (!open) return
    setActiveIdx(0)
    requestAnimationFrame(() => menuRef.current?.focus())
    function handler(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  function activate(id: string) {
    onAction(id)
    onClose()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, actionItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIdx(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIdx(actionItems.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const item = actionItems[activeIdx]
      if (item && !item.disabled) activate(item.id)
    } else if (e.key === 'Tab') {
      onClose()
    }
  }

  if (!open) return null

  const menuW = 168
  const menuH = items.length * 30 + 8
  const cx = Math.min(x, window.innerWidth - menuW - 8)
  const cy = Math.min(y, window.innerHeight - menuH - 8)

  return (
    <ul
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      className="ctx-menu"
      style={{ left: cx, top: cy }}
      onKeyDown={onKeyDown}
    >
      {items.map((entry, i) => {
        if ('separator' in entry) {
          return <li key={i} role="separator" className="ctx-menu-sep" />
        }
        const ai = actionItems.indexOf(entry)
        return (
          <li
            key={entry.id}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={entry.disabled || undefined}
            data-active={ai === activeIdx ? 'true' : undefined}
            data-danger={entry.danger || undefined}
            data-warning={entry.warning || undefined}
            className="ctx-menu-item"
            onMouseEnter={() => setActiveIdx(ai)}
            onMouseDown={(e) => {
              e.preventDefault()
              if (!entry.disabled) activate(entry.id)
            }}
          >
            {entry.label}
          </li>
        )
      })}
    </ul>
  )
}
