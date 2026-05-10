import { useState, useId } from 'react';

export type GroupedListItemStatus = 'danger' | 'warn' | 'success' | 'info' | 'neutral';

export interface GroupedListItem {
  label: string;
  sublabel?: string;
  meta?: string;
  status?: GroupedListItemStatus;
}

export interface GroupedListGroup {
  label: string;
  items: GroupedListItem[];
  defaultOpen?: boolean;
  color?: string;
}

export interface GroupedListProps {
  groups: GroupedListGroup[];
  collapsible?: boolean;
  ariaLabel?: string;
}

const STATUS_COLORS: Record<GroupedListItemStatus, string> = {
  danger: '#F03A3A',
  warn: '#F5A623',
  success: '#00B070',
  info: '#006FFF',
  neutral: '#6E7079',
};

export function GroupedList({ groups, collapsible = true, ariaLabel = 'Grouped list' }: GroupedListProps) {
  const uid = useId();
  const [open, setOpen] = useState<boolean[]>(() => groups.map(g => g.defaultOpen !== false));

  function toggle(i: number) {
    setOpen(prev => prev.map((v, j) => (j === i ? !v : v)));
  }

  return (
    <div className="gl" aria-label={ariaLabel}>
      {groups.map((group, gi) => {
        const isOpen = open[gi];
        const panelId = `${uid}-gl-${gi}`;
        return (
          <div key={gi} className="gl-group">
            {collapsible ? (
              <button
                type="button"
                className="gl-header"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(gi)}
              >
                {group.color && <span className="gl-color-dot" style={{ background: group.color }} aria-hidden="true" />}
                <span className="gl-title">{group.label}</span>
                <span className="gl-count">{group.items.length}</span>
                <svg
                  className={`gl-chevron${isOpen ? ' gl-chevron--open' : ''}`}
                  width="12" height="12" viewBox="0 0 12 12"
                  aria-hidden="true" focusable={false}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <div className="gl-header gl-header--static">
                {group.color && <span className="gl-color-dot" style={{ background: group.color }} aria-hidden="true" />}
                <span className="gl-title">{group.label}</span>
                <span className="gl-count">{group.items.length}</span>
              </div>
            )}
            {(!collapsible || isOpen) && (
              <ul id={panelId} className="gl-items" role="list">
                {group.items.map((item, ii) => (
                  <li key={ii} className="gl-item">
                    {item.status && (
                      <span
                        className="gl-item-dot"
                        style={{ background: STATUS_COLORS[item.status] }}
                        aria-label={item.status}
                      />
                    )}
                    <div className="gl-item-body">
                      <div className="gl-item-label">{item.label}</div>
                      {item.sublabel && <div className="gl-item-sublabel">{item.sublabel}</div>}
                    </div>
                    {item.meta && <span className="gl-item-meta">{item.meta}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
