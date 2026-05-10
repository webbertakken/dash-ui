import { useMemo } from 'react';

export interface DualAxisSeries {
  label: string;
  color: string;
  values: number[];
}

export interface DualAxisChartProps {
  bars: DualAxisSeries;
  line: DualAxisSeries;
  labels?: string[];
  height?: number;
  ariaLabel?: string;
}

const VW = 400;
const PAD = { t: 16, r: 44, b: 28, l: 44 };

function fmtTick(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(Math.round(n));
}

export function DualAxisChart({
  bars,
  line,
  labels = [],
  height = 160,
  ariaLabel = 'Dual axis chart',
}: DualAxisChartProps) {
  const { barRects, linePath, lineArea, gridLines, leftTicks, rightTicks } = useMemo(() => {
    const n = bars.values.length;
    if (!n) return { barRects: [], linePath: '', lineArea: '', gridLines: [], leftTicks: [], rightTicks: [] };

    const chartW = VW - PAD.l - PAD.r;
    const chartH = height - PAD.t - PAD.b;
    const bot = PAD.t + chartH;
    const gw = chartW / n;
    const barW = gw * 0.55;

    const barMax = Math.max(...bars.values, 1);
    const lineMin = Math.min(...line.values);
    const lineMax = Math.max(...line.values, lineMin + 1);
    const lineRange = lineMax - lineMin || 1;

    const toBarH = (v: number) => (v / barMax) * chartH;
    const toLineX = (i: number) => PAD.l + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
    const toLineY = (v: number) => PAD.t + chartH - ((v - lineMin) / lineRange) * chartH;

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => PAD.t + (1 - f) * chartH);

    const barRects = bars.values.map((v, i) => ({
      key: i,
      x: (PAD.l + i * gw + gw / 2 - barW / 2).toFixed(1),
      y: (bot - toBarH(v)).toFixed(1),
      w: barW.toFixed(1),
      h: toBarH(v).toFixed(1),
    }));

    const linePts = line.values.map((v, i) => `${toLineX(i).toFixed(1)},${toLineY(v).toFixed(1)}`);
    const linePath = `M ${linePts.join(' L ')}`;
    const lineArea = `M ${toLineX(0).toFixed(1)},${bot} L ${linePts.join(' L ')} L ${toLineX(n - 1).toFixed(1)},${bot} Z`;

    const leftTicks = [0, 0.5, 1].map((f) => ({
      y: PAD.t + (1 - f) * chartH,
      label: fmtTick(barMax * f),
    }));
    const rightTicks = [0, 0.5, 1].map((f) => ({
      y: PAD.t + (1 - f) * chartH,
      label: fmtTick(lineMin + lineRange * f),
    }));

    return { barRects, linePath, lineArea, gridLines, leftTicks, rightTicks };
  }, [bars, line, height]);

  const chartW = VW - PAD.l - PAD.r;
  const n = bars.values.length;
  const gw = n > 0 ? chartW / n : chartW;

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
        {leftTicks.map((t, i) => (
          <text key={i} x={PAD.l - 4} y={t.y + 4} textAnchor="end" fill={bars.color} fontSize={9} fontFamily="inherit" fillOpacity={0.8}>
            {t.label}
          </text>
        ))}
        {rightTicks.map((t, i) => (
          <text key={i} x={VW - PAD.r + 4} y={t.y + 4} textAnchor="start" fill={line.color} fontSize={9} fontFamily="inherit" fillOpacity={0.8}>
            {t.label}
          </text>
        ))}
        {barRects.map((b) => (
          <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} fill={bars.color} fillOpacity={0.75} rx={2} />
        ))}
        <path d={lineArea} fill={line.color} fillOpacity={0.12} />
        <path d={linePath} fill="none" stroke={line.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {labels.map((lbl, i) => (
          <text key={i} x={(PAD.l + (i + 0.5) * gw).toFixed(1)} y={height - 4} textAnchor="middle" fill="#6E7079" fontSize={9} fontFamily="inherit">
            {lbl}
          </text>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 11, color: '#A4A7B5', marginTop: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, background: bars.color, borderRadius: 2, opacity: 0.75 }} />
          {bars.label}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 16, height: 2, background: line.color, borderRadius: 1 }} />
          {line.label}
        </span>
      </div>
    </div>
  );
}
