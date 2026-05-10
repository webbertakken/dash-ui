import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';

const PRESETS = [
  { id: '1h', label: 'Last 1 hour', short: 'Last 1 h' },
  { id: '6h', label: 'Last 6 hours', short: 'Last 6 h' },
  { id: '24h', label: 'Last 24 hours', short: 'Last 24 h' },
  { id: '7d', label: 'Last 7 days', short: 'Last 7 d' },
  { id: '30d', label: 'Last 30 days', short: 'Last 30 d' },
] as const;

export type TimeRangeId = (typeof PRESETS)[number]['id'];

export interface TimeRangeProps {
  value?: TimeRangeId;
  onChange?: (value: TimeRangeId) => void;
}

export function TimeRange({ value = '1h', onChange }: TimeRangeProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = PRESETS.find((p) => p.id === value) ?? PRESETS[0];

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function toggle() {
    setOpen((prev) => {
      if (!prev) setActiveIdx(PRESETS.findIndex((p) => p.id === value));
      return !prev;
    });
  }

  function select(id: TimeRangeId) {
    onChange?.(id);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setActiveIdx(PRESETS.findIndex((p) => p.id === value));
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, PRESETS.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(PRESETS.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(PRESETS[activeIdx].id); }
    else if (e.key === 'Tab') { setOpen(false); }
  }

  return (
    <div ref={wrapperRef} className="time-range-root">
      <button
        ref={triggerRef}
        type="button"
        className="btn time-range-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        {selected.short}
        <svg className="time-range-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <ul id={listId} role="listbox" aria-label="Time range" className="time-range-list">
          {PRESETS.map((p, idx) => (
            <li
              key={p.id}
              role="option"
              aria-selected={p.id === value}
              tabIndex={-1}
              data-active={idx === activeIdx ? 'true' : undefined}
              className="time-range-option"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => { e.preventDefault(); select(p.id); }}
            >
              {p.label}
              {p.id === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
