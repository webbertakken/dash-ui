import { useState, useId } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'

export interface RangeSliderProps {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultLow?: number
  defaultHigh?: number
  low?: number
  high?: number
  suffix?: string
  disabled?: boolean
  onChange?: (range: [number, number]) => void
  className?: string
}

export function RangeSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultLow,
  defaultHigh,
  low: lowProp,
  high: highProp,
  suffix,
  disabled = false,
  onChange,
  className = '',
}: RangeSliderProps) {
  const uid = useId()
  const labelId = `${uid}-label`
  const [internalLow, setInternalLow] = useState(defaultLow ?? min)
  const [internalHigh, setInternalHigh] = useState(defaultHigh ?? max)
  const low = lowProp !== undefined ? lowProp : internalLow
  const high = highProp !== undefined ? highProp : internalHigh

  function toPercent(v: number) {
    return max === min ? 0 : ((v - min) / (max - min)) * 100
  }

  const lowPct = toPercent(low)
  const highPct = toPercent(high)
  const lowOnTop = low >= max - step

  const fillStyle: CSSProperties = {
    '--rs-low': `${lowPct}%`,
    '--rs-high': `${highPct}%`,
  } as CSSProperties

  function handleLowChange(e: ChangeEvent<HTMLInputElement>) {
    const next = Math.min(Number(e.target.value), high - step)
    if (lowProp === undefined) setInternalLow(next)
    onChange?.([next, high])
  }

  function handleHighChange(e: ChangeEvent<HTMLInputElement>) {
    const next = Math.max(Number(e.target.value), low + step)
    if (highProp === undefined) setInternalHigh(next)
    onChange?.([low, next])
  }

  return (
    <div className={`range-slider ${className}`.trim()}>
      {label && (
        <div className="range-slider__header">
          <span className="range-slider__label" id={labelId}>
            {label}
          </span>
          <span className="range-slider__value" aria-live="polite">
            {low}
            {suffix} &ndash; {high}
            {suffix}
          </span>
        </div>
      )}
      <div
        className="range-slider__wrap"
        style={fillStyle}
        role="group"
        aria-labelledby={label ? labelId : undefined}
      >
        <div className="range-slider__track-bg" />
        <div className="range-slider__fill" />
        <input
          type="range"
          className="range-slider__input"
          min={min}
          max={max}
          step={step}
          value={low}
          disabled={disabled}
          style={{ zIndex: lowOnTop ? 2 : 1 }}
          aria-label={label ? `${label} minimum` : 'Minimum'}
          aria-valuetext={suffix ? `${low}${suffix}` : String(low)}
          onChange={handleLowChange}
        />
        <input
          type="range"
          className="range-slider__input"
          min={min}
          max={max}
          step={step}
          value={high}
          disabled={disabled}
          style={{ zIndex: lowOnTop ? 1 : 2 }}
          aria-label={label ? `${label} maximum` : 'Maximum'}
          aria-valuetext={suffix ? `${high}${suffix}` : String(high)}
          onChange={handleHighChange}
        />
      </div>
    </div>
  )
}
