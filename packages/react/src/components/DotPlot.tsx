export interface DotPlotItem {
  label: string
  value: number
  compare?: number
  color?: string
}

export interface DotPlotProps {
  items: DotPlotItem[]
  min?: number
  max?: number
  unit?: string
  valueLegend?: string
  compareLegend?: string
  ariaLabel?: string
}

const VW = 380
const LABEL_W = 132
const VALUE_W = 32
const PAD_R = 6
const TRACK_W = VW - LABEL_W - VALUE_W - PAD_R
const DOT_R = 5
const ROW_H = 28
const PAD_T = 8
const AXIS_H = 18
const LEG_H = 18
const TICKS = 5

export function DotPlot({
  items,
  min = 0,
  max,
  unit = '',
  valueLegend,
  compareLegend,
  ariaLabel = 'Dot plot',
}: DotPlotProps) {
  const hasCompare = items.some((it) => it.compare !== undefined)
  const maxVal = max ?? Math.max(...items.map((it) => Math.max(it.value, it.compare ?? 0)))
  const range = Math.max(maxVal - min, 1)
  const svgH =
    PAD_T +
    items.length * ROW_H +
    AXIS_H +
    (hasCompare && (valueLegend || compareLegend) ? LEG_H + 4 : 0)

  const tx = (v: number) => LABEL_W + ((v - min) / range) * TRACK_W

  const ticks = Array.from({ length: TICKS }, (_, i) => min + (i / (TICKS - 1)) * range)

  const legY = PAD_T + items.length * ROW_H + AXIS_H + 4

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
              {Number.isInteger(t) ? t : t.toFixed(1)}
              {unit}
            </text>
          </g>
        ))}

        {items.map((item, i) => {
          const cy = PAD_T + i * ROW_H + ROW_H / 2
          const cx = tx(item.value)
          const ccx = item.compare !== undefined ? tx(item.compare) : null
          const color = item.color ?? '#006FFF'

          return (
            <g key={i}>
              <text
                x={LABEL_W - 8}
                y={cy + 4}
                fill="#A4A7B5"
                fontSize={10}
                textAnchor="end"
                fontFamily="inherit"
              >
                {item.label}
              </text>

              <line
                x1={LABEL_W}
                y1={cy}
                x2={LABEL_W + TRACK_W}
                y2={cy}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />

              {ccx !== null && (
                <line
                  x1={Math.min(cx, ccx)}
                  y1={cy}
                  x2={Math.max(cx, ccx)}
                  y2={cy}
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={0.35}
                />
              )}

              {ccx !== null && (
                <circle
                  cx={ccx}
                  cy={cy}
                  r={DOT_R - 1}
                  fill="none"
                  stroke="#A4A7B5"
                  strokeWidth={1.5}
                />
              )}

              <circle cx={cx} cy={cy} r={DOT_R} fill={color} />

              <text
                x={LABEL_W + TRACK_W + 6}
                y={cy + 4}
                fill="#A4A7B5"
                fontSize={9}
                fontFamily="inherit"
              >
                {item.value}
                {unit}
              </text>
            </g>
          )
        })}

        {hasCompare && (valueLegend || compareLegend) && (
          <g>
            {valueLegend && (
              <>
                <circle cx={LABEL_W} cy={legY + 5} r={4} fill="#006FFF" />
                <text
                  x={LABEL_W + 10}
                  y={legY + 9}
                  fill="#A4A7B5"
                  fontSize={9}
                  fontFamily="inherit"
                >
                  {valueLegend}
                </text>
              </>
            )}
            {compareLegend && (
              <>
                <circle
                  cx={LABEL_W + (valueLegend ? 80 : 0)}
                  cy={legY + 5}
                  r={3}
                  fill="none"
                  stroke="#A4A7B5"
                  strokeWidth={1.5}
                />
                <text
                  x={LABEL_W + (valueLegend ? 90 : 10)}
                  y={legY + 9}
                  fill="#A4A7B5"
                  fontSize={9}
                  fontFamily="inherit"
                >
                  {compareLegend}
                </text>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  )
}
