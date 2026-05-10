import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconButton } from './Button.js';
import { CloseIcon } from '../icons.js';

export interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

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
        className={`drawer-overlay ${open ? 'show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`drawer-panel ${open ? 'show' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="drawer-h">
          <h2 id={titleId}>{title}</h2>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="drawer-b">{children}</div>
      </div>
    </>
  );
}
