# Narrow Center / Living Edge

**Narrow Center / Living Edge** is a chaordic governance workbench for AI agent fleets. It helps teams decide what belongs in invariant common rails — identity, authority, budget, audit, settlement, revocation — and what should remain alive at the edge: voice, tactics, local workflows, experiments, and tool composition.

Public app: https://deehock.github.io/narrow-center-living-edge/

Repository: https://github.com/deehock/narrow-center-living-edge

## What It Is

The first version is an interactive doctrine demo: diagnostic, constitutional rails, compact builder, anti-patterns, and operating cadence.

The product direction is larger: a real workbench where teams can model an agent fleet, classify capabilities, author operating compacts, simulate governance scenarios, record decisions, and export audit-ready doctrine.

## Product Modules

- **Workspace shell** — saved governance workspace with local persistence.
- **Fleet inventory** — agents, owners, powers, budgets, memory scope, escalation, revocation.
- **Capability matrix** — center / edge / observe / forbid classification across the fleet.
- **Compact builder** — purpose, powers, limits, obligations, escalation, dissolution.
- **Scenario simulator** — proposed capability → zone, rationale, controls, decision record.
- **Audit exports** — markdown compacts, JSON snapshot, capability report, scenario log.

## Development

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## TENET

This repository is onboarded as a TENET GTM/product workspace with a registered web service: `narrow-center-living-edge-app`.

The current build board starts with productization tasks: app shell, fleet inventory, compact v2, scenario simulator, audit exports, and product tests.

## Doctrine

The design principle is borrowed from network association governance: make the center narrow enough to be trusted and the edge alive enough to learn. A god-agent bureaucracy is too brittle. Credentialed chaos is too dangerous. The product lives between them.
