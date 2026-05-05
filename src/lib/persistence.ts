/**
 * @purpose Persists and restores the workspace model from browser localStorage with safe seeded fallback behavior.
 */

import { cloneWorkspace, parseWorkspace, seededWorkspace, serializeWorkspace, WORKSPACE_STORAGE_KEY, type Workspace } from './workspace'

export type WorkspaceStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function loadWorkspace(store: WorkspaceStore | undefined = globalThis.localStorage): Workspace {
  if (!store) {
    return cloneWorkspace()
  }

  const stored = store.getItem(WORKSPACE_STORAGE_KEY)

  if (!stored) {
    const workspace = cloneWorkspace(seededWorkspace)
    store.setItem(WORKSPACE_STORAGE_KEY, serializeWorkspace(workspace))
    return workspace
  }

  try {
    return parseWorkspace(stored)
  } catch {
    const workspace = cloneWorkspace(seededWorkspace)
    store.setItem(WORKSPACE_STORAGE_KEY, serializeWorkspace(workspace))
    return workspace
  }
}

export function saveWorkspace(workspace: Workspace, store: WorkspaceStore | undefined = globalThis.localStorage): Workspace {
  const stamped = { ...workspace, updatedAt: new Date().toISOString() }

  if (store) {
    store.setItem(WORKSPACE_STORAGE_KEY, serializeWorkspace(stamped))
  }

  return stamped
}

export function resetWorkspace(store: WorkspaceStore | undefined = globalThis.localStorage): Workspace {
  const workspace = cloneWorkspace(seededWorkspace)

  if (store) {
    store.removeItem(WORKSPACE_STORAGE_KEY)
    store.setItem(WORKSPACE_STORAGE_KEY, serializeWorkspace(workspace))
  }

  return workspace
}
