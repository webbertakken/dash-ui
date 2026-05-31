import { useId, useState } from 'react'
import type { ChangeEvent } from 'react'

export interface PasswordInputProps {
  label?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  autocomplete?: 'current-password' | 'new-password' | 'off'
  onChange?: (value: string) => void
  id?: string
  className?: string
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 2l12 12M6.5 6.6A2 2 0 0 0 9.4 9.5M4.2 4.3C2.7 5.3 1.5 7 1.5 8s2.2 4.5 6.5 4.5c1.3 0 2.4-.3 3.3-.8M7 3.6C7.3 3.5 7.7 3.5 8 3.5c4.3 0 6.5 3.5 6.5 4.5 0 .6-.6 1.7-1.7 2.7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PasswordInput({
  label,
  value: valueProp,
  defaultValue = '',
  placeholder,
  disabled = false,
  autocomplete = 'current-password',
  onChange,
  id,
  className = '',
}: PasswordInputProps) {
  const gid = useId()
  const inputId = id ?? gid
  const [shown, setShown] = useState(false)
  const [internal, setInternal] = useState(defaultValue)

  const value = valueProp !== undefined ? valueProp : internal

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (valueProp === undefined) setInternal(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div className={`pwd-input-wrapper${className ? ` ${className}` : ''}`}>
      {label && (
        <label htmlFor={inputId} className="pwd-input__label">
          {label}
        </label>
      )}
      <div className={`pwd-input${disabled ? ' pwd-input--disabled' : ''}`}>
        <input
          id={inputId}
          type={shown ? 'text' : 'password'}
          aria-label={label}
          className="pwd-input__field"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autocomplete}
          onChange={handleChange}
        />
        <button
          type="button"
          className="pwd-input__toggle"
          aria-pressed={shown}
          aria-label={shown ? 'Hide password' : 'Show password'}
          disabled={disabled}
          onClick={() => setShown((v) => !v)}
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}
