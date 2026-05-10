import { useMemo } from 'react';

export interface BarChartSeries {
  label: string;
  color: string;
  values: number[];
}

export interface BarChartProps {
  series: BarChartSeries[];
  labels?: string[];
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 12, r: 8, b: 28, l: 8 };

export function BarChart({ series, labels = [], height = 160, ariaLabel = 'Bar chart' }: BarChartProps) {
  const { bars, gridLines, groupW } = useMemo(() => {
    if (!series.length || !series[0].values.length) return { bars: [], gridLines: [], groupW: 0 };
    const n = series[0].values.length;
    const m = series.length;
    const maxV = Math.max(...series.flatMap((s) => s.values)) || 1;
    const chartW = VW - PAD.l - PAD.r;
    const chartH = height - PAD.t - PAD.b;
    const bot = PAD.t + chartH;
    const gw = chartW / n;
    const gap = gw * 0.15;
    const barW = (gw - gap * (m + 1)) / m;
    const gridLines = [0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);
    const bars = series.flatMap((s, si) =>
      s.values.map((v, gi) => {
        const x = PAD.l + gi * gw + gap * (si + 1) + barW * si;
        const bh = (v / maxV) * chartH;
        return { x: x.toFixed(1), y: (bot - bh).toFixed(1), w: Math.max(barW, 1).toFixed(1), h: bh.toFixed(1), color: s.color, key: `${si}-${gi}` };
      }),
    );
    return { bars, gridLines, groupW: gw };
  }, [series, height]);

  const chartW = VW - PAD.l - PAD.r;
  const n = series[0]?.values.length ?? 0;
  const gw = n > 0 ? chartW / n : chartW;
  const effectiveGroupW = groupW || gw;

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
        {bars.map((b) => (
          <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} fillOpacity={0.9} rx={2} />
        ))}
        {labels.map((lbl, i) => (
          <text
            key={i}
            x={(PAD.l + (i + 0.5) * effectiveGroupW).toFixed(1)}
            y={height - 4}
            textAnchor="middle"
            fill="#6E7079"
            fontSize={9}
            fontFamily="inherit"
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
