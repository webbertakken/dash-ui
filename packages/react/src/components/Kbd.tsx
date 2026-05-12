export interface KbdProps {
  keys: string | string[]
  className?: string
}

export function Kbd({ keys, className = '' }: KbdProps) {
  const parts = typeof keys === 'string' ? keys.split('+') : keys
  return (
    <kbd className={`kbd ${className}`.trim()}>
      {parts.map((k, i) => (
        <span key={i} className="kbd__segment">
          {i > 0 && (
            <span className="kbd__plus" aria-hidden="true">
              +
            </span>
          )}
          <kbd className="kbd__key">{k}</kbd>
        </span>
      ))}
    </kbd>
  )
}
