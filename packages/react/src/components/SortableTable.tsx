import { useState, type CSSProperties, type ReactNode } from 'react';

export type SortDir = 'asc' | 'desc';

export function useSortable() {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [dir, setDir] = useState<SortDir>('asc');

  function onSort(key: string) {
    if (sortKey === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setDir('asc'); }
  }

  return { sortKey, dir, onSort };
}

export interface SortHeaderProps {
  sortKey: string;
  activeKey: string | null;
  dir: SortDir;
  onSort: (key: string) => void;
  children: ReactNode;
  style?: CSSProperties;
}

export function SortHeader({ sortKey, activeKey, dir, onSort, children, style }: SortHeaderProps) {
  const active = activeKey === sortKey;
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      style={style}
    >
      <button type="button" className="sort-header-btn" onClick={() => onSort(sortKey)}>
        {children}
        <svg className="sort-icon" viewBox="0 0 8 11" aria-hidden="true" fill="currentColor">
          <path d="M4 0L7 4H1Z" opacity={active && dir === 'asc' ? 1 : 0.3} />
          <path d="M4 11L1 7H7Z" opacity={active && dir === 'desc' ? 1 : 0.3} />
        </svg>
      </button>
    </th>
  );
}
