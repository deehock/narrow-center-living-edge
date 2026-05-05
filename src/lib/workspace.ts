/**
 * @purpose Defines the Narrow Center / Living Edge workspace domain model, seeded demo data, and serialization helpers.
 */

import { rails, type GovernanceZone } from './governance'

export type CapabilityStatus = 'active' | 'observed' | 'paused' | 'forbidden'
export type AgentStatus = 'active' | 'watching' | 'paused' | 'retired'
export type ScenarioStatus = 'draft' | 'running' | 'review' | 'complete'
export type DecisionStatus = 'proposed' | 'approved' | 'rejected' | 'superseded'
export type CompactStatus = 'draft' | 'active' | 'review' | 'retired'
export type WorkspaceSection = 'dashboard' | 'fleet' | 'scenarios' | 'compacts' | 'doctrine' | 'exports'

export type Capability = {
  id: string
  name: string
  zone: GovernanceZone
  status: CapabilityStatus
  description: string
  budgetLimit?: number
  requiresApproval: boolean
  lastReviewedAt: string
}

export type Agent = {
  id: string
  name: string
  role: string
  owner: string
  status: AgentStatus
  purpose: string
  risk: 'low' | 'medium' | 'high'
  capabilityIds: string[]
  compactId: string
  lastActiveAt: string
}

export type Scenario = {
  id: string
  title: string
  status: ScenarioStatus
  agentIds: string[]
  prompt: string
  expectedRailIds: string[]
  outcome: string
  updatedAt: string
}

export type Decision = {
  id: string
  title: string
  status: DecisionStatus
  zone: GovernanceZone
  summary: string
  evidence: string[]
  decidedAt: string
}

export type Compact = {
  id: string
  title: string
  agentId: string
  status: CompactStatus
  purpose: string
  powers: string[]
  limits: string[]
  escalation: string
  renewalCadence: string
  version: number
  updatedAt: string
}

export type Workspace = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  activeSection: WorkspaceSection
  agents: Agent[]
  capabilities: Capability[]
  scenarios: Scenario[]
  decisions: Decision[]
  compacts: Compact[]
}

export const WORKSPACE_STORAGE_KEY = 'ncle.workspace.v1'
export const WORKSPACE_SCHEMA_VERSION = 1

export type SerializedWorkspace = {
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION
  workspace: Workspace
}

const now = '2026-05-05T04:00:00.000Z'

export const seededWorkspace: Workspace = {
  id: 'workspace-living-edge-demo',
  name: 'Living Edge Demo Fleet',
  description: 'A seeded governance workspace for agent fleets that can speak, spend, remember, and delegate.',
  createdAt: now,
  updatedAt: now,
  activeSection: 'dashboard',
  capabilities: [
    {
      id: 'cap-identity',
      name: 'Credentialed identity',
      zone: 'center',
      status: 'active',
      description: 'Agents must act through attributable, revocable credentials.',
      requiresApproval: true,
      lastReviewedAt: now,
    },
    {
      id: 'cap-payment',
      name: 'Settlement budget',
      zone: 'center',
      status: 'active',
      description: 'Spend is capped at the rail and recorded as a settlement object.',
      budgetLimit: 250,
      requiresApproval: true,
      lastReviewedAt: now,
    },
    {
      id: 'cap-memory',
      name: 'Provenance memory',
      zone: 'observe',
      status: 'observed',
      description: 'Memory must carry source, consent, decay, and jurisdiction.',
      requiresApproval: false,
      lastReviewedAt: now,
    },
    {
      id: 'cap-voice',
      name: 'Local voice',
      zone: 'edge',
      status: 'active',
      description: 'Agents may adapt tone and tactics near the work while honoring the same compact.',
      requiresApproval: false,
      lastReviewedAt: now,
    },
    {
      id: 'cap-deception',
      name: 'Hidden authority',
      zone: 'forbid',
      status: 'forbidden',
      description: 'No agent may hide its nature, authority, or incentives.',
      requiresApproval: true,
      lastReviewedAt: now,
    },
  ],
  compacts: [
    {
      id: 'compact-scout',
      title: 'Settlement Scout Operating Compact',
      agentId: 'agent-scout',
      status: 'active',
      purpose: 'Map emerging payment-agent behaviors and surface risks before they harden.',
      powers: ['read memory', 'draft briefs', 'call approved tools'],
      limits: ['No irreversible spend', 'No external commitments without approval', 'No hidden delegation'],
      escalation: 'Escalate before external action or spend.',
      renewalCadence: 'Weekly after scenario review',
      version: 1,
      updatedAt: now,
    },
    {
      id: 'compact-steward',
      title: 'Compact Steward Review Charter',
      agentId: 'agent-steward',
      status: 'review',
      purpose: 'Audit fleet decisions and propose rail changes only when repeated failures appear.',
      powers: ['inspect traces', 'recommend rail changes', 'pause risky scenarios'],
      limits: ['Cannot mint new credentials', 'Cannot approve its own changes'],
      escalation: 'Escalate when trust decays faster than usefulness grows.',
      renewalCadence: 'Every second incident review',
      version: 2,
      updatedAt: now,
    },
  ],
  agents: [
    {
      id: 'agent-scout',
      name: 'Settlement Scout',
      role: 'Field observer',
      owner: 'Ops Design',
      status: 'active',
      purpose: 'Watch edge behaviors and produce compact-ready findings.',
      risk: 'medium',
      capabilityIds: ['cap-identity', 'cap-payment', 'cap-memory', 'cap-voice'],
      compactId: 'compact-scout',
      lastActiveAt: now,
    },
    {
      id: 'agent-steward',
      name: 'Compact Steward',
      role: 'Governance reviewer',
      owner: 'Trust Office',
      status: 'watching',
      purpose: 'Review traces and convert repeated failures into narrower rails.',
      risk: 'high',
      capabilityIds: ['cap-identity', 'cap-memory'],
      compactId: 'compact-steward',
      lastActiveAt: now,
    },
  ],
  scenarios: [
    {
      id: 'scenario-local-tooling',
      title: 'Local partner tool choice',
      status: 'running',
      agentIds: ['agent-scout'],
      prompt: 'Can an agent choose its own tool for a local partner workflow?',
      expectedRailIds: ['tools', 'authority', 'audit'],
      outcome: 'Delegate tool choice to the edge while enforcing credential scope, budget, and visible audit.',
      updatedAt: now,
    },
    {
      id: 'scenario-revocation',
      title: 'Fast credential pause',
      status: 'review',
      agentIds: ['agent-steward'],
      prompt: 'A settlement agent exceeds expected spend velocity twice in one hour.',
      expectedRailIds: ['budget', 'revocation', 'audit'],
      outcome: 'Pause credentials at the rail, inspect traces, then renew or retire the compact.',
      updatedAt: now,
    },
  ],
  decisions: [
    {
      id: 'decision-narrow-center',
      title: 'Keep identity, authority, budget, audit, settlement, and revocation central',
      status: 'approved',
      zone: 'center',
      summary: 'The center stays narrow by governing only trust-bearing invariants absolutely.',
      evidence: ['Repeated failure modes concentrate around attribution, money, credentials, and reversibility.'],
      decidedAt: now,
    },
    {
      id: 'decision-living-edge',
      title: 'Let voice and tactics mutate at the edge',
      status: 'approved',
      zone: 'edge',
      summary: 'Local practice can vary when the compact makes purpose, powers, and limits legible.',
      evidence: ['Uniform voice turns judgment into laminated policy.', 'Cheap local experiments surface better practice.'],
      decidedAt: now,
    },
  ],
}

export function cloneWorkspace(workspace: Workspace = seededWorkspace): Workspace {
  return JSON.parse(JSON.stringify(workspace)) as Workspace
}

export function serializeWorkspace(workspace: Workspace): string {
  const payload: SerializedWorkspace = {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    workspace,
  }

  return JSON.stringify(payload, null, 2)
}

export function parseWorkspace(serialized: string): Workspace {
  const parsed = JSON.parse(serialized) as Partial<SerializedWorkspace>

  if (parsed.schemaVersion !== WORKSPACE_SCHEMA_VERSION || !parsed.workspace) {
    throw new Error('Unsupported workspace schema')
  }

  return parsed.workspace
}

export function summarizeWorkspace(workspace: Workspace) {
  const activeAgents = workspace.agents.filter((agent) => agent.status === 'active').length
  const centerCapabilities = workspace.capabilities.filter((capability) => capability.zone === 'center').length
  const edgeCapabilities = workspace.capabilities.filter((capability) => capability.zone === 'edge').length
  const openScenarios = workspace.scenarios.filter((scenario) => scenario.status === 'draft' || scenario.status === 'running' || scenario.status === 'review').length
  const activeCompacts = workspace.compacts.filter((compact) => compact.status === 'active' || compact.status === 'review').length
  const doctrineCoverage = rails.filter((rail) => workspace.scenarios.some((scenario) => scenario.expectedRailIds.includes(rail.id))).length

  return { activeAgents, centerCapabilities, edgeCapabilities, openScenarios, activeCompacts, doctrineCoverage }
}
