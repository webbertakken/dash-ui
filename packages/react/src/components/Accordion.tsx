import { useState, useId, type HTMLAttributes, type ReactNode } from 'react'

export interface AccordionItemProps {
  title: string
  children?: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const btnId = `acc-btn-${id}`
  const panelId = `acc-panel-${id}`
  return (
    <div className="accordion-item">
      <h3 className="accordion-header">
        <button
          id={btnId}
          type="button"
          className="accordion-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{title}</span>
          <svg
            className={`accordion-chevron${open ? ' open' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="accordion-panel"
        hidden={!open}
      >
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  )
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Accordion({ children, className = '', ...rest }: AccordionProps) {
  return (
    <div className={`accordion ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}
