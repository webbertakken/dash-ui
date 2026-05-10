import { useId, useRef, useState, type ReactNode } from 'react';

export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface HoverCardProps {
  content: ReactNode;
  children: ReactNode;
  placement?: HoverCardPlacement;
  delay?: number;
  className?: string;
}

export function HoverCard({
  content,
  children,
  placement = 'bottom',
  delay = 300,
  className = '',
}: HoverCardProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <div
      className={`hovercard-wrapper hovercard-${placement} ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <div className="hovercard-trigger" aria-describedby={open ? id : undefined}>
        {children}
      </div>
      {open && (
        <div id={id} role="tooltip" className="hovercard">
          {content}
        </div>
      )}
    </div>
  );
}
