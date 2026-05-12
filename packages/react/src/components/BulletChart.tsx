export interface BulletItem {
  label: string
  value: number
  target?: number
  ranges?: [number, number]
  unit?: string
  color?: string
}

export interface BulletChartProps {
  items: BulletItem[]
  max?: number
  ariaLabel?: string
}

const VW = 400
const LABEL_W = 110
const VAL_W = 44
const TRACK_H = 10
const RANGE_H = 18
const ROW_H = 34
const PAD = 8

export function BulletChart({ items, max = 100, ariaLabel = 'Bullet chart' }: BulletChartProps) {
  const trackW = VW - LABEL_W - VAL_W
  const totalH = items.length * ROW_H + PAD * 2

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${totalH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {items.map((item, i) => {
          const y = PAD + i * ROW_H
          const midY = y + ROW_H / 2
          const rangeY = midY - RANGE_H / 2
          const trackY = midY - TRACK_H / 2
          const [r1, r2] = item.ranges ?? [50, 75]
          const r1w = (r1 / max) * trackW
          const r2w = (r2 / max) * trackW
          const valW = Math.min(item.value / max, 1) * trackW
          const targetX = item.target != null ? (Math.min(item.target, max) / max) * trackW : null
          const color = item.color ?? '#006FFF'
          const unit = item.unit ?? '%'

          return (
            <g key={i}>
              <text
                x={LABEL_W - 8}
                y={midY + 4}
                textAnchor="end"
                fill="#A4A7B5"
                fontSize={11}
                fontFamily="inherit"
              >
                {item.label}
              </text>
              <rect
                x={LABEL_W}
                y={rangeY}
                width={trackW}
                height={RANGE_H}
                fill="rgba(255,255,255,0.04)"
                rx={2}
              />
              <rect
                x={LABEL_W + r1w}
                y={rangeY}
                width={trackW - r1w}
                height={RANGE_H}
                fill="rgba(255,255,255,0.07)"
                rx={2}
              />
              <rect
                x={LABEL_W + r2w}
                y={rangeY}
                width={trackW - r2w}
                height={RANGE_H}
                fill="rgba(255,255,255,0.10)"
                rx={2}
              />
              <rect
                x={LABEL_W}
                y={trackY}
                width={valW}
                height={TRACK_H}
                fill={color}
                fillOpacity={0.9}
                rx={2}
              />
              {targetX != null && (
                <rect
                  x={LABEL_W + targetX - 1.5}
                  y={rangeY}
                  width={3}
                  height={RANGE_H}
                  fill="rgba(255,255,255,0.85)"
                  rx={1}
                />
              )}
              <text
                x={LABEL_W + trackW + 6}
                y={midY + 4}
                fill="#fff"
                fontSize={11}
                fontFamily="inherit"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {item.value}
                {unit}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
