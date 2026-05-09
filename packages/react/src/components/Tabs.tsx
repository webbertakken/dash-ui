import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  badge?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  active: string;
  onChange?: (id: string) => void;
}

export function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {items.map((t) => (
        <div
          key={t.id}
          className={`tab ${t.id === active ? 'active' : ''}`}
          onClick={() => onChange?.(t.id)}
        >
          {t.label}
          {t.badge !== undefined && <span className="badge">{t.badge}</span>}
        </div>
      ))}
    </div>
  );
}
