export interface BeeswarmSeries {
  label: string;
  points: number[];
  color?: string;
}

export interface BeeswarmChartProps {
  series: BeeswarmSeries[];
  yRange?: [number, number];
  height?: number;
  unit?: string;
  dotRadius?: number;
  ariaLabel?: string;
}

const PALETTE = ['#006FFF', '#00C875', '#FF7B7B', '#F5C26B', '#A78BFA', '#34D399'];
const VW = 340;
const PAD_L = 28;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 24;

function swarmedPositions(
  values: number[],
  tyFn: (v: number) => number,
  r: number,
  halfWidth: number,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const sorted = [...values].sort((a, b) => a - b);
  const step = r * 2 + 0.5;
  for (const v of sorted) {
    const cy = tyFn(v);
    let chosen = 0;
    let found = false;
    for (let dist = 0; dist <= halfWidth && !found; dist += step) {
      const candidates = dist === 0 ? [0] : [dist, -dist];
      for (const cx of candidates) {
        if (pts.every((p) => Math.hypot(cx - p.x, cy - p.y) >= r * 2)) {
          chosen = cx;
          found = true;
          break;
        }
      }
    }
    pts.push({ x: chosen, y: cy });
  }
  return pts;
}

export function BeeswarmChart({
  series,
  yRange,
  height = 200,
  unit = '',
  dotRadius = 4,
  ariaLabel = 'Beeswarm chart',
}: BeeswarmChartProps) {
  if (!series.length) return null;

  const PLOT_W = VW - PAD_L - PAD_R;
  const PLOT_H = height - PAD_T - PAD_B;
  const n = series.length;
  const colWidth = PLOT_W / n;
  const halfWidth = colWidth / 2 - dotRadius;

  const allPts = series.flatMap((s) => s.points);
  const minV = yRange ? yRange[0] : Math.min(...allPts);
  const maxV = yRange ? yRange[1] : Math.max(...allPts);
  const vRange = maxV - minV || 1;

  const ty = (v: number) => PAD_T + (1 - (v - minV) / vRange) * PLOT_H;
  const colCx = (i: number) => PAD_L + (i + 0.5) * colWidth;
  const yTicks = [minV, (minV + maxV) / 2, maxV];

  const swarmed = series.map((s) => swarmedPositions(s.points, ty, dotRadius, halfWidth));

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1}
            />
            <text x={PAD_L - 4} y={ty(v) + 4} fill="#6E7079" fontSize={8} textAnchor="end" fontFamily="inherit">
              {Math.round(v)}{unit}
            </text>
          </g>
        ))}

        {series.map((s, si) => {
          const cx = colCx(si);
          const color = s.color ?? PALETTE[si % PALETTE.length];
          const pts = swarmed[si];
          return (
            <g key={si}>
              {pts.map((p, pi) => (
                <circle key={pi} cx={cx + p.x} cy={p.y} r={dotRadius} fill={color} fillOpacity={0.75} />
              ))}
              <text x={cx} y={height - 4} fill="#6E7079" fontSize={9} textAnchor="middle" fontFamily="inherit">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
