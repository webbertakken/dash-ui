import { useId, useRef, useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export function Checkbox({ label, indeterminate = false, id, className = '', ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const input = (
    <input
      ref={ref}
      type="checkbox"
      id={inputId}
      className={`checkbox ${className}`.trim()}
      {...rest}
    />
  );

  if (!label) return input;

  return (
    <label className="checkbox-label" htmlFor={inputId}>
      {input}
      <span>{label}</span>
    </label>
  );
}
