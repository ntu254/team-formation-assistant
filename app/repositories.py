"""Repository interfaces + an in-memory implementation. Pure stdlib.

The application depends on these Protocols, not on a database — so ownership checks are
testable now (in-memory) and the real Postgres/SQLAlchemy repository (free, OSS) plugs in
later behind the same interface (docs/architecture.md: infrastructure implements domain
interfaces).
"""
from __future__ import annotations

from typing import Protocol

from .domain.models import Cohort, FormationRun, Team, Constraint


class CohortRepository(Protocol):
    def get(self, cohort_id: str) -> Cohort | None: ...
    def add(self, cohort: Cohort) -> None: ...
    def save_formation_run(self, run_data: FormationRun) -> None: ...
    def get_formation_run(self, formation_id: str) -> FormationRun | None: ...
    def update_formation_run_teams(self, formation_id: str, teams: list[Team]) -> None: ...
    def commit_formation_run(self, formation_id: str, lecturer_id: str) -> None: ...
    def get_cohort_constraints(self, cohort_id: str) -> list[Constraint]: ...
    def update_constraint_status(self, cohort_id: str, constraint_id: str, status: str) -> None: ...
    def log_audit_event(self, cohort_id: str, user_id: str, action: str, payload: str) -> None: ...


class InMemoryCohortRepository:
    """Stdlib in-memory repo — for tests and local dev. Not for production data."""

    def __init__(self, cohorts: list[Cohort] | None = None) -> None:
        self._by_id: dict[str, Cohort] = {c.id: c for c in (cohorts or [])}

    def get(self, cohort_id: str) -> Cohort | None:
        return self._by_id.get(cohort_id)

    def add(self, cohort: Cohort) -> None:
        self._by_id[cohort.id] = cohort

    def save_formation_run(self, run_data: FormationRun) -> None:
        pass

    def get_formation_run(self, formation_id: str) -> FormationRun | None:
        return None

    def update_formation_run_teams(self, formation_id: str, teams: list[Team]) -> None:
        pass

    def commit_formation_run(self, formation_id: str, lecturer_id: str) -> None:
        pass

    def get_cohort_constraints(self, cohort_id: str) -> list[Constraint]:
        return []

    def update_constraint_status(self, cohort_id: str, constraint_id: str, status: str) -> None:
        pass

    def log_audit_event(self, cohort_id: str, user_id: str, action: str, payload: str) -> None:
        pass
