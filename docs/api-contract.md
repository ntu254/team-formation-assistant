# API Contract — Team Formation Assistant

## Conventions

- Transport: REST/JSON over HTTPS. Auth: bearer token; never a token in a URL.
- Error shape: `{ "code": string, "message": string, "details": object }`; HTTP status is authoritative.
- Versioned under `/v1`. Timestamps are ISO-8601 UTC. Pagination via `limit` and `cursor`.

## Endpoints (v1)

| Method | Path | Role/scope | Purpose | Errors |
|--------|------|-----------|---------|--------|
| GET | /v1/students/me/profile | student | Read own profile | 401, 403 |
| PUT | /v1/students/me/profile | student | Update own skills/schedule/preferences | 400, 401, 403 |
| POST | /v1/students/me/constraints | student | Propose must/cannot-pair (needs lecturer approval) | 400, 403 |
| GET | /v1/students/me/teams | student | Teams the caller is in | 401 |
| POST | /v1/cohorts | lecturer | Create a cohort | 400, 403 |
| POST | /v1/cohorts/{cohortId}/projects | lecturer | Add a project (size band, required skills/roles) | 400, 403 |
| POST | /v1/cohorts/{cohortId}/formations | lecturer (owns cohort) | Run a formation (async job) | 403, 409, 422 |
| GET | /v1/formations/{formationId} | lecturer (owns cohort) | Teams + scores + rationale | 403, 404 |
| POST | /v1/formations/{formationId}/override | lecturer (owns cohort) | Adjust assignments (final) | 400, 403, 409 |
| POST | /v1/formations/{formationId}/commit | lecturer (owns cohort) | Commit the formation | 403, 409 |

## Formation request/response (shape)

- **Request**: `{ "projectId", "weights": {"balance","schedule","preference","role"}, "seed" }`.
- **Response** (per team): `{ "teamId", "members", "scores": {...}, "rationale": string,
  "unmet_soft": [...] }`. Unassignable students are returned in `unassignable` with a reason.

## Validation and errors

- Every input is validated at the API boundary with pydantic models; unknown fields rejected
  where they matter (guards mass-assignment).
- `422` when a run is infeasible (hard constraints cannot be satisfied) — the response names
  the conflicting constraints rather than returning a partial, invalid formation.
