// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'
import GroupFieldset from './GroupFieldset.svelte'

afterEach(() => cleanup())

const base = {
  groupId: 'alpha',
  label: 'ALPHA',
  logo: '/alpha.svg',
  rollup: 'up' as const,
  reachable: 2,
  total: 3,
  width: 300,
  height: 200,
}

describe('GroupFieldset', () => {
  it('renders the label, count and rollup pill', () => {
    const { getByTestId } = render(GroupFieldset, { props: { data: base } })
    const el = getByTestId('fieldset-alpha')
    expect(el.textContent).toContain('ALPHA')
    expect(el.textContent).toContain('2/3')
    expect(el.textContent).toContain('up')
  })

  it('applies accent classes when provided', () => {
    const { getByTestId } = render(GroupFieldset, {
      props: { data: { ...base, accent: { border: 'border-status-success/25', tint: 'from-x' } } },
    })
    expect(getByTestId('fieldset-alpha').className).toContain('border-status-success/25')
  })

  it('omits the logo img when logo is empty', () => {
    const { getByTestId } = render(GroupFieldset, { props: { data: { ...base, logo: '' } } })
    expect(getByTestId('fieldset-alpha').querySelector('img')).toBeNull()
  })

  it('keeps the truthful rollup label even when a display clamp softens the pill', () => {
    const { getByTestId } = render(GroupFieldset, {
      props: { data: { ...base, rollup: 'down' as const, displayRollup: 'unknown' as const } },
    })
    expect(getByTestId('fieldset-alpha').textContent).toContain('down')
  })
})
