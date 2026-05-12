export interface RidgelineSeries {
  label: string
  values: number[]
  color?: string
}

export interface RidgelinePlotProps {
  series: RidgelineSeries[]
  xRange?: [number, number]
  height?: number
  ariaLabel?: string
}

const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342']
const SQRT_TWO_PI = Math.sqrt(2 * Math.PI)
const NUM_PTS = 80

function bandwidth(vals: number[]): number {
  const n = vals.length
  const m = vals.reduce((a, b) => a + b, 0) / n
  const s = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / n)
  return Math.max(0.9 * s * Math.pow(n, -0.2), 0.5)
}

function kde(vals: number[], bw: number, pts: number[]): number[] {
  const n = vals.length
  const c = 1 / (n * bw * SQRT_TWO_PI)
  return pts.map(
    (x) =>
      c *
      vals.reduce((acc, v) => {
        const z = (x - v) / bw
        return acc + Math.exp(-0.5 * z * z)
      }, 0),
  )
}

export function RidgelinePlot({
  series,
  xRange,
  height = 180,
  ariaLabel = 'Ridgeline plot',
}: RidgelinePlotProps) {
  const VW = 380
  const VH = height
  const PAD_L = 56
  const PAD_R = 12
  const PAD_T = 16
  const PAD_B = 20

  const TRACK_W = VW - PAD_L - PAD_R
  const TRACK_H = VH - PAD_T - PAD_B
  const n = series.length
  const rowH = TRACK_H / n
  const maxDensH = rowH * 1.6

  const allVals = series.flatMap((s) => s.values)
  const [xMin, xMax] = xRange ?? [Math.min(...allVals), Math.max(...allVals)]

  const evalPts = Array.from(
    { length: NUM_PTS },
    (_, i) => xMin + (i / (NUM_PTS - 1)) * (xMax - xMin),
  )

  function xSvg(v: number) {
    return PAD_L + ((v - xMin) / (xMax - xMin)) * TRACK_W
  }

  const ridges = series.map((s, si) => {
    const bw = bandwidth(s.values)
    const dens = kde(s.values, bw, evalPts)
    const maxD = Math.max(...dens, 1e-9)
    const baselineY = PAD_T + (si + 1) * rowH
    const color = s.color ?? COLORS[si % COLORS.length]

    const d = [
      `M${xSvg(xMin).toFixed(1)},${baselineY.toFixed(1)}`,
      ...evalPts.map(
        (v, i) => `L${xSvg(v).toFixed(1)},${(baselineY - (dens[i] / maxD) * maxDensH).toFixed(1)}`,
      ),
      `L${xSvg(xMax).toFixed(1)},${baselineY.toFixed(1)}`,
      'Z',
    ].join(' ')

    return { d, baselineY, color, label: s.label }
  })

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = xMin + t * (xMax - xMin)
    return { v, x: xSvg(v) }
  })

  const reversedRidges = [...ridges].reverse()

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {xTicks.map(({ v, x }) => (
          <g key={v}>
            <line
              x1={x}
              y1={PAD_T}
              x2={x}
              y2={VH - PAD_B}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={VH - PAD_B + 12}
              fill="#6E7079"
              fontSize={8}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {v.toFixed(0)}
            </text>
          </g>
        ))}
        {reversedRidges.map((r) => (
          <g key={r.label}>
            <line
              x1={PAD_L}
              y1={r.baselineY}
              x2={VW - PAD_R}
              y2={r.baselineY}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={0.5}
            />
            <path d={r.d} fill={r.color} opacity={0.45} />
            <path d={r.d} fill="none" stroke={r.color} strokeWidth={1.2} opacity={0.9} />
          </g>
        ))}
        {ridges.map((r, si) => (
          <text
            key={si}
            x={PAD_L - 4}
            y={r.baselineY - 2}
            fill="#A4A7B5"
            fontSize={8}
            textAnchor="end"
            fontFamily="inherit"
          >
            {r.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
