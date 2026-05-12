export interface HistogramBin {
  x0: number
  x1: number
  count: number
}

export interface HistogramProps {
  bins: HistogramBin[]
  height?: number
  color?: string
  xUnit?: string
  ariaLabel?: string
}

const VW = 320
const PAD_L = 36
const PAD_R = 8
const PAD_T = 8
const PAD_B = 28

export function Histogram({
  bins,
  height = 160,
  color = '#006FFF',
  xUnit = '',
  ariaLabel = 'Histogram',
}: HistogramProps) {
  const PLOT_W = VW - PAD_L - PAD_R
  const PLOT_H = height - PAD_T - PAD_B
  const maxCount = Math.max(...bins.map((b) => b.count), 1)
  const barW = PLOT_W / bins.length

  const yTicks = [0, 1, 2, 3].map((i) => Math.round((maxCount * i) / 3))

  const xStep = bins.length <= 6 ? 1 : Math.ceil(bins.length / 5)
  const xLabels: { x: number; label: string }[] = []
  bins.forEach((bin, i) => {
    if (i % xStep === 0) {
      xLabels.push({ x: PAD_L + i * barW, label: String(bin.x0) + xUnit })
    }
  })
  xLabels.push({
    x: PAD_L + PLOT_W,
    label: String(bins[bins.length - 1].x1) + xUnit,
  })

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {yTicks.map((tick, i) => {
          const ty = PAD_T + PLOT_H - (tick / maxCount) * PLOT_H
          return (
            <g key={i}>
              <line
                x1={PAD_L}
                y1={ty}
                x2={PAD_L + PLOT_W}
                y2={ty}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={PAD_L - 4}
                y={ty + 4}
                fill="#6E7079"
                fontSize={9}
                textAnchor="end"
                fontFamily="inherit"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {bins.map((bin, i) => {
          const bh = (bin.count / maxCount) * PLOT_H
          return (
            <rect
              key={i}
              x={PAD_L + i * barW + 1}
              y={PAD_T + PLOT_H - bh}
              width={Math.max(barW - 2, 1)}
              height={bh}
              fill={color}
              opacity={0.85}
            />
          )
        })}

        <line
          x1={PAD_L}
          y1={PAD_T + PLOT_H}
          x2={PAD_L + PLOT_W}
          y2={PAD_T + PLOT_H}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />

        {xLabels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={PAD_T + PLOT_H + 14}
            fill="#6E7079"
            fontSize={9}
            textAnchor="middle"
            fontFamily="inherit"
          >
            {lbl.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
