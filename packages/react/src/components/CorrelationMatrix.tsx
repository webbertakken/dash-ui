export interface CorrelationMatrixProps {
  labels: string[]
  data: number[][]
  cellSize?: number
  ariaLabel?: string
}

const LABEL_W = 68
const LABEL_H = 26
const DARK = [26, 29, 43] as const
const BLUE = [0, 111, 255] as const
const RED = [255, 59, 48] as const

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function cellColor(v: number): string {
  const t = Math.max(0, Math.min(1, Math.abs(v)))
  const [r0, g0, b0] = DARK
  if (v >= 0) {
    const [r1, g1, b1] = BLUE
    return `rgb(${lerp(r0, r1, t)},${lerp(g0, g1, t)},${lerp(b0, b1, t)})`
  }
  const [r1, g1, b1] = RED
  return `rgb(${lerp(r0, r1, t)},${lerp(g0, g1, t)},${lerp(b0, b1, t)})`
}

export function CorrelationMatrix({
  labels,
  data,
  cellSize = 52,
  ariaLabel = 'Correlation matrix',
}: CorrelationMatrixProps) {
  const n = labels.length
  const svgW = LABEL_W + n * cellSize
  const svgH = LABEL_H + n * cellSize

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {labels.map((label, j) => (
          <text
            key={j}
            x={LABEL_W + j * cellSize + cellSize / 2}
            y={LABEL_H - 4}
            textAnchor="middle"
            fontSize={9}
            fill="#A4A7B5"
            fontFamily="inherit"
          >
            {label}
          </text>
        ))}
        {labels.map((label, i) => (
          <text
            key={i}
            x={LABEL_W - 4}
            y={LABEL_H + i * cellSize + cellSize / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={9}
            fill="#A4A7B5"
            fontFamily="inherit"
          >
            {label}
          </text>
        ))}
        {data.map((row, i) =>
          row.map((v, j) => {
            const x = LABEL_W + j * cellSize
            const y = LABEL_H + i * cellSize
            return (
              <g key={`${i}-${j}`}>
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  fill={cellColor(v)}
                  rx={3}
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill={Math.abs(v) >= 0.5 ? '#fff' : '#A4A7B5'}
                  fontFamily="inherit"
                  fontWeight={i === j ? '700' : '400'}
                >
                  {v.toFixed(2)}
                </text>
              </g>
            )
          }),
        )}
      </svg>
    </div>
  )
}
