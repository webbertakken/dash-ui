/**
 * Where a context menu opens: at the pointer, the way OS menus do.
 *
 * Takes the menu's MEASURED size, never a guess: menus hold labels of
 * any length, and a guessed width let a long one run off the edge.
 *   - It opens at the pointer when it fits.
 *   - It flips to the pointer's left (or above it) when it would cross
 *     the right edge (or the bottom).
 *   - When neither side has room, it is clamped inside the margins, and
 *     a menu bigger than the viewport is pinned to the margin.
 *
 * Pure. The Svelte twin is `packages/svelte/src/lib/components/menu-position.ts`.
 */
export interface MenuPositionInput {
  /** The pointer, in viewport coordinates. */
  x: number
  y: number
  menuWidth: number
  menuHeight: number
  viewportWidth: number
  viewportHeight: number
  /** Space kept between the menu and every viewport edge. */
  margin: number
}

function along(pointer: number, size: number, viewport: number, margin: number): number {
  const far = viewport - margin
  if (pointer + size <= far) return Math.max(margin, pointer)
  if (pointer - size >= margin) return pointer - size
  return Math.max(margin, Math.min(pointer, far - size))
}

export function computeMenuPosition(input: MenuPositionInput): { left: number; top: number } {
  return {
    left: along(input.x, input.menuWidth, input.viewportWidth, input.margin),
    top: along(input.y, input.menuHeight, input.viewportHeight, input.margin),
  }
}
