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

Walking skeleton built on branch `feat/001-team-suggestion` (option B — defaults recorded as
assumptions A-01..A-05). **Core is verified real:** domain + deterministic mock matching engine
(`app/`), 7 stdlib `unittest` tests PASS (incl. a 300-cohort property test that hard constraints
R1/R2/R7 never break, R8 determinism, and infeasibility reporting). `python -m app.demo` runs
end-to-end. FastAPI API and React web are **scaffolded (not run — need `uv sync` / `npm ci`)**.
Free-first + privacy strategy recorded in `docs/architecture.md`.
BRD/PRD authored earlier; system-memory passes `--strict`.

## Blockers

- [ ] Tech stack chosen (Python/FastAPI + React); repo skeleton (app/, web/) not scaffolded yet.

## Verified now
- Core: 7 stdlib tests (property/determinism/infeasible) + demo.
- API: 5 FastAPI TestClient tests — 401/403 (SC-004), 200 happy path, 422 infeasible. **12/12 pass.**
  Deps installed in `.venv` (fastapi, pydantic, httpx, pytest); run `.venv/Scripts/python -m pytest -q`.

## Next steps

1. Confirm/veto assumptions A-01..A-05 (balance metric, size band, forbidden signals, data model).
2. Wire cohort-ownership check to the datastore (BR-13); add web e2e.
3. Replace the mock engine with the real OR-Tools engine behind the same interface (free, OSS).
4. Confirm the free third-party services per `docs/architecture.md` (with the privacy caveat).

## Open decisions (not yet ADR'd)

- How is competency "balance" scored precisely (variance across teams vs min-max spread)?
- Minimum common availability threshold for R5.

## Recent loop runs

| Date | Loop | Level | Result | Link |
|------|------|-------|--------|------|
| —    | —    | —     | —      | —    |
