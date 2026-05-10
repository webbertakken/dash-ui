import { useState, useRef, useId, useEffect, type ReactNode } from 'react';
import type { KeyboardEvent } from 'react';
import { Kbd } from './Kbd.js';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  shortcut?: string;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  onSelect: (id: string) => void;
  placeholder?: string;
}

export function CommandPalette({
  open,
  onClose,
  items,
  onSelect,
  placeholder = 'Search pages and actions…',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const filtered =
    query.trim() === ''
      ? items
      : items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  const grouped = filtered.reduce<{ group: string; items: CommandItem[] }[]>(
    (acc, item) => {
      const g = item.group ?? '';
      const found = acc.find((a) => a.group === g);
      if (found) found.items.push(item);
      else acc.push({ group: g, items: [item] });
      return acc;
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  function commit(id: string) {
    onSelect(id);
    onClose();
    setQuery('');
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIdx];
      if (item) commit(item.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="cp-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="cp-panel"
      >
        <div className="cp-search">
          <svg
            className="cp-search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <path d="M10.5 10.5l3 3" />
          </svg>
          <input
            ref={inputRef}
            className="cp-input"
            type="text"
            role="combobox"
            aria-expanded={filtered.length > 0}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={
              filtered[activeIdx] ? `${listId}-${activeIdx}` : undefined
            }
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <span className="cp-kbd">Esc</span>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="cp-list">
          {filtered.length === 0 ? (
            <li className="cp-empty">
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            grouped.map(({ group, items: groupItems }) => (
              <li key={group} role="presentation">
                {group && <div className="cp-group-label">{group}</div>}
                {groupItems.map((item) => {
                  const idx = filtered.indexOf(item);
                  return (
                    <div
                      key={item.id}
                      id={`${listId}-${idx}`}
                      role="option"
                      aria-selected={idx === activeIdx}
                      data-active={idx === activeIdx ? 'true' : undefined}
                      className="cp-item"
                      onClick={() => commit(item.id)}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      {item.icon && (
                        <span className="cp-item-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                      {item.shortcut && (
                        <span className="cp-item-shortcut" aria-label={item.shortcut.replace(/\+/g, ' then ')}>
                          <Kbd keys={item.shortcut} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
