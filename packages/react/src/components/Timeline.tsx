export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  variant?: 'info' | 'warn' | 'danger' | 'success' | 'neutral';
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className = '' }: TimelineProps) {
  return (
    <ol className={`timeline ${className}`.trim()} aria-label="Event timeline">
      {events.map((e) => (
        <li key={e.id} className={`timeline__item timeline__item--${e.variant ?? 'neutral'}`}>
          <span className="timeline__dot" aria-hidden="true" />
          <div className="timeline__content">
            <div className="timeline__header">
              <span className="timeline__title">{e.title}</span>
              <time className="timeline__time">{e.time}</time>
            </div>
            {e.description && <p className="timeline__desc">{e.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
