import type { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
}

export function Textarea({ className = '', rows = 4, ...rest }: TextareaProps) {
  return <textarea className={`input textarea ${className}`.trim()} rows={rows} {...rest} />
}
