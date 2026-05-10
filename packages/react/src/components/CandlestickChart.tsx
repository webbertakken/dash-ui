export interface CandlestickBar {
  label: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface CandlestickChartProps {
  bars: CandlestickBar[];
  yRange?: [number, number];
  height?: number;
  unit?: string;
  upColor?: string;
  downColor?: string;
  ariaLabel?: string;
}

const VW = 340;
const PAD_L = 28;
const PAD_R = 8;
const PAD_T = 8;
const PAD_B = 20;
const PLOT_W = VW - PAD_L - PAD_R;

export function CandlestickChart({
  bars,
  yRange,
  height = 180,
  unit = '',
  upColor = '#00C875',
  downColor = '#FF7B7B',
  ariaLabel = 'Candlestick chart',
}: CandlestickChartProps) {
  if (!bars.length) return null;

  const n = bars.length;
  const PLOT_H = height - PAD_T - PAD_B;

  const allVals = bars.flatMap((b) => [b.low, b.high]);
  const minV = yRange ? yRange[0] : Math.min(...allVals);
  const maxV = yRange ? yRange[1] : Math.max(...allVals);
  const range = maxV - minV || 1;

  const tx = (i: number) => PAD_L + ((i + 0.5) / n) * PLOT_W;
  const ty = (v: number) => PAD_T + (1 - (v - minV) / range) * PLOT_H;

  const candleW = Math.max(4, (PLOT_W / n) * 0.5);
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

        {bars.map((b, i) => {
          const x = tx(i);
          const color = b.close >= b.open ? upColor : downColor;
          const bodyTop = ty(Math.max(b.open, b.close));
          const bodyBot = ty(Math.min(b.open, b.close));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          return (
            <g key={i}>
              <line x1={x} y1={ty(b.high)} x2={x} y2={ty(b.low)} stroke={color} strokeWidth={1} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} />
            </g>
          );
        })}

        {bars.map((b, i) => (
          <text
            key={i}
            x={tx(i)}
            y={height - 4}
            fill="#6E7079"
            fontSize={9}
            textAnchor="middle"
            fontFamily="inherit"
          >
            {b.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
