import { useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'

export interface SegmentOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedControlProps {
  label: string
  options: SegmentOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export function SegmentedControl({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? '')
  const active = controlledValue !== undefined ? controlledValue : internalValue
  const rootRef = useRef<HTMLDivElement>(null)

  function select(val: string) {
    if (controlledValue === undefined) setInternalValue(val)
    onChange?.(val)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = options.filter((o) => !o.disabled)
    const idx = enabled.findIndex((o) => o.value === active)
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      next = (idx + 1) % enabled.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      next = (idx - 1 + enabled.length) % enabled.length
    }
    if (next !== -1) {
      select(enabled[next].value)
      const btns = rootRef.current?.querySelectorAll<HTMLButtonElement>('button[role="radio"]')
      btns?.[next]?.focus()
    }
  }

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={label}
      className="seg-ctrl"
      onKeyDown={handleKeyDown}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={active === opt.value}
          disabled={opt.disabled}
          tabIndex={active === opt.value ? 0 : -1}
          className={['seg-ctrl__btn', active === opt.value && 'seg-ctrl__btn--active']
            .filter(Boolean)
            .join(' ')}
          onClick={() => select(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
