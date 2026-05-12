import { type ReactNode } from 'react'
import { CloseIcon } from '../icons.js'

export type BannerVariant = 'info' | 'success' | 'warn' | 'danger'

export interface BannerAction {
  label: string
  onClick: () => void
}

export interface BannerProps {
  variant?: BannerVariant
  title?: string
  children: ReactNode
  action?: BannerAction
  onDismiss?: () => void
}

export function Banner({ variant = 'info', title, children, action, onDismiss }: BannerProps) {
  const isUrgent = variant === 'danger' || variant === 'warn'
  return (
    <div
      className={`banner banner--${variant}`}
      role={isUrgent ? 'alert' : 'status'}
      aria-live={isUrgent ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="banner__body">
        {title && <span className="banner__title">{title}</span>}
        <span>{children}</span>
      </div>
      {action && (
        <button type="button" className="banner__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          className="banner__dismiss icon-btn"
          onClick={onDismiss}
          aria-label="Dismiss banner"
        >
          <CloseIcon aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
