import { describe, expect, it, vi } from 'vitest'
import {
  createHttpFleetApi,
  decodeProcesses,
  decodeResources,
  decodeStatusReport,
} from './fleet-api.ts'

describe('decodeStatusReport', () => {
  it('accepts a report with a components object', () => {
    const r = decodeStatusReport({ ts: 1, components: { a: { status: 'up' } } })
    expect(r?.components.a.status).toBe('up')
  })

  it('rejects a non-object or a report without components', () => {
    expect(decodeStatusReport(null)).toBeNull()
    expect(decodeStatusReport([1, 2])).toBeNull()
    expect(decodeStatusReport({ ts: 1 })).toBeNull()
    expect(decodeStatusReport({ ts: 1, components: [] })).toBeNull()
  })
})

describe('decodeProcesses', () => {
  it('returns the processes array', () => {
    expect(decodeProcesses({ processes: [{ name: 'a', status: 'online' }] })).toHaveLength(1)
  })

  it('returns [] for a malformed body', () => {
    expect(decodeProcesses(null)).toEqual([])
    expect(decodeProcesses({ processes: 'nope' })).toEqual([])
  })
})

describe('decodeResources', () => {
  it('unwraps the snapshot', () => {
    expect(decodeResources({ snapshot: { cpu: 1 } })).toEqual({ cpu: 1 })
  })

  it('returns null when absent', () => {
    expect(decodeResources({})).toBeNull()
    expect(decodeResources(null)).toBeNull()
  })
})

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } })
}

describe('createHttpFleetApi', () => {
  it('GET /status decodes the report', async () => {
    const fetchLike = vi.fn().mockResolvedValue(jsonResponse({ ts: 1, components: {} }))
    const api = createHttpFleetApi('/api', fetchLike)
    const r = await api.fetchStatus()
    expect(r?.ts).toBe(1)
    expect(fetchLike).toHaveBeenCalledWith('/api/status', { cache: 'no-store' })
  })

  it('trims a trailing slash from the base url', async () => {
    const fetchLike = vi.fn().mockResolvedValue(jsonResponse({ ts: 1, components: {} }))
    await createHttpFleetApi('/api/', fetchLike).fetchStatus()
    expect(fetchLike).toHaveBeenCalledWith('/api/status', { cache: 'no-store' })
  })

  it('POST action encodes the id + body', async () => {
    const fetchLike = vi.fn().mockResolvedValue(jsonResponse({ ok: true, pm2Name: 'p' }))
    const r = await createHttpFleetApi('/api', fetchLike).runAction('a b', 'restart')
    expect(r).toEqual({ ok: true, pm2Name: 'p' })
    expect(fetchLike).toHaveBeenCalledWith(
      '/api/components/a%20b/action',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ action: 'restart' }) }),
    )
  })

  it('GET logs passes the line count', async () => {
    const fetchLike = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    await createHttpFleetApi('/api', fetchLike).fetchLogs('x', 50)
    expect(fetchLike).toHaveBeenCalledWith('/api/components/x/logs?lines=50', { cache: 'no-store' })
  })

  it('runScenario + getScenarioRun hit the right paths', async () => {
    const fetchLike = vi
      .fn()
      .mockImplementation(() => Promise.resolve(jsonResponse({ ok: true, runId: 'r1' })))
    const api = createHttpFleetApi('/api', fetchLike)
    expect(await api.runScenario('s1')).toEqual({ ok: true, runId: 'r1' })
    await api.getScenarioRun('r1')
    expect(fetchLike).toHaveBeenNthCalledWith(1, '/api/scenarios/s1/run', { method: 'POST' })
    expect(fetchLike).toHaveBeenNthCalledWith(2, '/api/scenarios/runs/r1', undefined)
  })

  it('setAutoStart PATCHes the enabled flag', async () => {
    const fetchLike = vi.fn().mockResolvedValue(jsonResponse({ ok: true, enabled: true }))
    await createHttpFleetApi('/api', fetchLike).setAutoStart!('x', true)
    expect(fetchLike).toHaveBeenCalledWith(
      '/api/components/x/autostart',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ enabled: true }) }),
    )
  })

  it('returns a safe error envelope for an empty / non-json body', async () => {
    const fetchLike = vi.fn().mockImplementation(() => Promise.resolve(new Response('')))
    const api = createHttpFleetApi('/api', fetchLike)
    expect(await api.fetchStatus()).toBeNull()
    expect(await api.runAction('x', 'start')).toEqual({ ok: false, error: 'no response' })
    expect(await api.getScenarioRun('r')).toEqual({ ok: false, error: 'no response' })
  })

  it('tolerates invalid JSON without throwing', async () => {
    const fetchLike = vi.fn().mockResolvedValue(new Response('{not json'))
    expect(await createHttpFleetApi('/api', fetchLike).fetchStatus()).toBeNull()
  })
})
