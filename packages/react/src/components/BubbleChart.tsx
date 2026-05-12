import { useMemo } from 'react'

export interface BubblePoint {
  x: number
  y: number
  size: number
  color?: string
  label?: string
  key?: string
}

export interface BubbleChartProps {
  points: BubblePoint[]
  xRange?: [number, number]
  yRange?: [number, number]
  rRange?: [number, number]
  height?: number
  ariaLabel?: string
}

const VW = 400
const PAD = { t: 12, r: 12, b: 12, l: 12 }
const DEFAULT_COLOR = '#006FFF'

export function BubbleChart({
  points,
  xRange,
  yRange,
  rRange = [4, 20],
  height = 160,
  ariaLabel = 'Bubble chart',
}: BubbleChartProps) {
  const { bubbles, gridLines } = useMemo(() => {
    if (!points.length) return { bubbles: [], gridLines: [] }
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const sizes = points.map((p) => p.size)
    const x0 = xRange?.[0] ?? Math.min(...xs)
    const x1 = xRange?.[1] ?? Math.max(...xs)
    const y0 = yRange?.[0] ?? Math.min(...ys)
    const y1 = yRange?.[1] ?? Math.max(...ys)
    const s0 = Math.min(...sizes)
    const s1 = Math.max(...sizes)
    const xSpan = x1 - x0 || 1
    const ySpan = y1 - y0 || 1
    const sSpan = s1 - s0 || 1
    const [rMin, rMax] = rRange
    const chartW = VW - PAD.l - PAD.r
    const chartH = height - PAD.t - PAD.b

    const toX = (x: number) => PAD.l + ((x - x0) / xSpan) * chartW
    const toY = (y: number) => PAD.t + chartH - ((y - y0) / ySpan) * chartH
    const toR = (s: number) => rMin + ((s - s0) / sSpan) * (rMax - rMin)

    const gridLines = [0.25, 0.5, 0.75].map((f) => ({
      x: PAD.l + f * chartW,
      y: PAD.t + (1 - f) * chartH,
    }))

    const bubbles = points.map((p, i) => ({
      cx: toX(p.x).toFixed(1),
      cy: toY(p.y).toFixed(1),
      r: toR(p.size).toFixed(1),
      color: p.color ?? DEFAULT_COLOR,
      key: p.key ?? String(i),
    }))

    return { bubbles, gridLines }
  }, [points, xRange, yRange, rRange, height])

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={g.x}
              y1={PAD.t}
              x2={g.x}
              y2={PAD.t + (height - PAD.t - PAD.b)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <line
              x1={PAD.l}
              y1={g.y}
              x2={VW - PAD.r}
              y2={g.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          </g>
        ))}
        {bubbles.map((b) => (
          <circle
            key={b.key}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.color}
            fillOpacity={0.6}
            stroke={b.color}
            strokeOpacity={0.9}
            strokeWidth={1.5}
          />
        ))}
      </svg>
    </div>
  )
}
