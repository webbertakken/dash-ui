import { useState, useRef, useLayoutEffect, type ReactNode } from 'react';

export interface SpoilerProps {
  children: ReactNode;
  maxHeight?: number;
  showLabel?: string;
  hideLabel?: string;
  className?: string;
}

export function Spoiler({
  children,
  maxHeight = 80,
  showLabel = 'Show more',
  hideLabel = 'Show less',
  className,
}: SpoilerProps) {
  const [expanded, setExpanded] = useState(false);
  const [clipped, setClipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setClipped(el.scrollHeight > maxHeight);
  }, [maxHeight]);

  return (
    <div className={`spoiler${className ? ' ' + className : ''}`}>
      <div className="spoiler-outer" style={{ position: 'relative' }}>
        <div
          ref={ref}
          style={!expanded && clipped ? { maxHeight, overflow: 'hidden' } : undefined}
        >
          {children}
        </div>
        {!expanded && clipped && <div className="spoiler-fade" aria-hidden="true" />}
      </div>
      {clipped && (
        <button
          type="button"
          className="spoiler-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? hideLabel : showLabel}
        </button>
      )}
    </div>
  );
}
