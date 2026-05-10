import { useMemo } from 'react';

export interface CdfSeries {
  label: string;
  color: string;
  values: number[];
}

export interface CumulativeDistributionProps {
  series: CdfSeries[];
  guides?: number[];
  height?: number;
  unit?: string;
  ariaLabel?: string;
}

const W = 400;
const PL = 38;
const PR = 12;
const PT = 14;
const PB = 28;

export function CumulativeDistribution({
  series,
  guides = [50, 95],
  height = 160,
  unit = '',
  ariaLabel = 'Cumulative distribution chart',
}: CumulativeDistributionProps) {
  const layout = useMemo(() => {
    const allVals = series.flatMap((s) => s.values);
    if (!allVals.length) return null;

    const xMin = Math.min(...allVals);
    const xMax = Math.max(...allVals);
    const xRange = xMax - xMin || 1;
    const cW = W - PL - PR;
    const cH = height - PT - PB;

    const toX = (v: number) => PL + ((v - xMin) / xRange) * cW;
    const toY = (p: number) => PT + (1 - p) * cH;

    const paths = series.map((s) => {
      const sorted = [...s.values].sort((a, b) => a - b);
      const n = sorted.length;
      let d = `M${toX(xMin).toFixed(1)},${toY(0).toFixed(1)}`;
      sorted.forEach((v, i) => {
        d += ` H${toX(v).toFixed(1)} V${toY((i + 1) / n).toFixed(1)}`;
      });
      d += ` H${toX(xMax).toFixed(1)}`;
      return { label: s.label, color: s.color, d };
    });

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => ({ y: toY(p), label: `${Math.round(p * 100)}%` }));

    const step = xRange / 4;
    const xTicks = Array.from({ length: 5 }, (_, i) => {
      const v = xMin + step * i;
      return { x: toX(v), label: `${Math.round(v)}${unit}` };
    });

    const guideLines = guides.map((g) => ({ p: g, y: toY(g / 100) }));

    return { paths, yTicks, xTicks, guideLines };
  }, [series, guides, height, unit]);

  if (!layout) return null;
  const { paths, yTicks, xTicks, guideLines } = layout;

  return (
    <div role="img" aria-label={ariaLabel} style={{ lineHeight: 0 }}>
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} aria-hidden="true" focusable="false">
        {yTicks.map((t) => (
          <line key={t.label} x1={PL} x2={W - PR} y1={t.y} y2={t.y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        {guideLines.map((g) => (
          <g key={g.p}>
            <line x1={PL} x2={W - PR} y1={g.y} y2={g.y} stroke="rgba(255,255,255,0.18)" strokeWidth={1} strokeDasharray="4 3" />
            <text x={W - PR - 2} y={g.y - 3} textAnchor="end" fill="#6E7079" fontSize={9} fontFamily="inherit">p{g.p}</text>
          </g>
        ))}
        {paths.map((s) => (
          <path key={s.label} d={s.d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
        ))}
        {yTicks.map((t) => (
          <text key={t.label} x={PL - 4} y={t.y + 4} textAnchor="end" fill="#6E7079" fontSize={9} fontFamily="inherit">{t.label}</text>
        ))}
        {xTicks.map((t, i) => (
          <text key={i} x={t.x} y={height - PB + 14} textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit">{t.label}</text>
        ))}
      </svg>
    </div>
  );
}
