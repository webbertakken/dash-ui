export interface ViolinSeries {
  label: string
  values: number[]
  color?: string
}

export interface ViolinPlotProps {
  series: ViolinSeries[]
  yRange?: [number, number]
  height?: number
  ariaLabel?: string
}

const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342']
const SQRT_TWO_PI = Math.sqrt(2 * Math.PI)
const NUM_PTS = 60

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
    (y) =>
      c *
      vals.reduce((acc, x) => {
        const z = (y - x) / bw
        return acc + Math.exp(-0.5 * z * z)
      }, 0),
  )
}

function median(vals: number[]): number {
  const s = [...vals].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

export function ViolinPlot({
  series,
  yRange,
  height = 160,
  ariaLabel = 'Violin plot',
}: ViolinPlotProps) {
  const VW = 380
  const VH = height
  const PAD_L = 28
  const PAD_R = 8
  const PAD_T = 8
  const PAD_B = 20

  const allVals = series.flatMap((s) => s.values)
  const [yMin, yMax] = yRange ?? [Math.min(...allVals), Math.max(...allVals)]

  const TRACK_W = VW - PAD_L - PAD_R
  const TRACK_H = VH - PAD_T - PAD_B
  const slotW = TRACK_W / series.length
  const maxHalfW = slotW * 0.38

  const evalPts = Array.from(
    { length: NUM_PTS },
    (_, i) => yMin + (i / (NUM_PTS - 1)) * (yMax - yMin),
  )

  function ySvg(v: number) {
    return PAD_T + ((yMax - v) / (yMax - yMin)) * TRACK_H
  }

  const violins = series.map((s, si) => {
    const bw = bandwidth(s.values)
    const dens = kde(s.values, bw, evalPts)
    const maxD = Math.max(...dens, 1e-9)
    const cx = PAD_L + si * slotW + slotW / 2

    const pts = evalPts.map((v, i) => ({ x: (dens[i] / maxD) * maxHalfW, y: ySvg(v) }))
    const right = pts.map((p) => `${(cx + p.x).toFixed(1)},${p.y.toFixed(1)}`)
    const left = [...pts].reverse().map((p) => `${(cx - p.x).toFixed(1)},${p.y.toFixed(1)}`)
    const d = `M${cx},${ySvg(yMin)} L${right.join(' L')} L${left.join(' L')} Z`

    const med = median(s.values)
    return {
      d,
      cx,
      medY: ySvg(med),
      maxHalfW,
      color: s.color ?? COLORS[si % COLORS.length],
      label: s.label,
    }
  })

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = yMin + t * (yMax - yMin)
    return { v, y: ySvg(v) }
  })

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {ticks.map(({ v, y }) => (
          <g key={v}>
            <line
              x1={PAD_L}
              y1={y}
              x2={VW - PAD_R}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 3}
              y={y + 3}
              fill="#6E7079"
              fontSize={8}
              textAnchor="end"
              fontFamily="inherit"
            >
              {v.toFixed(0)}
            </text>
          </g>
        ))}
        {violins.map((v, si) => (
          <g key={si}>
            <path d={v.d} fill={v.color} opacity={0.72} />
            <line
              x1={v.cx - v.maxHalfW * 0.45}
              y1={v.medY}
              x2={v.cx + v.maxHalfW * 0.45}
              y2={v.medY}
              stroke="#fff"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <text
              x={v.cx}
              y={VH - 5}
              fill="#6E7079"
              fontSize={8}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {v.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
