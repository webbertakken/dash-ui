import { useMemo } from 'react';

export interface StackedBarSeries {
  label: string;
  color: string;
  values: number[];
}

export interface StackedBarChartProps {
  series: StackedBarSeries[];
  labels?: string[];
  height?: number;
  normalized?: boolean;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 10, r: 8, b: 28, l: 36 };

export function StackedBarChart({
  series,
  labels = [],
  height = 180,
  normalized = false,
  ariaLabel = 'Stacked bar chart',
}: StackedBarChartProps) {
  const { stacks, gridLines, xLabels, yTicks } = useMemo(() => {
    if (!series.length || !series[0].values.length) {
      return { stacks: [], gridLines: [], xLabels: [], yTicks: [] };
    }
    const n = series[0].values.length;
    const chartW = VW - PAD.l - PAD.r;
    const chartH = height - PAD.t - PAD.b;
    const bot = PAD.t + chartH;

    const totals = Array.from({ length: n }, (_, i) =>
      series.reduce((s, ser) => s + (ser.values[i] ?? 0), 0)
    );
    const maxTotal = normalized ? 1 : Math.max(...totals) || 1;

    const barW = (chartW / n) * 0.72;
    const gap = (chartW / n) * 0.28;

    const stacks = Array.from({ length: n }, (_, gi) => {
      let y = bot;
      const total = totals[gi] || 1;
      return series.map((ser) => {
        const raw = ser.values[gi] ?? 0;
        const v = normalized ? raw / total : raw;
        const bh = (v / maxTotal) * chartH;
        const rect = {
          x: PAD.l + gi * (barW + gap) + gap / 2,
          y: y - bh,
          w: barW,
          h: bh,
          color: ser.color,
          key: `${gi}-${ser.label}`,
        };
        y -= bh;
        return rect;
      });
    });

    const gridFracs = [0.25, 0.5, 0.75, 1];
    const gridLines = gridFracs.map((f) => ({
      y: PAD.t + (1 - f) * chartH,
      label: normalized
        ? `${Math.round(f * 100)}%`
        : String(Math.round(f * maxTotal)),
    }));

    const xLabels = Array.from({ length: n }, (_, i) => ({
      x: PAD.l + i * (barW + gap) + gap / 2 + barW / 2,
      text: labels[i] ?? String(i),
    }));

    const yTicks = gridLines.map((g) => g);

    return { stacks, gridLines, xLabels, yTicks };
  }, [series, labels, height, normalized]);

  if (!stacks.length) return null;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.l} y1={g.y} x2={VW - PAD.r} y2={g.y}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1}
            />
            <text
              x={PAD.l - 4} y={g.y + 3}
              fill="#6E7079" fontSize={8} textAnchor="end" fontFamily="inherit"
            >
              {g.label}
            </text>
          </g>
        ))}

        {stacks.map((rects) =>
          rects.map((r) =>
            r.h > 0 ? (
              <rect
                key={r.key}
                x={r.x.toFixed(1)} y={r.y.toFixed(1)}
                width={r.w.toFixed(1)} height={r.h.toFixed(1)}
                fill={r.color} fillOpacity={0.9}
              />
            ) : null
          )
        )}

        {xLabels.map((l, i) => (
          <text
            key={i} x={l.x.toFixed(1)} y={height - 6}
            fill="#6E7079" fontSize={8} textAnchor="middle" fontFamily="inherit"
          >
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
