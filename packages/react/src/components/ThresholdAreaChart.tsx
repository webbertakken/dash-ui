import { useId } from 'react';

export interface ThresholdAreaChartProps {
  values: number[];
  labels?: string[];
  threshold: number;
  thresholdLabel?: string;
  belowColor?: string;
  aboveColor?: string;
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 16, r: 8, b: 28, l: 8 };

export function ThresholdAreaChart({
  values,
  labels = [],
  threshold,
  thresholdLabel,
  belowColor = '#00C875',
  aboveColor = '#FF7B7B',
  height = 160,
  ariaLabel = 'Threshold area chart',
}: ThresholdAreaChartProps) {
  const uid = useId();
  const n = values.length;
  if (!n) return null;

  const chartW = VW - PAD.l - PAD.r;
  const chartH = height - PAD.t - PAD.b;
  const maxV = Math.max(...values, threshold, 1);

  const toX = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const toY = (v: number) => PAD.t + chartH - (v / maxV) * chartH;

  const threshY = toY(threshold);
  const baseY = PAD.t + chartH;
  const pts = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
  const d = `M ${pts.join(' L ')} L ${toX(n - 1).toFixed(1)},${baseY} L ${toX(0).toFixed(1)},${baseY} Z`;
  const tLabel = thresholdLabel ?? String(threshold);

  const belowId = `${uid}b`;
  const aboveId = `${uid}a`;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={belowId}>
            <rect x={0} y={threshY} width={VW} height={height - threshY} />
          </clipPath>
          <clipPath id={aboveId}>
            <rect x={0} y={0} width={VW} height={threshY} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f, i) => (
          <line
            key={i}
            x1={PAD.l} y1={PAD.t + (1 - f) * chartH}
            x2={VW - PAD.r} y2={PAD.t + (1 - f) * chartH}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        <path d={d} fill={belowColor} fillOpacity={0.7} clipPath={`url(#${belowId})`} />
        <path d={d} fill={aboveColor} fillOpacity={0.7} clipPath={`url(#${aboveId})`} />
        <line
          x1={PAD.l} y1={threshY}
          x2={VW - PAD.r} y2={threshY}
          stroke={aboveColor}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.8}
        />
        <text
          x={VW - PAD.r - 2} y={threshY - 4}
          fill={aboveColor} fontSize={9} textAnchor="end" fontFamily="inherit" opacity={0.9}
        >
          {tLabel}
        </text>
        {labels.map((lbl, i) => (
          <text
            key={i} x={toX(i)} y={height - 4}
            textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit"
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
