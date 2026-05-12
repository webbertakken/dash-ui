import { useId, useRef, useState } from 'react'

export interface TransferListItem {
  id: string
  label: string
  description?: string
}

export interface TransferListProps {
  sourceLabel?: string
  targetLabel?: string
  source?: TransferListItem[]
  target?: TransferListItem[]
  defaultSource?: TransferListItem[]
  defaultTarget?: TransferListItem[]
  onChange?: (source: TransferListItem[], target: TransferListItem[]) => void
  className?: string
}

export function TransferList({
  sourceLabel = 'Available',
  targetLabel = 'Selected',
  source: srcProp,
  target: tgtProp,
  defaultSource = [],
  defaultTarget = [],
  onChange,
  className = '',
}: TransferListProps) {
  const gid = useId()
  const [intSrc, setIntSrc] = useState<TransferListItem[]>(() => srcProp ?? defaultSource)
  const [intTgt, setIntTgt] = useState<TransferListItem[]>(() => tgtProp ?? defaultTarget)
  const srcItems = srcProp !== undefined ? srcProp : intSrc
  const tgtItems = tgtProp !== undefined ? tgtProp : intTgt

  const [selSrc, setSelSrc] = useState(new Set<string>())
  const [selTgt, setSelTgt] = useState(new Set<string>())
  const [focSrc, setFocSrc] = useState(0)
  const [focTgt, setFocTgt] = useState(0)
  const srcRefs = useRef<(HTMLLIElement | null)[]>([])
  const tgtRefs = useRef<(HTMLLIElement | null)[]>([])

  function commit(nextSrc: TransferListItem[], nextTgt: TransferListItem[]) {
    if (srcProp === undefined) setIntSrc(nextSrc)
    if (tgtProp === undefined) setIntTgt(nextTgt)
    onChange?.(nextSrc, nextTgt)
  }

  function moveRight(ids: Set<string>) {
    if (!ids.size) return
    commit(
      srcItems.filter((i) => !ids.has(i.id)),
      [...tgtItems, ...srcItems.filter((i) => ids.has(i.id))],
    )
    setSelSrc(new Set())
    setFocSrc(0)
  }

  function moveLeft(ids: Set<string>) {
    if (!ids.size) return
    commit(
      [...srcItems, ...tgtItems.filter((i) => ids.has(i.id))],
      tgtItems.filter((i) => !ids.has(i.id)),
    )
    setSelTgt(new Set())
    setFocTgt(0)
  }

  function toggle(sel: Set<string>, set: (s: Set<string>) => void, id: string) {
    const n = new Set(sel)
    if (n.has(id)) {
      n.delete(id)
    } else {
      n.add(id)
    }
    set(n)
  }

  function listKey(
    e: React.KeyboardEvent,
    items: TransferListItem[],
    sel: Set<string>,
    setSel: (s: Set<string>) => void,
    foc: number,
    setFoc: (n: number) => void,
    refs: React.MutableRefObject<(HTMLLIElement | null)[]>,
    onEnter: () => void,
  ) {
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = Math.min(foc + 1, items.length - 1)
      setFoc(n)
      refs.current[n]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.max(foc - 1, 0)
      setFoc(n)
      refs.current[n]?.focus()
    } else if (e.key === ' ') {
      e.preventDefault()
      const item = items[foc]
      if (item) toggle(sel, setSel, item.id)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onEnter()
    }
  }

  function renderList(
    id: string,
    label: string,
    items: TransferListItem[],
    sel: Set<string>,
    setSel: (s: Set<string>) => void,
    foc: number,
    setFoc: (n: number) => void,
    refs: React.MutableRefObject<(HTMLLIElement | null)[]>,
    onEnter: () => void,
  ) {
    return (
      <div className="tl__panel">
        <div className="tl__header" id={id}>
          {label} <span className="tl__count">{items.length}</span>
        </div>
        <ul
          role="listbox"
          aria-labelledby={id}
          aria-multiselectable="true"
          className="tl__list"
          onKeyDown={(e) => listKey(e, items, sel, setSel, foc, setFoc, refs, onEnter)}
        >
          {items.length === 0 ? (
            <li className="tl__empty" role="option" aria-selected={false} aria-disabled="true">
              Empty
            </li>
          ) : (
            items.map((item, i) => (
              <li
                key={item.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                role="option"
                aria-selected={sel.has(item.id)}
                tabIndex={i === foc ? 0 : -1}
                className={`tl__item${sel.has(item.id) ? ' tl__item--sel' : ''}`}
                onClick={() => {
                  setFoc(i)
                  toggle(sel, setSel, item.id)
                }}
              >
                <span className="tl__item-label">{item.label}</span>
                {item.description && <span className="tl__item-desc">{item.description}</span>}
              </li>
            ))
          )}
        </ul>
      </div>
    )
  }

  return (
    <div className={`tl ${className}`.trim()}>
      {renderList(
        `${gid}-src`,
        sourceLabel,
        srcItems,
        selSrc,
        setSelSrc,
        focSrc,
        setFocSrc,
        srcRefs,
        () => moveRight(selSrc),
      )}
      <div className="tl__controls" role="group" aria-label="Transfer controls">
        <button
          type="button"
          className="tl__btn"
          aria-label={`Move all to ${targetLabel}`}
          disabled={!srcItems.length}
          onClick={() => moveRight(new Set(srcItems.map((i) => i.id)))}
        >
          {'»'}
        </button>
        <button
          type="button"
          className="tl__btn"
          aria-label={`Move selected to ${targetLabel}`}
          disabled={!selSrc.size}
          onClick={() => moveRight(selSrc)}
        >
          {'›'}
        </button>
        <button
          type="button"
          className="tl__btn"
          aria-label={`Move selected back to ${sourceLabel}`}
          disabled={!selTgt.size}
          onClick={() => moveLeft(selTgt)}
        >
          {'‹'}
        </button>
        <button
          type="button"
          className="tl__btn"
          aria-label={`Move all back to ${sourceLabel}`}
          disabled={!tgtItems.length}
          onClick={() => moveLeft(new Set(tgtItems.map((i) => i.id)))}
        >
          {'«'}
        </button>
      </div>
      {renderList(
        `${gid}-tgt`,
        targetLabel,
        tgtItems,
        selTgt,
        setSelTgt,
        focTgt,
        setFocTgt,
        tgtRefs,
        () => moveLeft(selTgt),
      )}
    </div>
  )
}
