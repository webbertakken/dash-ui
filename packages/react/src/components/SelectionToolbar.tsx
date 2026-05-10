import type { ReactNode } from 'react';
import { CloseIcon } from '../icons.js';

export interface SelectionToolbarAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface SelectionToolbarProps {
  count: number;
  actions: SelectionToolbarAction[];
  onClear: () => void;
  /** sr-only label for the toolbar (default: "Selection actions") */
  ariaLabel?: string;
  children?: ReactNode;
}

export function SelectionToolbar({ count, actions, onClear, ariaLabel = 'Selection actions', children }: SelectionToolbarProps) {
  if (count === 0) return null;
  return (
    <div className="sel-toolbar" role="toolbar" aria-label={ariaLabel}>
      <span className="sel-toolbar__count" aria-live="polite" aria-atomic="true">
        <strong>{count}</strong> selected
      </span>
      <div className="sel-toolbar__actions">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            className={`sel-toolbar__btn${a.variant === 'danger' ? ' sel-toolbar__btn--danger' : ''}`}
            onClick={a.onClick}
          >
            {a.label}
          </button>
        ))}
        {children}
      </div>
      <button
        type="button"
        className="sel-toolbar__clear icon-btn"
        onClick={onClear}
        aria-label="Clear selection"
      >
        <CloseIcon aria-hidden="true" />
      </button>
    </div>
  );
}
