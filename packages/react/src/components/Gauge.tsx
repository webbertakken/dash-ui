export interface GaugeProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
  ariaLabel?: string;
}

export function Gauge({ value, label, color = '#006FFF', size = 120, ariaLabel }: GaugeProps) {
  const sw = 10;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - sw / 2 - 2;
  const svgH = Math.round(size * 0.7);
  const pathLen = Math.PI * r;
  const fillLen = (Math.min(100, Math.max(0, value)) / 100) * pathLen;
  const d = `M ${cx - r},${cy} A ${r},${r} 0 1 1 ${cx + r},${cy}`;
  const valY = cy + Math.round(size * 0.06);
  const lblY = valY + Math.round(size * 0.13) + 2;
  const a11yLabel = ariaLabel ?? `${label} ${value}%`;

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={a11yLabel}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg width={size} height={svgH} aria-hidden="true" focusable="false">
        <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="round" />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${fillLen} ${pathLen}`}
        />
        <text
          x={cx}
          y={valY}
          textAnchor="middle"
          fill="#fff"
          fontSize={Math.round(size * 0.2)}
          fontWeight={600}
          fontFamily="inherit"
        >
          {value}%
        </text>
        <text x={cx} y={lblY} textAnchor="middle" fill="#6E7079" fontSize={Math.round(size * 0.1)} fontFamily="inherit">
          {label}
        </text>
      </svg>
    </div>
  );
}
