import { useMemo } from 'react'

export interface ScatterPoint {
  x: number
  y: number
  color?: string
  r?: number
  key?: string
}

export interface ScatterPlotProps {
  points: ScatterPoint[]
  xRange?: [number, number]
  yRange?: [number, number]
  height?: number
  ariaLabel?: string
}

const VW = 400
const PAD = { t: 12, r: 8, b: 12, l: 8 }
const DEFAULT_COLOR = '#006FFF'

export function ScatterPlot({
  points,
  xRange,
  yRange,
  height = 160,
  ariaLabel = 'Scatter plot',
}: ScatterPlotProps) {
  const { dots, gridLines } = useMemo(() => {
    if (!points.length) return { dots: [], gridLines: [] }
    const xs = points.map((p) => p.x)
    const ys = points.map((p) => p.y)
    const x0 = xRange?.[0] ?? Math.min(...xs)
    const x1 = xRange?.[1] ?? Math.max(...xs)
    const y0 = yRange?.[0] ?? Math.min(...ys)
    const y1 = yRange?.[1] ?? Math.max(...ys)
    const xSpan = x1 - x0 || 1
    const ySpan = y1 - y0 || 1
    const chartW = VW - PAD.l - PAD.r
    const chartH = height - PAD.t - PAD.b

    const toX = (x: number) => PAD.l + ((x - x0) / xSpan) * chartW
    const toY = (y: number) => PAD.t + chartH - ((y - y0) / ySpan) * chartH

    const gridLines = [0.25, 0.5, 0.75].map((f) => ({
      x: PAD.l + f * chartW,
      y: PAD.t + (1 - f) * chartH,
    }))

    const dots = points.map((p, i) => ({
      cx: toX(p.x).toFixed(1),
      cy: toY(p.y).toFixed(1),
      r: p.r ?? 5,
      color: p.color ?? DEFAULT_COLOR,
      key: p.key ?? String(i),
    }))

    return { dots, gridLines }
  }, [points, xRange, yRange, height])

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
        {dots.map((d) => (
          <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} fillOpacity={0.8} />
        ))}
      </svg>
    </div>
  )
}
