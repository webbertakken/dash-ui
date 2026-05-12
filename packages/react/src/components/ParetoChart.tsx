import { useMemo } from 'react'

export interface ParetoItem {
  label: string
  value: number
  color?: string
}

export interface ParetoChartProps {
  items: ParetoItem[]
  height?: number
  ariaLabel?: string
  barColor?: string
  lineColor?: string
  threshold?: number
}

const VW = 400
const PAD = { t: 12, r: 40, b: 28, l: 8 }
const DEF_BAR = '#006FFF'
const DEF_LINE = '#F5A623'

export function ParetoChart({
  items,
  height = 160,
  ariaLabel = 'Pareto chart',
  barColor = DEF_BAR,
  lineColor = DEF_LINE,
  threshold = 0.8,
}: ParetoChartProps) {
  const { bars, linePoints, thresholdY, pctLabels, gridLines } = useMemo(() => {
    if (!items.length)
      return { bars: [], linePoints: '', thresholdY: null, pctLabels: [], gridLines: [] }

    const sorted = [...items].sort((a, b) => b.value - a.value)
    const total = sorted.reduce((s, it) => s + it.value, 0) || 1
    const chartW = VW - PAD.l - PAD.r
    const chartH = height - PAD.t - PAD.b
    const bot = PAD.t + chartH
    const maxV = sorted[0].value
    const barW = chartW / sorted.length
    const gap = barW * 0.15
    const bw = Math.max(barW - gap * 2, 1)

    const gridLines = [0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH)

    const bars = sorted.map((item, i) => {
      const bh = (item.value / maxV) * chartH
      const x = PAD.l + i * barW + gap
      return {
        x: x.toFixed(1),
        y: (bot - bh).toFixed(1),
        w: bw.toFixed(1),
        h: bh.toFixed(1),
        label: item.label,
        color: item.color ?? barColor,
        key: `b${i}`,
      }
    })

    let cumSum = 0
    const pts: string[] = [`${PAD.l},${bot}`]
    sorted.forEach((item, i) => {
      cumSum += item.value
      const pct = cumSum / total
      const x = PAD.l + (i + 1) * barW
      const y = PAD.t + (1 - pct) * chartH
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
    })
    const linePoints = pts.join(' ')

    const thresholdY = threshold > 0 ? (PAD.t + (1 - threshold) * chartH).toFixed(1) : null

    const pctLabels = [0, 50, 100].map((pct) => ({
      label: `${pct}%`,
      y: (PAD.t + (1 - pct / 100) * chartH + 3).toFixed(1),
    }))

    return { bars, linePoints, thresholdY, pctLabels, gridLines }
  }, [items, height, barColor, threshold])

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
        {bars.map((b) => (
          <rect
            key={b.key}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={b.color}
            fillOpacity={0.85}
            rx={2}
          />
        ))}
        {thresholdY && (
          <line
            x1={PAD.l}
            y1={thresholdY}
            x2={VW - PAD.r}
            y2={thresholdY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}
        <polyline
          points={linePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {pctLabels.map((pl) => (
          <text
            key={pl.label}
            x={VW - PAD.r + 4}
            y={pl.y}
            fill="#6E7079"
            fontSize={8}
            fontFamily="inherit"
          >
            {pl.label}
          </text>
        ))}
        {bars.map((b, i) => (
          <text
            key={`l${i}`}
            x={(parseFloat(b.x) + parseFloat(b.w) / 2).toFixed(1)}
            y={height - 4}
            textAnchor="middle"
            fill="#6E7079"
            fontSize={9}
            fontFamily="inherit"
          >
            {b.label.length > 8 ? `${b.label.slice(0, 7)}…` : b.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
