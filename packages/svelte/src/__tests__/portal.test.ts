import { afterEach, describe, expect, it } from 'vitest'
import { portal } from '../lib/actions/portal.js'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('portal', () => {
  it('moves the node to document.body by default', () => {
    const parent = document.createElement('div')
    const node = document.createElement('span')
    parent.append(node)
    document.body.append(parent)
    portal(node)
    expect(node.parentNode).toBe(document.body)
  })

  it('stays inside its shadow root, where the styles live', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const wrapper = document.createElement('div')
    const node = document.createElement('span')
    wrapper.append(node)
    shadow.append(wrapper)
    portal(node)
    expect(node.parentNode).toBe(shadow)
  })

  it('honours an explicit target inside a shadow root', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const node = document.createElement('span')
    shadow.append(node)
    const target = document.createElement('section')
    document.body.append(target)
    portal(node, target)
    expect(node.parentNode).toBe(target)
  })

  it('moves the node on update and removes it on destroy', () => {
    const node = document.createElement('span')
    document.body.append(node)
    const target = document.createElement('section')
    target.id = 'dest'
    document.body.append(target)
    const action = portal(node)!
    action.update!('#dest')
    expect(node.parentNode).toBe(target)
    action.destroy!()
    expect(node.isConnected).toBe(false)
  })
})
