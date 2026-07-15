# Code Style — Team Formation Assistant (stack idioms)

Pack companion to the portable `policies/code-quality.md`. The `code-review` gate reads both.

## Python (backend / optimizer)

- Type hints on every public function; `mypy` runs in strict mode; no untyped defs.
- `ruff` for lint + format; zero-warnings policy. No bare `except` — catch specific errors.
- Validate all boundary inputs with **pydantic** models; do not trust request payloads.
- Keep the domain pure: no FastAPI, ORM, or OR-Tools imports inside `domain/`.
- The optimizer takes an explicit `seed`; never rely on process-global randomness.
- Small functions; a function that needs a comment to explain "what" should be split.

## TypeScript / React (web)

- `strict` TS; no `any`. Exhaustive handling of discriminated unions.
- Function components + hooks; data fetching isolated in an API client, not in components.
- Tests with Vitest + React Testing Library; assert behavior, not implementation.

## Naming

- Python: `snake_case` for functions/vars, `PascalCase` for classes, `UPPER_SNAKE` for consts.
- TS: `camelCase` for vars/functions, `PascalCase` for components/types.
- Domain terms match `docs/domain.md` exactly (Student, Team, Formation, Constraint).

## Error handling idiom

- Backend: raise typed domain errors; the API layer maps them to the `{code,message,details}`
  contract and the right HTTP status. Never swallow an error.
- Optimizer: infeasibility is a typed result (reported), not an exception that hides the cause.

## Do / Don't

- **Do:** log run inputs + seed + result version for every formation (auditability).
- **Don't:** put authorization checks in the React UI as the only gate — server decides.
- **Don't:** read or log protected/sensitive attributes.
