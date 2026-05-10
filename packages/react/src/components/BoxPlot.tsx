import { useMemo } from 'react';

export interface BoxSeries {
  label: string;
  q0: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  color?: string;
}

export interface BoxPlotProps {
  series: BoxSeries[];
  yRange?: [number, number];
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 12, r: 8, b: 28, l: 8 };
const DEFAULT_COLOR = '#006FFF';

export function BoxPlot({ series, yRange, height = 160, ariaLabel = 'Box plot' }: BoxPlotProps) {
  const { boxes, gridLines } = useMemo(() => {
    if (!series.length) return { boxes: [], gridLines: [] };
    const allVals = series.flatMap((s) => [s.q0, s.q1, s.q2, s.q3, s.q4]);
    const y0 = yRange?.[0] ?? Math.min(...allVals);
    const y1 = yRange?.[1] ?? Math.max(...allVals);
    const ySpan = y1 - y0 || 1;
    const chartW = VW - PAD.l - PAD.r;
    const chartH = height - PAD.t - PAD.b;
    const n = series.length;
    const slotW = chartW / n;
    const bw = slotW * 0.4;
    const toY = (v: number) => PAD.t + chartH - ((v - y0) / ySpan) * chartH;
    const gridLines = [0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);
    const boxes = series.map((s, i) => {
      const cx = PAD.l + (i + 0.5) * slotW;
      return {
        key: String(i),
        cx: cx.toFixed(1),
        color: s.color ?? DEFAULT_COLOR,
        label: s.label,
        whiskerY0: toY(s.q0).toFixed(1),
        whiskerY4: toY(s.q4).toFixed(1),
        capX0: (cx - bw / 2).toFixed(1),
        capX1: (cx + bw / 2).toFixed(1),
        boxX: (cx - bw / 2).toFixed(1),
        boxW: bw.toFixed(1),
        boxY: toY(s.q3).toFixed(1),
        boxH: (toY(s.q1) - toY(s.q3)).toFixed(1),
        medY: toY(s.q2).toFixed(1),
      };
    });
    return { boxes, gridLines };
  }, [series, yRange, height]);

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
        {boxes.map((b) => (
          <g key={b.key}>
            <line x1={b.cx} y1={b.whiskerY4} x2={b.cx} y2={b.whiskerY0} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <line x1={b.capX0} y1={b.whiskerY0} x2={b.capX1} y2={b.whiskerY0} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <line x1={b.capX0} y1={b.whiskerY4} x2={b.capX1} y2={b.whiskerY4} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.6} />
            <rect x={b.boxX} y={b.boxY} width={b.boxW} height={b.boxH} fill={b.color} fillOpacity={0.2} stroke={b.color} strokeWidth={1.5} strokeOpacity={0.8} rx={2} />
            <line x1={b.capX0} y1={b.medY} x2={b.capX1} y2={b.medY} stroke={b.color} strokeWidth={2.5} />
            <text x={b.cx} y={height - 4} textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit">
              {b.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
