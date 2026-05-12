import { useEffect, useRef } from 'react'

export type ActivitySeverity = 'info' | 'success' | 'warn' | 'error' | 'neutral'

export interface ActivityItem {
  id: string
  title: string
  description?: string
  time: string
  severity?: ActivitySeverity
}

export interface ActivityFeedProps {
  items: ActivityItem[]
  label?: string
  busy?: boolean
  maxHeight?: number
  autoScroll?: boolean
}

export function ActivityFeed({
  items,
  label = 'Activity feed',
  busy = false,
  maxHeight = 360,
  autoScroll = false,
}: ActivityFeedProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [items, autoScroll])

  return (
    <div
      role="feed"
      aria-label={label}
      aria-busy={busy}
      className="activity-feed"
      style={{ maxHeight, overflowY: 'auto' }}
    >
      {items.map((item, i) => (
        <article
          key={item.id}
          className={`af-item af-item--${item.severity ?? 'neutral'}`}
          aria-labelledby={`af-title-${item.id}`}
          aria-describedby={item.description ? `af-desc-${item.id}` : undefined}
          aria-posinset={i + 1}
          aria-setsize={items.length}
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- navigable feed item for keyboard users
          tabIndex={0}
        >
          <div className="af-dot" aria-hidden="true" />
          <div className="af-body">
            <div className="af-header">
              <span id={`af-title-${item.id}`} className="af-title">
                {item.title}
              </span>
              <span className="af-time">{item.time}</span>
            </div>
            {item.description && (
              <p id={`af-desc-${item.id}`} className="af-desc">
                {item.description}
              </p>
            )}
          </div>
        </article>
      ))}
      {items.length === 0 && (
        <div className="af-empty" role="status">
          No activity
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}
