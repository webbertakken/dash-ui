import { useMemo } from 'react';

export interface StripeItem {
  label: string;
  value: number;
}

export interface StripeChartProps {
  data: StripeItem[];
  height?: number;
  colorLow?: string;
  colorHigh?: string;
  ariaLabel?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

function interpColor(low: string, high: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(low);
  const [r2, g2, b2] = hexToRgb(high);
  return `rgb(${lerp(r1, r2, t)},${lerp(g1, g2, t)},${lerp(b1, b2, t)})`;
}

const VW = 400;

export function StripeChart({
  data,
  height = 48,
  colorLow = '#0A2840',
  colorHigh = '#FF4040',
  ariaLabel = 'Stripe chart',
}: StripeChartProps) {
  const stripes = useMemo(() => {
    if (!data.length) return [];
    const vals = data.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const sw = VW / data.length;
    return data.map((d, i) => ({
      x: i * sw,
      w: sw,
      color: interpColor(colorLow, colorHigh, (d.value - min) / range),
      label: d.label,
      value: d.value,
    }));
  }, [data, colorLow, colorHigh]);

  return (
    <div role="img" aria-label={ariaLabel} style={{ lineHeight: 0 }}>
      <svg
        viewBox={`0 0 ${VW} ${height}`}
        width="100%"
        height={height}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      >
        {stripes.map((s, i) => (
          <g key={i}>
            <rect x={s.x} y={0} width={s.w} height={height} fill={s.color} />
            <title>{`${s.label}: ${s.value}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
