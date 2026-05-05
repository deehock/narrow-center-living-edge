# Product Spec — Narrow Center / Living Edge

## Premise

An AI agent fleet should not be governed like a software stack. It should be governed like a network association: narrow invariant rails at the center, wide experimentation at the edge, continuous observation where judgment is still forming, and hard forbiddance where trust itself is attacked.

## Product Direction

This project is no longer just a marketing landing page. It is a product workbench for designing, operating, and reviewing agent-fleet governance.

The landing-page sections remain as doctrine and onboarding, but the core product should let a team bring a real fleet and leave with operational artifacts.

## Primary User

A platform, strategy, product, or governance operator responsible for a set of AI agents that can do one or more of:

- speak to humans;
- call tools or APIs;
- access memory or private context;
- spend money, credits, compute, or budget;
- mutate code/content/configuration;
- delegate to other agents;
- operate across partners, merchants, issuers, or internal teams.

## Product Modules

### 1. Workspace Shell

A saved governance workspace with:

- workspace name and purpose;
- operating principles;
- default risk posture;
- local persistence;
- import/export seed data;
- navigation between dashboard, fleet, scenarios, compacts, doctrine, and exports.

### 2. Fleet Inventory

Users can model agents as institutional actors:

- name, role, owner, status;
- purpose;
- powers/capabilities;
- tools and channels;
- memory scope;
- budget/spend limits;
- authority source;
- escalation contact;
- revocation status;
- compact completeness.

### 3. Capability Matrix

Capabilities are classified by governance zone:

- **Center:** identity, authority, budget, audit, settlement, revocation.
- **Edge:** voice, tactics, local workflows, tool composition, experiments.
- **Observe:** memory behavior, drift, quality, provenance, feedback loops.
- **Forbid:** deception, impersonation, hidden incentives, exfiltration, bypassing audit.

The matrix should show coverage gaps and risky concentrations.

### 4. Compact Builder v2

The current charter builder becomes a structured compact editor:

- purpose;
- powers;
- limits;
- reciprocity / obligations to humans and other agents;
- escalation triggers;
- audit obligations;
- dissolution / pause / fork / retire conditions;
- generated markdown export.

### 5. Scenario Simulator

Users enter a proposed agent action or capability. The system returns:

- recommended zone;
- rationale;
- required controls;
- questions to answer before approval;
- precedent history if similar scenarios exist;
- decision record: approve, delegate, observe, forbid, or revisit.

### 6. Audit Trail / Precedent Log

Every scenario decision and compact change creates a record:

- timestamp;
- actor;
- scenario/capability;
- zone;
- decision;
- rationale;
- linked agents;
- exportable review packet.

### 7. Doctrine and Exports

The product produces artifacts humans can use:

- markdown operating doctrine;
- JSON workspace snapshot;
- compact per agent;
- capability risk report;
- scenario decision log.

## MVP Acceptance Criteria

- App builds with TypeScript.
- Works without a backend for alpha.
- Responsive from mobile to desktop.
- Accessible labels and reduced-motion support.
- Distinct brand system preserved.
- User can create/edit at least three agents in a fleet inventory.
- User can classify and record at least one governance scenario.
- User can generate/export a markdown compact for an agent.
- User can view dashboard metrics: center rails covered, edge freedoms, observed fields, forbidden risks, compact completeness.
- Tests cover governance classification, compact generation, workspace state, and export serialization.

## Non-Goals for MVP

- Real identity-provider integration.
- Live agent runtime enforcement.
- Multi-user hosted collaboration.
- Compliance-framework mapping.
- Payment or credential issuance.

## Near-Term Issues

1. Build the workspace data model and local persistence.
2. Replace single-page-only flow with product navigation.
3. Add fleet inventory CRUD.
4. Upgrade compact builder to structured markdown export.
5. Add scenario simulator with decision log.
6. Add dashboard metrics and risk summaries.
7. Add import/export for workspace snapshots.
8. Add tests for state and export behavior.
