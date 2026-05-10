import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';
import { Tag } from './Tag.js';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  label,
  placeholder = 'Select…',
  id,
  disabled = false,
  className = '',
}: MultiSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-lb`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedSet = new Set(value);

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

  function toggle(optValue: string) {
    const next = new Set(selectedSet);
    if (next.has(optValue)) next.delete(optValue);
    else next.add(optValue);
    onChange?.(Array.from(next));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;
    if (e.key === 'Escape') { setOpen(false); setQuery(''); return; }
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      onChange?.(value.slice(0, -1));
      return;
    }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); setActiveIdx(0); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(filtered.length - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) toggle(filtered[activeIdx].value);
    }
    else if (e.key === 'Tab') { setOpen(false); setQuery(''); }
  }

  return (
    <div ref={wrapperRef} className={`multiselect-wrapper ${className}`.trim()}>
      {label && <label htmlFor={inputId} className="sr-only">{label}</label>}
      <div
        className={`multiselect-field${open ? ' multiselect-field--open' : ''}`}
        onClick={() => { if (!disabled) inputRef.current?.focus(); }}
      >
        {value.map((v) => {
          const opt = options.find((o) => o.value === v);
          return opt ? (
            <Tag key={v} label={opt.label} onRemove={() => toggle(v)} />
          ) : null;
        })}
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
          placeholder={value.length === 0 ? placeholder : ''}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); if (!open) setOpen(true); }}
          onFocus={() => { if (!disabled) setOpen(true); }}
          onKeyDown={onKeyDown}
          className="multiselect-input"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="combobox-chevron-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (open) { setOpen(false); setQuery(''); }
            else { inputRef.current?.focus(); setOpen(true); }
          }}
        >
          <svg className={`select-chevron${open ? ' combobox-chevron-open' : ''}`} viewBox="0 0 16 16" aria-hidden="true" focusable={false}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
      {open && (
        <ul id={listboxId} role="listbox" aria-label={label} aria-multiselectable="true" className="select-listbox multiselect-listbox">
          {filtered.length === 0 ? (
            <li className="combobox-empty">No results</li>
          ) : (
            filtered.map((opt, idx) => (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={selectedSet.has(opt.value)}
                data-active={idx === activeIdx ? 'true' : undefined}
                className="select-option multiselect-option"
                onMouseDown={(e) => { e.preventDefault(); toggle(opt.value); }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <span className="multiselect-check" aria-hidden="true">
                  {selectedSet.has(opt.value) && (
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
