import type { ReactNode } from 'react'

export interface PageHeaderProps {
  title: ReactNode
  actions?: ReactNode
  sticky?: boolean
  className?: string
}

export function PageHeader({ title, actions, sticky = true, className = '' }: PageHeaderProps) {
  const stickyCls = sticky ? 'sticky top-0 z-5' : ''
  return (
    <div
      className={`flex items-center justify-between px-6 py-[14px] border-b border-white/[0.06] bg-[#0a0a0b] ${stickyCls} ${className}`.trim()}
    >
      <h2 className="m-0 text-[18px] font-semibold tracking-[-0.005em] text-white">{title}</h2>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
