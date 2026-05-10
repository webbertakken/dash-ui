export interface RadialBarItem {
  label: string;
  value: number;
  max: number;
  color?: string;
  unit?: string;
}

export interface RadialBarChartProps {
  items: RadialBarItem[];
  ariaLabel?: string;
}

const W = 280;
const H = 160;
const CX = 80;
const CY = 80;
const RING_W = 9;
const RING_GAP = 5;
const MIN_R = 20;
const LABEL_X = 170;
const ITEM_H = 22;

function arcPath(r: number, frac: number): string {
  if (frac <= 0) return '';
  const start = -Math.PI / 2;
  const clamped = Math.min(frac, 1);
  const x1 = (CX + r * Math.cos(start)).toFixed(2);
  const y1 = (CY + r * Math.sin(start)).toFixed(2);
  if (clamped >= 1) {
    const xm = (CX + r * Math.cos(start + Math.PI)).toFixed(2);
    const ym = (CY + r * Math.sin(start + Math.PI)).toFixed(2);
    return `M${x1},${y1} A${r},${r} 0 1 1 ${xm},${ym} A${r},${r} 0 1 1 ${x1},${y1}`;
  }
  const sweep = clamped * 2 * Math.PI;
  const end = start + sweep;
  const x2 = (CX + r * Math.cos(end)).toFixed(2);
  const y2 = (CY + r * Math.sin(end)).toFixed(2);
  return `M${x1},${y1} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2},${y2}`;
}

export function RadialBarChart({ items, ariaLabel = 'Radial bar chart' }: RadialBarChartProps) {
  if (!items.length) return null;
  const n = items.length;
  const yStart = CY - ((n - 1) * ITEM_H) / 2;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {items.map((item, i) => {
          const r = MIN_R + (n - 1 - i) * (RING_W + RING_GAP);
          const frac = Math.min(item.value / (item.max || 1), 1);
          const color = item.color ?? '#006FFF';
          const ly = yStart + i * ITEM_H;
          const d = arcPath(r, frac);
          const pct = Math.round(frac * 100);
          return (
            <g key={i}>
              <circle cx={CX} cy={CY} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={RING_W} />
              {d && <path d={d} fill="none" stroke={color} strokeWidth={RING_W} strokeLinecap="round" />}
              <circle cx={LABEL_X} cy={ly} r={3.5} fill={color} />
              <text x={LABEL_X + 10} y={ly - 2} fill="#C8C9D0" fontSize={9} fontFamily="inherit" dominantBaseline="auto">
                {item.label}
              </text>
              <text x={LABEL_X + 10} y={ly + 9} fill="#6E7079" fontSize={8} fontFamily="inherit" dominantBaseline="auto">
                {item.value}{item.unit ?? ''} · {pct}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
