export interface StepperStep {
  id: string
  label: string
}

export interface StepperProps {
  steps: StepperStep[]
  active: string
  className?: string
}

export function Stepper({ steps, active, className = '' }: StepperProps) {
  const activeIdx = steps.findIndex((s) => s.id === active)
  return (
    <nav aria-label="Progress" className={`stepper ${className}`.trim()}>
      <ol className="stepper__list">
        {steps.map((step, idx) => {
          const isActive = step.id === active
          const isDone = idx < activeIdx
          const state = isActive ? 'active' : isDone ? 'done' : 'upcoming'
          return (
            <li key={step.id} className={`stepper__item stepper__item--${state}`}>
              <span className="stepper__num" aria-hidden="true">
                {isDone ? (
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              {isDone && <span className="sr-only">completed: </span>}
              <span
                className="stepper__label"
                {...(isActive ? { 'aria-current': 'step' as const } : {})}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
