export type UptimeStatus = 'up' | 'degraded' | 'down'

export interface UptimeSegment {
  from: number
  to: number
  status: UptimeStatus
}

export interface UptimeSeries {
  label: string
  segments: UptimeSegment[]
}

export interface UptimeTimelineProps {
  series: UptimeSeries[]
  xLabels?: string[]
  ariaLabel?: string
}

const VW = 400
const LABEL_W = 88
const PAD_R = 10
const PAD_T = 6
const ROW_H = 14
const ROW_GAP = 8
const XLBL_H = 16
const LEG_H = 16
const PAD_B = XLBL_H + LEG_H + 4

const STATUS_COLOR: Record<UptimeStatus, string> = {
  up: '#00C875',
  degraded: '#F5A623',
  down: '#F03E3E',
}

const LEGEND: { status: UptimeStatus; label: string }[] = [
  { status: 'up', label: 'Up' },
  { status: 'degraded', label: 'Degraded' },
  { status: 'down', label: 'Down' },
]

export function UptimeTimeline({
  series,
  xLabels,
  ariaLabel = 'Uptime timeline',
}: UptimeTimelineProps) {
  const trackW = VW - LABEL_W - PAD_R
  const rowsH = series.length * (ROW_H + ROW_GAP) - ROW_GAP
  const totalH = PAD_T + rowsH + PAD_B
  const xlblY = PAD_T + rowsH + XLBL_H
  const legY = xlblY + LEG_H

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${totalH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {series.map((s, si) => {
          const y = PAD_T + si * (ROW_H + ROW_GAP)
          return (
            <g key={s.label}>
              <text
                x={LABEL_W - 8}
                y={y + ROW_H / 2 + 4}
                textAnchor="end"
                fill="#A4A7B5"
                fontSize={11}
                fontFamily="inherit"
              >
                {s.label}
              </text>
              <rect
                x={LABEL_W}
                y={y}
                width={trackW}
                height={ROW_H}
                fill="rgba(255,255,255,0.04)"
                rx={3}
              />
              {s.segments.map((seg, i) => (
                <rect
                  key={i}
                  x={LABEL_W + seg.from * trackW}
                  y={y}
                  width={(seg.to - seg.from) * trackW}
                  height={ROW_H}
                  fill={STATUS_COLOR[seg.status]}
                  rx={2}
                  fillOpacity={0.85}
                />
              ))}
            </g>
          )
        })}

        {xLabels?.map((lbl, i) => (
          <text
            key={lbl}
            x={LABEL_W + (xLabels.length > 1 ? i / (xLabels.length - 1) : 0) * trackW}
            y={xlblY}
            textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
            fill="#6E7079"
            fontSize={10}
            fontFamily="inherit"
          >
            {lbl}
          </text>
        ))}

        {LEGEND.map(({ status, label }, i) => (
          <g key={status}>
            <rect
              x={LABEL_W + i * 80}
              y={legY - 8}
              width={12}
              height={8}
              fill={STATUS_COLOR[status]}
              rx={2}
              fillOpacity={0.85}
            />
            <text
              x={LABEL_W + i * 80 + 16}
              y={legY}
              fill="#6E7079"
              fontSize={10}
              fontFamily="inherit"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
