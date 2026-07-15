# RBAC — Team Formation Assistant

Authorization is enforced server-side, per request, in the API/application layer.
`l1-rbac-audit` maps every protected operation to a scope here.

## Roles

| Role | Description |
|------|-------------|
| student | Owns their own profile; belongs to cohorts and teams. |
| lecturer | Owns cohorts/projects; runs and overrides formations for their own cohorts. |
| admin | Manages users, cohorts, and system configuration. |

## Operation to scope map

| Operation | Required role | Object-level (ownership) check | Enforced in |
|-----------|---------------|-------------------------------|-------------|
| View/edit own profile | student | acting on own studentId only | profile service |
| View own team | student | member of that team | formation service |
| Submit must/cannot-pair request | student | involves self; lecturer approves | constraint service |
| Create cohort/project | lecturer | none | cohort service |
| Run a formation | lecturer | owns the cohort/project | formation service |
| View a formation (full) | lecturer | owns the cohort | formation service |
| Override/commit teams | lecturer | owns the cohort | formation service |
| Manage users / config | admin | none | admin service |

## Rules

- A **student** may read and write only their own profile and read only the teams they are a
  member of. They may never read another student's profile or any full formation.
- A **lecturer** may run, view, and override formations **only for cohorts they own**
  (object-level ownership check on every formation operation).
- Object access is validated against the caller's identity/ownership on every request
  (guards against IDOR/BOLA), never trusting a client-supplied role or id.
- Privileged operations (override/commit, admin) require the elevated scope; roles are
  resolved server-side from the authenticated principal.
- Sensitive/protected attributes are never exposed across students and are never returned by
  student-scoped endpoints.
