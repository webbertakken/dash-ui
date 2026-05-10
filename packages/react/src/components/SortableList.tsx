import { useState } from 'react';

export interface SortableItem {
  id: string;
  label: string;
  meta?: string;
}

export interface SortableListProps {
  items: SortableItem[];
  onChange: (items: SortableItem[]) => void;
  ariaLabel?: string;
}

function GrabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="3" y="2" width="2" height="2" rx="1" />
      <rect x="9" y="2" width="2" height="2" rx="1" />
      <rect x="3" y="6" width="2" height="2" rx="1" />
      <rect x="9" y="6" width="2" height="2" rx="1" />
      <rect x="3" y="10" width="2" height="2" rx="1" />
      <rect x="9" y="10" width="2" height="2" rx="1" />
    </svg>
  );
}

export function SortableList({ items, onChange, ariaLabel }: SortableListProps) {
  const [grabbed, setGrabbed] = useState<string | null>(null);
  const [dragSrc, setDragSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    const from = items.findIndex(i => i.id === fromId);
    const to = items.findIndex(i => i.id === toId);
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  }

  function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex(i => i.id === id);
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    onChange(arr);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, id: string) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setGrabbed(g => (g === id ? null : id));
    } else if (grabbed === id) {
      if (e.key === 'ArrowUp') { e.preventDefault(); move(id, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(id, 1); }
      else if (e.key === 'Escape') { setGrabbed(null); }
    }
  }

  return (
    <ol className="sortable-list" aria-label={ariaLabel}>
      {items.map((item, idx) => (
        <li
          key={item.id}
          className={[
            'sortable-list__item',
            grabbed === item.id ? 'is-grabbed' : '',
            dragOver === item.id ? 'is-drag-over' : '',
          ].filter(Boolean).join(' ')}
          draggable
          onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragSrc(item.id); }}
          onDragEnd={() => { setDragSrc(null); setDragOver(null); }}
          onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (dragOver !== item.id) setDragOver(item.id); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={e => { e.preventDefault(); if (dragSrc) reorder(dragSrc, item.id); setDragSrc(null); setDragOver(null); }}
        >
          <button
            type="button"
            className="sortable-list__handle"
            aria-label={`${grabbed === item.id ? 'Release' : 'Grab'} ${item.label}. Use arrow keys to reorder.`}
            aria-pressed={grabbed === item.id}
            onKeyDown={e => handleKeyDown(e, item.id)}
          >
            <GrabIcon />
          </button>
          <span className="sortable-list__content">
            <span className="sortable-list__label">{item.label}</span>
            {item.meta && <span className="sortable-list__meta">{item.meta}</span>}
          </span>
          <span className="sortable-list__index" aria-hidden="true">{idx + 1}</span>
        </li>
      ))}
    </ol>
  );
}
