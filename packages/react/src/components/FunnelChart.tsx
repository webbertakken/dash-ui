import { useMemo } from 'react';

export interface FunnelSegment {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  segments: FunnelSegment[];
  height?: number;
  ariaLabel?: string;
}

const VW = 320;
const PAD = { t: 4, r: 8, b: 4, l: 8 };
const SEP = 2;
const DEFAULT_COLORS = ['#006FFF', '#0092FF', '#00B4C2', '#00C875', '#F5A623'];

export function FunnelChart({ segments, height = 160, ariaLabel = 'Funnel chart' }: FunnelChartProps) {
  const shapes = useMemo(() => {
    if (!segments.length) return [];
    const maxVal = Math.max(...segments.map((s) => s.value));
    const n = segments.length;
    const chartH = height - PAD.t - PAD.b;
    const slotH = (chartH - SEP * (n - 1)) / n;
    const chartW = VW - PAD.l - PAD.r;
    const cx = PAD.l + chartW / 2;
    const widths = segments.map((s) => (s.value / (maxVal || 1)) * chartW);

    return segments.map((s, i) => {
      const tw = widths[i];
      const bw = i + 1 < n ? widths[i + 1] : widths[i] * 0.7;
      const y0 = PAD.t + i * (slotH + SEP);
      const y1 = y0 + slotH;
      return {
        points: `${(cx - tw / 2).toFixed(1)},${y0.toFixed(1)} ${(cx + tw / 2).toFixed(1)},${y0.toFixed(1)} ${(cx + bw / 2).toFixed(1)},${y1.toFixed(1)} ${(cx - bw / 2).toFixed(1)},${y1.toFixed(1)}`,
        color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        label: s.label,
        value: s.value,
        cx: cx.toFixed(1),
        cy: ((y0 + y1) / 2).toFixed(1),
      };
    });
  }, [segments, height]);

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {shapes.map((s, i) => (
          <g key={i}>
            <polygon points={s.points} fill={s.color} fillOpacity={0.75} />
            <text
              x={s.cx}
              y={s.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.9)"
              fontSize={10}
              fontFamily="inherit"
              fontWeight={500}
            >
              {s.label} · {s.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
