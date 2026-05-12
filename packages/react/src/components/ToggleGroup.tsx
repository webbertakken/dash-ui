import type { ReactNode } from 'react'

export interface ToggleGroupOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[]
  value: string[]
  onChange: (value: string[]) => void
  ariaLabel: string
  size?: 'sm' | 'md'
  className?: string
}

export function ToggleGroup({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  className = '',
}: ToggleGroupProps) {
  function toggle(v: string) {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`tg-group tg-group--${size}${className ? ` ${className}` : ''}`}
    >
      {options.map((opt) => {
        const pressed = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={pressed}
            disabled={opt.disabled}
            className={`tg-btn${pressed ? ' tg-btn--on' : ''}`}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
