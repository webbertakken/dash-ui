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
}

export function Field({ label, children, defaultValue, value }: FieldProps) {
  return (
    <div className="field">
      <label>{label}</label>
      {children ?? <Input defaultValue={defaultValue} value={value} />}
    </div>
  );
}

export interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchBox({ placeholder, ...rest }: SearchBoxProps) {
  return (
    <div className="search">
      <SearchIcon style={{ color: '#6E7079' }} width={14} height={14} />
      <input placeholder={placeholder} {...rest} />
    </div>
  );
}
