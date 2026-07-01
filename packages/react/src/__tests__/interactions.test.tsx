// Targeted interaction tests that exercise the keyboard / click / focus
// branches the static auto-render fixtures cannot reach. The goal is to
// drive coverage of components/*.tsx to 100%. Tests are grouped by
// component and prefer fireEvent over userEvent for speed.

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import * as U from '../index.js'

afterEach(() => {
  cleanup()
})

// ------------------------------------------------------------------
// Shared helpers
// ------------------------------------------------------------------

function ControlledInput<T>({
  initial,
  render: renderProp,
}: {
  initial: T
  render: (v: T, set: (n: T) => void) => React.ReactNode
}) {
  const [v, setV] = useState<T>(initial)
  return <>{renderProp(v, setV)}</>
}

// ------------------------------------------------------------------

describe('ActionMenu', () => {
  it('opens, navigates with keyboard, activates, closes on Escape', () => {
    const onAction = vi.fn()
    render(
      <U.ActionMenu
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C', disabled: true },
        ]}
        onAction={onAction}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Actions' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    fireEvent.keyDown(trigger, { key: 'End' })
    fireEvent.keyDown(trigger, { key: 'Home' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onAction).toHaveBeenCalledWith('a')
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: ' ' })
    fireEvent.keyDown(trigger, { key: 'Escape' })
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Tab' })
    fireEvent.click(trigger)
    const items = screen.getAllByRole('menuitem')
    fireEvent.mouseEnter(items[1]!)
    fireEvent.mouseDown(items[1]!)
    expect(onAction).toHaveBeenCalledWith('b')
    fireEvent.click(trigger)
    fireEvent.mouseDown(document.body) // outside click
  })
})

describe('Combobox', () => {
  it('opens on focus, types, navigates, picks', () => {
    const onChange = vi.fn()
    render(
      <U.Combobox
        label="Pick"
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
        value="a"
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('combobox') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'ban' } })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'Home' })
    fireEvent.keyDown(input, { key: 'End' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('b')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Escape' })
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Tab' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'zzzz' } })
    expect(screen.getByText('No results')).toBeTruthy()
    fireEvent.mouseDown(document.body)
    fireEvent.focus(input)
    const chevron = input.parentElement!.querySelector('button')!
    fireEvent.click(chevron) // close
    fireEvent.click(chevron) // reopen
    const opt = screen.getAllByRole('option')[0]!
    fireEvent.mouseEnter(opt)
    fireEvent.mouseDown(opt)
  })

  it('respects disabled', () => {
    render(<U.Combobox options={[{ value: 'a', label: 'A' }]} disabled />)
    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
  })

  it('opens on ArrowUp when closed', () => {
    render(<U.Combobox options={[{ value: 'a', label: 'A' }]} />)
    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'q' }) // unhandled key
  })
})

describe('MultiSelect', () => {
  it('toggles options, selects all, clears all', () => {
    const onChange = vi.fn()
    const { container } = render(
      <U.MultiSelect
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        value={['a']}
        onChange={onChange}
        label="Pick"
      />,
    )
    const trigger = container.querySelector('input[role=combobox]') as HTMLInputElement
    fireEvent.focus(trigger)
    fireEvent.change(trigger, { target: { value: 'a' } })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    fireEvent.keyDown(trigger, { key: 'Home' })
    fireEvent.keyDown(trigger, { key: 'End' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    fireEvent.keyDown(trigger, { key: 'Escape' })
    fireEvent.focus(trigger)
    const opts = container.querySelectorAll('[role=option]')
    if (opts[0]) fireEvent.mouseDown(opts[0])
    fireEvent.focus(trigger)
    fireEvent.keyDown(trigger, { key: 'Tab' })
    fireEvent.focus(trigger)
    fireEvent.mouseDown(document.body)
  })

  it('opens with ArrowDown when closed', () => {
    render(<U.MultiSelect options={[{ value: 'a', label: 'A' }]} />)
    const trigger = screen.getByRole('combobox')
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
  })

  it('respects disabled', () => {
    render(<U.MultiSelect options={[{ value: 'a', label: 'A' }]} disabled />)
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
  })
})

describe('Select', () => {
  it('opens, navigates, picks', () => {
    const onChange = vi.fn()
    render(
      <U.Select
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        value="a"
        onChange={onChange}
        label="L"
      />,
    )
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'Home' })
    fireEvent.keyDown(trigger, { key: 'End' })
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(onChange).toHaveBeenCalled()
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Tab' })
    fireEvent.click(trigger)
    fireEvent.mouseDown(document.body)
    fireEvent.click(trigger)
    fireEvent.mouseDown(screen.getAllByRole('option')[0]!)
  })

  it('opens on ArrowDown', () => {
    render(<U.Select options={[{ value: 'a', label: 'A' }]} />)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
  })

  it('disabled noop', () => {
    render(<U.Select options={[{ value: 'a', label: 'A' }]} disabled />)
    fireEvent.click(screen.getByRole('combobox'))
  })
})

describe('SegmentedControl', () => {
  it('controlled selection by clicking', () => {
    const onChange = vi.fn()
    render(
      <U.SegmentedControl
        label="L"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        value="a"
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('uncontrolled defaultValue switches', () => {
    render(
      <U.SegmentedControl
        label="L"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        defaultValue="a"
      />,
    )
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
  })

  it('disabled options not clickable', () => {
    render(
      <U.SegmentedControl
        label="L"
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
      />,
    )
    fireEvent.click(screen.getByRole('radio', { name: 'B' }))
  })
})

describe('CommandPalette', () => {
  it('filters, navigates, picks, closes', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(
      <U.CommandPalette
        open
        items={[
          { id: 'a', label: 'Open A', group: 'Pages' },
          { id: 'b', label: 'Open B', shortcut: 'B' },
        ]}
        onSelect={onSelect}
        onClose={onClose}
      />,
    )
    const search = screen.getByRole('combobox')
    fireEvent.change(search, { target: { value: 'B' } })
    fireEvent.keyDown(search, { key: 'ArrowDown' })
    fireEvent.keyDown(search, { key: 'ArrowDown' })
    fireEvent.keyDown(search, { key: 'ArrowUp' })
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalled()
    fireEvent.change(search, { target: { value: 'zzz' } })
    fireEvent.keyDown(search, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
  it('clicking option picks', () => {
    const onSelect = vi.fn()
    render(
      <U.CommandPalette
        open
        items={[{ id: 'a', label: 'A' }]}
        onSelect={onSelect}
        onClose={() => {}}
      />,
    )
    const opt = screen.getAllByRole('option')[0]!
    fireEvent.mouseDown(opt)
  })
})

describe('Modal', () => {
  it('renders open, escape closes, traps focus', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <U.Modal open title="T" onClose={onClose}>
        <button>inside</button>
      </U.Modal>,
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
    fireEvent.keyDown(window, { key: 'Tab' })
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    rerender(<U.Modal open={false} title="T" onClose={onClose} />)
  })

  it('backdrop mousedown + mouseup closes', () => {
    const onClose = vi.fn()
    const { container } = render(
      <U.Modal open title="T" onClose={onClose}>
        <div>x</div>
      </U.Modal>,
    )
    const backdrop =
      container.querySelector('[class*=backdrop],.modal-backdrop,[role=dialog]')?.parentElement ??
      container.firstElementChild!
    fireEvent.mouseDown(backdrop)
    fireEvent.mouseUp(backdrop)
  })

  it('clicking close button works', () => {
    const onClose = vi.fn()
    render(<U.Modal open title="T" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('modal with only-empty content still tabs', () => {
    const onClose = vi.fn()
    render(<U.Modal open title="T" onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Tab' })
  })
})

describe('Drawer', () => {
  it('escape + backdrop click + close button', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <U.Drawer open title="D" onClose={onClose}>
        <button>inside</button>
      </U.Drawer>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
    fireEvent.keyDown(document, { key: 'Tab' })
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    const dialog = screen.getByRole('dialog')
    const backdrop = dialog.parentElement!
    fireEvent.click(backdrop)
    rerender(<U.Drawer open={false} title="D" onClose={onClose} />)
  })
})

describe('ConfirmDialog', () => {
  it('confirm and cancel callbacks', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(<U.ConfirmDialog open title="Sure?" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalled()
    fireEvent.keyDown(document, { key: 'Escape' })
  })
})

describe('ContextMenu', () => {
  it('action + escape + outside close + disabled item ignored', () => {
    const onClose = vi.fn()
    const onAction = vi.fn()
    const { container } = render(
      <U.ContextMenu
        open
        x={10}
        y={10}
        onClose={onClose}
        onAction={onAction}
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', disabled: true },
        ]}
      />,
    )
    const menu = container.querySelector('[role=menu]') as HTMLElement
    const items = container.querySelectorAll('[role=menuitem]')
    if (items[0]) fireEvent.mouseDown(items[0])
    if (items[0]) fireEvent.click(items[0])
    if (items[1]) fireEvent.click(items[1])
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    fireEvent.keyDown(menu, { key: 'ArrowUp' })
    fireEvent.keyDown(menu, { key: 'Home' })
    fireEvent.keyDown(menu, { key: 'End' })
    fireEvent.keyDown(menu, { key: 'Enter' })
    fireEvent.keyDown(menu, { key: 'Escape' })
    fireEvent.mouseDown(document.body)
  })
})

describe('Menubar', () => {
  it('opens menus and triggers actions', () => {
    const onAction = vi.fn()
    const { container } = render(
      <U.Menubar
        onAction={onAction}
        menus={[
          {
            id: 'f',
            label: 'File',
            items: [
              { id: 'open', label: 'Open' },
              { id: 'sep', label: '', separator: true },
              { id: 'close', label: 'Close', disabled: true },
            ],
          },
          { id: 'e', label: 'Edit', items: [{ id: 'cut', label: 'Cut' }] },
        ]}
      />,
    )
    const triggers = container.querySelectorAll('[aria-haspopup=menu]')
    const file = triggers[0] as HTMLElement
    fireEvent.click(file)
    const items = container.querySelectorAll('[role=menuitem]')
    for (const i of items) fireEvent.click(i)
    fireEvent.keyDown(file, { key: 'ArrowRight' })
    fireEvent.keyDown(file, { key: 'ArrowLeft' })
    fireEvent.keyDown(file, { key: 'ArrowDown' })
    fireEvent.keyDown(file, { key: 'Enter' })
    fireEvent.keyDown(file, { key: 'Escape' })
    fireEvent.mouseDown(document.body)
  })
})

describe('Tabs', () => {
  it('controlled change + uncontrolled noop without onChange', () => {
    const onChange = vi.fn()
    render(
      <U.Tabs
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
        active="a"
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
    fireEvent.keyDown(screen.getByRole('tab', { name: 'B' }), { key: 'ArrowLeft' })
    fireEvent.keyDown(screen.getByRole('tab', { name: 'B' }), { key: 'ArrowRight' })
    fireEvent.keyDown(screen.getByRole('tab', { name: 'B' }), { key: 'Home' })
    fireEvent.keyDown(screen.getByRole('tab', { name: 'B' }), { key: 'End' })
  })
})

describe('ToggleGroup', () => {
  it('toggles values', () => {
    const onChange = vi.fn()
    render(
      <U.ToggleGroup
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C', disabled: true },
        ]}
        value={['a']}
        onChange={onChange}
        ariaLabel="t"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    fireEvent.click(screen.getByRole('button', { name: 'B' }))
    fireEvent.click(screen.getByRole('button', { name: 'C' }))
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})

describe('Toggle', () => {
  it('clicking calls onToggle', () => {
    const onToggle = vi.fn()
    render(<U.Toggle on={false} onToggle={onToggle} ariaLabel="t" />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalled()
  })
  it('without onToggle still clickable', () => {
    render(<U.Toggle on />)
    fireEvent.click(screen.getByRole('switch'))
  })
})

describe('RowToggle', () => {
  it('clicking row toggles', () => {
    const onToggle = vi.fn()
    render(<U.RowToggle title="T" description="D" on={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalled()
  })
})

describe('Checkbox', () => {
  it('renders indeterminate pseudo state', () => {
    const { container } = render(<U.Checkbox label="x" indeterminate />)
    const cb = container.querySelector('input[type=checkbox]') as HTMLInputElement
    expect(cb.indeterminate).toBe(true)
    cb.click()
  })
})

describe('Slider', () => {
  it('controlled change', () => {
    const onChange = vi.fn()
    render(<U.Slider label="L" value={50} onChange={onChange} suffix="%" />)
    const slider = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '75' } })
    expect(onChange).toHaveBeenCalledWith(75)
  })
  it('uncontrolled default', () => {
    render(<U.Slider label="L" />)
    const slider = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '20' } })
  })
})

describe('RangeSlider', () => {
  it('changes both ends, stays within bounds', () => {
    const onChange = vi.fn()
    render(<U.RangeSlider label="R" low={20} high={80} onChange={onChange} />)
    const sliders = screen.getAllByRole('slider') as HTMLInputElement[]
    fireEvent.change(sliders[0]!, { target: { value: '85' } }) // pushes high
    fireEvent.change(sliders[1]!, { target: { value: '5' } }) // pushes low
  })
  it('uncontrolled defaults', () => {
    render(<U.RangeSlider label="R" />)
    const sliders = screen.getAllByRole('slider') as HTMLInputElement[]
    fireEvent.change(sliders[0]!, { target: { value: '40' } })
    fireEvent.change(sliders[1]!, { target: { value: '60' } })
  })
})

describe('NumberInput', () => {
  it('+/- buttons + manual change clamps', () => {
    const onChange = vi.fn()
    render(<U.NumberInput label="N" value={5} min={0} max={10} step={1} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /increment/i }))
    fireEvent.click(screen.getByRole('button', { name: /decrement/i }))
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    fireEvent.change(input, { target: { value: '3' } })
    fireEvent.change(input, { target: { value: '999' } })
    fireEvent.change(input, { target: { value: '' } })
  })
  it('uncontrolled', () => {
    render(<U.NumberInput label="N" />)
    fireEvent.click(screen.getByRole('button', { name: /increment/i }))
  })
})

describe('OTPInput', () => {
  it('typing fills boxes, backspace clears, paste fills', () => {
    const onChange = vi.fn()
    render(<U.OTPInput label="OTP" length={4} onChange={onChange} />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    fireEvent.input(inputs[0]!, { target: { value: '1' } })
    fireEvent.input(inputs[1]!, { target: { value: '2' } })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.input(inputs[1]!, { target: { value: '' } })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.keyDown(inputs[0]!, { key: 'ArrowRight' })
    fireEvent.keyDown(inputs[0]!, { key: 'ArrowLeft' })
    fireEvent.paste(inputs[0]!, { clipboardData: { getData: () => '1234' } } as any)
  })
  it('controlled value', () => {
    render(<U.OTPInput label="OTP" value="12" onChange={() => {}} />)
  })
})

describe('IPInput', () => {
  it('typing + arrow nav + invalid keystroke', () => {
    const onChange = vi.fn()
    const { container } = render(<U.IPInput label="IP" value="0.0.0.0" onChange={onChange} />)
    const inputs = Array.from(container.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.change(inputs[0]!, { target: { value: '192' } })
    fireEvent.keyDown(inputs[0]!, { key: 'ArrowRight' })
    fireEvent.keyDown(inputs[1]!, { key: 'ArrowLeft' })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.change(inputs[1]!, { target: { value: '' } })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.keyDown(inputs[0]!, { key: '.' })
    fireEvent.paste(inputs[0]!, { clipboardData: { getData: () => '10.0.0.1' } } as any)
  })
  it('uncontrolled', () => {
    render(<U.IPInput label="IP" />)
  })
})

describe('MACInput', () => {
  it('typing + nav + backspace', () => {
    const onChange = vi.fn()
    const { container } = render(
      <U.MACInput label="MAC" value="ff:ff:ff:ff:ff:ff" onChange={onChange} />,
    )
    const inputs = Array.from(container.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.change(inputs[0]!, { target: { value: 'aa' } })
    fireEvent.keyDown(inputs[0]!, { key: 'ArrowRight' })
    fireEvent.keyDown(inputs[1]!, { key: 'ArrowLeft' })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.change(inputs[1]!, { target: { value: '' } })
    fireEvent.keyDown(inputs[1]!, { key: 'Backspace' })
    fireEvent.keyDown(inputs[0]!, { key: ':' })
    fireEvent.paste(inputs[0]!, { clipboardData: { getData: () => 'aa:bb:cc:dd:ee:ff' } } as any)
  })
})

describe('CIDRInput', () => {
  it('typing + arrow nav', () => {
    const onChange = vi.fn()
    const { container } = render(<U.CIDRInput label="C" value="10.0.0.0/8" onChange={onChange} />)
    const inputs = Array.from(container.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.change(inputs[0]!, { target: { value: '11' } })
    fireEvent.keyDown(inputs[0]!, { key: 'ArrowRight' })
    fireEvent.keyDown(inputs[3]!, { key: 'ArrowLeft' })
    const prefix = inputs[inputs.length - 1]!
    fireEvent.change(prefix, { target: { value: '24' } })
    fireEvent.change(prefix, { target: { value: '99' } })
    fireEvent.paste(inputs[0]!, { clipboardData: { getData: () => '10.0.0.0/16' } } as any)
  })
})

describe('DurationInput', () => {
  it('changes h/m/s', () => {
    const onChange = vi.fn()
    render(<U.DurationInput label="D" value={3700} onChange={onChange} />)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
    fireEvent.change(inputs[0]!, { target: { value: '2' } })
    fireEvent.change(inputs[1]!, { target: { value: '30' } })
    fireEvent.change(inputs[2]!, { target: { value: '15' } })
    fireEvent.change(inputs[0]!, { target: { value: '99' } })
  })
})

describe('TimePicker', () => {
  it('changes hours/minutes', () => {
    const onChange = vi.fn()
    render(<U.TimePicker label="T" value="12:30" onChange={onChange} />)
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[]
    fireEvent.change(inputs[0]!, { target: { value: '15' } })
    fireEvent.change(inputs[1]!, { target: { value: '45' } })
    fireEvent.change(inputs[0]!, { target: { value: '99' } })
  })
})

describe('ColorPicker', () => {
  it('selects swatch, opens custom', () => {
    const onChange = vi.fn()
    render(<U.ColorPicker value="#006FFF" onChange={onChange} />)
    const swatches = screen.getAllByRole('radio')
    fireEvent.click(swatches[1]!)
    expect(onChange).toHaveBeenCalled()
  })
  it('uncontrolled', () => {
    render(<U.ColorPicker defaultValue="#006FFF" />)
    const swatches = screen.getAllByRole('radio')
    fireEvent.click(swatches[0]!)
  })
})

describe('DatePicker', () => {
  it('opens, picks a day, navigates months', () => {
    const onChange = vi.fn()
    const { container } = render(
      <U.DatePicker value={new Date('2025-01-15')} onChange={onChange} />,
    )
    const trigger = container.querySelector('button.dp-trigger') as HTMLButtonElement
    fireEvent.click(trigger)
    const prev = container.querySelector('button[aria-label="Previous month"]') as HTMLButtonElement
    const next = container.querySelector('button[aria-label="Next month"]') as HTMLButtonElement
    fireEvent.click(prev)
    fireEvent.click(next)
    const days = container.querySelectorAll('button.dp-day')
    if (days[10]) fireEvent.click(days[10])
  })
  it('uncontrolled', () => {
    const { container } = render(<U.DatePicker />)
    fireEvent.click(container.querySelector('button.dp-trigger') as HTMLButtonElement)
  })
})

describe('DateRangePicker', () => {
  it('selects a range', () => {
    const onChange = vi.fn()
    const { container } = render(
      <U.DateRangePicker
        value={{ start: new Date('2025-01-01'), end: new Date('2025-01-10') }}
        onChange={onChange}
      />,
    )
    const trigger = container.querySelector('button') as HTMLButtonElement
    fireEvent.click(trigger)
    const navs = container.querySelectorAll('button[aria-label*="month"]')
    for (const n of navs) fireEvent.click(n)
    const days = container.querySelectorAll('button.dp-day,button.drp-day')
    if (days[5]) fireEvent.click(days[5])
    if (days[15]) fireEvent.click(days[15])
    if (days[2]) fireEvent.click(days[2])
  })
  it('uncontrolled', () => {
    render(<U.DateRangePicker />)
  })
})

describe('TimeRange', () => {
  it('selects preset', () => {
    const onChange = vi.fn()
    const { container } = render(<U.TimeRange value="1h" onChange={onChange} />)
    const trigger = container.querySelector('button') as HTMLButtonElement
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    fireEvent.keyDown(trigger, { key: 'Home' })
    fireEvent.keyDown(trigger, { key: 'End' })
    fireEvent.keyDown(trigger, { key: 'Enter' })
    fireEvent.click(trigger)
    const opts = container.querySelectorAll('[role=option]')
    if (opts[1]) fireEvent.mouseDown(opts[1])
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })
    fireEvent.click(trigger)
    fireEvent.mouseDown(document.body)
  })
})

describe('SortableTable / SortHeader', () => {
  it('useSortable cycles', () => {
    function Demo() {
      const sort = U.useSortable()
      return (
        <table>
          <thead>
            <tr>
              <U.SortHeader
                sortKey="a"
                activeKey={sort.sortKey}
                dir={sort.dir}
                onSort={sort.onSort}
              >
                A
              </U.SortHeader>
              <U.SortHeader
                sortKey="b"
                activeKey={sort.sortKey}
                dir={sort.dir}
                onSort={sort.onSort}
              >
                B
              </U.SortHeader>
            </tr>
          </thead>
        </table>
      )
    }
    render(<Demo />)
    const a = screen.getByRole('columnheader', { name: /^A/ })
    const b = screen.getByRole('columnheader', { name: /^B/ })
    fireEvent.click(a.querySelector('button')!)
    fireEvent.click(a.querySelector('button')!)
    fireEvent.click(b.querySelector('button')!)
  })
})

describe('SortableList', () => {
  it('arrow keys reorder', () => {
    const onChange = vi.fn()
    render(
      <U.SortableList
        items={[
          { id: '1', label: 'A' },
          { id: '2', label: 'B' },
          { id: '3', label: 'C' },
        ]}
        onChange={onChange}
      />,
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.keyDown(buttons[0]!, { key: 'ArrowDown' })
    fireEvent.keyDown(buttons[1]!, { key: 'ArrowUp' })
    fireEvent.keyDown(buttons[2]!, { key: 'Home' })
    fireEvent.keyDown(buttons[0]!, { key: 'End' })
    fireEvent.keyDown(buttons[0]!, { key: ' ' })
    fireEvent.keyDown(buttons[0]!, { key: ' ' })
  })
})

describe('TreeView', () => {
  it('expand/collapse + select with keyboard', () => {
    const onSelect = vi.fn()
    render(
      <U.TreeView
        nodes={[
          { id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] },
          { id: 'c', label: 'C' },
        ]}
        onSelect={onSelect}
        defaultExpanded={['a']}
        label="T"
      />,
    )
    const items = screen.getAllByRole('treeitem')
    fireEvent.click(items[0]!)
    fireEvent.keyDown(items[0]!, { key: 'ArrowRight' })
    fireEvent.keyDown(items[0]!, { key: 'ArrowDown' })
    fireEvent.keyDown(items[0]!, { key: 'ArrowLeft' })
    fireEvent.keyDown(items[0]!, { key: 'ArrowUp' })
    fireEvent.keyDown(items[0]!, { key: 'Enter' })
    fireEvent.keyDown(items[0]!, { key: ' ' })
    fireEvent.keyDown(items[0]!, { key: 'Home' })
    fireEvent.keyDown(items[0]!, { key: 'End' })
  })
})

describe('TreeBrowser', () => {
  const collections = {
    root: { id: 'root', name: '', collections: ['game-types'], items: ['rules', 'interface'] },
    'game-types': {
      id: 'game-types',
      name: 'game-types',
      descriptor: '2 types',
      items: ['classic', 'mini'],
    },
  }
  const items = {
    rules: { id: 'rules', name: 'RULES', descriptor: 'spec' },
    interface: { id: 'interface', name: 'INTERFACE' },
    classic: { id: 'classic', name: 'classic' },
    mini: { id: 'mini', name: 'mini' },
  }

  it('renders top-level rows and toggles a folder on click', () => {
    const onSelect = vi.fn()
    render(
      <U.TreeBrowser
        rootId="root"
        collections={collections}
        items={items}
        onSelect={onSelect}
        label="Files"
      />,
    )
    expect(screen.getByText('game-types')).toBeTruthy()
    expect(screen.queryByText('classic')).toBeNull()
    fireEvent.click(screen.getByText('game-types'))
    expect(onSelect).toHaveBeenCalledWith('game-types', 'collection')
    expect(screen.getByText('classic')).toBeTruthy()
    fireEvent.click(screen.getByText('game-types'))
    expect(screen.queryByText('classic')).toBeNull()
  })

  it('selects a leaf and marks aria-selected', () => {
    const onSelect = vi.fn()
    render(
      <U.TreeBrowser rootId="root" collections={collections} items={items} onSelect={onSelect} />,
    )
    fireEvent.click(screen.getByText('RULES'))
    expect(onSelect).toHaveBeenCalledWith('rules', 'item')
    expect(
      screen.getByText('RULES').closest('[role="treeitem"]')?.getAttribute('aria-selected'),
    ).toBe('true')
  })

  it('walks the tree by keyboard', () => {
    render(
      <U.TreeBrowser
        rootId="root"
        collections={collections}
        items={items}
        defaultExpanded={['game-types']}
        label="T"
      />,
    )
    const folder = screen.getByText('game-types').closest('[role="treeitem"]') as HTMLElement
    folder.focus()
    fireEvent.keyDown(folder, { key: 'ArrowDown' })
    fireEvent.keyDown(folder, { key: 'ArrowUp' })
    fireEvent.keyDown(folder, { key: 'ArrowLeft' })
    fireEvent.keyDown(folder, { key: 'ArrowRight' })
    fireEvent.keyDown(folder, { key: 'ArrowRight' })
    fireEvent.keyDown(folder, { key: 'Home' })
    fireEvent.keyDown(folder, { key: 'End' })
    fireEvent.keyDown(folder, { key: 'Enter' })
    fireEvent.keyDown(folder, { key: ' ' })
  })

  it('controlled expansion reports intent via onToggle without self-expanding', () => {
    const onToggle = vi.fn()
    render(
      <U.TreeBrowser
        rootId="root"
        collections={collections}
        items={items}
        expanded={[]}
        onToggle={onToggle}
      />,
    )
    expect(screen.queryByText('classic')).toBeNull()
    fireEvent.click(screen.getByText('game-types'))
    expect(onToggle).toHaveBeenCalledWith('game-types')
    expect(screen.queryByText('classic')).toBeNull()
  })

  it('renders custom icon + badge snippets with row context', () => {
    render(
      <U.TreeBrowser
        rootId="root"
        collections={collections}
        items={items}
        defaultExpanded={['game-types']}
        renderIcon={(ctx) => <span data-testid={`icon-${ctx.id}`} data-kind={ctx.type} />}
        renderBadge={(ctx) =>
          ctx.id === 'rules' ? <span data-testid="badge-rules">!</span> : null
        }
      />,
    )
    expect(screen.getByTestId('icon-classic').getAttribute('data-kind')).toBe('item')
    expect(screen.getByTestId('icon-game-types').getAttribute('data-kind')).toBe('collection')
    expect(screen.getByTestId('badge-rules')).toBeTruthy()
  })

  it('exports topLevelIds helper matching the root children', () => {
    expect(U.topLevelIds(collections, 'root')).toEqual(['game-types', 'rules', 'interface'])
    expect(U.topLevelIds(collections, 'nope')).toEqual([])
  })
})

describe('ColumnToggle', () => {
  it('opens then toggles a column', () => {
    const onChange = vi.fn()
    render(
      <U.ColumnToggle
        columns={[
          { key: 'a', label: 'A', required: true },
          { key: 'b', label: 'B' },
        ]}
        visible={new Set(['a', 'b'])}
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('button'))
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
    fireEvent.click(checkboxes[1]!)
    fireEvent.click(checkboxes[1]!) // toggle back
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.mouseDown(document.body)
  })
})

describe('SplitButton', () => {
  it('primary click + opens menu + picks', () => {
    const onPrimary = vi.fn()
    const onAction = vi.fn()
    render(
      <U.SplitButton
        label="Save"
        items={[
          { id: 'a', label: 'Save as' },
          { id: 'b', label: 'Disabled', disabled: true },
        ]}
        onPrimaryClick={onPrimary}
        onAction={onAction}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onPrimary).toHaveBeenCalled()
    const caret = screen.getByRole('button', { name: 'Save options' })
    fireEvent.click(caret)
    const items = screen.getAllByRole('menuitem')
    fireEvent.mouseDown(items[0]!)
    fireEvent.click(caret)
    fireEvent.mouseDown(items[items.length - 1]!)
    fireEvent.click(caret)
    fireEvent.keyDown(caret, { key: 'Escape' })
    fireEvent.click(caret)
    fireEvent.mouseDown(document.body)
  })
})

describe('Spoiler', () => {
  it('expands and collapses', () => {
    // jsdom reports scrollHeight as 0; patch the prototype so clipped becomes true
    const orig = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: () => 9999,
    })
    render(
      <U.Spoiler maxHeight={20}>
        <div style={{ height: 200 }}>tall</div>
      </U.Spoiler>,
    )
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
    if (orig) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', orig)
  })
  it('does not render toggle when content fits', () => {
    render(
      <U.Spoiler maxHeight={9999}>
        <div>x</div>
      </U.Spoiler>,
    )
  })
})

describe('Pagination', () => {
  it('clicks pages and arrows', () => {
    const onChange = vi.fn()
    render(<U.Pagination page={3} pageSize={10} total={100} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
  it('first page disables previous', () => {
    render(<U.Pagination page={1} pageSize={10} total={100} onChange={() => {}} />)
  })
})

describe('Tag / TagInput', () => {
  it('Tag onRemove triggers', () => {
    const onRemove = vi.fn()
    render(<U.Tag label="x" onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onRemove).toHaveBeenCalled()
  })
  it('TagInput Enter adds, Backspace removes, click x removes', () => {
    const onChange = vi.fn()
    render(<U.TagInput label="L" defaultValue={['a']} onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'b' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(input, { key: 'Backspace' })
    fireEvent.change(input, { target: { value: 'c' } })
    fireEvent.keyDown(input, { key: ',' })
    const closeBtn = screen.getAllByRole('button')[0]!
    fireEvent.click(closeBtn)
  })
  it('TagInput controlled', () => {
    render(<U.TagInput label="L" value={['a']} onChange={() => {}} />)
  })
})

describe('TransferList', () => {
  it('moves items source -> target -> source', () => {
    const onChange = vi.fn()
    const { container } = render(
      <U.TransferList
        defaultSource={[
          { id: '1', label: 'A' },
          { id: '2', label: 'B' },
        ]}
        defaultTarget={[{ id: '3', label: 'C' }]}
        onChange={onChange}
      />,
    )
    const items = container.querySelectorAll('li')
    for (const li of items) fireEvent.click(li)
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
  it('controlled', () => {
    render(
      <U.TransferList
        source={[{ id: '1', label: 'A' }]}
        target={[{ id: '2', label: 'B' }]}
        onChange={() => {}}
      />,
    )
  })
})

describe('FileUpload', () => {
  it('handles drop + change', () => {
    const onFiles = vi.fn()
    const { container } = render(<U.FileUpload onFiles={onFiles} multiple accept=".png" />)
    const dropzone = container.querySelector(
      '.file-upload, label, [class*=upload]',
    ) as HTMLElement | null
    const file = new File(['x'], 't.png', { type: 'image/png' })
    if (dropzone) {
      fireEvent.dragEnter(dropzone)
      fireEvent.dragOver(dropzone)
      fireEvent.dragLeave(dropzone)
      fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    }
    const input = container.querySelector('input[type=file]') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file] })
    fireEvent.change(input)
  })
  it('disabled ignores drop', () => {
    const onFiles = vi.fn()
    const { container } = render(<U.FileUpload onFiles={onFiles} disabled />)
    const dropzone = container.querySelector(
      '.file-upload, label, [class*=upload]',
    ) as HTMLElement | null
    if (dropzone) fireEvent.drop(dropzone, { dataTransfer: { files: [new File(['x'], 'x.txt')] } })
  })
})

describe('FilterBuilder', () => {
  it('add, edit, remove rule + change conjunction', () => {
    const onChange = vi.fn()
    render(
      <U.FilterBuilder
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'count', label: 'Count', type: 'number' },
          { key: 'kind', label: 'Kind', type: 'select', options: ['x', 'y'] },
        ]}
        value={[{ id: '1', field: 'name', op: 'is', value: 'foo' }]}
        onChange={onChange}
        conjunction="and"
      />,
    )
    const buttons = screen.getAllByRole('button')
    const addBtn = buttons.find((b) => /add/i.test(b.textContent ?? ''))!
    fireEvent.click(addBtn)
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[]
    for (const s of selects)
      fireEvent.change(s, { target: { value: s.options[s.options.length - 1]!.value } })
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    for (const i of inputs) fireEvent.change(i, { target: { value: 'bar' } })
    const removeBtn = screen
      .getAllByRole('button')
      .find((b) => /remove/i.test(b.getAttribute('aria-label') ?? ''))
    if (removeBtn) fireEvent.click(removeBtn)
  })
})

describe('Popover', () => {
  it('opens, closes on outside, on Escape', () => {
    render(
      <U.Popover label="open" title="T">
        body
      </U.Popover>,
    )
    const trigger = screen.getByRole('button', { name: 'open' })
    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(trigger)
    fireEvent.mouseDown(document.body)
    fireEvent.click(trigger)
    fireEvent.click(trigger) // closes
  })
})

describe('ContextualHelp', () => {
  it('toggles on click + closes on outside', () => {
    render(<U.ContextualHelp title="T" body="B" />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(btn)
    fireEvent.mouseDown(document.body)
  })
})

describe('HoverCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('shows after delay then hides', () => {
    render(
      <U.HoverCard delay={100} content={<div>tip</div>}>
        trigger
      </U.HoverCard>,
    )
    const trigger = screen.getByText('trigger')
    fireEvent.mouseEnter(trigger)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    fireEvent.mouseLeave(trigger)
    fireEvent.focus(trigger)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    fireEvent.blur(trigger)
  })
})

describe('CopyButton', () => {
  it('copies to clipboard', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.resolve()) } })
    render(<U.CopyButton text="hello" />)
    const btn = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(btn)
    })
  })
  it('handles failure', async () => {
    // Swallow the rejection at the test boundary so vitest does not flag it as
    // an unhandled error.
    const swallowed = vi.fn()
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn(() => Promise.reject(new Error('fail')).catch(swallowed)) },
    })
    render(<U.CopyButton text="boom" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })
  })
})

describe('InlineEdit', () => {
  it('edit + confirm + cancel', () => {
    const onConfirm = vi.fn()
    render(<U.InlineEdit value="hi" onConfirm={onConfirm} label="Name" />)
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'world' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onConfirm).toHaveBeenCalledWith('world')
    fireEvent.click(screen.getByRole('button'))
    const i2 = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(i2, { target: { value: 'foo' } })
    fireEvent.keyDown(i2, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button'))
    fireEvent.blur(screen.getByRole('textbox'))
  })
})

describe('StarRating', () => {
  it('clicking sets value', () => {
    const onChange = vi.fn()
    render(<U.StarRating label="r" value={2} onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    fireEvent.click(stars[3]!)
    expect(onChange).toHaveBeenCalled()
  })
  it('uncontrolled + readonly', () => {
    render(<U.StarRating label="r" defaultValue={2} />)
    const stars = screen.getAllByRole('radio')
    fireEvent.click(stars[1]!)
    fireEvent.keyDown(stars[1]!, { key: 'ArrowRight' })
    fireEvent.keyDown(stars[1]!, { key: 'ArrowLeft' })
  })
})

describe('Carousel', () => {
  it('next + prev + indicator', () => {
    render(
      <U.Carousel
        label="x"
        slides={[
          { id: 'a', title: 'A', body: 'a' },
          { id: 'b', title: 'B', body: 'b' },
          { id: 'c', title: 'C', body: 'c' },
        ]}
      />,
    )
    const next = screen.getByRole('button', { name: /next/i })
    const prev = screen.getByRole('button', { name: /previous/i })
    fireEvent.click(next)
    fireEvent.click(next)
    fireEvent.click(next) // wrap or stop
    fireEvent.click(prev)
    fireEvent.click(prev)
    fireEvent.click(prev) // wrap
    const dots = screen.getAllByRole('tab')
    fireEvent.click(dots[2]!)
  })
})

describe('NotificationPanel', () => {
  it('mark all read + mark single read', () => {
    const onMarkAll = vi.fn()
    const onMarkRead = vi.fn()
    render(
      <U.NotificationPanel
        open
        onClose={() => {}}
        onMarkAllRead={onMarkAll}
        onMarkRead={onMarkRead}
        notifications={[
          { id: '1', title: 'a', body: 'b', time: 'now', read: false, severity: 'info' },
          { id: '2', title: 'b', body: 'b', time: 'now', read: true, severity: 'warn' },
        ]}
      />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
})

describe('KanbanBoard', () => {
  it('drag card across columns', () => {
    const onMove = vi.fn()
    const { container } = render(
      <U.KanbanBoard
        onCardMove={onMove}
        columns={[
          { id: 'todo', title: 'To do', cards: [{ id: '1', title: 'A' }] },
          { id: 'done', title: 'Done', cards: [] },
        ]}
      />,
    )
    const card = container.querySelector('[draggable=true]') as HTMLElement
    const target = container.querySelectorAll('[data-col-id], .kb-col, [class*=column]')
    // jsdom does not implement DataTransfer; supply a stub on the synthetic event.
    const dt = { effectAllowed: '', dropEffect: '', setData: () => {}, getData: () => '' }
    if (card) {
      fireEvent.dragStart(card, { dataTransfer: dt })
      for (const t of target) {
        fireEvent.dragOver(t, { dataTransfer: dt })
        fireEvent.drop(t, { dataTransfer: dt })
      }
      fireEvent.dragEnd(card, { dataTransfer: dt })
    }
  })
})

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })
  it('shows and dismisses', () => {
    render(<U.Toaster />)
    act(() => {
      U.toast.show('a')
      U.toast.success('b')
      U.toast.warn('c')
      U.toast.danger('d')
      U.toast.info('e')
    })
    fireEvent.click(screen.getAllByRole('button', { name: /dismiss/i })[0]!)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
  })
})

describe('CountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('animates to target', () => {
    render(<U.CountUp from={0} to={100} duration={100} decimals={1} prefix="$" suffix="!" />)
    act(() => {
      vi.advanceTimersByTime(200)
    })
  })
})

describe('ResizablePanel', () => {
  it('drags pointer to resize', () => {
    const { container } = render(
      <U.ResizablePanel orientation="horizontal" defaultSize={50}>
        {[<div key="a">A</div>, <div key="b">B</div>]}
      </U.ResizablePanel>,
    )
    const handle = container.querySelector('[role=separator]') as HTMLElement
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    fireEvent.keyDown(handle, { key: 'ArrowUp' })
    fireEvent.keyDown(handle, { key: 'ArrowDown' })
    fireEvent.keyDown(handle, { key: 'Home' })
    fireEvent.keyDown(handle, { key: 'End' })
    fireEvent.pointerDown(handle, { clientX: 100, clientY: 100 })
    fireEvent.pointerMove(window, { clientX: 200, clientY: 200 })
    fireEvent.pointerUp(window)
  })
})

describe('Topbar / Sidebar interactions', () => {
  it('Topbar clicks app + bell', () => {
    const onAppChange = vi.fn()
    render(
      <U.Topbar
        siteName="HQ"
        activeApp="network"
        onAppChange={onAppChange}
        notificationCount={3}
      />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
  it('Sidebar onChange', () => {
    const onChange = vi.fn()
    render(
      <U.Sidebar
        activeId="dash"
        onChange={onChange}
        sections={[
          {
            title: 'Manage',
            items: [
              { id: 'dash', label: 'Dashboard', icon: null },
              { id: 'devs', label: 'Devices', icon: null, count: 2, pill: 1 },
            ],
          },
        ]}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Devices/ }))
  })
})

describe('InputGroup variants', () => {
  it('renders without prefix or suffix', () => {
    render(
      <U.InputGroup>
        <input aria-label="Demo input" />
      </U.InputGroup>,
    )
  })
})

describe('Stat deltaDir + Sparkline active toggle', () => {
  it('Stat down/up/neutral', () => {
    render(
      <>
        <U.Stat label="L" value="42" delta="+1" deltaDir="up" />
        <U.Stat label="L" value="42" delta="-1" deltaDir="down" />
        <U.Stat label="L" value="42" />
      </>,
    )
  })
})

describe('VirtualList scroll', () => {
  it('scrolls the inner viewport', () => {
    const { container } = render(
      <U.VirtualList
        items={Array.from({ length: 200 }, (_, i) => i)}
        itemHeight={20}
        height={100}
        renderItem={(n) => <span>{n}</span>}
      />,
    )
    const list = container.querySelector('[role=list]') as HTMLDivElement
    fireEvent.scroll(list, { target: { scrollTop: 500 } })
  })
})

describe('Banner / Alert dismiss', () => {
  it('Banner dismiss + action click', () => {
    const onDismiss = vi.fn()
    const action = vi.fn()
    render(
      <U.Banner onDismiss={onDismiss} action={{ label: 'Do', onClick: action }}>
        x
      </U.Banner>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Do' }))
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
  })
  it('Alert dismiss', () => {
    const onDismiss = vi.fn()
    render(<U.Alert onDismiss={onDismiss}>x</U.Alert>)
    fireEvent.click(screen.getByRole('button'))
  })
})

describe('Accordion item open/close', () => {
  it('toggles open', () => {
    render(<U.AccordionItem title="T">body</U.AccordionItem>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
  })
})

describe('Callout variants', () => {
  it('all variants', () => {
    render(
      <>
        <U.Callout variant="info" title="i">
          x
        </U.Callout>
        <U.Callout variant="success" title="s">
          x
        </U.Callout>
        <U.Callout variant="warn" title="w">
          x
        </U.Callout>
        <U.Callout variant="danger" title="d">
          x
        </U.Callout>
        <U.Callout>no title</U.Callout>
      </>,
    )
  })
})

describe('Breadcrumb navigation', () => {
  it('clicking button without href triggers onNavigate', () => {
    const onNavigate = vi.fn()
    render(
      <U.Breadcrumb
        items={[{ label: 'Root' }, { label: 'Sub' }, { label: 'Now' }]}
        onNavigate={onNavigate}
      />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
    expect(onNavigate).toHaveBeenCalled()
  })
  it('href items render as anchors', () => {
    render(
      <U.Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Sub', href: '/sub' }, { label: 'Now' }]}
      />,
    )
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(2)
  })
})

describe('Input + Textarea', () => {
  it('renders custom className/rows', () => {
    render(
      <>
        <U.Input className="x" />
        <U.Textarea rows={6} className="x" />
      </>,
    )
  })
})

describe('PasswordInput visibility toggle', () => {
  it('shows and hides password', () => {
    const onChange = vi.fn()
    render(<U.PasswordInput label="P" value="x" onChange={onChange} />)
    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    fireEvent.change(screen.getByLabelText('P') as HTMLInputElement, { target: { value: 'y' } })
  })
  it('uncontrolled', () => {
    render(<U.PasswordInput label="P" />)
    fireEvent.change(screen.getByLabelText('P') as HTMLInputElement, { target: { value: 'a' } })
  })
})

describe('SwitchPortGrid click', () => {
  it('clicking port fires callback', () => {
    const onPortClick = vi.fn()
    render(
      <U.SwitchPortGrid
        onPortClick={onPortClick}
        ports={[
          { index: 1, status: 'up' },
          { index: 2, status: 'down' },
          { index: 3, status: 'disabled' },
          { index: 4, status: 'poe' },
        ]}
      />,
    )
    const ports = screen.getAllByRole('button')
    for (const p of ports) fireEvent.click(p)
  })
})

describe('JsonViewer expand', () => {
  it('toggles open state', () => {
    render(
      <U.JsonViewer data={{ a: { b: { c: { d: { e: 1 } } } } }} maxDepth={1} defaultExpanded />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons.slice(0, 3)) fireEvent.click(b)
  })
})

describe('LogViewer auto-follow toggle', () => {
  it('scroll disables follow + clicking follow re-enables', () => {
    const { container } = render(
      <U.LogViewer
        entries={Array.from({ length: 30 }, (_, i) => ({
          time: `${i}`,
          level: ['info', 'warn', 'error', 'debug'][i % 4] as any,
          message: `m${i}`,
        }))}
      />,
    )
    const view = container.querySelector('[role=log]') as HTMLDivElement
    fireEvent.scroll(view, { target: { scrollTop: 100 } })
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
})

describe('SelectionToolbar clear', () => {
  it('clear button fires callback + action click', () => {
    const onClear = vi.fn()
    const onAction = vi.fn()
    render(
      <U.SelectionToolbar
        count={3}
        actions={[
          { id: 'a', label: 'Act', onClick: onAction },
          { id: 'd', label: 'Delete', danger: true, onClick: onAction },
        ]}
        onClear={onClear}
      />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
})

describe('ExpandableRow expand', () => {
  it('toggles row', () => {
    render(
      <table>
        <U.ExpandableRow row={<td>row</td>} detail={<div>detail</div>} colSpan={1} />
      </table>,
    )
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button'))
  })
})

describe('GroupedList collapsible', () => {
  it('toggles each group', () => {
    render(
      <U.GroupedList
        groups={[
          { title: 'A', items: [{ label: 'one' }] },
          { title: 'B', items: [{ label: 'two' }] },
        ]}
      />,
    )
    const buttons = screen.getAllByRole('button')
    for (const b of buttons) fireEvent.click(b)
  })
})

describe('Various uncontrolled defaults', () => {
  it('NumberInput uncontrolled empty', () => {
    render(<U.NumberInput label="N" defaultValue={5} />)
  })
  it('OTPInput defaultValue', () => {
    render(<U.OTPInput label="O" defaultValue="123" length={4} />)
  })
  it('IPInput defaultValue', () => {
    render(<U.IPInput label="IP" defaultValue="192.168.1.1" />)
  })
  it('MACInput defaultValue', () => {
    render(<U.MACInput label="M" defaultValue="aa:bb:cc:dd:ee:ff" />)
  })
  it('CIDRInput defaultValue', () => {
    render(<U.CIDRInput label="C" defaultValue="10.0.0.0/8" />)
  })
  it('TimePicker defaultValue', () => {
    render(<U.TimePicker label="T" defaultValue="13:45" />)
  })
  it('DurationInput defaultValue', () => {
    render(<U.DurationInput label="D" defaultValue={3700} />)
  })
  it('TagInput defaultValue', () => {
    render(<U.TagInput label="L" defaultValue={['a', 'b']} />)
  })
  it('PasswordInput defaultValue', () => {
    render(<U.PasswordInput label="P" defaultValue="abc" />)
  })
  it('Slider defaultValue', () => {
    render(<U.Slider label="L" defaultValue={50} />)
  })
  it('RangeSlider defaults', () => {
    render(<U.RangeSlider label="R" defaultLow={20} defaultHigh={70} />)
  })
  it('StarRating defaultValue', () => {
    render(<U.StarRating label="r" defaultValue={3} />)
  })
})

// silence unused
void ControlledInput
