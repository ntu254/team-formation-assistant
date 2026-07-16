"""Repository interfaces + an in-memory implementation. Pure stdlib.

The application depends on these Protocols, not on a database — so ownership checks are
testable now (in-memory) and the real Postgres/SQLAlchemy repository (free, OSS) plugs in
later behind the same interface (docs/architecture.md: infrastructure implements domain
interfaces).
"""
from __future__ import annotations

from typing import Protocol

from .domain.models import Cohort


class CohortRepository(Protocol):
    def get(self, cohort_id: str) -> Cohort | None: ...


class InMemoryCohortRepository:
    """Stdlib in-memory repo — for tests and local dev. Not for production data."""

    def __init__(self, cohorts: list[Cohort] | None = None) -> None:
        self._by_id: dict[str, Cohort] = {c.id: c for c in (cohorts or [])}

    def get(self, cohort_id: str) -> Cohort | None:
        return self._by_id.get(cohort_id)

    def add(self, cohort: Cohort) -> None:
        self._by_id[cohort.id] = cohort
