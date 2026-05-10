export interface MirroredBarItem {
  label: string;
  left: number;
  right: number;
}

export interface MirroredBarChartProps {
  items: MirroredBarItem[];
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
  unit?: string;
  ariaLabel?: string;
}

const VW = 340;
const LABEL_W = 80;
const PAD_T = 20;
const PAD_B = 8;
const ROW_H = 26;
const HALF_W = (VW - LABEL_W) / 2;
const CX = VW / 2;

export function MirroredBarChart({
  items,
  leftLabel = 'Download',
  rightLabel = 'Upload',
  leftColor = '#006FFF',
  rightColor = '#00C8C8',
  unit = '',
  ariaLabel = 'Mirrored bar chart',
}: MirroredBarChartProps) {
  const svgH = PAD_T + items.length * ROW_H + PAD_B;
  const maxVal = Math.max(...items.flatMap((it) => [it.left, it.right]), 1);

  function bw(val: number): number {
    return (val / maxVal) * HALF_W;
  }

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        <text
          x={CX - LABEL_W / 2 - 6}
          y={13}
          fill="#6E7079"
          fontSize={9}
          textAnchor="end"
          fontFamily="inherit"
        >
          {leftLabel}
        </text>
        <text
          x={CX + LABEL_W / 2 + 6}
          y={13}
          fill="#6E7079"
          fontSize={9}
          textAnchor="start"
          fontFamily="inherit"
        >
          {rightLabel}
        </text>

        <line
          x1={CX}
          y1={PAD_T - 4}
          x2={CX}
          y2={PAD_T + items.length * ROW_H}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />

        {items.map((item, i) => {
          const y = PAD_T + i * ROW_H;
          const midY = y + ROW_H / 2;
          const bh = ROW_H - 8;
          const by = y + 4;
          const lw = bw(item.left);
          const rw = bw(item.right);
          return (
            <g key={i}>
              <rect
                x={CX - LABEL_W / 2 - lw}
                y={by}
                width={lw}
                height={bh}
                fill={leftColor}
                opacity={0.85}
                rx={2}
              />
              <rect
                x={CX + LABEL_W / 2}
                y={by}
                width={rw}
                height={bh}
                fill={rightColor}
                opacity={0.85}
                rx={2}
              />
              <text
                x={CX}
                y={midY + 4}
                fill="#CDD0DB"
                fontSize={10}
                textAnchor="middle"
                fontFamily="inherit"
              >
                {item.label}
              </text>
              {lw >= 28 && (
                <text
                  x={CX - LABEL_W / 2 - lw + 4}
                  y={midY + 4}
                  fill="rgba(255,255,255,0.55)"
                  fontSize={9}
                  textAnchor="start"
                  fontFamily="inherit"
                >
                  {item.left}
                  {unit}
                </text>
              )}
              {rw >= 28 && (
                <text
                  x={CX + LABEL_W / 2 + rw - 4}
                  y={midY + 4}
                  fill="rgba(255,255,255,0.55)"
                  fontSize={9}
                  textAnchor="end"
                  fontFamily="inherit"
                >
                  {item.right}
                  {unit}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
