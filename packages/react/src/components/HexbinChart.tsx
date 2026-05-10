export interface HexbinPoint {
  x: number;
  y: number;
}

export interface HexbinChartProps {
  points: HexbinPoint[];
  xRange?: [number, number];
  yRange?: [number, number];
  height?: number;
  hexRadius?: number;
  ariaLabel?: string;
}

const ROOT3 = Math.sqrt(3);
const VW = 340;
const PAD_L = 28;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 20;

function pixelToHex(px: number, py: number, R: number): [number, number] {
  const q = (ROOT3 / 3 * px - 1 / 3 * py) / R;
  const r = (2 / 3 * py) / R;
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
  const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  else rs = -rq - rr; // eslint-disable-line @typescript-eslint/no-unused-vars
  return [rq, rr];
}

function hexCenter(q: number, r: number, R: number, ox: number, oy: number): [number, number] {
  return [ROOT3 * R * (q + r / 2) + ox, 1.5 * R * r + oy];
}

function hexPath(cx: number, cy: number, R: number): string {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = Math.PI / 6 + (Math.PI / 3) * k;
    return `${(cx + R * Math.cos(a)).toFixed(2)},${(cy + R * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}

export function HexbinChart({
  points,
  xRange,
  yRange,
  height = 200,
  hexRadius = 10,
  ariaLabel = 'Hexbin chart',
}: HexbinChartProps) {
  if (!points.length) return null;

  const PLOT_W = VW - PAD_L - PAD_R;
  const PLOT_H = height - PAD_T - PAD_B;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = xRange?.[0] ?? Math.min(...xs);
  const xMax = xRange?.[1] ?? Math.max(...xs);
  const yMin = yRange?.[0] ?? Math.min(...ys);
  const yMax = yRange?.[1] ?? Math.max(...ys);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const bins = new Map<string, { q: number; r: number; count: number }>();
  for (const pt of points) {
    const px = ((pt.x - xMin) / xSpan) * PLOT_W;
    const py = (1 - (pt.y - yMin) / ySpan) * PLOT_H;
    const [q, r] = pixelToHex(px, py, hexRadius);
    const key = `${q},${r}`;
    const bin = bins.get(key);
    if (bin) bin.count++;
    else bins.set(key, { q, r, count: 1 });
  }

  const maxCount = Math.max(...[...bins.values()].map((b) => b.count));
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];
  const xTicks = [xMin, (xMin + xMax) / 2, xMax];
  const ty = (v: number) => PAD_T + (1 - (v - yMin) / ySpan) * PLOT_H;
  const tx = (v: number) => PAD_L + ((v - xMin) / xSpan) * PLOT_W;

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
            <line x1={PAD_L} y1={ty(v)} x2={PAD_L + PLOT_W} y2={ty(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD_L - 4} y={ty(v) + 3} fill="#6E7079" fontSize={8}
              textAnchor="end" fontFamily="inherit">{Math.round(v)}</text>
          </g>
        ))}

        {[...bins.values()].map(({ q, r, count }) => {
          const [cx, cy] = hexCenter(q, r, hexRadius, PAD_L, PAD_T);
          if (cx < PAD_L - hexRadius * 2 || cx > PAD_L + PLOT_W + hexRadius * 2) return null;
          if (cy < PAD_T - hexRadius * 2 || cy > PAD_T + PLOT_H + hexRadius * 2) return null;
          const alpha = (0.15 + 0.85 * (count / maxCount)).toFixed(3);
          return (
            <path
              key={`${q},${r}`}
              d={hexPath(cx, cy, hexRadius - 0.5)}
              fill={`rgba(0,111,255,${alpha})`}
              stroke="rgba(0,111,255,0.2)"
              strokeWidth={0.5}
            />
          );
        })}

        {xTicks.map((v, i) => (
          <text key={i} x={tx(v)} y={height - 4} fill="#6E7079" fontSize={8}
            textAnchor="middle" fontFamily="inherit">{Math.round(v)}</text>
        ))}
      </svg>
    </div>
  );
}
