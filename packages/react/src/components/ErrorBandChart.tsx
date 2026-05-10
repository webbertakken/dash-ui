export interface ErrorBandSeries {
  label: string;
  color: string;
  mean: number[];
  lower: number[];
  upper: number[];
}

export interface ErrorBandChartProps {
  series: ErrorBandSeries[];
  xLabels?: string[];
  yRange?: [number, number];
  height?: number;
  unit?: string;
  ariaLabel?: string;
}

const VW = 340;
const PAD_L = 28;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 20;
const PLOT_W = VW - PAD_L - PAD_R;

export function ErrorBandChart({
  series,
  xLabels = [],
  yRange,
  height = 180,
  unit = '',
  ariaLabel = 'Error band chart',
}: ErrorBandChartProps) {
  if (!series.length || !series[0].mean.length) return null;

  const n = series[0].mean.length;
  const PLOT_H = height - PAD_T - PAD_B;

  const allVals = series.flatMap((s) => [...s.lower, ...s.upper]);
  const minV = yRange ? yRange[0] : Math.min(...allVals);
  const maxV = yRange ? yRange[1] : Math.max(...allVals);
  const range = maxV - minV || 1;

  const tx = (i: number) => PAD_L + (i / (n - 1 || 1)) * PLOT_W;
  const ty = (v: number) => PAD_T + (1 - (v - minV) / range) * PLOT_H;

  const bandPath = (lower: number[], upper: number[]) => {
    const top = upper.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
    const bot = [...lower].reverse().map((v, i) => `L${tx(n - 1 - i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');
    return `${top} ${bot} Z`;
  };

  const linePath = (mean: number[]) =>
    mean.map((v, i) => `${i === 0 ? 'M' : 'L'}${tx(i).toFixed(1)},${ty(v).toFixed(1)}`).join(' ');

  const yTicks = [minV, (minV + maxV) / 2, maxV];

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
              x1={PAD_L}
              y1={ty(v)}
              x2={PAD_L + PLOT_W}
              y2={ty(v)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 4}
              y={ty(v) + 4}
              fill="#6E7079"
              fontSize={8}
              textAnchor="end"
              fontFamily="inherit"
            >
              {Math.round(v)}{unit}
            </text>
          </g>
        ))}

        {series.map((s, si) => (
          <g key={si}>
            <path d={bandPath(s.lower, s.upper)} fill={s.color} opacity={0.12} />
            <path
              d={linePath(s.mean)}
              fill="none"
              stroke={s.color}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        ))}

        {xLabels.map((lbl, i) => (
          <text
            key={i}
            x={PAD_L + (i / (xLabels.length - 1 || 1)) * PLOT_W}
            y={height - 4}
            fill="#6E7079"
            fontSize={9}
            textAnchor="middle"
            fontFamily="inherit"
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
