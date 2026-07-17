"""SQL-backed CohortRepository (SQLAlchemy). Implements the domain repository Protocol.

Same interface as InMemoryCohortRepository, so it drops into the API without route changes.
Verified against SQLite in tests; production uses the same code against Postgres (URL swap).
"""
from __future__ import annotations

from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update
import json
from uuid import uuid4

from ..domain.models import Cohort, FormationRun, Team, Constraint
from .db import (
    CohortRow, FormationRunRow, FormationTeamRow,
    CommittedResultRow, StudentConstraintRow, AuditEventRow
)


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

    def save_formation_run(self, run_data: FormationRun) -> None:
        with self._session_factory() as session:
            row = FormationRunRow(
                id=run_data.id,
                cohort_id=run_data.cohort_id,
                project_id=run_data.project_id,
                min_size=run_data.min_size,
                max_size=run_data.max_size,
                seed=run_data.seed,
                status=run_data.status,
                balance=run_data.balance,
                created_at=run_data.created_at,
            )
            for t in run_data.teams:
                t_row = FormationTeamRow(
                    id=t.id,
                    formation_id=run_data.id,
                    name=t.id,
                    rationale=t.rationale,
                    member_ids=",".join(t.member_ids)
                )
                row.teams.append(t_row)
            session.add(row)
            session.commit()

    def get_formation_run(self, formation_id: str) -> FormationRun | None:
        with self._session_factory() as session:
            row = session.get(FormationRunRow, formation_id)
            if not row:
                return None
            teams = [
                Team(
                    id=t.id,
                    member_ids=t.member_ids.split(",") if t.member_ids else [],
                    rationale=t.rationale
                )
                for t in row.teams
            ]
            return FormationRun(
                id=row.id,
                cohort_id=row.cohort_id,
                project_id=row.project_id,
                min_size=row.min_size,
                max_size=row.max_size,
                seed=row.seed,
                status=row.status,
                balance=row.balance,
                created_at=row.created_at,
                teams=teams
            )

    def update_formation_run_teams(self, formation_id: str, teams: list[Team]) -> None:
        with self._session_factory() as session:
            stmt = select(FormationRunRow).where(FormationRunRow.id == formation_id)
            run = session.execute(stmt).scalar_one_or_none()
            if not run:
                return
            
            run.teams.clear()
            
            for t in teams:
                run.teams.append(FormationTeamRow(
                    id=t.id,
                    formation_id=formation_id,
                    name=t.id,
                    rationale=t.rationale,
                    member_ids=",".join(t.member_ids)
                ))
            session.commit()

    def commit_formation_run(self, formation_id: str, lecturer_id: str) -> None:
        with self._session_factory() as session:
            run = session.get(FormationRunRow, formation_id)
            if not run:
                return
                
            stmt = update(CommittedResultRow).where(
                CommittedResultRow.cohort_id == run.cohort_id
            ).values(status="superseded")
            session.execute(stmt)
            
            stmt = select(CommittedResultRow).where(CommittedResultRow.cohort_id == run.cohort_id)
            existing = session.execute(stmt).scalars().all()
            next_version = max([c.version for c in existing], default=0) + 1
            
            from datetime import datetime
            commit_row = CommittedResultRow(
                id=str(uuid4()),
                cohort_id=run.cohort_id,
                formation_id=formation_id,
                version=next_version,
                status="active",
                committed_by=lecturer_id,
                committed_at=datetime.utcnow()
            )
            session.add(commit_row)
            run.status = "committed"
            session.commit()

    def get_cohort_constraints(self, cohort_id: str) -> list[Constraint]:
        with self._session_factory() as session:
            stmt = select(StudentConstraintRow).where(StudentConstraintRow.cohort_id == cohort_id)
            rows = session.execute(stmt).scalars().all()
            return [
                Constraint(
                    id=r.id,
                    cohort_id=r.cohort_id,
                    type=r.type,
                    student_a=r.student_a,
                    student_b=r.student_b,
                    status=r.status
                ) for r in rows
            ]

    def update_constraint_status(self, cohort_id: str, constraint_id: str, status: str) -> None:
        with self._session_factory() as session:
            stmt = update(StudentConstraintRow).where(
                StudentConstraintRow.cohort_id == cohort_id,
                StudentConstraintRow.id == constraint_id
            ).values(status=status)
            session.execute(stmt)
            session.commit()

    def log_audit_event(self, cohort_id: str, user_id: str, action: str, payload: str) -> None:
        with self._session_factory() as session:
            from datetime import datetime
            row = AuditEventRow(
                cohort_id=cohort_id,
                user_id=user_id,
                action=action,
                payload=payload,
                timestamp=datetime.utcnow()
            )
            session.add(row)
            session.commit()

