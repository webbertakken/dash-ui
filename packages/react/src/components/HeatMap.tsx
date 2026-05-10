import { useMemo } from 'react';

export interface HeatMapProps {
  data: number[][];
  colors?: string[];
  xLabels?: string[];
  height?: number;
  cellGap?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD_BASE = { t: 4, r: 4, l: 4 };
const DEFAULT_COLORS = ['#1B2D5A', '#3F7BC4', '#7FB6FF', '#F5C26B', '#F5A623', '#FF7B7B'];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function interpolateColor(colors: string[], t: number): string {
  if (colors.length === 1) return colors[0];
  const scaled = Math.max(0, Math.min(1, t)) * (colors.length - 1);
  const i = Math.min(Math.floor(scaled), colors.length - 2);
  const f = scaled - i;
  const [r1, g1, b1] = hexToRgb(colors[i]);
  const [r2, g2, b2] = hexToRgb(colors[i + 1]);
  return `rgb(${Math.round(r1 + f * (r2 - r1))},${Math.round(g1 + f * (g2 - g1))},${Math.round(b1 + f * (b2 - b1))})`;
}

export function HeatMap({
  data,
  colors = DEFAULT_COLORS,
  xLabels = [],
  height = 160,
  cellGap = 1,
  ariaLabel = 'Heat map',
}: HeatMapProps) {
  const { rects, labelNodes } = useMemo(() => {
    const rows = data.length;
    const cols = data[0]?.length ?? 0;
    if (!rows || !cols) return { rects: [], labelNodes: [] };

    const padB = xLabels.length ? 16 : 4;
    const chartW = VW - PAD_BASE.l - PAD_BASE.r;
    const chartH = height - PAD_BASE.t - padB;
    const cellW = (chartW - (cols - 1) * cellGap) / cols;
    const cellH = (chartH - (rows - 1) * cellGap) / rows;

    const rects: { key: string; x: number; y: number; w: number; h: number; fill: string }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rects.push({
          key: `${row}-${col}`,
          x: PAD_BASE.l + col * (cellW + cellGap),
          y: PAD_BASE.t + row * (cellH + cellGap),
          w: cellW,
          h: cellH,
          fill: interpolateColor(colors, data[row][col]),
        });
      }
    }

    const labelNodes = xLabels.map((lbl, i) => {
      const x = PAD_BASE.l + (xLabels.length > 1 ? (i / (xLabels.length - 1)) * chartW : chartW / 2);
      return { lbl, x, y: height - 2 };
    });

    return { rects, labelNodes };
  }, [data, colors, xLabels, height, cellGap]);

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {rects.map((r) => (
          <rect key={r.key} x={r.x.toFixed(2)} y={r.y.toFixed(2)} width={r.w.toFixed(2)} height={r.h.toFixed(2)} fill={r.fill} />
        ))}
        {labelNodes.map(({ lbl, x, y }, i) => (
          <text key={i} x={x.toFixed(1)} y={y} textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit">
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
