"""SQL-backed CohortRepository (SQLAlchemy). Implements the domain repository Protocol.

Same interface as InMemoryCohortRepository, so it drops into the API without route changes.
Verified against SQLite in tests; production uses the same code against Postgres (URL swap).
"""
from __future__ import annotations

from sqlalchemy.orm import sessionmaker

from ..domain.models import Cohort
from .db import CohortRow


class SqlCohortRepository:
    def __init__(self, session_factory: sessionmaker) -> None:
        self._session_factory = session_factory

    def get(self, cohort_id: str) -> Cohort | None:
        with self._session_factory() as session:
            row = session.get(CohortRow, cohort_id)
            if row is None:
                return None
            return Cohort(id=row.id, owner_id=row.owner_id, name=row.name)

    def add(self, cohort: Cohort) -> None:
        with self._session_factory() as session:
            session.merge(CohortRow(id=cohort.id, owner_id=cohort.owner_id, name=cohort.name))
            session.commit()
