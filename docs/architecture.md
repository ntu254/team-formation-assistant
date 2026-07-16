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

## Technology strategy — free-first, reuse over rebuild

Prefer completely-free third-party services and open-source libraries before writing custom
code (ponytail reuse ladder). Do **not** rebuild what a mature free tool already does.

**Privacy caveat (non-negotiable, ties to the constitution / BR-08, BR-09, CON-01):**
student personal data must not be sent to a third-party hosted service unless that service is
privacy-compliant and approved. Free **local / open-source** libraries (run on our own
infra) are always safe; free **hosted** services are acceptable only for parts that do not
process student PII, or when data is anonymized/compliant.

Candidate free/reuse options (inferred, needs confirmation):

| Concern | Free / OSS candidate | PII exposure |
|---------|----------------------|--------------|
| Optimization core | OR-Tools (Apache-2.0), PuLP / python-mip, NetworkX matching | None — runs locally |
| Auth | Keycloak / Authlib (OSS self-host); Supabase / Firebase Auth (free tier) | Minimal; verify region/compliance |
| Database | PostgreSQL (OSS); Neon / Supabase Postgres (free tier) | Stores PII — must be compliant/region-checked |
| Backend hosting | Render / Fly.io / Railway free tier | Processes PII — verify compliance |
| Frontend hosting | Vercel / Netlify / Cloudflare Pages (free) | None (static) |
| Rationale text | Template-based (no service) preferred; a hosted LLM only if no PII is sent | Avoid sending student data |

Rule of thumb: **optimization and any PII processing use free OSS running on our own infra;**
free hosted services are fine for static hosting and non-PII concerns. Final choice of each
service is an open question for the team (needs confirmation).

## Diagram

<!-- Add a Mermaid C4/container diagram via the diagram-architecture skill when useful. -->
