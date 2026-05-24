import { describe, it, expect } from 'vitest'
import { computePanelPosition } from '../lib/components/popover-position'

const baseInput = {
  triggerRect: { top: 100, bottom: 130, left: 200, right: 260, width: 60 },
  panelWidth: 240,
  panelHeight: 180,
  viewportWidth: 1024,
  viewportHeight: 768,
  placement: 'bottom-end' as const,
  margin: 8,
  offset: 6,
}

describe('computePanelPosition - horizontal', () => {
  it('aligns the panel left edge to the trigger left for bottom-start', () => {
    const { left } = computePanelPosition({ ...baseInput, placement: 'bottom-start' })
    expect(left).toBe(200)
  })

  it('aligns the panel right edge to the trigger right for bottom-end', () => {
    const { left } = computePanelPosition({ ...baseInput, placement: 'bottom-end' })
    // trigger.right (260) - panelWidth (240) = 20
    expect(left).toBe(20)
  })

  it('centres the panel on the trigger for bottom', () => {
    const { left } = computePanelPosition({ ...baseInput, placement: 'bottom' })
    // trigger.left (200) + trigger.width/2 (30) - panelWidth/2 (120) = 110
    expect(left).toBe(110)
  })

  it('clamps the panel left to viewport margin when it would overflow off-screen left', () => {
    const { left } = computePanelPosition({
      ...baseInput,
      triggerRect: { top: 100, bottom: 130, left: 5, right: 35, width: 30 },
      placement: 'bottom-end',
    })
    // raw left = 35 - 240 = -205 -> clamped to margin (8)
    expect(left).toBe(8)
  })

  it('clamps the panel right to viewport margin when it would overflow off-screen right', () => {
    const { left } = computePanelPosition({
      ...baseInput,
      triggerRect: { top: 100, bottom: 130, left: 1000, right: 1020, width: 20 },
      placement: 'bottom-start',
    })
    // raw left = 1000 -> max allowed = 1024 - 240 - 8 = 776
    expect(left).toBe(776)
  })
})

describe('computePanelPosition - vertical (auto-flip)', () => {
  it('opens BELOW the trigger when the panel fits below', () => {
    const { top } = computePanelPosition(baseInput)
    // trigger.bottom (130) + offset (6) = 136
    expect(top).toBe(136)
  })

  it('opens ABOVE the trigger when the panel would overflow the viewport bottom', () => {
    // Trigger near the bottom of the viewport, no room below.
    const { top } = computePanelPosition({
      ...baseInput,
      triggerRect: { top: 700, bottom: 730, left: 200, right: 260, width: 60 },
    })
    // space below = 768 - 730 - 8 = 30, panel needs 180 + 6 = 186 -> flip
    // top = 700 - 6 - 180 = 514
    expect(top).toBe(514)
  })

  it('still opens BELOW when both sides are tight but below has at least as much room', () => {
    // Trigger in the middle, both spaces are similar; we prefer below to
    // keep the existing reading order (matches the documented placement).
    const { top } = computePanelPosition({
      ...baseInput,
      panelHeight: 800,
      triggerRect: { top: 380, bottom: 400, left: 200, right: 260, width: 60 },
    })
    // space below = 768 - 400 - 8 = 360, space above = 380 - 8 = 372
    // panel needs 806; neither fits, but space above > space below -> flip
    expect(top).toBeLessThan(400)
  })

  it('clamps the flipped top to the viewport margin when the panel is taller than space above', () => {
    const { top } = computePanelPosition({
      ...baseInput,
      panelHeight: 800,
      triggerRect: { top: 200, bottom: 750, left: 200, right: 260, width: 60 },
    })
    // forced flip (no space below); raw top = 200 - 6 - 800 = -606
    // clamped to margin (8)
    expect(top).toBe(8)
  })

  it('prefers below when below has more room even if neither side fully fits', () => {
    const { top } = computePanelPosition({
      ...baseInput,
      panelHeight: 800,
      triggerRect: { top: 50, bottom: 80, left: 200, right: 260, width: 60 },
    })
    // space below = 768 - 80 - 8 = 680, space above = 50 - 8 = 42
    // neither fits; below has way more room -> stay below
    expect(top).toBe(86)
  })
})
