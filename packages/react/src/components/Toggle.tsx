import type { ReactNode } from 'react';

export interface ToggleProps {
  on: boolean;
  onToggle?: () => void;
  ariaLabel?: string;
}

export function Toggle({ on, onToggle, ariaLabel }: ToggleProps) {
  return (
    <span
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle?.();
        }
      }}
      className={`toggle-track ${on ? 'on' : 'off'}`}
    >
      <span className="knob" />
    </span>
  );
}

export interface RowToggleProps {
  title: string;
  description: string;
  on: boolean;
  onToggle?: () => void;
}

export function RowToggle({ title, description, on, onToggle }: RowToggleProps) {
  return (
    <div className="row-toggle">
      <div className="info">
        <div className="t">{title}</div>
        <div className="d">{description}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} ariaLabel={title} />
    </div>
  );
}

export interface RowToggleListProps {
  items: { title: string; description: string }[];
  state: Record<string, boolean>;
  onToggle: (title: string) => void;
}

export function RowToggleList({ items, state, onToggle }: RowToggleListProps) {
  return (
    <>
      {items.map((it) => (
        <RowToggle
          key={it.title}
          title={it.title}
          description={it.description}
          on={!!state[it.title]}
          onToggle={() => onToggle(it.title)}
        />
      ))}
    </>
  );
}
