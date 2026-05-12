export interface DumbbellItem {
  label: string
  start: number
  end: number
  color?: string
}

export interface DumbbellChartProps {
  items: DumbbellItem[]
  unit?: string
  color?: string
  ariaLabel?: string
}

const VW = 340
const LABEL_W = 110
const PAD_R = 8
const TRACK_W = VW - LABEL_W - PAD_R
const DOT_R = 5
const ROW_H = 26
const PAD_T = 6
const AXIS_H = 18
const TICKS = 4

export function DumbbellChart({
  items,
  unit = '',
  color = '#006FFF',
  ariaLabel = 'Dumbbell chart',
}: DumbbellChartProps) {
  const allValues = items.flatMap((it) => [it.start, it.end])
  const minVal = allValues.length ? Math.min(...allValues) : 0
  const maxVal = allValues.length ? Math.max(...allValues) : 1
  const range = maxVal - minVal || 1
  const svgH = PAD_T + items.length * ROW_H + AXIS_H

  const tx = (v: number) => LABEL_W + ((v - minVal) / range) * TRACK_W

  const ticks = Array.from({ length: TICKS + 1 }, (_, i) =>
    Math.round(minVal + (i / TICKS) * range),
  )

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={tx(t)}
              y1={PAD_T}
              x2={tx(t)}
              y2={PAD_T + items.length * ROW_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={tx(t)}
              y={PAD_T + items.length * ROW_H + 13}
              fill="#6E7079"
              fontSize={9}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {t}
              {unit}
            </text>
          </g>
        ))}

        {items.map((item, i) => {
          const cy = PAD_T + i * ROW_H + ROW_H / 2
          const cx1 = tx(item.start)
          const cx2 = tx(item.end)
          const c = item.color ?? color

          return (
            <g key={i}>
              <text
                x={LABEL_W - 6}
                y={cy + 4}
                fill="#A4A7B5"
                fontSize={10}
                textAnchor="end"
                fontFamily="inherit"
              >
                {item.label}
              </text>
              <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke={c} strokeWidth={2} opacity={0.4} />
              <circle cx={cx1} cy={cy} r={DOT_R} fill="#13131A" stroke={c} strokeWidth={1.5} />
              <circle cx={cx2} cy={cy} r={DOT_R} fill={c} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
