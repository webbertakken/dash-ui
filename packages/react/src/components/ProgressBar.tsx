export interface ProgressBarProps {
  value: number
  label?: string
  valueText?: string
  color?: string
}

export function ProgressBar({ value, label, valueText, color = '#006FFF' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const displayed = valueText ?? `${Math.round(clamped)}%`
  const hasHeader = label !== undefined || valueText !== undefined
  return (
    <div className="pb">
      {hasHeader && (
        <div className="pb-header">
          {label && <span className="pb-label">{label}</span>}
          <span className="pb-value">{displayed}</span>
        </div>
      )}
      <div
        className="pb-track"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        aria-valuetext={displayed}
      >
        <div className="pb-fill" style={{ width: `${clamped}%`, background: color }} />
      </div>
    </div>
  )
}
