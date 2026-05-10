import { useId, useRef, useState } from 'react';
import type { ReactNode, ClipboardEvent, KeyboardEvent, ChangeEvent } from 'react';

export interface IPInputProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
}

function clampOctet(s: string): string {
  if (s === '') return s;
  const n = Number(s);
  if (isNaN(n)) return s;
  return String(Math.min(255, Math.max(0, n)));
}

function parseIP(ip: string): [string, string, string, string] {
  const parts = ip.split('.');
  return [parts[0] ?? '0', parts[1] ?? '0', parts[2] ?? '0', parts[3] ?? '0'];
}

export function IPInput({
  label,
  value: valueProp,
  defaultValue = '0.0.0.0',
  disabled = false,
  onChange,
  id,
  className = '',
}: IPInputProps) {
  const gid = useId();
  const inputId = id ?? gid;
  const [internal, setInternal] = useState<[string, string, string, string]>(
    () => parseIP(valueProp ?? defaultValue),
  );
  const refs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const octets = valueProp !== undefined ? parseIP(valueProp) : internal;

  function focusAt(i: number) {
    const el = refs.current[i];
    if (el) { el.focus(); el.select(); }
  }

  function commit(i: number, val: string) {
    const next = [...octets] as [string, string, string, string];
    next[i] = clampOctet(val);
    if (valueProp === undefined) setInternal(next);
    onChange?.(next.join('.'));
  }

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (!/^\d{0,3}$/.test(raw)) return;
    commit(i, raw);
    if (raw.length === 3 && i < 3) focusAt(i + 1);
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    const el = refs.current[i]!;
    if (e.key === '.') {
      e.preventDefault();
      if (i < 3) focusAt(i + 1);
    } else if (e.key === 'ArrowRight' && el.selectionStart === el.value.length) {
      if (i < 3) { e.preventDefault(); focusAt(i + 1); }
    } else if (e.key === 'ArrowLeft' && el.selectionStart === 0) {
      if (i > 0) { e.preventDefault(); focusAt(i - 1); }
    } else if (e.key === 'Backspace' && el.value === '' && i > 0) {
      e.preventDefault(); focusAt(i - 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').trim();
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(text)) {
      e.preventDefault();
      const next = text.split('.').map(clampOctet) as [string, string, string, string];
      if (valueProp === undefined) setInternal(next);
      onChange?.(next.join('.'));
      focusAt(3);
    }
  }

  return (
    <div className={`ip-input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={`${inputId}-0`} className="ip-input__label">{label}</label>
      )}
      <div
        className={`ip-input${disabled ? ' ip-input--disabled' : ''}`}
        role="group"
        aria-label={label ?? 'IP address'}
      >
        {octets.flatMap((oct, i) => {
          const nodes: ReactNode[] = [
            <input
              key={`o${i}`}
              ref={(el) => { refs.current[i] = el; }}
              id={i === 0 ? `${inputId}-0` : undefined}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              role="spinbutton"
              aria-label={`Octet ${i + 1} of 4`}
              aria-valuenow={oct === '' ? 0 : Number(oct)}
              aria-valuemin={0}
              aria-valuemax={255}
              value={oct}
              disabled={disabled}
              maxLength={3}
              className="ip-input__octet"
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKey(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
            />,
          ];
          if (i < 3) nodes.push(
            <span key={`d${i}`} className="ip-input__dot" aria-hidden="true">.</span>,
          );
          return nodes;
        })}
      </div>
    </div>
  );
}
