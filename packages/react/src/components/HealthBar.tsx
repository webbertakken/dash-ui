import type { CSSProperties } from 'react';

export interface HealthBarProps {
  value: number;
  fillStyle?: CSSProperties;
}

export function HealthBar({ value, fillStyle }: HealthBarProps) {
  return (
    <div className="hb">
      <div
        className="hb-fill"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, ...fillStyle }}
      />
    </div>
  );
}
