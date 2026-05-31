import { useState, useRef, useCallback, useEffect, useId } from 'react'

const ColumnsIcon = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" aria-hidden="true" focusable={false}>
    <rect x="1" y="2" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="5.5" y="2" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="10" y="2" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

export interface ColumnDef {
  key: string
  label: string
  required?: boolean
}

export interface ColumnToggleProps {
  columns: ColumnDef[]
  visible: Set<string>
  onChange: (visible: Set<string>) => void
}

export function ColumnToggle({ columns, visible, onChange }: ColumnToggleProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const close = useCallback(() => {
    setOpen(false)
    btnRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    function onDown(e: MouseEvent) {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      )
        close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open, close])

  function toggle(key: string) {
    const next = new Set(visible)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange(next)
  }

  return (
    <div className="col-toggle">
      <button
        ref={btnRef}
        type="button"
        className={`col-toggle__btn${open ? ' col-toggle__btn--active' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <ColumnsIcon />
        <span>Columns</span>
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="col-toggle__panel"
          role="dialog"
          aria-label="Toggle columns"
        >
          <div className="col-toggle__header">Columns</div>
          <ul className="col-toggle__list">
            {columns.map((col) => (
              <li key={col.key} className="col-toggle__item">
                <label className="col-toggle__label">
                  <input
                    type="checkbox"
                    aria-label={col.label}
                    className="col-toggle__check"
                    checked={visible.has(col.key)}
                    disabled={col.required}
                    onChange={() => {
                      if (!col.required) toggle(col.key)
                    }}
                  />
                  <span>{col.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
