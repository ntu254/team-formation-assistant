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

## Verified now (18/18 pass — `.venv/Scripts/python -m pytest -q`)
- Core (stdlib): property/determinism/infeasible on the mock engine + demo.
- API (FastAPI TestClient): 401 / 403 role (SC-004) / **403 non-owner + 404 unknown cohort (BR-13, IDOR)** / 200 / 422.
- **Real OR-Tools CP-SAT engine** (app/matching/ortools_engine.py): 30 generated cohorts never
  violate R1/R2/R7, determinism (R8), infeasible reported. Same interface as the mock.
- Deps in `.venv`: fastapi, pydantic, httpx, pytest, ortools. Route defaults to the OR-Tools engine.

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
