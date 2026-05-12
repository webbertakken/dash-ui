import type { CSSProperties } from 'react'

export interface HealthBarProps {
  value: number
  fillStyle?: CSSProperties
  label?: string
  valueText?: string
}

export function HealthBar({ value, fillStyle, label, valueText }: HealthBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className="hb"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-valuetext={valueText}
    >
      <div className="hb-fill" style={{ width: `${clamped}%`, ...fillStyle }} />
    </div>
  )
}
