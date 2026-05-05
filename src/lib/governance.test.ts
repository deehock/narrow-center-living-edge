import { describe, expect, it } from 'vitest'
import { classifyGovernance, generateCharter } from './governance'

describe('classifyGovernance', () => {
  it('places identity and revocation in the center', () => {
    expect(classifyGovernance('agent identity credential revocation')).toBe('center')
  })

  it('places voice and experiments at the edge', () => {
    expect(classifyGovernance('local voice experiment and tool choice')).toBe('edge')
  })

  it('forbids deception above other matches', () => {
    expect(classifyGovernance('secretly bypass audit and deceive users')).toBe('forbid')
  })
})

describe('generateCharter', () => {
  it('includes powers and invariant rails', () => {
    const charter = generateCharter({
      name: 'Scout',
      purpose: 'map partner friction',
      powers: ['read docs', 'draft memos'],
      risk: 'medium',
    })

    expect(charter).toContain('Scout exists')
    expect(charter).toContain('read docs, draft memos')
    expect(charter).toContain('identity, provenance, auditability, and revocability')
    expect(charter).toContain('before irreversible action')
  })
})
