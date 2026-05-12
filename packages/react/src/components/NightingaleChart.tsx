export interface NightingaleSegment {
  label: string
  value: number
  color?: string
}

export interface NightingaleChartProps {
  segments: NightingaleSegment[]
  color?: string
  ariaLabel?: string
}

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const MAX_R = 108
const MIN_R = 8

function wedgePath(cx: number, cy: number, r: number, sa: number, ea: number): string {
  const x1 = cx + r * Math.cos(sa)
  const y1 = cy + r * Math.sin(sa)
  const x2 = cx + r * Math.cos(ea)
  const y2 = cy + r * Math.sin(ea)
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
}

export function NightingaleChart({
  segments,
  color = '#006FFF',
  ariaLabel = 'Nightingale chart',
}: NightingaleChartProps) {
  if (!segments.length) return null
  const n = segments.length
  const maxVal = Math.max(...segments.map((s) => s.value), 1)
  const step = (2 * Math.PI) / n
  const BASE = -Math.PI / 2
  const LABEL_R = MAX_R + 16
  const labelEvery = n <= 8 ? 1 : Math.round(n / 8)

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <circle
            key={f}
            cx={CX}
            cy={CY}
            r={MIN_R + (MAX_R - MIN_R) * f}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {segments.map((seg, i) => {
          const sa = BASE + i * step
          const ea = BASE + (i + 1) * step
          const r = MIN_R + (seg.value / maxVal) * (MAX_R - MIN_R)
          const c = seg.color ?? color
          const mid = sa + step / 2
          const lx = CX + LABEL_R * Math.cos(mid)
          const ly = CY + LABEL_R * Math.sin(mid)
          return (
            <g key={i}>
              <path
                d={wedgePath(CX, CY, r, sa, ea)}
                fill={c}
                opacity={0.3 + 0.7 * (seg.value / maxVal)}
              />
              {i % labelEvery === 0 && (
                <text
                  x={lx.toFixed(1)}
                  y={ly.toFixed(1)}
                  fill="#6E7079"
                  fontSize={8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="inherit"
                >
                  {seg.label}
                </text>
              )}
            </g>
          )
        })}
        <circle
          cx={CX}
          cy={CY}
          r={MIN_R}
          fill="#13131A"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
      </svg>
    </div>
  )
}
