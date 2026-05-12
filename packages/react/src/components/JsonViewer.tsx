import { useState } from 'react'

type JsVal = string | number | boolean | null | JsVal[] | { [k: string]: JsVal }

function Primitive({ v }: { v: string | number | boolean | null }) {
  if (v === null) return <span className="jv-null">null</span>
  if (typeof v === 'string') return <span className="jv-string">&quot;{v}&quot;</span>
  if (typeof v === 'number') return <span className="jv-number">{v}</span>
  return <span className="jv-boolean">{String(v)}</span>
}

function JvNode({
  v,
  k,
  depth,
  maxDepth,
  startOpen,
}: {
  v: JsVal
  k?: string
  depth: number
  maxDepth: number
  startOpen: boolean
}) {
  const isArr = Array.isArray(v)
  const isObj = v !== null && typeof v === 'object'
  const [open, setOpen] = useState(startOpen && depth < maxDepth)

  const indent = depth * 14

  if (!isArr && !isObj) {
    return (
      <div role="treeitem" aria-selected={false} className="jv-row" style={{ paddingLeft: indent }}>
        {k != null && (
          <>
            <span className="jv-key">&quot;{k}&quot;</span>
            <span className="jv-colon">: </span>
          </>
        )}
        <Primitive v={v as string | number | boolean | null} />
      </div>
    )
  }

  const entries: [string | number, JsVal][] = isArr
    ? (v as JsVal[]).map((item, i) => [i, item])
    : Object.entries(v as { [key: string]: JsVal })
  const count = entries.length
  const [ob, cb] = isArr ? ['[', ']'] : ['{', '}']

  return (
    <div role="treeitem" aria-selected={false} aria-expanded={open} className="jv-node">
      <button
        type="button"
        className="jv-toggle-row"
        onClick={() => setOpen((s) => !s)}
        aria-label={`${open ? 'Collapse' : 'Expand'} ${k ?? (isArr ? 'array' : 'object')}`}
        style={{ paddingLeft: indent }}
      >
        <span className="jv-caret" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
        {k != null && (
          <>
            <span className="jv-key">&quot;{k}&quot;</span>
            <span className="jv-colon">: </span>
          </>
        )}
        <span className="jv-bracket">{ob}</span>
        {!open && (
          <>
            <span className="jv-count">&thinsp;{count}&thinsp;</span>
            <span className="jv-bracket">{cb}</span>
          </>
        )}
      </button>
      {open && (
        <div role="group" className="jv-children">
          {entries.map(([ek, ev]) => (
            <JvNode
              key={String(ek)}
              v={ev}
              k={isArr ? undefined : String(ek)}
              depth={depth + 1}
              maxDepth={maxDepth}
              startOpen={startOpen}
            />
          ))}
          <div className="jv-row jv-close" style={{ paddingLeft: indent }}>
            <span className="jv-bracket">{cb}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export interface JsonViewerProps {
  data: unknown
  label?: string
  defaultExpanded?: boolean
  maxDepth?: number
}

export function JsonViewer({
  data,
  label = 'JSON viewer',
  defaultExpanded = true,
  maxDepth = 3,
}: JsonViewerProps) {
  return (
    <div className="json-viewer" role="tree" aria-label={label}>
      <JvNode v={data as JsVal} depth={0} maxDepth={maxDepth} startOpen={defaultExpanded} />
    </div>
  )
}
