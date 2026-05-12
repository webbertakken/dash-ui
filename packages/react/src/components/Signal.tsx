export interface SignalProps {
  weak?: boolean
  label?: string
}

export function Signal({ weak = false, label }: SignalProps) {
  return (
    <span
      className={`signal ${weak ? 'weak' : ''}`.trim()}
      role="img"
      aria-label={label ?? (weak ? 'Signal: weak' : 'Signal: strong')}
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}
