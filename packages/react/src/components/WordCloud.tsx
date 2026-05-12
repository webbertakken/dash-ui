export interface WordCloudItem {
  word: string
  weight: number
  color?: string
}

export interface WordCloudProps {
  items: WordCloudItem[]
  height?: number
  ariaLabel?: string
}

const VW = 380
const PAD = 14
const MIN_FONT = 9
const MAX_FONT = 28
const GAP = 6
const COLORS = [
  '#006FFF',
  '#00C8C8',
  '#F5A623',
  '#7FB6FF',
  '#A878F5',
  '#F56342',
  '#00C875',
  '#FF7BB1',
]

export function WordCloud({ items, height = 160, ariaLabel = 'Word cloud' }: WordCloudProps) {
  const sorted = [...items].sort((a, b) => b.weight - a.weight)
  const maxW = sorted[0]?.weight ?? 1
  const minW = sorted[sorted.length - 1]?.weight ?? 0
  const range = maxW - minW || 1

  const words = sorted.map((item, i) => {
    const t = (item.weight - minW) / range
    const fontSize = MIN_FONT + t * (MAX_FONT - MIN_FONT)
    const approxW = item.word.length * fontSize * 0.56 + GAP * 2
    return {
      word: item.word,
      weight: item.weight,
      fontSize,
      approxW,
      color: item.color ?? COLORS[i % COLORS.length],
      bold: fontSize >= 16,
    }
  })

  const usableW = VW - PAD * 2
  const rows: (typeof words)[] = []
  let row: typeof words = []
  let rowW = 0

  for (const w of words) {
    if (rowW + w.approxW > usableW && row.length > 0) {
      rows.push(row)
      row = [w]
      rowW = w.approxW
    } else {
      row.push(w)
      rowW += w.approxW
    }
  }
  if (row.length) rows.push(row)

  const ROW_H = 32
  const totalH = rows.length * ROW_H + PAD * 2
  const svgH = Math.max(height, totalH)
  const offsetY = PAD + (svgH - totalH) / 2

  const placed = rows.flatMap((r, ri) => {
    const rowUsed = r.reduce((s, w) => s + w.approxW, 0)
    let x = PAD + (usableW - rowUsed) / 2
    const baseY = offsetY + ri * ROW_H
    return r.map((w) => {
      const cx = x + w.approxW / 2
      x += w.approxW
      return { ...w, cx, cy: baseY + w.fontSize }
    })
  })

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {placed.map((w, i) => (
          <text
            key={i}
            x={w.cx}
            y={w.cy}
            textAnchor="middle"
            fill={w.color}
            fontSize={w.fontSize}
            fontWeight={w.bold ? 600 : 400}
            fontFamily="inherit"
          >
            {w.word}
          </text>
        ))}
      </svg>
    </div>
  )
}
