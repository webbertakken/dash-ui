export interface MatrixChartProps {
  rows: string[]
  cols: string[]
  values: number[][]
  unit?: string
  height?: number
  ariaLabel?: string
}

const LEFT = 80
const TOP = 60
const CELL = 38
const FONT = 'inherit'

function cellColor(t: number): string {
  const alpha = 0.07 + t * 0.88
  return `rgba(0,111,255,${alpha.toFixed(2)})`
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function MatrixChart({
  rows,
  cols,
  values,
  unit = '',
  ariaLabel = 'Matrix chart',
}: MatrixChartProps) {
  const allVals = values.flat()
  const max = Math.max(...allVals, 1)
  const W = LEFT + cols.length * CELL
  const H = TOP + rows.length * CELL

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {cols.map((col, ci) => {
          const cx = LEFT + ci * CELL + CELL / 2
          return (
            <text
              key={ci}
              x={cx}
              y={TOP - 8}
              fill="#A4A7B5"
              fontSize={10}
              textAnchor="end"
              fontFamily={FONT}
              transform={`rotate(-40, ${cx}, ${TOP - 8})`}
            >
              {col}
            </text>
          )
        })}

        {rows.map((row, ri) => {
          const cy = TOP + ri * CELL + CELL / 2
          return (
            <text
              key={ri}
              x={LEFT - 8}
              y={cy + 4}
              fill="#A4A7B5"
              fontSize={10}
              textAnchor="end"
              fontFamily={FONT}
            >
              {row}
            </text>
          )
        })}

        {rows.map((_, ri) =>
          cols.map((_, ci) => {
            const v = values[ri]?.[ci] ?? 0
            const t = v / max
            const x = LEFT + ci * CELL
            const y = TOP + ri * CELL
            const cx = x + CELL / 2
            const cy = y + CELL / 2
            return (
              <g key={`${ri}-${ci}`}>
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={3}
                  fill={cellColor(t)}
                />
                {v > 0 && (
                  <text
                    x={cx}
                    y={cy + 4}
                    fill={t > 0.5 ? '#fff' : '#A4A7B5'}
                    fontSize={9}
                    textAnchor="middle"
                    fontFamily={FONT}
                  >
                    {fmt(v)}
                    {unit}
                  </text>
                )}
              </g>
            )
          }),
        )}
      </svg>
    </div>
  )
}
