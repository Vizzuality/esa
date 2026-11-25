# 0001. Record architecture decisions

- **Status**: accepted
- **Date**: 2026-11-25

## Context

Decisions about infrastructure and architecture in this project have so far lived in pull request descriptions and people's heads. Without the reasoning, future contributors can't tell whether a choice is deliberate or an accident they're free to change.

## Decision

Record architecturally significant decisions as Architecture Decision Records in `docs/adr/`, numbered sequentially (`NNNN-kebab-case-title.md`).

## Alternatives considered

- **Pull request descriptions only**: they're hard to find once merged and aren't versioned with the code they explain.
- **A single design document**: it tends to go stale and mixes decisions with descriptions of the current state.

## Consequences

- **Positive**: the "why" behind a decision lives next to the code and is reviewed with it.
- **Trade-offs**: writing an ADR adds a small step to changes that make a real architectural choice.
- **Follow-ups**: superseded decisions get a new ADR that references the old one, rather than being edited in place.
