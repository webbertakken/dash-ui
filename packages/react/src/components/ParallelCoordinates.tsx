const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342']

export interface ParallelAxis {
  label: string
  min: number
  max: number
  unit?: string
  invert?: boolean
}

export interface ParallelSeries {
  label: string
  color?: string
  values: number[]
}

export interface ParallelCoordinatesProps {
  axes: ParallelAxis[]
  series: ParallelSeries[]
  height?: number
  ariaLabel?: string
}

export function ParallelCoordinates({
  axes,
  series,
  height = 200,
  ariaLabel = 'Parallel coordinates chart',
}: ParallelCoordinatesProps) {
  const VW = 380
  const VH = height
  const PAD_L = 28
  const PAD_R = 28
  const PAD_T = 32
  const PAD_B = 20

  const TRACK_W = VW - PAD_L - PAD_R
  const TRACK_H = VH - PAD_T - PAD_B
  const nAxes = axes.length

  function axisX(i: number): number {
    return PAD_L + (nAxes > 1 ? i * (TRACK_W / (nAxes - 1)) : TRACK_W / 2)
  }

  function valueY(axis: ParallelAxis, v: number): number {
    const t = Math.max(0, Math.min(1, (v - axis.min) / (axis.max - axis.min)))
    return axis.invert ? PAD_T + t * TRACK_H : PAD_T + (1 - t) * TRACK_H
  }

  function seriesPath(s: ParallelSeries): string {
    return axes
      .map((axis, i) => {
        const x = axisX(i).toFixed(1)
        const y = valueY(axis, s.values[i] ?? axis.min).toFixed(1)
        return i === 0 ? `M${x},${y}` : `L${x},${y}`
      })
      .join(' ')
  }

  const TICKS = [0, 0.5, 1]

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {axes.map((axis, i) => {
          const x = axisX(i)
          return (
            <g key={i}>
              <line
                x1={x}
                y1={PAD_T}
                x2={x}
                y2={VH - PAD_B}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
              <text
                x={x}
                y={PAD_T - 8}
                fill="#A4A7B5"
                fontSize={8}
                textAnchor="middle"
                fontFamily="inherit"
              >
                {axis.label}
              </text>
              {axis.unit && (
                <text
                  x={x}
                  y={PAD_T - 1}
                  fill="#6E7079"
                  fontSize={7}
                  textAnchor="middle"
                  fontFamily="inherit"
                >
                  {axis.unit}
                </text>
              )}
              {TICKS.map((t) => {
                const v = axis.invert
                  ? axis.min + t * (axis.max - axis.min)
                  : axis.max - t * (axis.max - axis.min)
                const y = PAD_T + t * TRACK_H
                return (
                  <g key={t}>
                    <line
                      x1={x - 3}
                      y1={y}
                      x2={x + 3}
                      y2={y}
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth={1}
                    />
                    <text
                      x={x - 5}
                      y={y + 3}
                      fill="#6E7079"
                      fontSize={7}
                      textAnchor="end"
                      fontFamily="inherit"
                    >
                      {v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}
                    </text>
                  </g>
                )
              })}
            </g>
          )
        })}

        {series.map((s, si) => (
          <path
            key={si}
            d={seriesPath(s)}
            fill="none"
            stroke={s.color ?? COLORS[si % COLORS.length]}
            strokeWidth={1.5}
            opacity={0.75}
          />
        ))}
      </svg>
    </div>
  )
}
