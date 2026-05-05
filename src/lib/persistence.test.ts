/**
 * @purpose Verifies workspace serialization and localStorage persistence behavior.
 */

import { describe, expect, it, vi } from 'vitest'
import { loadWorkspace, resetWorkspace, saveWorkspace, type WorkspaceStore } from './persistence'
import { addAgent, parseWorkspace, recordScenario, seededWorkspace, serializeWorkspace, WORKSPACE_STORAGE_KEY, workspaceMarkdown } from './workspace'

function createStore(seed?: string): WorkspaceStore & { values: Map<string, string> } {
  const values = new Map<string, string>()

  if (seed) {
    values.set(WORKSPACE_STORAGE_KEY, seed)
  }

  return {
    values,
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
  }
}

describe('workspace serialization', () => {
  it('round-trips the seeded demo workspace', () => {
    const serialized = serializeWorkspace(seededWorkspace)
    const restored = parseWorkspace(serialized)

    expect(restored.id).toBe(seededWorkspace.id)
    expect(restored.agents).toHaveLength(2)
    expect(restored.capabilities.some((capability) => capability.zone === 'center')).toBe(true)
    expect(restored.scenarios[0]?.expectedRailIds).toContain('tools')
  })

  it('rejects unsupported schemas', () => {
    expect(() => parseWorkspace(JSON.stringify({ schemaVersion: 999, workspace: seededWorkspace }))).toThrow('Unsupported workspace schema')
  })

  it('adds an agent with a draft compact', () => {
    const workspace = addAgent(seededWorkspace, {
      name: 'Buyer Agent',
      role: 'Delegated buyer',
      owner: 'Commerce',
      purpose: 'prepare bounded purchases',
      risk: 'medium',
      powers: ['read memory', 'spend budget'],
    })

    expect(workspace.agents.at(-1)?.name).toBe('Buyer Agent')
    expect(workspace.compacts.at(-1)?.title).toContain('Buyer Agent')
  })

  it('records scenarios as precedents and decisions', () => {
    const workspace = recordScenario(seededWorkspace, {
      title: 'Hidden delegation',
      prompt: 'Can an agent secretly delegate to another agent and hide that from audit?',
      agentId: 'agent-scout',
    })

    expect(workspace.scenarios[0]?.title).toBe('Hidden delegation')
    expect(workspace.decisions[0]?.zone).toBe('forbid')
    expect(workspace.decisions[0]?.status).toBe('rejected')
  })

  it('exports a markdown operating packet', () => {
    const markdown = workspaceMarkdown(seededWorkspace)

    expect(markdown).toContain('# Living Edge Demo Fleet')
    expect(markdown).toContain('## Agents')
    expect(markdown).toContain('Settlement Scout')
  })
})

describe('workspace persistence', () => {
  it('seeds localStorage when no workspace exists', () => {
    const store = createStore()
    const workspace = loadWorkspace(store)

    expect(workspace.name).toBe('Living Edge Demo Fleet')
    expect(store.setItem).toHaveBeenCalledOnce()
    expect(store.values.get(WORKSPACE_STORAGE_KEY)).toContain('Living Edge Demo Fleet')
  })

  it('loads a saved workspace and preserves user edits', () => {
    const custom = { ...seededWorkspace, name: 'Custom Fleet' }
    const store = createStore(serializeWorkspace(custom))

    expect(loadWorkspace(store).name).toBe('Custom Fleet')
  })

  it('saves workspace state with an updated timestamp', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-05T05:00:00.000Z'))

    const store = createStore()
    const saved = saveWorkspace({ ...seededWorkspace, name: 'Saved Fleet' }, store)

    expect(saved.updatedAt).toBe('2026-05-05T05:00:00.000Z')
    expect(parseWorkspace(store.values.get(WORKSPACE_STORAGE_KEY) ?? '').name).toBe('Saved Fleet')

    vi.useRealTimers()
  })

  it('resets corrupted storage to the seeded demo workspace', () => {
    const store = createStore('{not json')
    const workspace = loadWorkspace(store)

    expect(workspace.id).toBe(seededWorkspace.id)
    expect(store.setItem).toHaveBeenCalledOnce()
  })

  it('can explicitly reset back to the seeded workspace', () => {
    const store = createStore(serializeWorkspace({ ...seededWorkspace, name: 'Custom Fleet' }))
    const workspace = resetWorkspace(store)

    expect(workspace.name).toBe('Living Edge Demo Fleet')
    expect(store.removeItem).toHaveBeenCalledWith(WORKSPACE_STORAGE_KEY)
  })
})
