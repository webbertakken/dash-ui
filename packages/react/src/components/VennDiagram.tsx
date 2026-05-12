export interface VennSet {
  id: string
  label: string
  value: number
  color?: string
}

export interface VennIntersection {
  sets: string[]
  value: number
}

export interface VennDiagramProps {
  sets: VennSet[]
  intersections?: VennIntersection[]
  height?: number
  ariaLabel?: string
}

const PALETTE = ['#006FFF', '#00C875', '#A78BFA']
const VW = 340

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export function VennDiagram({
  sets,
  intersections = [],
  height = 240,
  ariaLabel = 'Venn diagram',
}: VennDiagramProps) {
  if (sets.length < 2 || sets.length > 3) return null

  const is3 = sets.length === 3
  const cx = VW / 2
  const cy = height / 2

  const circles = is3
    ? [
        { x: cx, y: cy - 40, r: 75 },
        { x: cx - 65, y: cy + 50, r: 75 },
        { x: cx + 65, y: cy + 50, r: 75 },
      ]
    : [
        { x: cx - 58, y: cy, r: 85 },
        { x: cx + 58, y: cy, r: 85 },
      ]

  const exclusiveValues = sets.map((s) =>
    Math.max(
      0,
      s.value -
        intersections.filter((i) => i.sets.includes(s.id)).reduce((sum, i) => sum + i.value, 0),
    ),
  )

  function getPt(inter: VennIntersection): { x: number; y: number } | null {
    const idxById: Record<string, number> = {}
    sets.forEach((s, i) => {
      idxById[s.id] = i
    })
    const idxs = inter.sets
      .map((id) => idxById[id])
      .filter((v) => v !== undefined)
      .sort((a, b) => a - b)
    if (!is3) return { x: cx, y: cy }
    if (idxs.length >= 3) return { x: cx, y: cy + 18 }
    if (idxs[0] === 0 && idxs[1] === 1) return { x: cx - 33, y: cy + 4 }
    if (idxs[0] === 0 && idxs[1] === 2) return { x: cx + 33, y: cy + 4 }
    if (idxs[0] === 1 && idxs[1] === 2) return { x: cx, y: cy + 50 }
    return null
  }

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {sets.map((s, i) => {
          const c = circles[i]
          const color = s.color ?? PALETTE[i % PALETTE.length]
          return (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={c.r}
              fill={color}
              fillOpacity={0.15}
              stroke={color}
              strokeOpacity={0.55}
              strokeWidth={1.5}
            />
          )
        })}

        {sets.map((s, i) => {
          const c = circles[i]
          const color = s.color ?? PALETTE[i % PALETTE.length]
          return (
            <g key={i}>
              <text
                x={c.x}
                y={c.y - 8}
                fill={color}
                fontSize={11}
                textAnchor="middle"
                fontFamily="inherit"
                fontWeight={600}
              >
                {s.label}
              </text>
              <text
                x={c.x}
                y={c.y + 8}
                fill="#A4A7B5"
                fontSize={10}
                textAnchor="middle"
                fontFamily="inherit"
              >
                {fmt(exclusiveValues[i])}
              </text>
            </g>
          )
        })}

        {intersections.map((inter, i) => {
          const pt = getPt(inter)
          if (!pt) return null
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              fill="rgba(255,255,255,0.65)"
              fontSize={10}
              textAnchor="middle"
              fontFamily="inherit"
            >
              {fmt(inter.value)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
