import { useId, useRef, useState } from 'react'
import type { ReactNode, ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react'

export interface CIDRInputProps {
  label?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: string) => void
  id?: string
  className?: string
}

function clampOctet(s: string): string {
  if (s === '') return s
  const n = Number(s)
  if (isNaN(n)) return s
  return String(Math.min(255, Math.max(0, n)))
}

function clampPrefix(s: string): string {
  if (s === '') return s
  const n = Number(s)
  if (isNaN(n)) return s
  return String(Math.min(32, Math.max(0, n)))
}

function parseCIDR(cidr: string): [string, string, string, string, string] {
  const [ip = '0.0.0.0', prefix = '24'] = cidr.split('/')
  const parts = ip.split('.')
  return [parts[0] ?? '0', parts[1] ?? '0', parts[2] ?? '0', parts[3] ?? '0', prefix]
}

export function CIDRInput({
  label,
  value: valueProp,
  defaultValue = '0.0.0.0/0',
  disabled = false,
  onChange,
  id,
  className = '',
}: CIDRInputProps) {
  const gid = useId()
  const inputId = id ?? gid
  const [internal, setInternal] = useState<[string, string, string, string, string]>(() =>
    parseCIDR(valueProp ?? defaultValue),
  )
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null])

  const fields = valueProp !== undefined ? parseCIDR(valueProp) : internal

  function focusAt(i: number) {
    const el = refs.current[i]
    if (el) {
      el.focus()
      el.select()
    }
  }

  function commitFields(next: [string, string, string, string, string]) {
    if (valueProp === undefined) setInternal(next)
    onChange?.(`${next.slice(0, 4).join('.')}/${next[4]}`)
  }

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const next = [...fields] as [string, string, string, string, string]
    if (i < 4) {
      if (!/^\d{0,3}$/.test(raw)) return
      next[i] = clampOctet(raw)
      commitFields(next)
      if (raw.length === 3 && i < 4) focusAt(i + 1)
    } else {
      if (!/^\d{0,2}$/.test(raw)) return
      next[4] = clampPrefix(raw)
      commitFields(next)
    }
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    const el = refs.current[i]!
    if (e.key === '.' && i < 3) {
      e.preventDefault()
      focusAt(i + 1)
    } else if (e.key === '/' && i <= 3) {
      e.preventDefault()
      focusAt(4)
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 4) {
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
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/.test(text)) {
      e.preventDefault()
      const [ip = '0.0.0.0', prefix = '0'] = text.split('/')
      const next = [...ip.split('.').map(clampOctet), clampPrefix(prefix)] as [
        string,
        string,
        string,
        string,
        string,
      ]
      if (valueProp === undefined) setInternal(next)
      onChange?.(`${next.slice(0, 4).join('.')}/${next[4]}`)
      focusAt(4)
    }
  }

  return (
    <div className={`cidr-input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={`${inputId}-0`} className="cidr-input__label">
          {label}
        </label>
      )}
      <div
        className={`cidr-input${disabled ? ' cidr-input--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'CIDR'}
      >
        {([0, 1, 2, 3] as const).flatMap((i) => {
          const nodes: ReactNode[] = [
            <input
              key={`o${i}`}
              ref={(el) => {
                refs.current[i] = el
              }}
              id={i === 0 ? `${inputId}-0` : undefined}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              role="spinbutton"
              aria-label={`Octet ${i + 1} of 4`}
              aria-valuenow={fields[i] === '' ? 0 : Number(fields[i])}
              aria-valuemin={0}
              aria-valuemax={255}
              value={fields[i]}
              disabled={disabled}
              maxLength={3}
              className="cidr-input__octet"
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
            />,
          ]
          nodes.push(
            <span key={`d${i}`} className="cidr-input__dot" aria-hidden="true">
              {i < 3 ? '.' : '/'}
            </span>,
          )
          return nodes
        })}
        <input
          ref={(el) => {
            refs.current[4] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          role="spinbutton"
          aria-label="Prefix length"
          aria-valuenow={fields[4] === '' ? 0 : Number(fields[4])}
          aria-valuemin={0}
          aria-valuemax={32}
          value={fields[4]}
          disabled={disabled}
          maxLength={2}
          className="cidr-input__prefix"
          onChange={(e) => handleChange(4, e)}
          onKeyDown={(e) => handleKey(4, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>
    </div>
  )
}
