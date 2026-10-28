import { describe, expect, it } from 'vitest'
import { computeMenuPosition } from '../components/menu-position'

const base = {
  x: 100,
  y: 100,
  menuWidth: 240,
  menuHeight: 200,
  viewportWidth: 1280,
  viewportHeight: 720,
  margin: 8,
}

describe('computeMenuPosition', () => {
  it('opens at the pointer when the menu fits', () => {
    expect(computeMenuPosition(base)).toEqual({ left: 100, top: 100 })
  })

  it('opens to the left of the pointer when it would run off the right edge', () => {
    // 1200 + 240 > 1272: flip so the right edge sits on the pointer.
    expect(computeMenuPosition({ ...base, x: 1200 }).left).toBe(960)
  })

  it('opens above the pointer when it would run off the bottom', () => {
    expect(computeMenuPosition({ ...base, y: 600 }).top).toBe(400)
  })

  it('measures the real menu, not a guess: a wide one near the edge still fits', () => {
    const { left } = computeMenuPosition({ ...base, x: 1100, menuWidth: 300 })
    expect(left + 300).toBeLessThanOrEqual(1280 - 8)
  })

  it('clamps inside the margins when neither side of the pointer has room', () => {
    // Too tall to open below or above a pointer in the middle.
    expect(computeMenuPosition({ ...base, y: 360, menuHeight: 600 }).top).toBe(112)
    // Wider than the space either side of a centred pointer.
    expect(computeMenuPosition({ ...base, x: 640, viewportWidth: 1000, menuWidth: 700 }).left).toBe(
      292,
    )
  })

  it('pins to the margin when the menu is bigger than the viewport', () => {
    expect(
      computeMenuPosition({ ...base, x: 50, y: 50, menuWidth: 2000, menuHeight: 2000 }),
    ).toEqual({
      left: 8,
      top: 8,
    })
  })

  it('never opens at a negative position from a pointer outside the viewport', () => {
    expect(computeMenuPosition({ ...base, x: -20, y: -20 })).toEqual({ left: 8, top: 8 })
  })
})
