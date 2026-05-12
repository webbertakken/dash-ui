import { useState, useRef, useEffect, useId, useCallback } from 'react'
import type { KeyboardEvent } from 'react'

export interface MenubarItem {
  id: string
  label: string
  disabled?: boolean
  separator?: boolean
}

export interface MenubarMenu {
  id: string
  label: string
  items: MenubarItem[]
}

export interface MenubarProps {
  menus: MenubarMenu[]
  onAction: (menuId: string, itemId: string) => void
  label?: string
  className?: string
}

export function Menubar({ menus, onAction, label = 'Menu', className }: MenubarProps) {
  const uid = useId()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [activeItemIdx, setActiveItemIdx] = useState(0)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openIdx === null) return
    function handler(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenIdx(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openIdx])

  const openMenu = useCallback(
    (idx: number, focusLast = false) => {
      const eligible = menus[idx].items.filter((i) => !i.separator && !i.disabled)
      setActiveItemIdx(focusLast ? eligible.length - 1 : 0)
      setOpenIdx(idx)
    },
    [menus],
  )

  const closeMenu = useCallback(() => setOpenIdx(null), [])

  const activate = useCallback(
    (menuId: string, itemId: string) => {
      onAction(menuId, itemId)
      setOpenIdx(null)
    },
    [onAction],
  )

  function handleTriggerKeyDown(e: KeyboardEvent, idx: number) {
    const count = menus.length
    if (openIdx === null) {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        triggerRefs.current[(idx + 1) % count]?.focus()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        triggerRefs.current[(idx - 1 + count) % count]?.focus()
      } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openMenu(idx, false)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        openMenu(idx, true)
      } else if (e.key === 'Home') {
        e.preventDefault()
        triggerRefs.current[0]?.focus()
      } else if (e.key === 'End') {
        e.preventDefault()
        triggerRefs.current[count - 1]?.focus()
      }
    } else {
      const menu = menus[openIdx]
      const eligible = menu.items.filter((i) => !i.separator && !i.disabled)
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
        triggerRefs.current[openIdx]?.focus()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveItemIdx((i) => Math.min(i + 1, eligible.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveItemIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setActiveItemIdx(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setActiveItemIdx(eligible.length - 1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const item = eligible[activeItemIdx]
        if (item) activate(menu.id, item.id)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const nextIdx = (openIdx + 1) % count
        openMenu(nextIdx, false)
        triggerRefs.current[nextIdx]?.focus()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prevIdx = (openIdx - 1 + count) % count
        openMenu(prevIdx, false)
        triggerRefs.current[prevIdx]?.focus()
      } else if (e.key === 'Tab') {
        closeMenu()
      }
    }
  }

  return (
    <div
      ref={rootRef}
      role="menubar"
      aria-label={label}
      className={`menubar${className ? ' ' + className : ''}`}
    >
      {menus.map((menu, idx) => {
        const isOpen = openIdx === idx
        const menuId = `${uid}-menu-${idx}`
        const eligible = menu.items.filter((i) => !i.separator && !i.disabled)
        return (
          <div key={menu.id} className="menubar-menu">
            <button
              ref={(el) => {
                triggerRefs.current[idx] = el
              }}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls={isOpen ? menuId : undefined}
              className={`menubar-trigger${isOpen ? ' is-open' : ''}`}
              onClick={() => {
                if (isOpen) closeMenu()
                else openMenu(idx)
              }}
              onKeyDown={(e) => handleTriggerKeyDown(e, idx)}
            >
              {menu.label}
            </button>
            {isOpen && (
              <ul id={menuId} role="menu" aria-label={menu.label} className="menubar-dropdown">
                {menu.items.map((item) => {
                  if (item.separator) {
                    return (
                      <li
                        key={item.id}
                        role="separator"
                        className="menubar-sep"
                        aria-hidden="true"
                      />
                    )
                  }
                  const eligibleIdx = eligible.indexOf(item)
                  return (
                    <li
                      key={item.id}
                      role="menuitem"
                      tabIndex={-1}
                      aria-disabled={item.disabled}
                      data-active={
                        eligibleIdx === activeItemIdx && !item.disabled ? 'true' : undefined
                      }
                      className="menubar-item"
                      onMouseEnter={() => {
                        if (!item.disabled) setActiveItemIdx(eligibleIdx)
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        if (!item.disabled) activate(menu.id, item.id)
                      }}
                    >
                      {item.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
