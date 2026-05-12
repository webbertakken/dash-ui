import { useMemo } from 'react'

export interface MarimekkoSegment {
  label: string
  value: number
  color?: string
}

export interface MarimekkoColumn {
  label: string
  segments: MarimekkoSegment[]
}

export interface MarimekkoChartProps {
  columns: MarimekkoColumn[]
  height?: number
  ariaLabel?: string
}

const PALETTE = ['#006FFF', '#00C875', '#F5A623', '#A78BFA', '#FF7B7B', '#00C8C8', '#FB923C']
const VW = 340
const LABEL_H = 22
const GAP = 2

interface Cell {
  x: number
  y: number
  w: number
  h: number
  color: string
  label: string
}
interface Header {
  x: number
  w: number
  label: string
}

export function MarimekkoChart({
  columns,
  height = 160,
  ariaLabel = 'Marimekko chart',
}: MarimekkoChartProps) {
  const { cells, headers } = useMemo(() => {
    const colTotals = columns.map((col) => col.segments.reduce((s, seg) => s + seg.value, 0))
    const grandTotal = colTotals.reduce((s, t) => s + t, 0)
    if (grandTotal === 0) return { cells: [] as Cell[], headers: [] as Header[] }

    const chartH = height - LABEL_H
    const result: Cell[] = []
    const hdrs: Header[] = []

    let cx = 0
    columns.forEach((col, ci) => {
      const colTotal = colTotals[ci]
      const colW = (colTotal / grandTotal) * VW
      hdrs.push({ x: cx, w: colW, label: col.label })

      let sy = LABEL_H
      col.segments.forEach((seg, si) => {
        const segH = colTotal > 0 ? (seg.value / colTotal) * chartH : 0
        result.push({
          x: cx,
          y: sy,
          w: colW,
          h: segH,
          color: seg.color ?? PALETTE[si % PALETTE.length],
          label: seg.label,
        })
        sy += segH
      })
      cx += colW
    })
    return { cells: result, headers: hdrs }
  }, [columns, height])

  if (!cells.length) return null

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {headers.map((h, i) =>
          h.w > GAP * 2 ? (
            <text
              key={i}
              x={h.x + h.w / 2}
              y={LABEL_H - 6}
              textAnchor="middle"
              fontSize={Math.min(10, h.w / 6)}
              fill="#A4A7B5"
              fontFamily="inherit"
            >
              {h.label}
            </text>
          ) : null,
        )}
        {cells.map((cell, i) =>
          cell.w > GAP * 2 && cell.h > GAP * 2 ? (
            <g key={i}>
              <rect
                x={cell.x + GAP / 2}
                y={cell.y + GAP / 2}
                width={Math.max(0, cell.w - GAP)}
                height={Math.max(0, cell.h - GAP)}
                fill={cell.color}
                fillOpacity={0.8}
                rx={2}
              />
              {cell.w > 36 && cell.h > 14 && (
                <text
                  x={cell.x + cell.w / 2}
                  y={cell.y + cell.h / 2 + 4}
                  textAnchor="middle"
                  fontSize={Math.min(9, (cell.w - GAP) / 8, cell.h - 6)}
                  fill="#fff"
                  fontFamily="inherit"
                >
                  {cell.label}
                </text>
              )}
            </g>
          ) : null,
        )}
        {headers.slice(0, -1).map((h, i) => (
          <line
            key={i}
            x1={h.x + h.w}
            y1={LABEL_H}
            x2={h.x + h.w}
            y2={height}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
      </svg>
    </div>
  )
}
