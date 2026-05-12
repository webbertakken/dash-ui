import { useMemo } from 'react'

export interface TimeSeriesAnnotation {
  index: number
  label: string
  color?: string
}

export interface AnnotatedTimeSeriesProps {
  data: number[]
  labels?: string[]
  annotations?: TimeSeriesAnnotation[]
  color?: string
  height?: number
  ariaLabel?: string
}

const VW = 400
const PAD = { t: 16, r: 8, b: 28, l: 32 }

export function AnnotatedTimeSeries({
  data,
  labels = [],
  annotations = [],
  color = '#006FFF',
  height = 160,
  ariaLabel = 'Annotated time series',
}: AnnotatedTimeSeriesProps) {
  const { linePath, areaPath, gridLines, xLabels, markers } = useMemo(() => {
    if (data.length < 2)
      return { linePath: '', areaPath: '', gridLines: [], xLabels: [], markers: [] }
    const n = data.length
    const chartW = VW - PAD.l - PAD.r
    const chartH = height - PAD.t - PAD.b
    const minV = Math.min(...data)
    const maxV = Math.max(...data) || 1
    const range = maxV - minV || 1
    const bot = PAD.t + chartH

    const toX = (i: number) => PAD.l + (i / (n - 1)) * chartW
    const toY = (v: number) => PAD.t + chartH - ((v - minV) / range) * chartH

    const pts = data.map((v, i) => [toX(i), toY(v)] as [number, number])
    const linePath = pts
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ')
    const areaPath = `${linePath} L${pts[n - 1][0].toFixed(1)},${bot} L${pts[0][0].toFixed(1)},${bot} Z`

    const gridLines = [0, 0.5, 1].map((f) => ({
      y: PAD.t + (1 - f) * chartH,
      label: String(Math.round(minV + f * range)),
    }))

    const stride = n <= 8 ? 1 : Math.ceil(n / 6)
    const xLabels = data
      .map((_, i) => ({ x: toX(i), text: labels[i] ?? String(i), i }))
      .filter(({ i }) => i % stride === 0 || i === n - 1)

    const markers = annotations.map((a) => ({
      x: toX(Math.max(0, Math.min(n - 1, a.index))),
      label: a.label,
      color: a.color ?? '#F5A623',
      chartH,
    }))

    return { linePath, areaPath, gridLines, xLabels, markers }
  }, [data, labels, annotations, height])

  if (data.length < 2) return null

  const n = data.length

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
              x1={PAD.l}
              y1={g.y}
              x2={VW - PAD.r}
              y2={g.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={PAD.l - 4}
              y={g.y + 3}
              fill="#6E7079"
              fontSize={8}
              textAnchor="end"
              fontFamily="inherit"
            >
              {g.label}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={color} fillOpacity={0.08} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {markers.map((m, i) => (
          <g key={i}>
            <line
              x1={m.x}
              y1={PAD.t}
              x2={m.x}
              y2={PAD.t + m.chartH}
              stroke={m.color}
              strokeWidth={1}
              strokeDasharray="3,2"
              opacity={0.85}
            />
            <text x={m.x + 2} y={PAD.t + 8} fill={m.color} fontSize={7} fontFamily="inherit">
              {m.label}
            </text>
          </g>
        ))}

        {xLabels.map((l) => (
          <text
            key={l.i}
            x={l.x.toFixed(1)}
            y={height - 6}
            fill="#6E7079"
            fontSize={8}
            textAnchor={l.i === 0 ? 'start' : l.i === n - 1 ? 'end' : 'middle'}
            fontFamily="inherit"
          >
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  )
}
