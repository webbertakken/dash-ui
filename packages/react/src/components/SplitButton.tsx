import { useState, useRef, useEffect, useId } from 'react'
import type { KeyboardEvent } from 'react'
import type { ButtonVariant } from './Button.js'

export interface SplitButtonItem {
  id: string
  label: string
  disabled?: boolean
}

export interface SplitButtonProps {
  label: string
  variant?: ButtonVariant
  disabled?: boolean
  items: SplitButtonItem[]
  onPrimaryClick?: () => void
  onAction?: (id: string) => void
}

export function SplitButton({
  label,
  variant = 'ghost',
  disabled,
  items,
  onPrimaryClick,
  onAction,
}: SplitButtonProps) {
  const uid = useId()
  const menuId = `${uid}-menu`
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const caretRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function toggleMenu() {
    setOpen((prev) => {
      if (!prev) setActiveIdx(0)
      return !prev
    })
  }

  function activate(id: string) {
    onAction?.(id)
    setOpen(false)
    caretRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        setActiveIdx(0)
        setOpen(true)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      caretRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIdx(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIdx(items.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const item = items[activeIdx]
      if (item && !item.disabled) activate(item.id)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="split-btn">
      <button
        type="button"
        className={`btn btn-${variant} split-btn-primary`}
        disabled={disabled}
        onClick={onPrimaryClick}
      >
        {label}
      </button>
      <button
        ref={caretRef}
        type="button"
        className={`btn btn-${variant} split-btn-caret`}
        disabled={disabled}
        aria-label={`${label} options`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={toggleMenu}
        onKeyDown={onKeyDown}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 3 L5 7 L9 3" />
        </svg>
      </button>
      {open && (
        <ul id={menuId} role="menu" aria-label={`${label} options`} className="action-menu">
          {items.map((item, idx) => (
            <li
              key={item.id}
              role="menuitem"
              tabIndex={-1}
              aria-disabled={item.disabled}
              data-active={idx === activeIdx ? 'true' : undefined}
              className="action-menu-item"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => {
                e.preventDefault()
                if (!item.disabled) activate(item.id)
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
