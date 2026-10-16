import type { ReactNode } from 'react'
import { CloseIcon } from '../icons.js'
import { Tooltip } from './Tooltip.js'

export type AlertVariant = 'success' | 'warn' | 'danger' | 'info'

export interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  onDismiss?: () => void
}

export function Alert({ variant = 'info', children, onDismiss }: AlertProps) {
  return (
    <div
      className={`alert alert-${variant}`}
      role={variant === 'danger' ? 'alert' : 'status'}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <span className="alert-body">{children}</span>
      {onDismiss && (
        <Tooltip label="Dismiss alert" placement="left" className="alert-dismiss-tip">
          <button
            type="button"
            className="alert-dismiss icon-btn"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
