import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';

export interface ActionMenuItem {
  id: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  onAction: (id: string) => void;
  label?: string;
}

export function ActionMenu({ items, onAction, label = 'Actions' }: ActionMenuProps) {
  const uid = useId();
  const menuId = `${uid}-menu`;
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function toggle() {
    setOpen((prev) => {
      if (!prev) setActiveIdx(0);
      return !prev;
    });
  }

  function activate(id: string) {
    onAction(id);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setActiveIdx(0);
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIdx(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIdx(items.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[activeIdx];
      if (item && !item.disabled) activate(item.id);
    }
    else if (e.key === 'Tab') { setOpen(false); }
  }

  return (
    <div ref={wrapperRef} className="action-menu-root">
      <button
        ref={triggerRef}
        type="button"
        className="icon-btn action-menu-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false" fill="currentColor">
          <circle cx="7" cy="2.5" r="1.2" />
          <circle cx="7" cy="7" r="1.2" />
          <circle cx="7" cy="11.5" r="1.2" />
        </svg>
      </button>
      {open && (
        <ul id={menuId} role="menu" aria-label={label} className="action-menu">
          {items.map((item, idx) => (
            <li
              key={item.id}
              role="menuitem"
              tabIndex={-1}
              aria-disabled={item.disabled}
              data-active={idx === activeIdx ? 'true' : undefined}
              data-danger={item.danger ? 'true' : undefined}
              className="action-menu-item"
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                if (!item.disabled) activate(item.id);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
