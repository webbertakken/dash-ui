export interface BumpSeries {
  label: string
  ranks: number[] // 1 = top rank at each time point
  color?: string
}

export interface BumpChartProps {
  labels: string[]
  series: BumpSeries[]
  ariaLabel?: string
}

const VW = 380
const PAD_L = 12
const PAD_R = 76
const PAD_T = 8
const PAD_B = 20
const ROW_H = 28
const DOT_R = 5
const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#7FB6FF', '#A878F5', '#F56342']

export function BumpChart({ labels, series, ariaLabel = 'Bump chart' }: BumpChartProps) {
  const maxRank = Math.max(...series.flatMap((s) => s.ranks), 1)
  const TRACK_W = VW - PAD_L - PAD_R
  const svgH = PAD_T + maxRank * ROW_H + PAD_B

  const xOf = (i: number) =>
    labels.length > 1 ? PAD_L + (i / (labels.length - 1)) * TRACK_W : PAD_L + TRACK_W / 2

  const yOf = (rank: number) => PAD_T + (rank - 1) * ROW_H + ROW_H / 2

  function buildPath(ranks: number[]): string {
    return ranks
      .map((rank, i) => {
        const x = xOf(i)
        const y = yOf(rank)
        if (i === 0) return `M${x},${y}`
        const prevX = xOf(i - 1)
        const prevY = yOf(ranks[i - 1])
        const cpX = (prevX + x) / 2
        return `C${cpX},${prevY} ${cpX},${y} ${x},${y}`
      })
      .join(' ')
  }

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {labels.map((label, i) => (
          <g key={i}>
            <line
              x1={xOf(i)}
              y1={PAD_T}
              x2={xOf(i)}
              y2={PAD_T + maxRank * ROW_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={xOf(i)}
              y={svgH - 5}
              fill="#6E7079"
              fontSize={9}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {label}
            </text>
          </g>
        ))}

        {Array.from({ length: maxRank }, (_, i) => (
          <line
            key={i}
            x1={PAD_L}
            y1={yOf(i + 1)}
            x2={PAD_L + TRACK_W}
            y2={yOf(i + 1)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}

        {series.map((s, si) => {
          const color = s.color ?? COLORS[si % COLORS.length]
          const lastRank = s.ranks[s.ranks.length - 1]
          return (
            <g key={si}>
              <path
                d={buildPath(s.ranks)}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                opacity={0.85}
              />
              {s.ranks.map((rank, i) => (
                <circle
                  key={i}
                  cx={xOf(i)}
                  cy={yOf(rank)}
                  r={DOT_R}
                  fill={color}
                  stroke="#1A1F2E"
                  strokeWidth={1.5}
                />
              ))}
              <text
                x={xOf(labels.length - 1) + DOT_R + 6}
                y={yOf(lastRank) + 4}
                fill={color}
                fontSize={10}
                fontFamily="inherit"
              >
                {s.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
