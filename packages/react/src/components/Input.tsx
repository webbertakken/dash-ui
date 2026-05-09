import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { SearchIcon } from '../icons.js';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...rest }: InputProps) {
  return <input className={`input ${className}`.trim()} {...rest} />;
}

export interface FieldProps {
  label: string;
  children?: ReactNode;
  defaultValue?: string;
  value?: string;
  id?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

export function Field({ label, children, defaultValue, value, id, error, required, hint }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={inputId}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <div className="field-hint" id={hintId}>
          {hint}
        </div>
      )}
      {children ?? (
        <Input
          id={inputId}
          defaultValue={defaultValue}
          value={value}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
      {error && (
        <div className="field-error" id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchBox({ placeholder, type, 'aria-label': ariaLabel, ...rest }: SearchBoxProps) {
  return (
    <div className="search" role="search">
      <SearchIcon style={{ color: '#6E7079' }} width={14} height={14} aria-hidden="true" focusable="false" />
      <input type={type ?? 'search'} placeholder={placeholder} aria-label={ariaLabel ?? placeholder} {...rest} />
    </div>
  );
}
