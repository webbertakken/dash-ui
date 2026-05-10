export interface PieSlice {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  slices: PieSlice[];
  size?: number;
  ariaLabel?: string;
}

const COLORS = ['#006FFF', '#00C8C8', '#F5A623', '#A878F5', '#FF6B6B', '#00C875', '#7FB6FF', '#6E7079'];
const TAU = 2 * Math.PI;
const START = -Math.PI / 2;

function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

export function PieChart({ slices, size = 140, ariaLabel = 'Pie chart' }: PieChartProps) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.82;
  const LEGEND_ROW = 18;
  const legendH = Math.ceil(slices.length / 2) * LEGEND_ROW + 6;
  const VW = size;
  const VH = size + legendH;

  const segments: { path: string; color: string; mid: number }[] = [];
  let angle = START;
  for (const sl of slices) {
    const span = (sl.value / total) * TAU;
    const color = sl.color ?? COLORS[segments.length % COLORS.length];
    segments.push({ path: arc(cx, cy, r, angle, angle + span), color, mid: angle + span / 2 });
    angle += span;
  }

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {segments.map((seg, i) => (
          <path key={i} d={seg.path} fill={seg.color} stroke="#1a1d2b" strokeWidth={1.5} />
        ))}

        {slices.map((sl, i) => {
          const pct = Math.round((sl.value / total) * 100);
          if (pct < 5) return null;
          const mid = segments[i].mid;
          const lr = r * 0.6;
          const tx = cx + lr * Math.cos(mid);
          const ty = cy + lr * Math.sin(mid);
          return (
            <text
              key={i}
              x={tx.toFixed(1)}
              y={ty.toFixed(1)}
              fill="#fff"
              fontSize={9}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="inherit"
              fontWeight="600"
            >
              {pct}%
            </text>
          );
        })}

        {slices.map((sl, i) => {
          const col = Math.floor(i / Math.ceil(slices.length / 2));
          const row = i % Math.ceil(slices.length / 2);
          const colW = VW / 2;
          const lx = col * colW + 10;
          const ly = size + 6 + row * LEGEND_ROW;
          const c = sl.color ?? COLORS[i % COLORS.length];
          return (
            <g key={i}>
              <rect x={lx} y={ly + 2} width={8} height={8} rx={2} fill={c} />
              <text x={lx + 12} y={ly + 9} fill="#A4A7B5" fontSize={9} fontFamily="inherit">
                {sl.label} ({sl.value})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
