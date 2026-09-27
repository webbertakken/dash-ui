import { cleanup, fireEvent, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'
import Popover from '../lib/components/Popover.svelte'

afterEach(() => {
  cleanup()
})

describe('Popover trigger', () => {
  it('announces the dialog it opens and anchors the panel to itself', async () => {
    const { getByRole } = render(Popover, { props: { label: 'Filter' } })
    const trigger = getByRole('button', { name: 'Filter' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    trigger.getBoundingClientRect = () =>
      ({ top: 100, bottom: 130, left: 40, right: 96, width: 56, height: 30 }) as DOMRect
    await fireEvent.click(trigger)
    await new Promise((r) => setTimeout(r, 0))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = document.body.querySelector('[role="dialog"]') as HTMLElement
    expect(panel.style.top).toBe('136px')
  })
})
