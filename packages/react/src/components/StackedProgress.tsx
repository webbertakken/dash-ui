export interface StackedProgressSegment {
  label: string
  value: number
  color: string
}

export interface StackedProgressProps {
  segments: StackedProgressSegment[]
  total?: number
  ariaLabel?: string
  showLegend?: boolean
}

export function StackedProgress({
  segments,
  total,
  ariaLabel,
  showLegend = true,
}: StackedProgressProps) {
  const sum = total ?? segments.reduce((acc, s) => acc + s.value, 0)
  const text =
    ariaLabel ?? segments.map((s) => `${s.label} ${Math.round((s.value / sum) * 100)}%`).join(', ')
  return (
    <div className="sp" role="img" aria-label={text}>
      <div className="sp-bar" aria-hidden="true">
        {segments.map(({ label, value, color }) => (
          <div
            key={label}
            className="sp-seg"
            style={{ width: `${(value / sum) * 100}%`, background: color }}
          />
        ))}
      </div>
      {showLegend && (
        <div className="sp-legend" aria-hidden="true">
          {segments.map(({ label, value, color }) => (
            <span key={label} className="sp-item">
              <span className="sp-dot" style={{ background: color }} />
              {label}
              <span className="sp-pct">{Math.round((value / sum) * 100)}%</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
