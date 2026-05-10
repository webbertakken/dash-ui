import { useState, useRef, useEffect, useId } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search…',
  id,
  disabled = false,
  className = '',
}: ComboboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-lb`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered =
    query.trim() === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  const activeOptionId =
    activeIdx >= 0 && filtered[activeIdx] ? `${listboxId}-opt-${activeIdx}` : undefined;

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function openList() {
    if (disabled) return;
    setQuery(selectedOption?.label ?? '');
    setActiveIdx(options.findIndex((o) => o.value === value));
    setOpen(true);
  }

  function pick(opt: ComboboxOption) {
    onChange?.(opt.value);
    setOpen(false);
    setQuery('');
    inputRef.current?.focus();
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setActiveIdx(-1);
    if (!open) setOpen(true);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === 'Escape') { setOpen(false); setQuery(''); return; }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(filtered.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (activeIdx >= 0 && filtered[activeIdx]) pick(filtered[activeIdx]); }
    else if (e.key === 'Tab') { setOpen(false); setQuery(''); }
  }

  const displayValue = open ? query : (selectedOption?.label ?? '');

  return (
    <div ref={wrapperRef} className={`combobox-wrapper ${className}`.trim()}>
      {label && <label htmlFor={inputId} className="sr-only">{label}</label>}
      <div className="combobox-field">
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          aria-label={label}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={onInputChange}
          onFocus={openList}
          onKeyDown={onKeyDown}
          className="combobox-input"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="combobox-chevron-btn"
          onClick={() => {
            if (open) { setOpen(false); setQuery(''); }
            else { inputRef.current?.focus(); openList(); }
          }}
        >
          <svg className={`select-chevron${open ? ' combobox-chevron-open' : ''}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
      {open && (
        <ul id={listboxId} role="listbox" aria-label={label} className="select-listbox combobox-listbox">
          {filtered.length === 0 ? (
            <li className="combobox-empty">No results</li>
          ) : (
            filtered.map((opt, idx) => (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={opt.value === value}
                data-active={idx === activeIdx ? 'true' : undefined}
                className="select-option"
                onMouseDown={(e) => { e.preventDefault(); pick(opt); }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
