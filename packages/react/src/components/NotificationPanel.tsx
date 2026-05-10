import { useEffect, useId, useRef, useState } from 'react';
import { IconButton } from './Button.js';
import { CloseIcon } from '../icons.js';

export type NotifType = 'alarm' | 'system' | 'update';
export type NotifSeverity = 'danger' | 'warn' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotifType;
  severity?: NotifSeverity;
  title: string;
  description?: string;
  time: string;
  read: boolean;
}

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const SEV_COLOR: Record<string, string> = {
  danger: '#F03A3A',
  warn: '#F5A623',
  info: '#006FFF',
  success: '#00B070',
};

const TYPE_LABEL: Record<NotifType, string> = {
  alarm: 'Alarm',
  system: 'System',
  update: 'Update',
};

export function NotificationPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | NotifType>('all');

  const unread = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) { e.preventDefault(); return; }
      const f = items[0]!, l = items[items.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && active === l) { e.preventDefault(); f.focus(); }
    }

    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`np-overlay${open ? ' np-overlay--show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`np-panel${open ? ' np-panel--show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="np-header">
          <div className="np-title-row">
            <h2 id={titleId} className="np-title">
              Notifications
              {unread > 0 && (
                <span className="np-badge" aria-label={`${unread} unread`}>
                  {unread}
                </span>
              )}
            </h2>
            <div className="np-header-actions">
              {unread > 0 && (
                <button type="button" className="np-mark-all" onClick={onMarkAllRead}>
                  Mark all read
                </button>
              )}
              <IconButton onClick={onClose} aria-label="Close notifications">
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="np-filters" role="tablist" aria-label="Filter by type">
            {(['all', 'alarm', 'system', 'update'] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={`np-filter${filter === f ? ' np-filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : TYPE_LABEL[f]}
              </button>
            ))}
          </div>
        </div>
        <div
          className="np-list"
          role="log"
          aria-live="polite"
          aria-label="Notifications"
          aria-relevant="additions"
        >
          {filtered.length === 0 ? (
            <div className="np-empty">No notifications</div>
          ) : (
            filtered.map((n) => (
              <div key={n.id} className={`np-item${n.read ? ' np-item--read' : ''}`}>
                <span
                  className="np-dot"
                  style={{ background: SEV_COLOR[n.severity ?? 'info'] }}
                  aria-hidden="true"
                />
                <div className="np-item-body">
                  <div className="np-item-top">
                    <span className="np-item-title">{n.title}</span>
                    <span className="np-item-time">{n.time}</span>
                  </div>
                  {n.description && <p className="np-item-desc">{n.description}</p>}
                  <span className="np-type-badge">{TYPE_LABEL[n.type]}</span>
                </div>
                {!n.read && onMarkRead && (
                  <button
                    type="button"
                    className="np-read-btn"
                    onClick={() => onMarkRead(n.id)}
                    aria-label={`Mark as read: ${n.title}`}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
