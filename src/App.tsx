/**
 * @purpose Renders the Narrow Center / Living Edge product shell, workspace navigation, and preserved doctrine field guide.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  Clipboard,
  Download,
  FileText,
  GitBranch,
  Landmark,
  LayoutDashboard,
  Network,
  Orbit,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { classifyGovernance, generateCharter, rails, type GovernanceZone, zoneCopy } from './lib/governance'
import { loadWorkspace, resetWorkspace, saveWorkspace } from './lib/persistence'
import { summarizeWorkspace, type Agent, type Compact, type Scenario, type Workspace, type WorkspaceSection } from './lib/workspace'

const zoneOrder: GovernanceZone[] = ['center', 'edge', 'observe', 'forbid']
const powers = ['read memory', 'draft replies', 'call tools', 'spend budget', 'message humans', 'spawn agents']

const navigation: Array<{ id: WorkspaceSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fleet', label: 'Fleet', icon: Network },
  { id: 'scenarios', label: 'Scenarios', icon: PlayCircle },
  { id: 'compacts', label: 'Compacts', icon: FileText },
  { id: 'doctrine', label: 'Doctrine / Field Guide', icon: Landmark },
  { id: 'exports', label: 'Exports', icon: Download },
]

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 96 96" aria-hidden="true">
      <path d="M14 14h24v8H22v16h-8V14Zm44 0h24v24h-8V22H58v-8ZM14 58h8v16h16v8H14V58Zm60 0h8v24H58v-8h16V58Z" />
      <rect x="39" y="39" width="18" height="18" rx="2" />
      <circle cx="48" cy="48" r="34" />
    </svg>
  )
}

function TypographicOrbit() {
  const reduced = useReducedMotion()
  const glyphs = 'identity authority budget memory audit revoke voice tactic experiment settlement'.split(' ')
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit__center"><Mark /></div>
      {glyphs.map((glyph, index) => {
        const angle = (index / glyphs.length) * 360
        const radius = 35 + (index % 3) * 10
        return (
          <motion.span
            key={glyph}
            className={`orbit__glyph orbit__glyph--${index % 4}`}
            style={{ '--angle': `${angle}deg`, '--radius': `${radius}%` } as React.CSSProperties}
            animate={reduced ? undefined : { opacity: [0.38, 0.82, 0.38], scale: [0.98, 1.04, 0.98] }}
            transition={{ duration: 5 + index * 0.19, repeat: Infinity, ease: 'easeInOut' }}
          >
            {glyph}
          </motion.span>
        )
      })}
      <div className="orbit__ring orbit__ring--one" />
      <div className="orbit__ring orbit__ring--two" />
      <div className="orbit__ring orbit__ring--three" />
    </div>
  )
}

function ZonePill({ zone }: { zone: GovernanceZone }) {
  return <span className={`zone zone--${zone}`}>{zoneCopy[zone].label}</span>
}

function StatusPill({ label }: { label: string }) {
  return <span className="status-pill">{label}</span>
}

function Hero({ onNavigate }: { onNavigate: (section: WorkspaceSection) => void }) {
  return (
    <section className="hero shell-hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <div className="eyebrow"><Mark /> Chaordic governance for agent fleets</div>
        <h1 id="hero-title">Narrow Center.<br />Living Edge.</h1>
        <p>Govern fewer things absolutely. Observe many things continuously.</p>
        <div className="hero__actions">
          <button type="button" onClick={() => onNavigate('dashboard')}>Open workspace</button>
          <button type="button" className="secondary" onClick={() => onNavigate('doctrine')}>Read field guide</button>
        </div>
      </div>
      <TypographicOrbit />
    </section>
  )
}

function ShellHeader({ workspace, activeSection, onNavigate, onReset }: { workspace: Workspace; activeSection: WorkspaceSection; onNavigate: (section: WorkspaceSection) => void; onReset: () => void }) {
  return (
    <header className="app-header">
      <a className="brand-lockup" href="#workspace" aria-label="Narrow Center workspace home" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <Mark />
        <span><strong>{workspace.name}</strong><small>Workspace model · local-first demo</small></span>
      </a>
      <nav className="shell-nav" aria-label="Workspace sections">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.id} type="button" className={activeSection === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>
              <Icon aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </nav>
      <button type="button" className="reset-button" onClick={onReset}><RotateCcw aria-hidden="true" />Reset demo</button>
    </header>
  )
}

function Dashboard({ workspace, onNavigate }: { workspace: Workspace; onNavigate: (section: WorkspaceSection) => void }) {
  const summary = summarizeWorkspace(workspace)
  const latestDecision = workspace.decisions[0]

  return (
    <section className="panel dashboard" aria-labelledby="dashboard-title">
      <div className="section-kicker">Command surface</div>
      <div className="split-heading">
        <div>
          <h2 id="dashboard-title">Fleet posture at a glance.</h2>
          <p className="lede">{workspace.description}</p>
        </div>
        <button type="button" onClick={() => onNavigate('exports')}><Download aria-hidden="true" />Export state</button>
      </div>
      <div className="metric-grid">
        <article><span>{summary.activeAgents}</span><p>active agents</p></article>
        <article><span>{summary.centerCapabilities}</span><p>center capabilities</p></article>
        <article><span>{summary.edgeCapabilities}</span><p>edge capabilities</p></article>
        <article><span>{summary.openScenarios}</span><p>open scenarios</p></article>
        <article><span>{summary.activeCompacts}</span><p>live compacts</p></article>
        <article><span>{summary.doctrineCoverage}/{rails.length}</span><p>rails exercised</p></article>
      </div>
      <div className="dashboard-grid">
        <article className="paper-card">
          <div className="card-top"><Activity /><StatusPill label="localStorage persisted" /></div>
          <h3>Workspace state</h3>
          <p>Changes to the active section and reset action are serialized to localStorage through the typed workspace model.</p>
        </article>
        {latestDecision && (
          <article className="paper-card">
            <div className="card-top"><ShieldCheck /><ZonePill zone={latestDecision.zone} /></div>
            <h3>{latestDecision.title}</h3>
            <p>{latestDecision.summary}</p>
          </article>
        )}
      </div>
    </section>
  )
}

function Fleet({ workspace }: { workspace: Workspace }) {
  const capabilityById = new Map(workspace.capabilities.map((capability) => [capability.id, capability]))

  return (
    <section className="panel" aria-labelledby="fleet-title">
      <div className="section-kicker">Fleet</div>
      <h2 id="fleet-title">Agents carry compacts, not vibes.</h2>
      <div className="entity-grid">
        {workspace.agents.map((agent: Agent) => (
          <article className="entity-card" key={agent.id}>
            <div className="card-top"><StatusPill label={agent.status} /><span>{agent.owner}</span></div>
            <h3>{agent.name}</h3>
            <p>{agent.purpose}</p>
            <dl>
              <dt>Role</dt><dd>{agent.role}</dd>
              <dt>Risk</dt><dd>{agent.risk}</dd>
              <dt>Capabilities</dt>
              <dd className="mini-pills">
                {agent.capabilityIds.map((id) => {
                  const capability = capabilityById.get(id)
                  return capability ? <ZonePill key={id} zone={capability.zone} /> : null
                })}
              </dd>
            </dl>
          </article>
        ))}
      </div>
      <div className="capability-board">
        {zoneOrder.map((zone) => (
          <article key={zone}>
            <ZonePill zone={zone} />
            <ul>
              {workspace.capabilities.filter((capability) => capability.zone === zone).map((capability) => (
                <li key={capability.id}><strong>{capability.name}</strong><span>{capability.status}</span></li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function Scenarios({ workspace }: { workspace: Workspace }) {
  return (
    <section className="panel" aria-labelledby="scenarios-title">
      <div className="section-kicker">Scenarios</div>
      <h2 id="scenarios-title">Test judgment before it hardens.</h2>
      <div className="scenario-list">
        {workspace.scenarios.map((scenario: Scenario, index) => (
          <article key={scenario.id} className="scenario-row">
            <span className="scenario-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <div className="card-top"><StatusPill label={scenario.status} /><span>{scenario.agentIds.length} agent(s)</span></div>
              <h3>{scenario.title}</h3>
              <p>{scenario.prompt}</p>
              <strong>Expected outcome</strong>
              <p>{scenario.outcome}</p>
              <div className="mini-pills">{scenario.expectedRailIds.map((id) => <span className="status-pill" key={id}>{id}</span>)}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Compacts({ workspace }: { workspace: Workspace }) {
  return (
    <section className="panel" aria-labelledby="compacts-title">
      <div className="section-kicker">Compacts</div>
      <h2 id="compacts-title">Purpose, powers, limits, renewal.</h2>
      <div className="entity-grid">
        {workspace.compacts.map((compact: Compact) => (
          <article className="compact-card" key={compact.id}>
            <div className="stamp">v{compact.version} · {compact.status}</div>
            <h3>{compact.title}</h3>
            <p>{compact.purpose}</p>
            <dl>
              <dt>Powers</dt><dd>{compact.powers.join(', ')}</dd>
              <dt>Limits</dt><dd>{compact.limits.join(' · ')}</dd>
              <dt>Escalation</dt><dd>{compact.escalation}</dd>
              <dt>Renewal</dt><dd>{compact.renewalCadence}</dd>
            </dl>
          </article>
        ))}
      </div>
      <CharterBuilder />
    </section>
  )
}

function Exports({ workspace }: { workspace: Workspace }) {
  const exported = useMemo(() => JSON.stringify({ schemaVersion: 1, workspace }, null, 2), [workspace])

  return (
    <section className="panel exports" aria-labelledby="exports-title">
      <div className="section-kicker">Exports</div>
      <h2 id="exports-title">Portable workspace state.</h2>
      <p className="lede">This demo keeps state local and exportable. Copy the JSON to inspect the typed model that powers the shell.</p>
      <textarea readOnly rows={18} value={exported} aria-label="Serialized workspace JSON" />
    </section>
  )
}

function Diagnostic() {
  const [query, setQuery] = useState('Can an agent choose its own tool for a local partner workflow?')
  const zone = classifyGovernance(query)
  const copy = zoneCopy[zone]

  return (
    <section className="diagnostic" id="diagnostic" aria-labelledby="diagnostic-title">
      <div className="section-kicker">Diagnostic</div>
      <div className="diagnostic__grid">
        <div>
          <h2 id="diagnostic-title">Centralize, delegate, observe, or forbid?</h2>
          <p className="lede">Name a governance question. The field guide classifies the instinct, then tells you what kind of rail it needs.</p>
        </div>
        <div className="console">
          <label htmlFor="question">Governance question</label>
          <textarea id="question" value={query} onChange={(event) => setQuery(event.target.value)} rows={4} />
          <AnimatePresence mode="wait">
            <motion.div key={zone} className={`verdict verdict--${zone}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              <ZonePill zone={zone} />
              <h3>{copy.action}</h3>
              <p>{copy.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Rails() {
  const [activeZone, setActiveZone] = useState<GovernanceZone | 'all'>('all')
  const visibleRails = activeZone === 'all' ? rails : rails.filter((rail) => rail.zone === activeZone)

  return (
    <section className="rails" id="rails" aria-labelledby="rails-title">
      <div className="section-kicker">Constitutional rails</div>
      <div className="split-heading">
        <h2 id="rails-title">The center should be narrow enough to trust.</h2>
        <div className="filterbar" aria-label="Filter rails by zone">
          <button className={activeZone === 'all' ? 'active' : ''} onClick={() => setActiveZone('all')}>All</button>
          {zoneOrder.map((zone) => <button key={zone} className={activeZone === zone ? 'active' : ''} onClick={() => setActiveZone(zone)}>{zoneCopy[zone].label}</button>)}
        </div>
      </div>
      <div className="railgrid">
        {visibleRails.map((rail, index) => (
          <motion.article className="railcard" key={rail.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
            <div className="railcard__top"><span>{String(index + 1).padStart(2, '0')}</span><ZonePill zone={rail.zone} /></div>
            <h3>{rail.title}</h3>
            <p>{rail.doctrine}</p>
            <dl>
              <dt>Field test</dt><dd>{rail.test}</dd>
              <dt>Failure mode</dt><dd>{rail.failure}</dd>
            </dl>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function CharterBuilder() {
  const [name, setName] = useState('Settlement Scout')
  const [purpose, setPurpose] = useState('map emerging payment-agent behaviors and surface risks before they harden')
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedPowers, setSelectedPowers] = useState(['read memory', 'draft replies', 'call tools'])
  const charter = useMemo(() => generateCharter({ name, purpose, powers: selectedPowers, risk }), [name, purpose, selectedPowers, risk])

  function togglePower(power: string) {
    setSelectedPowers((current) => current.includes(power) ? current.filter((item) => item !== power) : [...current, power])
  }

  return (
    <section className="charter" id="charter" aria-labelledby="charter-title">
      <div className="section-kicker">Charter builder</div>
      <div className="charter__grid">
        <div>
          <h2 id="charter-title">Every agent should carry its compact.</h2>
          <p className="lede">Not a prompt. A compact: purpose, powers, limits, reciprocity, dissolution.</p>
          <div className="formstack">
            <label>Agent name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label>Purpose<textarea rows={3} value={purpose} onChange={(event) => setPurpose(event.target.value)} /></label>
            <fieldset>
              <legend>Powers</legend>
              <div className="chips">
                {powers.map((power) => <button key={power} type="button" className={selectedPowers.includes(power) ? 'selected' : ''} onClick={() => togglePower(power)}>{power}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>Risk posture</legend>
              <div className="segmented">
                {(['low', 'medium', 'high'] as const).map((level) => <button key={level} type="button" className={risk === level ? 'selected' : ''} onClick={() => setRisk(level)}>{level}</button>)}
              </div>
            </fieldset>
          </div>
        </div>
        <div className="charterpaper" aria-live="polite">
          <div className="stamp">Operating Compact</div>
          <pre>{charter}</pre>
        </div>
      </div>
    </section>
  )
}

function AntiPatterns() {
  return (
    <section className="antipatterns" id="antipatterns" aria-labelledby="anti-title">
      <div className="section-kicker">Failure geometry</div>
      <h2 id="anti-title">Two ways fleets go bad.</h2>
      <div className="anti-grid">
        <article>
          <Landmark />
          <h3>God-agent bureaucracy</h3>
          <p>One central agent becomes the permission office for every local judgment. It looks safe, then becomes slow, political, and brittle.</p>
        </article>
        <article>
          <Sparkles />
          <h3>Credentialed chaos</h3>
          <p>Every agent can improvise with real tools and soft norms. It looks alive, then becomes impossible to audit or revoke.</p>
        </article>
      </div>
    </section>
  )
}

function Cadence() {
  const steps = [
    ['Observe', 'Watch traces, memory provenance, tool use, spend, drift, and counterpart complaints.'],
    ['Intervene', 'Tighten a rail only when failure repeats or trust is threatened.'],
    ['Prune', 'Retire powers, memories, agents, and workflows that accrete risk without usefulness.'],
    ['Renew', 'Rewrite charters as the edge discovers better practice.'],
  ]
  return (
    <section className="cadence" id="cadence" aria-labelledby="cadence-title">
      <div className="section-kicker">Operating cadence</div>
      <h2 id="cadence-title">Governance is a rhythm, not a committee.</h2>
      <div className="timeline">
        {steps.map(([title, body], index) => <article key={title}><span>{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
      </div>
    </section>
  )
}

function Doctrine() {
  return (
    <div className="field-guide">
      <section className="doctrine" aria-label="Core doctrine">
        <article><ShieldCheck /><h2>Hard rails</h2><p>Identity, authority, audit, budget, settlement, and revocation belong at the center.</p></article>
        <article><Orbit /><h2>Living edges</h2><p>Voice, tactics, experiments, and domain specialization belong near the work.</p></article>
        <article><GitBranch /><h2>Accountable mutation</h2><p>Let agents learn locally without letting trust become local folklore.</p></article>
        <article><PauseCircle /><h2>Real pause</h2><p>Revocation must happen at credentials, budget, and network access — not merely in policy.</p></article>
      </section>
      <Diagnostic />
      <Rails />
      <AntiPatterns />
      <Cadence />
    </div>
  )
}

function WorkspacePanel({ workspace, onWorkspaceChange }: { workspace: Workspace; onWorkspaceChange: (workspace: Workspace) => void }) {
  function setSection(section: WorkspaceSection) {
    onWorkspaceChange({ ...workspace, activeSection: section })
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function resetDemo() {
    onWorkspaceChange(resetWorkspace())
  }

  return (
    <div className="workspace-shell" id="workspace">
      <ShellHeader workspace={workspace} activeSection={workspace.activeSection} onNavigate={setSection} onReset={resetDemo} />
      <AnimatePresence mode="wait">
        <motion.div key={workspace.activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
          {workspace.activeSection === 'dashboard' && <Dashboard workspace={workspace} onNavigate={setSection} />}
          {workspace.activeSection === 'fleet' && <Fleet workspace={workspace} />}
          {workspace.activeSection === 'scenarios' && <Scenarios workspace={workspace} />}
          {workspace.activeSection === 'compacts' && <Compacts workspace={workspace} />}
          {workspace.activeSection === 'doctrine' && <Doctrine />}
          {workspace.activeSection === 'exports' && <Exports workspace={workspace} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [workspace, setWorkspace] = useState<Workspace>(() => loadWorkspace())

  useEffect(() => {
    saveWorkspace(workspace)
  }, [workspace])

  function updateWorkspace(nextWorkspace: Workspace) {
    setWorkspace(nextWorkspace)
  }

  function navigateFromHero(section: WorkspaceSection) {
    updateWorkspace({ ...workspace, activeSection: section })
    window.setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return (
    <main>
      <Hero onNavigate={navigateFromHero} />
      <WorkspacePanel workspace={workspace} onWorkspaceChange={updateWorkspace} />
      <footer>
        <Clipboard />
        <p>A field manual and workspace for fleets that can speak, spend, remember, and delegate.</p>
        <a href="#hero-title">Return to center</a>
      </footer>
    </main>
  )
}

export default App
