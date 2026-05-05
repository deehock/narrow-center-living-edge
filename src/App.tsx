import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Clipboard, GitBranch, Landmark, Orbit, PauseCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import { classifyGovernance, generateCharter, rails, type GovernanceZone, zoneCopy } from './lib/governance'

const zoneOrder: GovernanceZone[] = ['center', 'edge', 'observe', 'forbid']

const powers = ['read memory', 'draft replies', 'call tools', 'spend budget', 'message humans', 'spawn agents']

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

function App() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <div className="eyebrow"><Mark /> Chaordic governance for agent fleets</div>
          <h1 id="hero-title">Narrow Center.<br />Living Edge.</h1>
          <p>Govern fewer things absolutely. Observe many things continuously.</p>
          <div className="hero__actions">
            <a href="#diagnostic">Run the diagnostic</a>
            <a href="#charter" className="secondary">Draft a charter</a>
          </div>
        </div>
        <TypographicOrbit />
      </section>

      <section className="doctrine" aria-label="Core doctrine">
        <article><ShieldCheck /><h2>Hard rails</h2><p>Identity, authority, audit, budget, settlement, and revocation belong at the center.</p></article>
        <article><Orbit /><h2>Living edges</h2><p>Voice, tactics, experiments, and domain specialization belong near the work.</p></article>
        <article><GitBranch /><h2>Accountable mutation</h2><p>Let agents learn locally without letting trust become local folklore.</p></article>
        <article><PauseCircle /><h2>Real pause</h2><p>Revocation must happen at credentials, budget, and network access — not merely in policy.</p></article>
      </section>

      <Diagnostic />
      <Rails />
      <CharterBuilder />
      <AntiPatterns />
      <Cadence />

      <footer>
        <Clipboard />
        <p>A field manual for fleets that can speak, spend, remember, and delegate.</p>
        <a href="#hero-title">Return to center</a>
      </footer>
    </main>
  )
}

export default App
