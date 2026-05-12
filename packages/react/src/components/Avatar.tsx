import type { CSSProperties } from 'react'

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'offline' | 'away'

export interface AvatarProps {
  initials?: string
  src?: string
  alt?: string
  size?: AvatarSize
  status?: AvatarStatus
  className?: string
  style?: CSSProperties
}

export function Avatar({
  initials = '?',
  src,
  alt,
  size = 'md',
  status,
  className = '',
  style,
}: AvatarProps) {
  const label = alt ?? (src ? '' : initials)
  return (
    <span
      className={`avatar avatar-${size}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={label}
      style={style}
    >
      {src ? <img src={src} alt="" /> : initials}
      {status && <span className={`avatar-status avatar-status-${status}`} aria-hidden="true" />}
    </span>
  )
}
