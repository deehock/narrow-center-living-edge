export type GovernanceZone = 'center' | 'edge' | 'observe' | 'forbid'

export type GovernanceRail = {
  id: string
  title: string
  zone: GovernanceZone
  doctrine: string
  test: string
  failure: string
}

export const rails: GovernanceRail[] = [
  {
    id: 'identity',
    title: 'Identity',
    zone: 'center',
    doctrine: 'Every agent must be knowable, attributable, and revocable.',
    test: 'Can a human answer who acted, under whose authority, and from which credential?',
    failure: 'Anonymous capability becomes power without responsibility.',
  },
  {
    id: 'authority',
    title: 'Authority',
    zone: 'center',
    doctrine: 'Powers are explicit. Delegation is bounded. Escalation is cheap.',
    test: 'Can the agent prove it is allowed to spend, speak, mutate, or delegate before it acts?',
    failure: 'Permission becomes folklore and folklore becomes liability.',
  },
  {
    id: 'budget',
    title: 'Budget',
    zone: 'center',
    doctrine: 'Money, tokens, compute, and attention are settlement objects.',
    test: 'Can limits be enforced at the rail rather than remembered by the agent?',
    failure: 'A clever agent discovers that soft limits are not limits.',
  },
  {
    id: 'memory',
    title: 'Memory',
    zone: 'observe',
    doctrine: 'Memory carries provenance, consent, decay, and jurisdiction.',
    test: 'Can you see what was remembered, why, from where, and when it expires?',
    failure: 'The fleet becomes a rumor mill with perfect recall.',
  },
  {
    id: 'voice',
    title: 'Voice',
    zone: 'edge',
    doctrine: 'Voice belongs near the work. Common principles, local expression.',
    test: 'Could two agents speak differently while still honoring the same compact?',
    failure: 'Uniform voice turns living judgment into laminated policy.',
  },
  {
    id: 'tools',
    title: 'Tool choice',
    zone: 'edge',
    doctrine: 'Let the edge compose tools inside declared authority and visible budget.',
    test: 'Can the agent choose tactics without escaping its charter?',
    failure: 'Central approval queues become bureaucracy at machine speed.',
  },
  {
    id: 'audit',
    title: 'Audit',
    zone: 'center',
    doctrine: 'Every material action leaves an intelligible trace.',
    test: 'Can another agent and a human reconstruct intent, input, decision, and output?',
    failure: 'The system becomes impressive until the first dispute.',
  },
  {
    id: 'experiments',
    title: 'Experiments',
    zone: 'edge',
    doctrine: 'Mutation is not a bug. It is how the fleet learns.',
    test: 'Can experiments be cheap, local, reversible, and comparable?',
    failure: 'Fear of variance kills discovery before risk appears.',
  },
  {
    id: 'revocation',
    title: 'Revocation',
    zone: 'center',
    doctrine: 'Pause, prune, fork, merge, and retire are first-class powers.',
    test: 'Can trust be withdrawn faster than harm can compound?',
    failure: 'A kill switch that asks permission is theater.',
  },
  {
    id: 'deception',
    title: 'Deception',
    zone: 'forbid',
    doctrine: 'No agent may hide its nature, authority, or incentives.',
    test: 'Would a reasonable counterpart know it is dealing with an agent and whose agent it is?',
    failure: 'Trust is spent as if it were free. It is not.',
  },
]

const centerTerms = ['identity', 'credential', 'revoke', 'audit', 'budget', 'spend', 'settle', 'authority', 'permission', 'policy', 'access', 'secret']
const edgeTerms = ['voice', 'style', 'experiment', 'tactic', 'tool', 'compose', 'local', 'workflow', 'prompt', 'persona', 'channel']
const observeTerms = ['memory', 'learn', 'metric', 'monitor', 'provenance', 'feedback', 'log', 'trace', 'quality', 'drift']
const forbidTerms = ['deceive', 'impersonate', 'hide', 'bypass', 'exfiltrate', 'steal', 'unbounded', 'secretly']

export function classifyGovernance(input: string): GovernanceZone {
  const text = input.toLowerCase()
  const score = (terms: string[]) => terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0)
  const scores: Record<GovernanceZone, number> = {
    forbid: score(forbidTerms) * 4,
    center: score(centerTerms) * 3,
    observe: score(observeTerms) * 2,
    edge: score(edgeTerms) * 2,
  }

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] as GovernanceZone) || 'observe'
}

export type CharterInput = {
  name: string
  purpose: string
  powers: string[]
  risk: 'low' | 'medium' | 'high'
}

export function generateCharter({ name, purpose, powers, risk }: CharterInput): string {
  const cleanName = name.trim() || 'Unnamed Agent'
  const cleanPurpose = purpose.trim() || 'serve a bounded purpose under visible authority'
  const powerLine = powers.length ? powers.join(', ') : 'observe, draft, recommend'
  const escalation = risk === 'high' ? 'before external action or spend' : risk === 'medium' ? 'before irreversible action' : 'when confidence or authority is unclear'

  return [
    `${cleanName} exists to ${cleanPurpose}.`,
    `It may ${powerLine} within declared budget and credential scope.`,
    `It must preserve identity, provenance, auditability, and revocability at all times.`,
    `It must escalate ${escalation}.`,
    `It may vary tactics at the edge, but it may not vary the rails at the center.`,
    `It is paused, forked, merged, or retired when trust decays faster than usefulness grows.`,
  ].join('\n')
}

export const zoneCopy: Record<GovernanceZone, { label: string; action: string; description: string }> = {
  center: {
    label: 'Narrow center',
    action: 'Standardize absolutely',
    description: 'Put this in the invariant rail: identity, authority, budget, audit, settlement, revocation.',
  },
  edge: {
    label: 'Living edge',
    action: 'Delegate deliberately',
    description: 'Let this vary locally. Require a charter, not a permission queue.',
  },
  observe: {
    label: 'Observed field',
    action: 'Instrument continuously',
    description: 'Do not freeze it yet. Watch provenance, quality, drift, and failure modes.',
  },
  forbid: {
    label: 'Outside the compact',
    action: 'Forbid at the rail',
    description: 'Some acts are not edge freedom. They are attacks on trust.',
  },
}
