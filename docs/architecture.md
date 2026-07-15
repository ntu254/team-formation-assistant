# Architecture — Team Formation Assistant

Source of truth for boundaries and dependency direction. Stack: FastAPI (Python) backend,
React + TypeScript frontend, PostgreSQL, OR-Tools optimizer.

## Components

- **Web (React/TS)** — two surfaces: the student profile app (edit skills, schedule,
  preferences, constraints) and the lecturer console (create a cohort/project, run a
  formation, review and override suggested teams).
- **API (FastAPI)** — authentication, profile CRUD, cohort/project management, and the
  formation endpoints. Enforces authorization per request.
- **Application / services** — use cases: build a formation request, invoke the optimizer,
  persist and version results, apply lecturer overrides.
- **Domain** — pure entities and rules (Student, Team, Constraint, Formation, balance
  scoring). No I/O, no framework imports.
- **Matching engine (optimizer)** — a boundary. Takes a formation request (students +
  constraints + weights) and returns scored team sets plus a per-team rationale. Backed by
  OR-Tools CP-SAT; reached through an interface, not imported across layers.
- **Infrastructure** — PostgreSQL repositories, auth provider, object storage for exports.

## Boundaries (Architecture Reviewer enforces)

- Dependencies point inward: `web -> api -> application -> domain`; `infrastructure` and the
  `matching engine` implement domain-defined interfaces. The domain never imports FastAPI,
  the ORM, or OR-Tools.
- Authorization happens in the application/API layer, per request — never only in the web UI.
- The optimizer is deterministic given inputs + seed; it is called through its interface so
  it can be swapped or stubbed in tests.

## Dependency direction

`web -> api -> application -> domain  <-  infrastructure | matching-engine`. No cycles.

## Key flows

1. **Profile intake** — student edits their profile; validated at the API boundary; stored.
2. **Run formation** — lecturer triggers a run for a cohort/project; application assembles
   the request, calls the optimizer, stores a versioned Formation with rationale.
3. **Review and override** — lecturer inspects suggested teams and edits assignments; the
   override is persisted as the committed result and always wins over the AI.

## Diagram

<!-- Add a Mermaid C4/container diagram via the diagram-architecture skill when useful. -->
