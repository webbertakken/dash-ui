export type SwitchPortStatus = 'up' | 'poe' | 'down'

export interface SwitchPort {
  status: SwitchPortStatus
  speed?: string
  label?: string
}

export interface SwitchPortGridProps {
  ports: SwitchPort[]
  columns?: number
  onPortClick?: (index: number) => void
  ariaLabel?: string
}

const STATUS_LABEL: Record<SwitchPortStatus, string> = {
  up: 'Connected',
  poe: 'PoE Active',
  down: 'Down',
}

export function SwitchPortGrid({
  ports,
  columns = 12,
  onPortClick,
  ariaLabel = 'Switch port panel',
}: SwitchPortGridProps) {
  return (
    <ul
      className="spg"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {ports.map((port, i) => {
        const n = i + 1
        const desc = `Port ${n}: ${STATUS_LABEL[port.status]}${port.speed ? ` · ${port.speed}` : ''}${port.label ? ` · ${port.label}` : ''}`
        return (
          <li key={i}>
            <button
              type="button"
              className="spg__btn"
              data-status={port.status}
              aria-label={desc}
              onClick={() => onPortClick?.(i)}
            >
              <span className="spg__num">{n}</span>
              {port.speed && <span className={`spg__speed--${port.status}`}>{port.speed}</span>}
              {port.status === 'poe' && (
                <span className="spg__poe" aria-hidden="true">
                  PoE
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
