import { useState, useRef, useEffect, useId } from 'react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDate(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${d.getFullYear()}`
}

function buildGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const grid: Date[] = []
  for (let i = first.getDay() - 1; i >= 0; i--) {
    grid.push(new Date(year, month, -i))
  }
  for (let d = 1; d <= last.getDate(); d++) {
    grid.push(new Date(year, month, d))
  }
  while (grid.length < 42) {
    grid.push(new Date(year, month + 1, grid.length - first.getDay() - last.getDate() + 1))
  }
  return grid
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
}: DateRangePickerProps) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [picking, setPicking] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const uid = useId()
  const dlgId = `${uid}-drp`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dlgRef = useRef<HTMLDivElement>(null)

  const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear
  const leftGrid = buildGrid(viewYear, viewMonth)
  const rightGrid = buildGrid(rightYear, rightMonth)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else setViewMonth((m) => m + 1)
  }

  function handleDayClick(day: Date) {
    if (!picking) {
      setPicking(day)
      onChange?.({ start: day, end: null })
    } else {
      const [s, e] = day < picking ? [day, picking] : [picking, day]
      setPicking(null)
      setHoverDate(null)
      onChange?.({ start: s, end: e })
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  function isInRange(day: Date): boolean {
    const start = picking ?? value?.start ?? null
    const end = picking ? hoverDate : (value?.end ?? null)
    if (!start || !end) return false
    const lo = start < end ? start : end
    const hi = start < end ? end : start
    return day > lo && day < hi
  }

  function isStart(day: Date): boolean {
    const start = picking ?? value?.start ?? null
    return start ? isSameDay(day, start) : false
  }

  function isEnd(day: Date): boolean {
    if (picking) return hoverDate ? isSameDay(day, hoverDate) : false
    return value?.end ? isSameDay(day, value.end) : false
  }

  function formatRange() {
    if (!value?.start) return null
    if (!value.end) return `${formatDate(value.start)} –`
    return `${formatDate(value.start)} – ${formatDate(value.end)}`
  }

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (
        !dlgRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
        setPicking(null)
      }
    }
    // Escape closes the dialog and restores focus to the trigger. Handled
    // at the document level (rather than a JSX onKeyDown on the dialog) so
    // it works regardless of focus position inside the popover.
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setPicking(null)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function renderCalendar(grid: Date[], gridMonth: number, gridYear: number) {
    return (
      <div className="drp-month">
        <div className="dp-header">
          {gridMonth === viewMonth ? (
            <button
              type="button"
              className="dp-nav"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M7 1L2 6l5 5" />
              </svg>
            </button>
          ) : (
            <span style={{ width: 28, display: 'inline-block' }} />
          )}
          <span className="dp-month-label" aria-live="polite">
            {MONTHS[gridMonth]} {gridYear}
          </span>
          {gridMonth === rightMonth ? (
            <button type="button" className="dp-nav" onClick={nextMonth} aria-label="Next month">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          ) : (
            <span style={{ width: 28, display: 'inline-block' }} />
          )}
        </div>
        <table role="grid" className="dp-grid" aria-label={`${MONTHS[gridMonth]} ${gridYear}`}>
          <thead>
            <tr>
              {DAYS.map((d) => (
                <th key={d} scope="col" abbr={d}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {Array.from({ length: 7 }, (_, col) => {
                  const idx = row * 7 + col
                  const day = grid[idx]
                  const outside = day.getMonth() !== gridMonth
                  const isTodayDay = isSameDay(day, today)
                  const start = isStart(day)
                  const end = isEnd(day)
                  const inRange = isInRange(day)
                  return (
                    <td key={col} role="gridcell" aria-selected={start || end}>
                      <button
                        type="button"
                        className={[
                          'dp-day',
                          outside && 'dp-day--outside',
                          isTodayDay && !start && !end && 'dp-day--today',
                          start && 'dp-day--start',
                          end && 'dp-day--end',
                          inRange && 'dp-day--in-range',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-label={day.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        onClick={() => handleDayClick(day)}
                        onMouseEnter={() => picking && setHoverDate(day)}
                        onMouseLeave={() => picking && setHoverDate(null)}
                      >
                        {day.getDate()}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="drp-root">
      <button
        ref={triggerRef}
        type="button"
        className="btn dp-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dlgId : undefined}
        disabled={disabled}
        onClick={() => {
          if (open) {
            setOpen(false)
            setPicking(null)
          } else setOpen(true)
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="1" y="2" width="12" height="11" rx="1.5" />
          <path d="M1 6h12M4 1v2M10 1v2" />
        </svg>
        {formatRange() ?? placeholder}
      </button>
      {open && (
        <div
          id={dlgId}
          ref={dlgRef}
          role="dialog"
          aria-modal="true"
          aria-label="Select date range"
          className="drp-cal"
        >
          <div className="drp-months">
            {renderCalendar(leftGrid, viewMonth, viewYear)}
            {renderCalendar(rightGrid, rightMonth, rightYear)}
          </div>
          {picking && (
            <p className="drp-hint" aria-live="polite">
              Pick the end date
            </p>
          )}
        </div>
      )}
    </div>
  )
}
