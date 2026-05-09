import type { CSSProperties } from 'react';

export interface StatusIndicatorProps {
  color: string;
  text: string;
  textColor?: string;
}

export function StatusIndicator({ color, text, textColor }: StatusIndicatorProps) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: textColor ?? color,
    fontSize: 12,
  };
  return (
    <span style={style}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {text}
    </span>
  );
}
