import { useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  badge?: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  active: string;
  children?: ReactNode;
}

export function TabPanel({ id, active, children, ...rest }: TabPanelProps) {
  const isActive = id === active;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      tabIndex={0}
      {...rest}
    >
      {isActive ? children : null}
    </div>
  );
}

export interface TabsProps {
  items: TabItem[];
  active: string;
  onChange?: (id: string) => void;
  ariaLabel?: string;
}

export function Tabs({ items, active, onChange, ariaLabel }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusAt = (idx: number) => {
    const next = items[(idx + items.length) % items.length];
    if (!next) return;
    onChange?.(next.id);
    refs.current[(idx + items.length) % items.length]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); focusAt(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
    else if (e.key === 'End') { e.preventDefault(); focusAt(items.length - 1); }
  };

  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel}>
      {items.map((t, i) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`tabpanel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            className={`tab ${selected ? 'active' : ''}`}
            onClick={() => onChange?.(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
            {t.badge !== undefined && <span className="badge">{t.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
