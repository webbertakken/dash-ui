import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

export interface TimePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseTime(t: string): [number, number] {
  const [h = '0', m = '0'] = t.split(':');
  return [
    Math.min(23, Math.max(0, parseInt(h, 10) || 0)),
    Math.min(59, Math.max(0, parseInt(m, 10) || 0)),
  ];
}

export function TimePicker({
  label,
  value: valueProp,
  defaultValue = '00:00',
  disabled = false,
  onChange,
  id,
  className = '',
}: TimePickerProps) {
  const gid = useId();
  const inputId = id ?? gid;
  const [internal, setInternal] = useState<[number, number]>(() => parseTime(valueProp ?? defaultValue));
  const refs = useRef<[HTMLInputElement | null, HTMLInputElement | null]>([null, null]);

  const [hours, minutes] = valueProp !== undefined ? parseTime(valueProp) : internal;

  function commit(h: number, m: number) {
    if (valueProp === undefined) setInternal([h, m]);
    onChange?.(`${pad(h)}:${pad(m)}`);
  }

  function handleKey(field: 0 | 1, e: KeyboardEvent<HTMLInputElement>) {
    const val = field === 0 ? hours : minutes;
    const max = field === 0 ? 23 : 59;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = val >= max ? 0 : val + 1;
      field === 0 ? commit(next, minutes) : commit(hours, next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = val <= 0 ? max : val - 1;
      field === 0 ? commit(next, minutes) : commit(hours, next);
    } else if ((e.key === ':' || e.key === 'ArrowRight') && field === 0) {
      e.preventDefault();
      refs.current[1]?.focus();
    } else if (e.key === 'ArrowLeft' && field === 1) {
      e.preventDefault();
      refs.current[0]?.focus();
    }
  }

  function handleChange(field: 0 | 1, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!/^\d{0,2}$/.test(raw)) return;
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const max = field === 0 ? 23 : 59;
    const clamped = Math.min(max, n);
    field === 0 ? commit(clamped, minutes) : commit(hours, clamped);
    if (raw.length === 2 && field === 0) refs.current[1]?.focus();
  }

  return (
    <div className={`time-picker-wrapper${className ? ` ${className}` : ''}`}>
      {label && (
        <label htmlFor={`${inputId}-h`} className="time-picker__label">{label}</label>
      )}
      <div
        className={`time-picker${disabled ? ' time-picker--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'Time'}
      >
        <input
          ref={(el) => { refs.current[0] = el; }}
          id={`${inputId}-h`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          role="spinbutton"
          aria-label="Hours"
          aria-valuenow={hours}
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuetext={pad(hours)}
          value={pad(hours)}
          disabled={disabled}
          maxLength={2}
          className="time-picker__field"
          onChange={(e) => handleChange(0, e)}
          onKeyDown={(e) => handleKey(0, e)}
          onFocus={(e) => e.currentTarget.select()}
        />
        <span className="time-picker__sep" aria-hidden="true">:</span>
        <input
          ref={(el) => { refs.current[1] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          role="spinbutton"
          aria-label="Minutes"
          aria-valuenow={minutes}
          aria-valuemin={0}
          aria-valuemax={59}
          aria-valuetext={pad(minutes)}
          value={pad(minutes)}
          disabled={disabled}
          maxLength={2}
          className="time-picker__field"
          onChange={(e) => handleChange(1, e)}
          onKeyDown={(e) => handleKey(1, e)}
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>
    </div>
  );
}
