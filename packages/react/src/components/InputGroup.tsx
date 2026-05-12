import type { ReactNode } from 'react'

export interface InputGroupProps {
  prefix?: ReactNode
  suffix?: ReactNode
  children: ReactNode
}

export function InputGroup({ prefix, suffix, children }: InputGroupProps) {
  return (
    <div className="input-group">
      {prefix !== undefined && (
        <span className="input-group-addon input-group-addon--prefix">{prefix}</span>
      )}
      {children}
      {suffix !== undefined && (
        <span className="input-group-addon input-group-addon--suffix">{suffix}</span>
      )}
    </div>
  )
}
