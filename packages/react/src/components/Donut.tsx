export interface DonutSegment {
  label: string
  value: number
  color: string
}

export interface DonutProps {
  size?: number
  segments: DonutSegment[]
  centerValue: string | number
  centerLabel: string
  trackColor?: string
  ariaLabel?: string
}

export function Donut({
  size = 96,
  segments,
  centerValue,
  centerLabel,
  trackColor = 'rgba(255,255,255,0.06)',
  ariaLabel,
}: DonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - 20) / 2
  const c = 2 * Math.PI * r
  let cumulative = 0
  const segDesc = segments
    .map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`)
    .join(', ')
  const label = ariaLabel ?? `${centerValue} ${centerLabel}${segDesc ? `: ${segDesc}` : ''}`
  return (
    <div
      role="img"
      aria-label={label}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={10}
        />
        {segments.map((seg) => {
          const frac = seg.value / total
          const dash = c
          const offset = c * (1 - cumulative - frac)
          const rotate = cumulative * 360
          cumulative += frac
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={10}
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
            />
          )
        })}
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {centerValue}
        </div>
        <div style={{ fontSize: 10, color: '#6E7079' }}>{centerLabel}</div>
      </div>
    </div>
  )
}
