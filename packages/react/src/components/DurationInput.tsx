import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

export interface DurationInputProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  maxHours?: number;
  disabled?: boolean;
  onChange?: (seconds: number) => void;
  id?: string;
  className?: string;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toHMS(secs: number): [number, number, number] {
  const t = Math.max(0, secs);
  return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
}

function fromHMS(h: number, m: number, s: number): number {
  return h * 3600 + m * 60 + s;
}

export function DurationInput({
  label,
  value: valueProp,
  defaultValue = 0,
  maxHours = 99,
  disabled = false,
  onChange,
  id,
  className = '',
}: DurationInputProps) {
  const gid = useId();
  const inputId = id ?? gid;
  const [internal, setInternal] = useState<number>(valueProp ?? defaultValue);
  const refs = useRef<[HTMLInputElement | null, HTMLInputElement | null, HTMLInputElement | null]>([null, null, null]);

  const [hours, minutes, seconds] = toHMS(valueProp !== undefined ? valueProp : internal);

  function commit(h: number, m: number, s: number) {
    const total = fromHMS(Math.min(maxHours, h), m, s);
    if (valueProp === undefined) setInternal(total);
    onChange?.(total);
  }

  function handleKey(field: 0 | 1 | 2, e: KeyboardEvent<HTMLInputElement>) {
    const vals: [number, number, number] = [hours, minutes, seconds];
    const maxes = [maxHours, 59, 59];
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = vals[field] >= maxes[field] ? 0 : vals[field] + 1;
      vals[field] = next;
      commit(...vals);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = vals[field] <= 0 ? maxes[field] : vals[field] - 1;
      vals[field] = next;
      commit(...vals);
    } else if ((e.key === ':' || e.key === 'ArrowRight') && field < 2) {
      e.preventDefault();
      refs.current[field + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && field > 0) {
      e.preventDefault();
      refs.current[field - 1]?.focus();
    }
  }

  function handleChange(field: 0 | 1 | 2, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!/^\d{0,2}$/.test(raw)) return;
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const maxes = [maxHours, 59, 59];
    const updated: [number, number, number] = [hours, minutes, seconds];
    updated[field] = Math.min(maxes[field], n);
    commit(...updated);
    if (raw.length === 2 && field < 2) refs.current[field + 1]?.focus();
  }

  const FIELDS = [
    { idx: 0 as const, val: hours,   ariaLabel: 'Hours',   ariaMax: maxHours },
    { idx: 1 as const, val: minutes, ariaLabel: 'Minutes', ariaMax: 59 },
    { idx: 2 as const, val: seconds, ariaLabel: 'Seconds', ariaMax: 59 },
  ];

  return (
    <div className={`dur-input-wrapper${className ? ` ${className}` : ''}`}>
      {label && (
        <label htmlFor={`${inputId}-h`} className="dur-input__label">{label}</label>
      )}
      <div
        className={`dur-input${disabled ? ' dur-input--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'Duration'}
      >
        {FIELDS.flatMap(({ idx, val, ariaLabel, ariaMax }, i) => {
          const nodes = [
            <input
              key={`f${idx}`}
              ref={(el) => { refs.current[idx] = el; }}
              id={idx === 0 ? `${inputId}-h` : undefined}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              role="spinbutton"
              aria-label={ariaLabel}
              aria-valuenow={val}
              aria-valuemin={0}
              aria-valuemax={ariaMax}
              aria-valuetext={pad(val)}
              value={pad(val)}
              disabled={disabled}
              maxLength={2}
              className="dur-input__field"
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKey(idx, e)}
              onFocus={(e) => e.currentTarget.select()}
            />,
          ];
          if (i < 2) nodes.push(
            <span key={`c${idx}`} className="dur-input__sep" aria-hidden="true">:</span>,
          );
          return nodes;
        })}
      </div>
    </div>
  );
}
