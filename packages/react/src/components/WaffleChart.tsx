export interface WaffleSegment {
  label: string
  value: number
  color?: string
}

export interface WaffleChartProps {
  segments: WaffleSegment[]
  total?: number
  cols?: number
  rows?: number
  gap?: number
  ariaLabel?: string
}

const COLORS = ['#006FFF', '#00C7A8', '#F5A623', '#FF6B6B', '#A78BFA']
const VW = 280
const LEGEND_H = 24

export function WaffleChart({
  segments,
  total,
  cols = 10,
  rows = 10,
  gap = 2,
  ariaLabel = 'Waffle chart',
}: WaffleChartProps) {
  const totalCells = cols * rows
  const sum = total ?? segments.reduce((s, seg) => s + seg.value, 0)
  const cellSize = (VW - gap * (cols - 1)) / cols
  const gridH = rows * cellSize + gap * (rows - 1)
  const svgH = gridH + LEGEND_H + 6

  const cellMap: number[] = Array.from({ length: totalCells }, () => -1)
  let cursor = 0
  segments.forEach((seg, si) => {
    const count = Math.round((seg.value / sum) * totalCells)
    for (let j = 0; j < count && cursor < totalCells; j++, cursor++) {
      cellMap[cursor] = si
    }
  })

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {Array.from({ length: totalCells }, (_, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          const x = col * (cellSize + gap)
          const y = row * (cellSize + gap)
          const si = cellMap[i]
          const fill =
            si >= 0 ? (segments[si].color ?? COLORS[si % COLORS.length]) : 'rgba(255,255,255,0.06)'
          return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill={fill} rx={1} />
        })}

        {segments.map((seg, si) => {
          const color = seg.color ?? COLORS[si % COLORS.length]
          const pct = Math.round((seg.value / sum) * 100)
          const lx = si * (VW / segments.length)
          const ly = gridH + 8
          return (
            <g key={si}>
              <rect x={lx} y={ly} width={8} height={8} fill={color} rx={1} />
              <text x={lx + 11} y={ly + 7.5} fill="#A4A7B5" fontSize={9} fontFamily="inherit">
                {seg.label} {pct}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
