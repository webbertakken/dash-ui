import { useEffect, useId, useRef, useState } from 'react';

export interface ContextualHelpProps {
  title: string;
  body: string;
  placement?: 'top' | 'bottom';
}

export function ContextualHelp({ title, body, placement = 'top' }: ContextualHelpProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="ch-root">
      <button
        ref={triggerRef}
        type="button"
        className="ch-trigger"
        aria-label="Help"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ?
      </button>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby={titleId}
          className={`ch-panel ch-panel--${placement}`}
          tabIndex={-1}
        >
          <div id={titleId} className="ch-title">{title}</div>
          <div className="ch-body">{body}</div>
        </div>
      )}
    </span>
  );
}
