# Testing — Team Formation Assistant

Verifier uses this. Commands run from the repo root; pass conditions are explicit.

## Commands

| Purpose | Command | Pass condition |
|---------|---------|----------------|
| Install | `uv sync && npm --prefix web ci` | exit 0 |
| Lint | `ruff check . && npm --prefix web run lint` | no errors |
| Typecheck | `mypy . && npm --prefix web run typecheck` | no errors |
| Unit/integration | `pytest -q && npm --prefix web test -- --run` | all pass |
| E2E | `playwright test` | all pass |
| Build | `npm --prefix web run build` | build succeeds |
| Run | `uvicorn app.main:app --reload` | affected flow observably works |

## Rules

- Verify by **driving the affected flow** (run a formation, inspect teams), not tests alone.
- Authorization changes require a test proving the unauthorized / other-owner case is rejected.
- New/changed behavior gets a regression test; report failures with output.

## Matching-engine tests (property-based)

The optimizer is the highest-risk component; test it with properties, not just examples:

- **Hard constraints hold** — for random feasible cohorts, every produced team satisfies R1
  (size band), R2 (must/cannot-pair), R7 (exactly-once). Never violated.
- **Determinism (R8)** — same inputs + same seed produce byte-identical formations.
- **Infeasibility is honest** — when hard constraints cannot be met, the engine reports the
  conflict (422 upstream), never a partial/invalid team.
- **Balance improves (R4)** — competency spread beats a random assignment baseline on average.

Use small hand-built fixtures for edge cases (odd cohort size, one cannot-pair clique) and
generated cohorts for the properties.
