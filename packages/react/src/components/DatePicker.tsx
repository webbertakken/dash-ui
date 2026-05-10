import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function formatDate(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const grid: Date[] = [];
  for (let i = first.getDay() - 1; i >= 0; i--) {
    grid.push(new Date(year, month, -i));
  }
  for (let d = 1; d <= last.getDate(); d++) {
    grid.push(new Date(year, month, d));
  }
  while (grid.length < 42) {
    grid.push(new Date(year, month + 1, grid.length - first.getDay() - last.getDate() + 1));
  }
  return grid;
}

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', disabled = false }: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value?.getMonth() ?? today.getMonth());
  const [focusIdx, setFocusIdx] = useState(0);

  const uid = useId();
  const calId = `${uid}-cal`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const grid = buildGrid(viewYear, viewMonth);

  function openCal() {
    if (disabled) return;
    const initial = value
      ? grid.findIndex((d) => isSameDay(d, value))
      : grid.findIndex((d) => isSameDay(d, today));
    setFocusIdx(Math.max(0, initial));
    setOpen(true);
  }

  function closeCal() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function select(d: Date) {
    onChange?.(d);
    closeCal();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (
        !calRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open) dayRefs.current[focusIdx]?.focus();
  }, [open, focusIdx]);

  function onGridKey(e: KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === 'ArrowRight') { e.preventDefault(); next = idx + 1; }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next = idx - 1; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); next = idx + 7; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); next = idx - 7; }
    else if (e.key === 'Home') { e.preventDefault(); next = Math.floor(idx / 7) * 7; }
    else if (e.key === 'End') { e.preventDefault(); next = Math.floor(idx / 7) * 7 + 6; }
    else if (e.key === 'PageDown') { e.preventDefault(); nextMonth(); return; }
    else if (e.key === 'PageUp') { e.preventDefault(); prevMonth(); return; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(grid[idx]); return; }
    else if (e.key === 'Escape') { e.preventDefault(); closeCal(); return; }
    else if (e.key === 'Tab') { closeCal(); return; }
    else return;
    if (next < 0) { prevMonth(); return; }
    if (next >= grid.length) { nextMonth(); return; }
    setFocusIdx(next);
  }

  return (
    <div className="dp-root">
      <button
        ref={triggerRef}
        type="button"
        className="btn dp-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? calId : undefined}
        disabled={disabled}
        onClick={open ? closeCal : openCal}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <rect x="1" y="2" width="12" height="11" rx="1.5" />
          <path d="M1 6h12M4 1v2M10 1v2" />
        </svg>
        {value ? formatDate(value) : placeholder}
      </button>
      {open && (
        <div
          id={calId}
          ref={calRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Choose date, ${MONTHS[viewMonth]} ${viewYear}`}
          className="dp-cal"
        >
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth} aria-label="Previous month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 1L2 6l5 5" />
              </svg>
            </button>
            <span className="dp-month-label" aria-live="polite">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth} aria-label="Next month">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </div>
          <table role="grid" className="dp-grid" aria-label={`${MONTHS[viewMonth]} ${viewYear}`}>
            <thead>
              <tr>
                {DAYS.map((d) => (
                  <th key={d} scope="col" abbr={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, row) => (
                <tr key={row}>
                  {Array.from({ length: 7 }, (_, col) => {
                    const idx = row * 7 + col;
                    const day = grid[idx];
                    const outside = day.getMonth() !== viewMonth;
                    const isToday = isSameDay(day, today);
                    const isSelected = value ? isSameDay(day, value) : false;
                    return (
                      <td key={col} role="gridcell" aria-selected={isSelected}>
                        <button
                          ref={(el) => { dayRefs.current[idx] = el; }}
                          type="button"
                          tabIndex={idx === focusIdx ? 0 : -1}
                          className={[
                            'dp-day',
                            outside && 'dp-day--outside',
                            isToday && !isSelected && 'dp-day--today',
                            isSelected && 'dp-day--selected',
                          ].filter(Boolean).join(' ')}
                          aria-label={day.toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                          })}
                          onKeyDown={(e) => onGridKey(e, idx)}
                          onClick={() => select(day)}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
