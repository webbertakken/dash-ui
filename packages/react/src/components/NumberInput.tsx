import { useState, useId } from 'react'
import type { KeyboardEvent, ChangeEvent } from 'react'

export interface NumberInputProps {
  label?: string
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  disabled?: boolean
  onChange?: (value: number) => void
  id?: string
  className?: string
}

export function NumberInput({
  label,
  value: valueProp,
  defaultValue = 0,
  min,
  max,
  step = 1,
  suffix,
  disabled = false,
  onChange,
  id,
  className = '',
}: NumberInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = valueProp !== undefined ? valueProp : internalValue

  function clamp(n: number) {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }

  function commit(next: number) {
    const clamped = clamp(next)
    if (valueProp === undefined) setInternalValue(clamped)
    onChange?.(clamped)
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      commit(value + step)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      commit(value - step)
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      commit(value + step * 10)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      commit(value - step * 10)
    } else if (e.key === 'Home' && min !== undefined) {
      e.preventDefault()
      commit(min)
    } else if (e.key === 'End' && max !== undefined) {
      e.preventDefault()
      commit(max)
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value)
    if (!isNaN(n)) commit(n)
  }

  const canDecrement = !disabled && (min === undefined || value > min)
  const canIncrement = !disabled && (max === undefined || value < max)

  return (
    <div className={`number-input ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="number-input__label">
          {label}
        </label>
      )}
      <div className="number-input__control">
        <button
          type="button"
          className="number-input__btn"
          aria-label="Decrement"
          tabIndex={-1}
          disabled={!canDecrement}
          onClick={() => commit(value - step)}
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={suffix ? `${value} ${suffix}` : undefined}
          value={value}
          disabled={disabled}
          className="number-input__field"
          onChange={handleChange}
          onKeyDown={handleKey}
        />
        {suffix && (
          <span className="number-input__suffix" aria-hidden="true">
            {suffix}
          </span>
        )}
        <button
          type="button"
          className="number-input__btn"
          aria-label="Increment"
          tabIndex={-1}
          disabled={!canIncrement}
          onClick={() => commit(value + step)}
        >
          +
        </button>
      </div>
    </div>
  )
}
