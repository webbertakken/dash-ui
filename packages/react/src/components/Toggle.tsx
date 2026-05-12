import { useId } from 'react'

export interface ToggleProps {
  on: boolean
  onToggle?: () => void
  ariaLabel?: string
  ariaDescribedBy?: string
}

export function Toggle({ on, onToggle, ariaLabel, ariaDescribedBy }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={onToggle}
      className={`toggle-track ${on ? 'on' : 'off'}`}
    >
      <span className="knob" />
    </button>
  )
}

export interface RowToggleProps {
  title: string
  description: string
  on: boolean
  onToggle?: () => void
}

export function RowToggle({ title, description, on, onToggle }: RowToggleProps) {
  const descId = useId()
  return (
    <div className="row-toggle">
      <div className="info">
        <div className="t">{title}</div>
        <div className="d" id={descId}>
          {description}
        </div>
      </div>
      <Toggle on={on} onToggle={onToggle} ariaLabel={title} ariaDescribedBy={descId} />
    </div>
  )
}

export interface RowToggleListProps {
  items: { title: string; description: string }[]
  state: Record<string, boolean>
  onToggle: (title: string) => void
}

export function RowToggleList({ items, state, onToggle }: RowToggleListProps) {
  return (
    <>
      {items.map((it) => (
        <RowToggle
          key={it.title}
          title={it.title}
          description={it.description}
          on={!!state[it.title]}
          onToggle={() => onToggle(it.title)}
        />
      ))}
    </>
  )
}
