import { useState, useRef, useEffect, useId } from 'react'
import type { KeyboardEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select…',
  id,
  disabled = false,
  className = '',
}: SelectProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const listboxId = `${triggerId}-lb`
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected?.label ?? placeholder

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function toggle() {
    if (disabled) return
    setOpen((prev) => {
      if (!prev) {
        const idx = options.findIndex((o) => o.value === value)
        setActiveIdx(idx >= 0 ? idx : 0)
      }
      return !prev
    })
  }

  function pick(val: string) {
    onChange?.(val)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (e.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        const idx = options.findIndex((o) => o.value === value)
        setActiveIdx(idx >= 0 ? idx : 0)
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIdx(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIdx(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIdx >= 0) pick(options[activeIdx].value)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className={`select-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={triggerId} className="sr-only">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label}
        disabled={disabled}
        className="select-trigger"
        onClick={toggle}
        onKeyDown={onKeyDown}
        type="button"
      >
        <span>{displayLabel}</span>
        <svg className="select-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
      {open && (
        <ul id={listboxId} role="listbox" aria-label={label} className="select-listbox">
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              data-active={idx === activeIdx ? 'true' : undefined}
              className="select-option"
              onMouseDown={(e) => {
                e.preventDefault()
                pick(opt.value)
              }}
              onMouseEnter={() => setActiveIdx(idx)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
