import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div role="status" aria-live="polite" className={`empty-state ${className}`.trim()}>
      <svg className="empty-state__icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable={false}>
        <rect x="6" y="11" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 30h10l3 5h10l3-5h10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15 20h18M15 25h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4" />
      </svg>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__desc">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
