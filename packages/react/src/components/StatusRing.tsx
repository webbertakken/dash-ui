import type { HTMLAttributes } from 'react'

export type StatusRingStatus = 'ok' | 'warn' | 'danger' | 'neutral'

export interface StatusRingProps extends HTMLAttributes<HTMLSpanElement> {
  /** Health colour of the ring. Defaults to `'ok'` (success green). */
  status?: StatusRingStatus
}

const MODIFIER: Record<StatusRingStatus, string> = {
  ok: '',
  warn: 'status-ring--warn',
  danger: 'status-ring--danger',
  neutral: 'status-ring--neutral',
}

/**
 * Pulsing status indicator: a soft translucent ring around a solid coloured
 * inner dot. Renders `<span aria-hidden class="status-ring">` so the
 * `.status-ring` rule in `@w5-ui/tokens/dashboard.css` paints the canonical
 * 18 px ring + 8 px inner dot without userland having to hand-roll the two
 * layers.
 *
 * The `status` prop swaps the ring + dot colour: `'ok'` (default, success
 * green), `'warn'` (amber), `'danger'` (red), `'neutral'` (grey). Use it to
 * drive a live-health signal next to the site name in `<Topbar>` or on a
 * tunnel / session / device row.
 *
 * Decorative — the wrapper sets `aria-hidden`; pair with a label so screen
 * readers announce the state. Typed equivalent of
 * `<span aria-hidden className="status-ring status-ring--<status>" />`. Stops
 * userland copying the class name into bespoke status rows and silently
 * drifting when the ring colour / size tokens change.
 */
export function StatusRing({ className = '', status = 'ok', ...rest }: StatusRingProps) {
  const cls = ['status-ring', MODIFIER[status], className].filter(Boolean).join(' ')
  return <span aria-hidden="true" className={cls} {...rest} />
}
