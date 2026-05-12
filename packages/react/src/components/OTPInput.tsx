import { useId, useRef, useState } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

export interface OTPInputProps {
  label?: string
  length?: number
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: string) => void
  id?: string
  className?: string
}

export function OTPInput({
  label,
  length = 6,
  value: valueProp,
  defaultValue = '',
  disabled = false,
  onChange,
  id,
  className = '',
}: OTPInputProps) {
  const gid = useId()
  const inputId = id ?? gid
  const [internal, setInternal] = useState<string[]>(() => {
    const src = valueProp ?? defaultValue
    return Array.from({ length }, (_, i) => src[i] ?? '')
  })
  const refs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))

  const digits =
    valueProp !== undefined ? Array.from({ length }, (_, i) => valueProp[i] ?? '') : internal

  function focusAt(i: number) {
    const el = refs.current[i]
    if (el) {
      el.focus()
      el.select()
    }
  }

  function commit(next: string[]) {
    if (valueProp === undefined) setInternal(next)
    onChange?.(next.join(''))
  }

  function handleInput(i: number, raw: string) {
    const char = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = char
    commit(next)
    if (char && i < length - 1) focusAt(i + 1)
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits]
        next[i] = ''
        commit(next)
      } else if (i > 0) {
        e.preventDefault()
        focusAt(i - 1)
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      focusAt(i - 1)
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      e.preventDefault()
      focusAt(i + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text.length) return
    e.preventDefault()
    const next = Array.from({ length }, (_, i) => text[i] ?? digits[i] ?? '')
    commit(next)
    focusAt(Math.min(text.length, length - 1))
  }

  const half = Math.floor(length / 2)

  return (
    <div className={`otp-input-wrapper${className ? ` ${className}` : ''}`}>
      {label && (
        <label htmlFor={`${inputId}-0`} className="otp-input__label">
          {label}
        </label>
      )}
      <div
        className={`otp-input${disabled ? ' otp-input--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'One-time password'}
      >
        {digits.flatMap((d, i) => {
          const nodes = []
          if (i === half) {
            nodes.push(
              <span key="sep" className="otp-input__separator" aria-hidden="true">
                &ndash;
              </span>,
            )
          }
          nodes.push(
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              id={i === 0 ? `${inputId}-0` : undefined}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              aria-label={`Digit ${i + 1} of ${length}`}
              value={d}
              disabled={disabled}
              className="otp-input__digit"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
            />,
          )
          return nodes
        })}
      </div>
    </div>
  )
}
