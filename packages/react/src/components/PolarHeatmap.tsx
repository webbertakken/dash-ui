export interface PolarCell {
  row: number
  col: number
  value: number
}

export interface PolarHeatmapProps {
  data: PolarCell[]
  rows: number
  cols: number
  colLabels?: string[]
  color?: string
  ariaLabel?: string
}

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const MIN_R = 24
const MAX_R = 110
const BASE = -Math.PI / 2

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function annularSector(ir: number, or: number, sa: number, ea: number): string {
  const { cos, sin } = Math
  const f = (v: number) => v.toFixed(2)
  return [
    `M ${f(CX + ir * cos(sa))} ${f(CY + ir * sin(sa))}`,
    `A ${f(ir)} ${f(ir)} 0 0 1 ${f(CX + ir * cos(ea))} ${f(CY + ir * sin(ea))}`,
    `L ${f(CX + or * cos(ea))} ${f(CY + or * sin(ea))}`,
    `A ${f(or)} ${f(or)} 0 0 0 ${f(CX + or * cos(sa))} ${f(CY + or * sin(sa))}`,
    'Z',
  ].join(' ')
}

export function PolarHeatmap({
  data,
  rows,
  cols,
  colLabels = [],
  color = '#006FFF',
  ariaLabel = 'Polar heatmap',
}: PolarHeatmapProps) {
  if (!data.length) return null
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const ringH = (MAX_R - MIN_R) / rows
  const segA = (2 * Math.PI) / cols
  const [r, g, b] = hexToRgb(color)
  const LABEL_R = MAX_R + 14
  const labelEvery = cols <= 12 ? 1 : cols <= 24 ? 3 : Math.round(cols / 8)

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {Array.from({ length: rows + 1 }, (_, i) => MIN_R + i * ringH).map((rr, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={rr.toFixed(2)}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={0.5}
          />
        ))}
        {data.map((cell, i) => {
          const ir = MIN_R + cell.row * ringH
          const or = ir + ringH - 0.5
          const sa = BASE + cell.col * segA + 0.01
          const ea = BASE + (cell.col + 1) * segA - 0.01
          const norm = cell.value / maxVal
          return (
            <path
              key={i}
              d={annularSector(ir, or, sa, ea)}
              fill={`rgba(${r},${g},${b},${(0.08 + 0.92 * norm).toFixed(3)})`}
            />
          )
        })}
        {colLabels.map((label, i) => {
          if (i % labelEvery !== 0) return null
          const a = BASE + (i + 0.5) * segA
          return (
            <text
              key={i}
              x={(CX + LABEL_R * Math.cos(a)).toFixed(1)}
              y={(CY + LABEL_R * Math.sin(a)).toFixed(1)}
              fill="#6E7079"
              fontSize={7}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="inherit"
            >
              {label}
            </text>
          )
        })}
        <circle
          cx={CX}
          cy={CY}
          r={MIN_R}
          fill="#13131A"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={0.5}
        />
      </svg>
    </div>
  )
}
