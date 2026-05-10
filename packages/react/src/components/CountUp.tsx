import { useState, useEffect, useRef } from 'react';

export interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function fmt(n: number, decimals: number, separator: string): string {
  const fixed = n.toFixed(decimals);
  if (!separator) return fixed;
  const [int, dec] = fixed.split('.');
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return dec !== undefined ? `${intFmt}.${dec}` : intFmt;
}

export function CountUp({
  from = 0,
  to,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className,
}: CountUpProps) {
  const [current, setCurrent] = useState(from);
  const rafRef = useRef<number>(0);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) {
      setCurrent(to);
      return;
    }
    const t0 = performance.now();
    const range = to - from;
    function tick(now: number) {
      const t = Math.min((now - t0) / duration, 1);
      setCurrent(from + range * easeOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [from, to, duration, reduced]);

  const display = fmt(current, decimals, separator);
  const label = `${prefix}${fmt(to, decimals, separator)}${suffix}`;

  return (
    <span className={className}>
      <span aria-hidden="true">{prefix}{display}{suffix}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
