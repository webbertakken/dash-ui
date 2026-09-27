import { cleanup, render } from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'
import Pagination from '../lib/components/Pagination.svelte'

afterEach(() => {
  cleanup()
})

describe('Pagination current page', () => {
  it('is painted brand-blue, not overridden by the idle surface utilities', () => {
    const { container } = render(Pagination, { props: { page: 1, total: 50, pageSize: 10 } })
    const current = container.querySelector('[aria-current="page"]') as HTMLElement
    const idle = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '2',
    )!
    const cls = (el: HTMLElement) => el.className.split(/\s+/)
    expect(cls(current)).toEqual(
      expect.arrayContaining(['bg-brand-05', 'text-white', 'border-brand-05']),
    )
    expect(cls(current)).not.toEqual(expect.arrayContaining(['bg-transparent']))
    expect(cls(current)).not.toContain('text-text-3')
    expect(cls(current)).not.toContain('border-transparent')
    expect(cls(idle)).toEqual(expect.arrayContaining(['bg-transparent', 'text-text-3']))
  })
})
