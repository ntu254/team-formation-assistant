# AGENTS.md — Team Formation Assistant

This repo adopts **Forge Harness**. Authoritative rules: `forge-harness/AGENTS.md`.
Pack manifest: `.forge/pack.yaml`.

    active_pack: tfa

Task contract: Understand -> (Specify) -> Plan -> Implement -> Verify -> Review -> Human gate.
For non-trivial features use Spec-Driven Development (`scripts/new-feature`).

Policies: ponytail, code-quality, security, git-and-worktree, human-gate. Agents never self-merge.

## Project one-liner
Auto-groups students into balanced project teams (skills, major, experience, schedule,
preferences, desired roles); AI suggests optimal formations. Users: students, lecturers.
Goal: shorten team formation, reduce conflict, raise team quality.

## Non-negotiables (see docs/constitution.md)
- Hard constraints (team size, must-pair, cannot-pair) are never violated.
- Student data is private; access is per-role + per-ownership (docs/rbac.md).
- Every suggestion is explainable; a lecturer's override is final (human-in-the-loop).
