import { useId, useState, type ReactNode } from 'react'

export interface ExpandableRowProps {
  row: ReactNode
  detail: ReactNode
  colSpan: number
  defaultExpanded?: boolean
}

export function ExpandableRow({
  row,
  detail,
  colSpan,
  defaultExpanded = false,
}: ExpandableRowProps) {
  const [open, setOpen] = useState(defaultExpanded)
  const detailId = useId()
  return (
    <tbody className="exp-tbody">
      <tr className="exp-row">
        <td className="exp-toggle-cell">
          <button
            type="button"
            className="exp-toggle"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              className={`exp-chevron${open ? ' exp-chevron--open' : ''}`}
              viewBox="0 0 10 6"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </td>
        {row}
      </tr>
      <tr
        id={detailId}
        className={`exp-detail${open ? ' exp-detail--open' : ''}`}
        aria-hidden={!open}
      >
        <td colSpan={colSpan + 1} className="exp-detail-cell">
          {detail}
        </td>
      </tr>
    </tbody>
  )
}
