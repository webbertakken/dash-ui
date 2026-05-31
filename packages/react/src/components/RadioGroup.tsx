import { useId } from 'react'
import type { ReactNode } from 'react'

export interface RadioOption {
  value: string
  label: ReactNode
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  legend: string
  name?: string
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  srOnlyLegend?: boolean
  horizontal?: boolean
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onChange,
  srOnlyLegend = false,
  horizontal = false,
}: RadioGroupProps) {
  const groupId = useId()
  const groupName = name ?? groupId
  const cls = ['radio-group', horizontal && 'radio-group--h'].filter(Boolean).join(' ')

  return (
    <fieldset className={cls}>
      <legend className={srOnlyLegend ? 'sr-only' : 'radio-group__legend'}>{legend}</legend>
      {options.map((opt) => {
        const optId = `${groupName}-${opt.value}`
        return (
          <label
            key={opt.value}
            htmlFor={optId}
            className={['radio-option', opt.disabled && 'radio-option--disabled']
              .filter(Boolean)
              .join(' ')}
          >
            <input
              type="radio"
              id={optId}
              aria-labelledby={`${optId}-label`}
              name={groupName}
              value={opt.value}
              checked={value !== undefined ? value === opt.value : undefined}
              defaultChecked={defaultValue !== undefined ? defaultValue === opt.value : undefined}
              disabled={opt.disabled}
              onChange={() => onChange?.(opt.value)}
              className="radio"
            />
            <span className="radio-text" id={`${optId}-label`}>
              <span>{opt.label}</span>
              {opt.description && <span className="radio-description">{opt.description}</span>}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
