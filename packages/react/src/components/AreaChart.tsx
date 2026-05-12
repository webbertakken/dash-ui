import { useMemo } from 'react'

export interface AreaChartSeries {
  label: string
  color: string
  values: number[]
}

export interface AreaChartProps {
  series: AreaChartSeries[]
  labels?: string[]
  height?: number
  ariaLabel?: string
}

const VW = 400
const PAD = { t: 12, r: 8, b: 28, l: 8 }

export function AreaChart({
  series,
  labels = [],
  height = 160,
  ariaLabel = 'Area chart',
}: AreaChartProps) {
  const { areas, gridLines, chartW } = useMemo(() => {
    const n = series[0]?.values.length ?? 0
    if (!n) return { areas: [], gridLines: [], chartW: VW - PAD.l - PAD.r }

    const totals = Array.from({ length: n }, (_, i) =>
      series.reduce((acc, s) => acc + (s.values[i] ?? 0), 0),
    )
    const maxV = Math.max(...totals, 1)
    const chartW = VW - PAD.l - PAD.r
    const chartH = height - PAD.t - PAD.b

    const toX = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2)
    const toY = (v: number) => PAD.t + chartH - (v / maxV) * chartH

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH)

    const areas = series.map((s, j) => {
      const bottoms = Array.from({ length: n }, (_, i) =>
        series.slice(0, j).reduce((acc, sr) => acc + (sr.values[i] ?? 0), 0),
      )
      const tops = bottoms.map((b, i) => b + (s.values[i] ?? 0))

      const topPts = tops.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
      const botPts = bottoms.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).reverse()

      return {
        color: s.color,
        label: s.label,
        d: `M ${topPts.join(' L ')} L ${botPts.join(' L ')} Z`,
      }
    })

    return { areas, gridLines, chartW }
  }, [series, height])

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {gridLines.map((y, i) => (
          <line
            key={i}
            x1={PAD.l}
            y1={y}
            x2={VW - PAD.r}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {areas.map((s) => (
          <path key={s.label} d={s.d} fill={s.color} fillOpacity={0.75} />
        ))}
        {labels.map((lbl, i) => {
          const x = PAD.l + (labels.length > 1 ? (i / (labels.length - 1)) * chartW : chartW / 2)
          return (
            <text
              key={i}
              x={x}
              y={height - 4}
              textAnchor="middle"
              fill="#6E7079"
              fontSize={9}
              fontFamily="inherit"
            >
              {lbl}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
