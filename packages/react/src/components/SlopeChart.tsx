export interface SlopeItem {
  label: string
  before: number
  after: number
}

export interface SlopeChartProps {
  items: SlopeItem[]
  labelBefore?: string
  labelAfter?: string
  unit?: string
  ariaLabel?: string
  positiveIsGood?: boolean
}

const VW = 340
const COL_L = 108
const COL_R = 232
const PAD_T = 26
const CHART_H = 192
const PAD_B = 8
const SVG_H = PAD_T + CHART_H + PAD_B
const DOT_R = 4
const LABEL_GAP = 15

function nudge(ys: number[], gap: number): number[] {
  const out = [...ys]
  const ord = out.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y)
  for (let k = 1; k < ord.length; k++) {
    if (ord[k].y < ord[k - 1].y + gap) ord[k].y = ord[k - 1].y + gap
  }
  for (let k = ord.length - 2; k >= 0; k--) {
    if (ord[k].y > ord[k + 1].y - gap) ord[k].y = ord[k + 1].y - gap
  }
  const res: number[] = Array.from({ length: ys.length })
  ord.forEach(({ y, i }) => {
    res[i] = y
  })
  return res
}

export function SlopeChart({
  items,
  labelBefore = 'Before',
  labelAfter = 'After',
  unit = '',
  ariaLabel = 'Slope chart',
  positiveIsGood = false,
}: SlopeChartProps) {
  if (!items.length) return null

  const allVals = items.flatMap((it) => [it.before, it.after])
  const minV = Math.min(...allVals)
  const maxV = Math.max(...allVals)
  const range = maxV - minV || 1
  const ty = (v: number) => PAD_T + (1 - (v - minV) / range) * CHART_H

  const leftDotY = items.map((it) => ty(it.before))
  const rightDotY = items.map((it) => ty(it.after))
  const leftLabelY = nudge(leftDotY, LABEL_GAP)
  const rightLabelY = nudge(rightDotY, LABEL_GAP)

  const itemsWithColor = items.map((it) => {
    const diff = it.after - it.before
    const c = diff === 0 ? '#A4A7B5' : diff > 0 === positiveIsGood ? '#00C875' : '#FF7B7B'
    return { ...it, c }
  })

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${SVG_H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        <text
          x={COL_L}
          y={14}
          fill="#6E7079"
          fontSize={10}
          textAnchor="middle"
          fontFamily="inherit"
        >
          {labelBefore}
        </text>
        <text
          x={COL_R}
          y={14}
          fill="#6E7079"
          fontSize={10}
          textAnchor="middle"
          fontFamily="inherit"
        >
          {labelAfter}
        </text>
        <line
          x1={COL_L}
          y1={PAD_T}
          x2={COL_L}
          y2={PAD_T + CHART_H}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
        <line
          x1={COL_R}
          y1={PAD_T}
          x2={COL_R}
          y2={PAD_T + CHART_H}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />

        {itemsWithColor.map((it, i) => {
          const ly = leftDotY[i]
          const ry = rightDotY[i]
          const lly = leftLabelY[i]
          const rly = rightLabelY[i]
          return (
            <g key={i}>
              <line
                x1={COL_L}
                y1={ly}
                x2={COL_R}
                y2={ry}
                stroke={it.c}
                strokeWidth={1.5}
                opacity={0.65}
              />
              {Math.abs(lly - ly) > 1 && (
                <line
                  x1={COL_L - 6}
                  y1={ly}
                  x2={COL_L - 6}
                  y2={lly}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.75}
                />
              )}
              {Math.abs(rly - ry) > 1 && (
                <line
                  x1={COL_R + 6}
                  y1={ry}
                  x2={COL_R + 6}
                  y2={rly}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.75}
                />
              )}
              <circle cx={COL_L} cy={ly} r={DOT_R} fill={it.c} />
              <circle cx={COL_R} cy={ry} r={DOT_R} fill={it.c} />
              <text
                x={COL_L - 10}
                y={lly + 4}
                fill="#A4A7B5"
                fontSize={9}
                textAnchor="end"
                fontFamily="inherit"
              >
                {it.label}
              </text>
              <text
                x={COL_L - 10}
                y={lly + 15}
                fill="#6E7079"
                fontSize={9}
                textAnchor="end"
                fontFamily="inherit"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {it.before}
                {unit}
              </text>
              <text
                x={COL_R + 10}
                y={rly + 4}
                fill="#A4A7B5"
                fontSize={9}
                textAnchor="start"
                fontFamily="inherit"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {it.after}
                {unit}
              </text>
              <text
                x={COL_R + 10}
                y={rly + 15}
                fill={it.c}
                fontSize={9}
                textAnchor="start"
                fontFamily="inherit"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {it.after > it.before ? '+' : ''}
                {it.after - it.before}
                {unit}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
