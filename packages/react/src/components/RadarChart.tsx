import { useMemo } from 'react';

export interface RadarSeries {
  label: string;
  color: string;
  values: number[]; // each normalised 0–1
}

export interface RadarChartProps {
  series: RadarSeries[];
  axes: string[];
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = 36;

function pt(cx: number, cy: number, r: number, angle: number) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

function pts(coords: readonly (readonly [number, number])[]) {
  return coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export function RadarChart({ series, axes, height = 200, ariaLabel = 'Radar chart' }: RadarChartProps) {
  const { rings, axisLines, axisLabels, polygons } = useMemo(() => {
    const n = axes.length;
    if (n < 3) return { rings: [], axisLines: [], axisLabels: [], polygons: [] };

    const cx = VW / 2;
    const cy = height / 2;
    const R = Math.min(cx, cy) - PAD;
    const angles = axes.map((_, i) => (2 * Math.PI * i) / n - Math.PI / 2);

    const rings = [0.25, 0.5, 0.75, 1.0].map((f) =>
      pts(angles.map((a) => pt(cx, cy, R * f, a))),
    );

    const axisLines = angles.map((a) => {
      const [x, y] = pt(cx, cy, R, a);
      return { x: x.toFixed(1), y: y.toFixed(1) };
    });

    const axisLabels = axes.map((label, i) => {
      const [x, y] = pt(cx, cy, R + 16, angles[i]);
      const cos = Math.cos(angles[i]);
      const anchor: 'middle' | 'end' | 'start' = Math.abs(cos) < 0.3 ? 'middle' : cos < 0 ? 'end' : 'start';
      return { x: x.toFixed(1), y: y.toFixed(1), label, anchor };
    });

    const polygons = series.map((s) => ({
      pts: pts(angles.map((a, i) => pt(cx, cy, R * Math.max(0, Math.min(1, s.values[i] ?? 0)), a))),
      color: s.color,
      label: s.label,
    }));

    return { rings, axisLines, axisLabels, polygons };
  }, [series, axes, height]);

  const cx = VW / 2;
  const cy = height / 2;

  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        aria-hidden="true"
        focusable="false"
      >
        {rings.map((p, i) => (
          <polygon key={i} points={p} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        {axisLines.map((end, i) => (
          <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        {polygons.map((p) => (
          <polygon
            key={p.label}
            points={p.pts}
            fill={p.color}
            fillOpacity={0.12}
            stroke={p.color}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ))}
        {axisLabels.map((l) => (
          <text
            key={l.label}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            fill="#6E7079"
            fontSize={9}
            fontFamily="inherit"
            dominantBaseline="middle"
          >
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
