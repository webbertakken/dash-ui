import { useId, useState } from 'react'

export interface StarRatingProps {
  label: string
  value?: number
  defaultValue?: number
  max?: number
  readOnly?: boolean
  size?: 'sm' | 'md'
  onChange?: (value: number) => void
  className?: string
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}

export function StarRating({
  label,
  value: valueProp,
  defaultValue = 0,
  max = 5,
  readOnly = false,
  size = 'md',
  onChange,
  className,
}: StarRatingProps) {
  const id = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hovered, setHovered] = useState(0)
  const value = valueProp !== undefined ? valueProp : internalValue
  const active = hovered || value

  const cls = [
    'star-rating',
    size === 'sm' && 'star-rating--sm',
    readOnly && 'star-rating--readonly',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (readOnly) {
    return (
      <span className={cls} role="img" aria-label={`${value} out of ${max} stars`}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={i < value ? 'star-icon star-icon--on' : 'star-icon'}
            aria-hidden="true"
          >
            <StarIcon filled={i < value} />
          </span>
        ))}
      </span>
    )
  }

  return (
    <fieldset className={cls}>
      <legend className="sr-only">{label}</legend>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const on = star <= active
        return (
          <label
            key={star}
            htmlFor={`${id}-${star}`}
            className={on ? 'star-label star-label--on' : 'star-label'}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            <input
              type="radio"
              id={`${id}-${star}`}
              name={`${id}`}
              value={String(star)}
              checked={value === star}
              onChange={() => {
                if (valueProp === undefined) setInternalValue(star)
                onChange?.(star)
              }}
              className="star-radio"
              aria-label={`${star} out of ${max}`}
            />
            <StarIcon filled={on} />
          </label>
        )
      })}
    </fieldset>
  )
}
