import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react';

export type ResizableOrientation = 'horizontal' | 'vertical';

export interface ResizablePanelProps {
  defaultSize?: number;
  min?: number;
  max?: number;
  orientation?: ResizableOrientation;
  label?: string;
  className?: string;
  style?: CSSProperties;
  children: [ReactNode, ReactNode];
}

export function ResizablePanel({
  defaultSize = 50,
  min = 20,
  max = 80,
  orientation = 'vertical',
  label = 'Resize panels',
  className,
  style,
  children,
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;

    const onMove = (me: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = orientation === 'vertical'
        ? ((me.clientX - rect.left) / rect.width) * 100
        : ((me.clientY - rect.top) / rect.height) * 100;
      setSize(clamp(Math.round(pct)));
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [orientation, clamp]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    if (orientation === 'vertical') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setSize(s => clamp(s - step)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setSize(s => clamp(s + step)); }
    } else {
      if (e.key === 'ArrowUp') { e.preventDefault(); setSize(s => clamp(s - step)); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSize(s => clamp(s + step)); }
    }
    if (e.key === 'Home') { e.preventDefault(); setSize(min); }
    if (e.key === 'End') { e.preventDefault(); setSize(max); }
  }, [orientation, min, max, clamp]);

  const firstStyle = orientation === 'vertical'
    ? { flex: `0 0 ${size}%`, minWidth: 0 }
    : { flex: `0 0 ${size}%`, minHeight: 0 };

  return (
    <div ref={containerRef} className={['rp', `rp--${orientation}`, className].filter(Boolean).join(' ')} style={style}>
      <div className="rp-pane" style={firstStyle}>
        {children[0]}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={orientation}
        aria-valuenow={size}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="rp-handle"
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
      />
      <div className="rp-pane rp-pane--second">
        {children[1]}
      </div>
    </div>
  );
}
