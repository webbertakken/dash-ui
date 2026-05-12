import { useState, useEffect } from 'react'
import { CloseIcon } from '../icons.js'

export type ToastVariant = 'success' | 'info' | 'warn' | 'danger'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

type Listener = (item: ToastItem) => void
const listeners = new Set<Listener>()
let seq = 0

export const toast = {
  show(message: string, variant: ToastVariant = 'info') {
    const item: ToastItem = { id: String(++seq), message, variant }
    listeners.forEach((l) => l(item))
  },
  success: (msg: string) => toast.show(msg, 'success'),
  warn: (msg: string) => toast.show(msg, 'warn'),
  danger: (msg: string) => toast.show(msg, 'danger'),
  info: (msg: string) => toast.show(msg, 'info'),
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    const add = (item: ToastItem) => {
      setItems((prev) => [...prev, item])
      setTimeout(() => remove(item.id), 4000)
    }
    listeners.add(add)
    return () => {
      listeners.delete(add)
    }
  }, [])

  function remove(id: string) {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div
      className="toaster"
      role="log"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`toast toast-${item.variant}`}
          role={item.variant === 'danger' ? 'alert' : 'status'}
        >
          <span className="toast-msg">{item.message}</span>
          <button
            type="button"
            className="toast-dismiss icon-btn"
            onClick={() => remove(item.id)}
            aria-label="Dismiss notification"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
