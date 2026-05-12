import { useId } from 'react'

export interface FilterField {
  key: string
  label: string
  type?: 'text' | 'number' | 'select'
  options?: string[]
}

export interface FilterRule {
  id: string
  field: string
  op: string
  value: string
}

export interface FilterBuilderProps {
  fields: FilterField[]
  value?: FilterRule[]
  conjunction?: 'and' | 'or'
  onChange?: (rules: FilterRule[], conjunction: 'and' | 'or') => void
  'aria-label'?: string
}

const TEXT_OPS = ['contains', 'not contains', 'equals', 'not equals', 'starts with']
const NUM_OPS = ['equals', 'not equals', 'greater than', 'less than', 'at least', 'at most']
const SEL_OPS = ['is', 'is not']

function opsFor(type?: string) {
  if (type === 'number') return NUM_OPS
  if (type === 'select') return SEL_OPS
  return TEXT_OPS
}

function defaultOp(type?: string) {
  return opsFor(type)[0]
}

let _id = 0
function uid() {
  return String(++_id)
}

export function FilterBuilder({
  fields,
  value = [],
  conjunction = 'and',
  onChange,
  'aria-label': ariaLabel = 'Filter builder',
}: FilterBuilderProps) {
  const groupId = useId()

  function update(rules: FilterRule[], conj: 'and' | 'or' = conjunction) {
    onChange?.(rules, conj)
  }

  function addRule() {
    const f = fields[0]
    update([...value, { id: uid(), field: f?.key ?? '', op: defaultOp(f?.type), value: '' }])
  }

  function removeRule(id: string) {
    update(value.filter((r) => r.id !== id))
  }

  function setField(id: string, key: string) {
    const f = fields.find((x) => x.key === key)
    update(
      value.map((r) => (r.id === id ? { ...r, field: key, op: defaultOp(f?.type), value: '' } : r)),
    )
  }

  function setOp(id: string, op: string) {
    update(value.map((r) => (r.id === id ? { ...r, op } : r)))
  }

  function setValue(id: string, val: string) {
    update(value.map((r) => (r.id === id ? { ...r, value: val } : r)))
  }

  return (
    <div className="fb" role="group" aria-label={ariaLabel}>
      <div className="fb-header">
        <span className="fb-label">Filters</span>
        {value.length > 0 && (
          <>
            <span className="fb-conj-label">Match</span>
            <div className="fb-conj" role="group" aria-label="Conjunction">
              {(['and', 'or'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`fb-conj-btn${conjunction === c ? ' is-active' : ''}`}
                  aria-pressed={conjunction === c}
                  onClick={() => update(value, c)}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="fb-conj-label">conditions</span>
          </>
        )}
        <button type="button" className="fb-add" onClick={addRule} aria-label="Add filter rule">
          + Add rule
        </button>
        {value.length > 0 && (
          <button
            type="button"
            className="fb-clear"
            onClick={() => update([])}
            aria-label="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>
      {value.length > 0 && (
        <ul className="fb-rules" aria-label="Filter rules">
          {value.map((rule, i) => {
            const f = fields.find((x) => x.key === rule.field)
            const ops = opsFor(f?.type)
            const fieldId = `${groupId}-f${i}`
            const opId = `${groupId}-op${i}`
            const valId = `${groupId}-v${i}`
            return (
              <li key={rule.id} className="fb-rule">
                <label className="sr-only" htmlFor={fieldId}>
                  Field {i + 1}
                </label>
                <select
                  id={fieldId}
                  className="fb-select"
                  value={rule.field}
                  onChange={(e) => setField(rule.id, e.target.value)}
                  aria-label={`Rule ${i + 1} field`}
                >
                  {fields.map((x) => (
                    <option key={x.key} value={x.key}>
                      {x.label}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={opId}>
                  Operator {i + 1}
                </label>
                <select
                  id={opId}
                  className="fb-select fb-select--op"
                  value={rule.op}
                  onChange={(e) => setOp(rule.id, e.target.value)}
                  aria-label={`Rule ${i + 1} operator`}
                >
                  {ops.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={valId}>
                  Value {i + 1}
                </label>
                {f?.type === 'select' ? (
                  <select
                    id={valId}
                    className="fb-select fb-select--val"
                    value={rule.value}
                    onChange={(e) => setValue(rule.id, e.target.value)}
                    aria-label={`Rule ${i + 1} value`}
                  >
                    <option value="">Any</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={valId}
                    className="fb-input"
                    type={f?.type === 'number' ? 'number' : 'text'}
                    value={rule.value}
                    placeholder="Value…"
                    onChange={(e) => setValue(rule.id, e.target.value)}
                    aria-label={`Rule ${i + 1} value`}
                  />
                )}
                <button
                  type="button"
                  className="fb-remove icon-btn"
                  onClick={() => removeRule(rule.id)}
                  aria-label={`Remove rule ${i + 1}`}
                >
                  <svg
                    viewBox="0 0 12 12"
                    width="10"
                    height="10"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path
                      d="M1 1l10 10M11 1L1 11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
