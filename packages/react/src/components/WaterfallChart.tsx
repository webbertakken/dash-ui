import { useMemo } from 'react'

export interface WaterfallBar {
  label: string
  value: number
  type?: 'start' | 'delta' | 'total'
}

export interface WaterfallChartProps {
  bars: WaterfallBar[]
  height?: number
  ariaLabel?: string
}

const VW = 320
const PAD = { t: 12, r: 8, b: 24, l: 8 }
const COLOR_START = '#006FFF'
const COLOR_POS = '#00C875'
const COLOR_NEG = '#F04949'
const COLOR_TOTAL = '#A78BFA'

export function WaterfallChart({
  bars,
  height = 160,
  ariaLabel = 'Waterfall chart',
}: WaterfallChartProps) {
  const { rects, connectors, labels } = useMemo(() => {
    if (!bars.length) return { rects: [], connectors: [], labels: [] }
    const chartH = height - PAD.t - PAD.b
    const chartW = VW - PAD.l - PAD.r
    const n = bars.length
    const colW = chartW / n
    const gap = colW * 0.15
    const barW = colW - gap * 2

    // compute cumulative bases
    const cumBases: number[] = []
    let acc = 0
    for (const b of bars) {
      if (b.type === 'start' || b.type === 'total') {
        cumBases.push(0)
        if (b.type === 'start') acc = b.value
        else acc = b.value
      } else {
        cumBases.push(acc)
        acc += b.value
      }
    }

    // y domain: include 0 and all tops/bases
    const tops = bars.map((b, i) => {
      if (b.type === 'start' || b.type === 'total') return b.value
      return cumBases[i] + b.value
    })
    const allVals = [0, ...cumBases, ...tops]
    const minV = Math.min(...allVals)
    const maxV = Math.max(...allVals)
    const range = maxV - minV || 1

    const toY = (v: number) => PAD.t + (1 - (v - minV) / range) * chartH
    const bot = PAD.t + chartH

    const rects = bars.map((b, i) => {
      const base = cumBases[i]
      const top = b.type === 'start' || b.type === 'total' ? b.value : base + b.value
      const y0 = toY(Math.max(base, top))
      const y1 = toY(Math.min(base, top))
      const x = PAD.l + i * colW + gap
      const color =
        b.type === 'start'
          ? COLOR_START
          : b.type === 'total'
            ? COLOR_TOTAL
            : b.value >= 0
              ? COLOR_POS
              : COLOR_NEG
      return {
        x: x.toFixed(1),
        y: y0.toFixed(1),
        w: barW.toFixed(1),
        h: Math.max(y1 - y0, 1).toFixed(1),
        color,
        topV: top,
        baseV: base,
      }
    })

    // connector: horizontal line from top of bar i to x of bar i+1
    const connectors = rects.slice(0, -1).map((r, i) => {
      const nextX = PAD.l + (i + 1) * colW + gap
      const nextEndX = nextX + barW
      const topY = parseFloat(r.y)
      return { x1: parseFloat(r.x), x2: nextEndX + barW + gap, y: topY }
    })

    const labels = bars.map((b, i) => ({
      x: (PAD.l + (i + 0.5) * colW).toFixed(1),
      y: (bot + 10).toFixed(1),
      label: b.label,
    }))

    return { rects, connectors, labels }
  }, [bars, height])

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {[0.25, 0.5, 0.75, 1].map((f, i) => (
          <line
            key={i}
            x1={PAD.l}
            y1={(PAD.t + (1 - f) * (height - PAD.t - PAD.b)).toFixed(1)}
            x2={VW - PAD.r}
            y2={(PAD.t + (1 - f) * (height - PAD.t - PAD.b)).toFixed(1)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {connectors.map((c, i) => (
          <line
            key={i}
            x1={c.x1}
            y1={c.y}
            x2={c.x2}
            y2={c.y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        ))}
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            fill={r.color}
            fillOpacity={0.85}
            rx={2}
          />
        ))}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            fill="#6E7079"
            fontSize={9}
            fontFamily="inherit"
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
