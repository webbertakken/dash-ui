export interface HorizonSeries {
  label: string
  values: number[]
  color?: string
}

export interface HorizonChartProps {
  series: HorizonSeries[]
  xLabels?: string[]
  bands?: number
  ariaLabel?: string
}

const LABEL_W = 72
const ROW_H = 24
const ROW_GAP = 3
const X_H = 14
const W = 400

export function HorizonChart({
  series,
  xLabels,
  bands = 3,
  ariaLabel = 'Horizon chart',
}: HorizonChartProps) {
  if (!series.length) return null
  const n = series[0].values.length
  const allVals = series.flatMap((s) => s.values)
  const maxVal = Math.max(...allVals, 1)
  const step = maxVal / bands
  const chartW = W - LABEL_W
  const colW = chartW / Math.max(n, 1)
  const totalH = series.length * (ROW_H + ROW_GAP) - ROW_GAP + (xLabels ? X_H + 4 : 0)

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${totalH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {series.map((s, si) => {
          const rowY = si * (ROW_H + ROW_GAP)
          const color = s.color ?? '#006FFF'
          return (
            <g key={si}>
              <text
                x={LABEL_W - 6}
                y={rowY + ROW_H / 2 + 4}
                textAnchor="end"
                fill="#C8C9D0"
                fontSize={9}
                fontFamily="inherit"
              >
                {s.label}
              </text>
              <rect
                x={LABEL_W}
                y={rowY}
                width={chartW}
                height={ROW_H}
                fill="rgba(255,255,255,0.04)"
                rx={2}
              />
              {s.values.flatMap((v, ti) =>
                Array.from({ length: bands }, (_, k) => {
                  const lo = k * step
                  const fill = Math.min(Math.max(v - lo, 0), step) / step
                  if (fill <= 0) return null
                  const alpha = 0.25 + 0.3 * k
                  const rH = fill * ROW_H
                  return (
                    <rect
                      key={`${ti}-${k}`}
                      x={LABEL_W + ti * colW}
                      y={rowY + ROW_H - rH}
                      width={Math.max(colW - 0.5, 0.5)}
                      height={rH}
                      fill={color}
                      opacity={alpha}
                      rx={1}
                    />
                  )
                }),
              )}
            </g>
          )
        })}
        {xLabels &&
          xLabels.map((label, i) => {
            const x = LABEL_W + (i / Math.max(xLabels.length - 1, 1)) * chartW
            return (
              <text
                key={i}
                x={x}
                y={totalH}
                textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
                fill="#6E7079"
                fontSize={8}
                fontFamily="inherit"
              >
                {label}
              </text>
            )
          })}
      </svg>
    </div>
  )
}
