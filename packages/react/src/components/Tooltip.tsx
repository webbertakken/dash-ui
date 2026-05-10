import type { ReactNode } from 'react';
import { useId } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  label: string;
  children: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
}

export function Tooltip({ label, children, placement = 'top', className = '' }: TooltipProps) {
  const id = useId();
  return (
    <span className={`tooltip-wrapper tooltip-${placement} ${className}`.trim()}>
      <span className="tooltip-trigger" aria-describedby={id}>{children}</span>
      <span id={id} role="tooltip" className="tooltip-content">{label}</span>
    </span>
  );
}
