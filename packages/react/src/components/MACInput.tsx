import { useId, useRef, useState } from 'react'
import type { ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react'

export interface MACInputProps {
  label?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: string) => void
  id?: string
  className?: string
}

const HEX_RE = /^[0-9a-fA-F]{0,2}$/
const FULL_MAC_RE = /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/

function parseMAC(mac: string): [string, string, string, string, string, string] {
  const parts = mac.replace(/-/g, ':').split(':')
  return [
    parts[0] ?? '00',
    parts[1] ?? '00',
    parts[2] ?? '00',
    parts[3] ?? '00',
    parts[4] ?? '00',
    parts[5] ?? '00',
  ]
}

function normalizeMAC(mac: string): string {
  return (
    mac
      .replace(/-/g, ':')
      .replace(/:/g, '')
      .match(/.{1,2}/g)
      ?.join(':') ?? mac
  )
}

export function MACInput({
  label,
  value: valueProp,
  defaultValue = '00:00:00:00:00:00',
  disabled = false,
  onChange,
  id,
  className = '',
}: MACInputProps) {
  const gid = useId()
  const inputId = id ?? gid
  const [internal, setInternal] = useState<[string, string, string, string, string, string]>(() =>
    parseMAC(valueProp ?? defaultValue),
  )
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])

  const pairs = valueProp !== undefined ? parseMAC(valueProp) : internal

  function focusAt(i: number) {
    const el = refs.current[i]
    if (el) {
      el.focus()
      el.select()
    }
  }

  function commit(i: number, val: string) {
    const next = [...pairs] as [string, string, string, string, string, string]
    next[i] = val.toUpperCase()
    if (valueProp === undefined) setInternal(next)
    onChange?.(next.join(':'))
  }

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (!HEX_RE.test(raw)) return
    commit(i, raw)
    if (raw.length === 2 && i < 5) focusAt(i + 1)
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    const el = refs.current[i]!
    if (e.key === ':' || e.key === '-') {
      e.preventDefault()
      if (i < 5) focusAt(i + 1)
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 5) {
        e.preventDefault()
        focusAt(i + 1)
      }
    } else if (e.key === 'ArrowLeft' && el.selectionStart === 0) {
      if (i > 0) {
        e.preventDefault()
        focusAt(i - 1)
      }
    } else if (e.key === 'Backspace' && el.value === '' && i > 0) {
      e.preventDefault()
      focusAt(i - 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').trim()
    if (FULL_MAC_RE.test(text)) {
      e.preventDefault()
      const normalized = normalizeMAC(text)
      const next = normalized.split(':') as [string, string, string, string, string, string]
      const upper = next.map((p) => p.toUpperCase()) as [
        string,
        string,
        string,
        string,
        string,
        string,
      ]
      if (valueProp === undefined) setInternal(upper)
      onChange?.(upper.join(':'))
      focusAt(5)
    }
  }

  return (
    <div className={`mac-input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={`${inputId}-0`} className="mac-input__label">
          {label}
        </label>
      )}
      <div
        className={`mac-input${disabled ? ' mac-input--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'MAC address'}
      >
        {pairs.flatMap((pair, i) => {
          const nodes = [
            <input
              key={`p${i}`}
              ref={(el) => {
                refs.current[i] = el
              }}
              id={i === 0 ? `${inputId}-0` : undefined}
              type="text"
              inputMode="text"
              aria-label={`Byte ${i + 1} of 6`}
              value={pair}
              disabled={disabled}
              maxLength={2}
              className="mac-input__pair"
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
            />,
          ]
          if (i < 5)
            nodes.push(
              <span key={`c${i}`} className="mac-input__colon" aria-hidden="true">
                :
              </span>,
            )
          return nodes
        })}
      </div>
    </div>
  )
}
