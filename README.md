# Team Formation Assistant

Auto-groups students into balanced project teams from skills, major, experience, schedule,
preferences, and desired roles. An AI engine suggests optimal formations; a lecturer reviews,
overrides, and commits. Users: students, lecturers.

Adopts **Forge Harness** (`../forge-harness`). Rules: `AGENTS.md`; product docs: `docs/`.

## Layout

```
app/domain/      Pure-stdlib entities + hard-constraint validators (R1/R2/R7)
app/matching/    Engine interface + deterministic mock engine + balance scoring
app/api/         FastAPI app (scaffold — needs deps to run)
tests/           stdlib unittest: property + determinism + infeasibility
web/             React + TypeScript placeholder (scaffold)
docs/            BRD, PRD, architecture, domain, rbac, api-contract, testing, constitution, code-style, adr
specs/           Spec-Driven Development feature dirs
```

## Run

The **core** runs and is tested with no external dependencies:

```sh
python -m unittest discover -s tests -t .   # 7 tests: hard constraints, determinism, infeasibility
python -m app.demo                      # end-to-end sample formation
```

The **API and web** need dependencies (not installed here):

```sh
uv sync            # or: pip install -e ".[dev]"
uvicorn app.api.main:app --reload
cd web && npm ci && npm run dev
```

## Status

Walking skeleton. Matching core verified; API/UI scaffolded. Defaults A-01..A-05 (in
`specs/001-team-suggestion/spec.md`) are marked **needs confirmation**. The real optimizer will
reuse **OR-Tools** (free, OSS, local). Student PII never goes to a third-party hosted service
(see `docs/architecture.md`).
