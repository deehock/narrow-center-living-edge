# Roadmap — Narrow Center / Living Edge

## Launch Target

**Target:** first product-quality alpha in two weeks.

**What ships:**

- Multi-workspace governance workbench shell.
- Agent fleet inventory.
- Compact builder v2 with structured export.
- Scenario simulator for center/edge decisions.
- Audit trail and doctrine export.
- Public demo URL plus repository-backed TENET board.

## Current Phase

```
[x] Phase 0: Doctrine demo
    └─ Interactive landing page with diagnostic, rails, and compact generator.

[ ] Phase 1: Product foundation
    └─ App shell, local persistence, data model, navigation, workspace state.

[ ] Phase 2: Fleet workbench
    └─ Agent inventory, capability matrix, budget/authority/revocation fields.

[ ] Phase 3: Governance simulator
    └─ Scenario decisions, precedent log, recommended rails, exportable review packet.

[ ] Phase 4: Collaboration and audit
    └─ Decision history, markdown/JSON exports, review states, shareable workspace snapshots.

[ ] Launch
    └─ A usable product, not a page: teams can model a real fleet and leave with operating artifacts.
```

## Milestones

### Pre-Launch

| Window | Focus | Deliverables |
|--------|-------|--------------|
| Now | TENET/service onboarding | .tenet config, registered service, kanban, product docs. |
| +2 days | App foundation | routing, layout, local storage, seed workspace, state tests. |
| +5 days | Fleet inventory | create/edit agents, powers, budgets, compact status, revocation status. |
| +8 days | Scenario simulator | decision form, zone scoring, precedent log, recommended controls. |
| +12 days | Export + polish | markdown/JSON exports, mobile QA, accessibility pass, Pages deploy. |

### Launch Week

| Day | Activity |
|-----|----------|
| Mon | Dogfood with one real agent fleet. |
| Tue | Fix confusing classifications and missing fields. |
| Wed | Add example workspaces for agentic commerce and internal ops. |
| Thu | Polish exports and README. |
| Fri | Share public URL and collect design-partner reactions. |

## Dependencies

### Blockers

- Decide whether first persistence stays local-only or adds a hosted backend.
- Pick the first real fleet to model.

### External Dependencies

- GitHub Pages deployment status.
- Feedback from Visa strategy / agentic-commerce operators.

### Internal Dependencies

- Clean data model for workspace, agent, capability, scenario, decision, and compact.
- Tests around classification, compact generation, persistence, and export.
- TENET kanban kept as the build source of truth.

## Success Metrics

### Launch Day Goals

| Metric | Target |
|--------|--------|
| Real fleet modeled | 1 complete workspace |
| Time to first compact | < 5 minutes |
| Export produced | Markdown + JSON |
| Build/test gate | passing |

### 30-Day Goals

| Metric | Target |
|--------|--------|
| Design partner workspaces | 3 |
| Reusable scenario precedents | 25 |
| Agent compacts authored | 50 |
| Product issues closed | 20 |

### 90-Day Goals

| Metric | Target |
|--------|--------|
| Active teams | 5 |
| Framework integrations scoped | 2 |
| Governance export accepted in real review | 1+ |

## Team Assignments

| Area | Owner | Status |
|------|-------|--------|
| Product | Dee / Tagga | Active |
| Doctrine | Dee | Active |
| Engineering | Dee + build agents | Starting |
| Design | Dee | Active |
| Design partners | Tagga / Visa room | Pending |

## Updates Log

### 2026-05-05

- Converted the project from a doctrine demo into a TENET-governed product workspace.
- Registered the app as a service and created product build roadmap.
