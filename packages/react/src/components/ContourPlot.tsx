export interface ContourPoint {
  x: number;
  y: number;
}

export interface ContourPlotProps {
  points: ContourPoint[];
  xRange?: [number, number];
  yRange?: [number, number];
  height?: number;
  bandwidth?: number;
  color?: string;
  ariaLabel?: string;
}

const VW = 340;
const PAD_L = 28;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 20;
const GW = 38;
const GH = 28;
const LEVELS = [0.12, 0.30, 0.54, 0.78];

function buildGrid(pts: Array<{ gx: number; gy: number }>, bw: number): number[][] {
  const bw2 = bw * bw;
  const g: number[][] = Array.from({ length: GH + 1 }, () => new Array(GW + 1).fill(0));
  for (let r = 0; r <= GH; r++) {
    for (let c = 0; c <= GW; c++) {
      let d = 0;
      for (const p of pts) {
        const dx = c - p.gx, dy = r - p.gy;
        d += Math.exp(-0.5 * (dx * dx + dy * dy) / bw2);
      }
      g[r][c] = d;
    }
  }
  let mx = 0;
  for (const row of g) for (const v of row) if (v > mx) mx = v;
  if (mx > 0) for (const row of g) for (let c = 0; c < row.length; c++) row[c] /= mx;
  return g;
}

function edgeCross(v0: number, v1: number, t: number): number {
  const d = v1 - v0;
  return Math.abs(d) < 1e-9 ? 0.5 : Math.max(0, Math.min(1, (t - v0) / d));
}

type P = [number, number];

function marchCell(
  tl: number, tr: number, bl: number, br: number, t: number
): Array<[P, P]> {
  const a = tl >= t ? 1 : 0;
  const b = tr >= t ? 1 : 0;
  const c = bl >= t ? 1 : 0;
  const d = br >= t ? 1 : 0;
  const T = (): P => [edgeCross(tl, tr, t), 0];
  const R = (): P => [1, edgeCross(tr, br, t)];
  const B = (): P => [edgeCross(bl, br, t), 1];
  const L = (): P => [0, edgeCross(tl, bl, t)];
  switch ((a << 3) | (b << 2) | (c << 1) | d) {
    case 0: case 15: return [];
    case 1:  return [[R(), B()]];
    case 2:  return [[B(), L()]];
    case 3:  return [[L(), R()]];
    case 4:  return [[T(), R()]];
    case 5:  return [[T(), B()]];
    case 6: {
      const m = (tl + tr + bl + br) / 4;
      return m >= t ? [[T(), L()], [R(), B()]] : [[T(), R()], [L(), B()]];
    }
    case 7:  return [[T(), L()]];
    case 8:  return [[T(), L()]];
    case 9: {
      const m = (tl + tr + bl + br) / 4;
      return m >= t ? [[T(), R()], [L(), B()]] : [[T(), L()], [R(), B()]];
    }
    case 10: return [[T(), B()]];
    case 11: return [[T(), R()]];
    case 12: return [[L(), R()]];
    case 13: return [[B(), L()]];
    case 14: return [[R(), B()]];
  }
  return [];
}

export function ContourPlot({
  points,
  xRange,
  yRange,
  height = 200,
  bandwidth = 3.5,
  color = '#006FFF',
  ariaLabel = 'Contour plot',
}: ContourPlotProps) {
  if (!points.length) return null;

  const PW = VW - PAD_L - PAD_R;
  const PH = height - PAD_T - PAD_B;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = xRange?.[0] ?? Math.min(...xs);
  const xMax = xRange?.[1] ?? Math.max(...xs);
  const yMin = yRange?.[0] ?? Math.min(...ys);
  const yMax = yRange?.[1] ?? Math.max(...ys);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const gridPts = points.map((p) => ({
    gx: ((p.x - xMin) / xSpan) * GW,
    gy: (1 - (p.y - yMin) / ySpan) * GH,
  }));
  const grid = buildGrid(gridPts, bandwidth);

  const cellW = PW / GW;
  const cellH = PH / GH;
  const svgX = (col: number, lx: number) => PAD_L + (col + lx) * cellW;
  const svgY = (row: number, ly: number) => PAD_T + (row + ly) * cellH;

  const tyY = (v: number) => PAD_T + (1 - (v - yMin) / ySpan) * PH;
  const txX = (v: number) => PAD_L + ((v - xMin) / xSpan) * PW;
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];
  const xTicks = [xMin, (xMin + xMax) / 2, xMax];

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
            <line x1={PAD_L} y1={tyY(v)} x2={PAD_L + PW} y2={tyY(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD_L - 4} y={tyY(v) + 3} fill="#6E7079" fontSize={8}
              textAnchor="end" fontFamily="inherit">{Math.round(v)}</text>
          </g>
        ))}

        {points.map((p, i) => (
          <circle
            key={i}
            cx={PAD_L + ((p.x - xMin) / xSpan) * PW}
            cy={PAD_T + (1 - (p.y - yMin) / ySpan) * PH}
            r={1.5}
            fill={color}
            opacity={0.2}
          />
        ))}

        {LEVELS.map((t, li) => {
          const opacity = 0.28 + li * 0.18;
          const sw = 0.55 + li * 0.28;
          const lines: Array<{ key: string; x1: number; y1: number; x2: number; y2: number }> = [];
          for (let r = 0; r < GH; r++) {
            for (let col = 0; col < GW; col++) {
              const segs = marchCell(
                grid[r][col], grid[r][col + 1],
                grid[r + 1][col], grid[r + 1][col + 1], t
              );
              segs.forEach(([[lx0, ly0], [lx1, ly1]], si) => {
                lines.push({
                  key: `${r}-${col}-${si}`,
                  x1: svgX(col, lx0), y1: svgY(r, ly0),
                  x2: svgX(col, lx1), y2: svgY(r, ly1),
                });
              });
            }
          }
          return lines.map((s) => (
            <line key={`${li}-${s.key}`}
              x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={color} strokeWidth={sw} opacity={opacity}
              strokeLinecap="round"
            />
          ));
        })}

        {xTicks.map((v, i) => (
          <text key={i} x={txX(v)} y={height - 4} fill="#6E7079" fontSize={8}
            textAnchor="middle" fontFamily="inherit">{Math.round(v)}</text>
        ))}
      </svg>
    </div>
  );
}
