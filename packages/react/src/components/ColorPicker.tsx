import { useId, useState, useRef, useCallback } from 'react'

export interface ColorSwatchDef {
  value: string
  label: string
  color: string
}

export const COLOR_SWATCHES: ColorSwatchDef[] = [
  { value: 'blue', label: 'Blue', color: '#006FFF' },
  { value: 'green', label: 'Green', color: '#00B070' },
  { value: 'amber', label: 'Amber', color: '#F5A623' },
  { value: 'red', label: 'Red', color: '#F03A3A' },
  { value: 'purple', label: 'Purple', color: '#9B59B6' },
  { value: 'teal', label: 'Teal', color: '#1ABC9C' },
  { value: 'pink', label: 'Pink', color: '#E91E8C' },
  { value: 'orange', label: 'Orange', color: '#FF6B35' },
  { value: 'slate', label: 'Slate', color: '#6E7079' },
  { value: 'light', label: 'Light', color: '#E8E8EC' },
]

export interface ColorPickerProps {
  label?: string
  srOnlyLabel?: boolean
  value?: string
  defaultValue?: string
  swatches?: ColorSwatchDef[]
  onChange?: (value: string) => void
  disabled?: boolean
}

export function ColorPicker({
  label = 'Colour',
  srOnlyLabel = false,
  value,
  defaultValue,
  swatches = COLOR_SWATCHES,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  const groupId = useId()
  const [internal, setInternal] = useState(defaultValue ?? swatches[0]?.value ?? '')
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const gridRef = useRef<HTMLDivElement>(null)

  const set = useCallback(
    (v: string) => {
      if (!controlled) setInternal(v)
      onChange?.(v)
    },
    [controlled, onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cells = Array.from(
        gridRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [],
      )
      if (!cells.length) return
      const idx = cells.findIndex((c) => c.value === current)
      let next = idx
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % cells.length
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        next = (idx - 1 + cells.length) % cells.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = cells.length - 1
      else return
      e.preventDefault()
      cells[next].focus()
      set(cells[next].value)
    },
    [current, set],
  )

  const hasMatch = swatches.some((s) => s.value === current)

  return (
    <div className={`color-picker${disabled ? ' color-picker--disabled' : ''}`}>
      <div
        id={`${groupId}-label`}
        className={`color-picker__label${srOnlyLabel ? ' sr-only' : ''}`}
      >
        {label}
      </div>
      <div
        ref={gridRef}
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        className="color-picker__grid"
        onKeyDown={handleKeyDown}
      >
        {swatches.map((sw, i) => {
          const checked = sw.value === current
          const tabIdx = checked || (i === 0 && !hasMatch) ? 0 : -1
          return (
            <label key={sw.value} className="color-picker__swatch" title={sw.label}>
              <input
                type="radio"
                name={groupId}
                value={sw.value}
                checked={checked}
                onChange={() => set(sw.value)}
                disabled={disabled}
                className="sr-only"
                tabIndex={tabIdx}
                aria-label={sw.label}
              />
              <span
                className={`color-picker__circle${checked ? ' color-picker__circle--selected' : ''}`}
                style={{ background: sw.color }}
                aria-hidden="true"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}
