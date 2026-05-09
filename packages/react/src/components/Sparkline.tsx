import { useMemo } from 'react';

export interface SparklineProps {
  bars?: number;
  active?: boolean;
  seed?: number;
  ariaLabel?: string;
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Sparkline({ bars = 36, active = false, seed = 1, ariaLabel = 'Activity sparkline' }: SparklineProps) {
  const heights = useMemo(() => {
    const out: number[] = [];
    let prev = 12;
    const r = rng(seed);
    for (let i = 0; i < bars; i++) {
      const v = Math.max(4, Math.min(40, prev + (r() * 10 - 5)));
      prev = v;
      out.push(v);
    }
    return out;
  }, [bars, seed]);
  return (
    <div className="spark" role="img" aria-label={ariaLabel}>
      {heights.map((h, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="b"
          style={{
            height: `${h}px`,
            opacity: active ? 0.4 + i / (bars * 1.4) : 0.5 + i / (bars * 1.6),
          }}
        />
      ))}
    </div>
  );
}
