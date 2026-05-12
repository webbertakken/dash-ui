import type { HTMLAttributes, ReactNode } from 'react'
import { Card } from './Card.js'

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  label: string
  value: ReactNode
  unit?: string
  sub?: string
  delta?: string
  deltaDir?: 'up' | 'down' | 'neutral'
  span?: number
  color?: string
}

export function Stat({
  label,
  value,
  unit,
  sub,
  delta,
  deltaDir = 'neutral',
  span,
  color,
  ...rest
}: StatProps) {
  const deltaClass = deltaDir === 'up' ? 'delta-up' : deltaDir === 'down' ? 'delta-down' : ''
  return (
    <Card span={span} {...rest}>
      <h3>{label}</h3>
      <div className="stat" style={color ? { color } : undefined}>
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {(sub || delta) && (
        <div className="submeta">
          {sub}
          {sub && delta && ' · '}
          {delta && (
            <>
              <span className="sr-only">Trend: </span>
              <span className={deltaClass || undefined}>{delta}</span>
            </>
          )}
        </div>
      )}
    </Card>
  )
}
