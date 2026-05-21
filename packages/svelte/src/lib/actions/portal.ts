import type { Action } from 'svelte/action'

/**
 * Move a DOM node into `target` (default: `document.body`) for the
 * lifetime of the action. Used by floating UI primitives so
 * `position: fixed` + `z-index` always escape:
 *
 *   - ancestor `overflow: hidden` / `overflow: clip` (would clip
 *     a non-portalled child even at `position: fixed` if the
 *     ancestor establishes a containing block)
 *   - ancestor `transform`, `filter`, `perspective`, `contain: paint`,
 *     `will-change: transform` (any of which create a containing
 *     block for `position: fixed` descendants, defeating viewport
 *     positioning)
 *   - ancestor stacking contexts with a lower `z-index` than the
 *     popover's `z-index`, which would otherwise trap it underneath
 *     sibling chrome
 *
 * The node still belongs to the Svelte component that owns it: props,
 * reactivity, lifecycle, and event handlers continue to work; only
 * the DOM position changes. The action removes the node on destroy
 * so cleanup is automatic.
 *
 * SSR-safe: actions don't run during server rendering.
 */
export const portal: Action<HTMLElement, HTMLElement | string | undefined> = (
  node,
  target = 'body',
) => {
  const resolveTarget = (value: HTMLElement | string | undefined): HTMLElement | null => {
    if (value === undefined) return document.body
    if (typeof value === 'string') {
      return document.querySelector<HTMLElement>(value)
    }
    return value
  }

  const move = (value: HTMLElement | string | undefined) => {
    const parent = resolveTarget(value)
    if (parent !== null && parent !== node.parentNode) {
      parent.appendChild(node)
    }
  }

  move(target)

  return {
    update(next: HTMLElement | string | undefined) {
      move(next)
    },
    destroy() {
      node.remove()
    },
  }
}
