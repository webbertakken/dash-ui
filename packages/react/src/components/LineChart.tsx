import { useMemo } from 'react';

export interface LineChartSeries {
  label: string;
  color: string;
  values: number[];
}

export interface LineChartProps {
  series: LineChartSeries[];
  labels?: string[];
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 12, r: 8, b: 28, l: 8 };

export function LineChart({ series, labels = [], height = 160, ariaLabel = 'Line chart' }: LineChartProps) {
  const { paths, areas, gridLines } = useMemo(() => {
    const allValues = series.flatMap((s) => s.values);
    if (!allValues.length) return { paths: [], areas: [], gridLines: [] };
    const minV = Math.min(...allValues);
    const maxV = Math.max(...allValues);
    const range = maxV - minV || 1;
    const chartW = VW - PAD.l - PAD.r;
    const chartH = height - PAD.t - PAD.b;
    const n = series[0]?.values.length ?? 0;

    const toX = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
    const toY = (v: number) => PAD.t + chartH - ((v - minV) / range) * chartH;

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);

    const paths = series.map((s) => {
      const pts = s.values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
      return { color: s.color, label: s.label, d: `M ${pts.join(' L ')}` };
    });

    const areas = series.map((s) => {
      const pts = s.values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
      const bot = (PAD.t + chartH).toFixed(1);
      return {
        color: s.color,
        label: s.label,
        d: `M ${toX(0).toFixed(1)},${bot} L ${pts.join(' L ')} L ${toX(n - 1).toFixed(1)},${bot} Z`,
      };
    });

    return { paths, areas, gridLines };
  }, [series, height]);

  const chartW = VW - PAD.l - PAD.r;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {gridLines.map((y, i) => (
          <line key={i} x1={PAD.l} y1={y} x2={VW - PAD.r} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        {areas.map((s) => (
          <path key={s.label} d={s.d} fill={s.color} fillOpacity={0.1} />
        ))}
        {paths.map((s) => (
          <path
            key={s.label}
            d={s.d}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {labels.map((lbl, i) => {
          const x = PAD.l + (labels.length > 1 ? (i / (labels.length - 1)) * chartW : chartW / 2);
          return (
            <text key={i} x={x} y={height - 4} textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit">
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
