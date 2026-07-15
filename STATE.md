# STATE

- **Last updated:** 2026-07-15 (by adoption)
- **Last verified commit:** (none yet — pre-implementation)
- **Active pack:** tfa
- **Loop level:** L1
- **loops_paused:** false
- **kill_switch:** false

<!--
loops_paused: false
-->

## Current focus

Project bootstrapped on Forge Harness. System-memory (architecture, domain, RBAC,
constitution, API contract, testing, code-style) is filled and passes `--strict`.
First feature spec (`specs/001-team-suggestion/`) is being written under SDD.

## Blockers

- [ ] Tech stack chosen (Python/FastAPI + React); repo skeleton (app/, web/) not scaffolded yet.

## Next steps

1. Finish `specs/001-team-suggestion/spec.md` — resolve the open `[NEEDS CLARIFICATION]`.
2. Plan (Constitution Check) -> analyze-consistency -> implement the matching engine core.
3. Scaffold the backend (`app/`) and web (`web/`) so the pack commands run.

## Open decisions (not yet ADR'd)

- How is competency "balance" scored precisely (variance across teams vs min-max spread)?
- Minimum common availability threshold for R5.

## Recent loop runs

| Date | Loop | Level | Result | Link |
|------|------|-------|--------|------|
| —    | —    | —     | —      | —    |
