import type { ReactNode } from 'react'

export interface PageHeaderProps {
  title: ReactNode
  actions?: ReactNode
  sticky?: boolean
  className?: string
}

export function PageHeader({ title, actions, sticky = true, className = '' }: PageHeaderProps) {
  return (
    <div
      className={`ph-bar ${className}`.trim()}
      style={sticky ? undefined : { position: 'static' }}
    >
      <h2 className="ph-title">{title}</h2>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  )
}
