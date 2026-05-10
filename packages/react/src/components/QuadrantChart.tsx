export interface QuadrantPoint {
  x: number;
  y: number;
  label?: string;
  color?: string;
}

export interface QuadrantChartProps {
  points: QuadrantPoint[];
  xThreshold: number;
  yThreshold: number;
  xRange?: [number, number];
  yRange?: [number, number];
  /** Labels: [top-left, top-right, bottom-left, bottom-right] */
  quadrantLabels?: [string, string, string, string];
  /** Fill colors for each quadrant zone */
  quadrantColors?: [string, string, string, string];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  ariaLabel?: string;
}

const VW = 360;
const PAD = { t: 8, r: 8, b: 28, l: 36 };

const DEFAULT_LABELS: [string, string, string, string] = ['', '', '', ''];
const DEFAULT_COLORS: [string, string, string, string] = [
  'rgba(0,200,117,0.06)',
  'rgba(245,166,35,0.07)',
  'rgba(0,111,255,0.06)',
  'rgba(255,123,123,0.09)',
];

export function QuadrantChart({
  points,
  xThreshold,
  yThreshold,
  xRange,
  yRange,
  quadrantLabels = DEFAULT_LABELS,
  quadrantColors = DEFAULT_COLORS,
  xLabel,
  yLabel,
  height = 200,
  ariaLabel = 'Quadrant chart',
}: QuadrantChartProps) {
  if (!points.length) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x0 = xRange?.[0] ?? Math.min(...xs, xThreshold - 1);
  const x1 = xRange?.[1] ?? Math.max(...xs, xThreshold + 1);
  const y0 = yRange?.[0] ?? Math.min(...ys, yThreshold - 1);
  const y1 = yRange?.[1] ?? Math.max(...ys, yThreshold + 1);
  const xSpan = x1 - x0 || 1;
  const ySpan = y1 - y0 || 1;
  const cw = VW - PAD.l - PAD.r;
  const ch = height - PAD.t - PAD.b;

  const toX = (x: number) => PAD.l + ((x - x0) / xSpan) * cw;
  const toY = (y: number) => PAD.t + ch - ((y - y0) / ySpan) * ch;

  const tx = toX(xThreshold);
  const ty = toY(yThreshold);

  const xTicks = [x0, xThreshold, x1];
  const yTicks = [y0, yThreshold, y1];

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {/* Quadrant zones */}
        <rect x={PAD.l} y={PAD.t} width={tx - PAD.l} height={ty - PAD.t} fill={quadrantColors[0]} />
        <rect x={tx} y={PAD.t} width={PAD.l + cw - tx} height={ty - PAD.t} fill={quadrantColors[1]} />
        <rect x={PAD.l} y={ty} width={tx - PAD.l} height={PAD.t + ch - ty} fill={quadrantColors[2]} />
        <rect x={tx} y={ty} width={PAD.l + cw - tx} height={PAD.t + ch - ty} fill={quadrantColors[3]} />

        {/* Grid border */}
        <rect x={PAD.l} y={PAD.t} width={cw} height={ch} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {/* Threshold lines */}
        <line x1={tx} y1={PAD.t} x2={tx} y2={PAD.t + ch} stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={PAD.l} y1={ty} x2={PAD.l + cw} y2={ty} stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="4 3" />

        {/* Quadrant labels */}
        {quadrantLabels[0] && (
          <text x={PAD.l + 5} y={PAD.t + 11} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="inherit">{quadrantLabels[0]}</text>
        )}
        {quadrantLabels[1] && (
          <text x={PAD.l + cw - 5} y={PAD.t + 11} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="inherit" textAnchor="end">{quadrantLabels[1]}</text>
        )}
        {quadrantLabels[2] && (
          <text x={PAD.l + 5} y={PAD.t + ch - 5} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="inherit">{quadrantLabels[2]}</text>
        )}
        {quadrantLabels[3] && (
          <text x={PAD.l + cw - 5} y={PAD.t + ch - 5} fill="rgba(255,255,255,0.22)" fontSize={9} fontFamily="inherit" textAnchor="end">{quadrantLabels[3]}</text>
        )}

        {/* Y-axis ticks */}
        {yTicks.map((v, i) => (
          <text key={i} x={PAD.l - 4} y={toY(v) + 3} fill="#6E7079" fontSize={8} textAnchor="end" fontFamily="inherit">
            {Math.round(v)}
          </text>
        ))}

        {/* X-axis ticks */}
        {xTicks.map((v, i) => (
          <text key={i} x={toX(v)} y={height - 4} fill="#6E7079" fontSize={8} textAnchor="middle" fontFamily="inherit">
            {Math.round(v)}
          </text>
        ))}

        {/* Axis labels */}
        {xLabel && (
          <text x={PAD.l + cw / 2} y={height - 2} fill="#6E7079" fontSize={8} textAnchor="middle" fontFamily="inherit">{xLabel}</text>
        )}
        {yLabel && (
          <text
            x={8}
            y={PAD.t + ch / 2}
            fill="#6E7079"
            fontSize={8}
            textAnchor="middle"
            fontFamily="inherit"
            transform={`rotate(-90, 8, ${PAD.t + ch / 2})`}
          >
            {yLabel}
          </text>
        )}

        {/* Points */}
        {points.map((p, i) => {
          const cx = toX(p.x);
          const cy = toY(p.y);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={5} fill={p.color ?? '#006FFF'} fillOpacity={0.85} />
              {p.label && (
                <text
                  x={cx + 7}
                  y={cy + 3}
                  fill="#CDD0DB"
                  fontSize={8}
                  fontFamily="inherit"
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
