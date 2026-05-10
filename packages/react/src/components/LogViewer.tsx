import { useEffect, useRef, useState } from 'react';

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category?: string;
  event: string;
  subject?: string;
  detail?: string;
}

export interface LogViewerProps {
  entries: LogEntry[];
  height?: number;
  defaultFollow?: boolean;
  ariaLabel?: string;
  className?: string;
}

const SEV_DOT: Record<string, string> = {
  error: '#F03A3A',
  warn: '#F5A623',
  info: '#006FFF',
  debug: '#4A4B53',
};

export function LogViewer({
  entries,
  height = 360,
  defaultFollow = true,
  ariaLabel = 'Log entries',
  className = '',
}: LogViewerProps) {
  const [follow, setFollow] = useState(defaultFollow);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (follow && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries.length, follow]);

  return (
    <div className={`lv ${className}`.trim()}>
      <div className="lv__toolbar">
        <span className="lv__count">{entries.length} entries</span>
        <button
          type="button"
          className={`lv__follow${follow ? ' lv__follow--on' : ''}`}
          onClick={() => setFollow((f) => !f)}
          aria-pressed={follow}
        >
          Follow
        </button>
      </div>
      <div
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label={ariaLabel}
        className="lv__body"
        style={{ height }}
      >
        <table className="lv__table">
          <caption className="sr-only">{ariaLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Severity</th>
              <th scope="col">Source</th>
              <th scope="col">Time</th>
              <th scope="col">Event</th>
              <th scope="col">Subject</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id ?? i}>
                <td>
                  <span className={`lv__sev lv__sev--${e.level}`}>
                    <span
                      className="lv__dot"
                      style={{ background: SEV_DOT[e.level] ?? SEV_DOT.info }}
                      aria-hidden="true"
                    />
                    {e.level === 'error' ? 'crit' : e.level}
                  </span>
                </td>
                <td className="lv__cat">{e.category ?? ''}</td>
                <td className="lv__time">{e.timestamp}</td>
                <td className="lv__event">{e.event}</td>
                <td className="lv__subject">{e.subject ?? ''}</td>
                <td className="lv__detail">{e.detail ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
