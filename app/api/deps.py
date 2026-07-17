"""Auth / role dependency (scaffold). Requires FastAPI (install to run).

Enforces authentication + role server-side per request (docs/rbac.md, BR-13). This is a stub
that reads a role header for local development; replace with a real auth provider
(free OSS / free-tier — see docs/architecture.md, respecting the privacy caveat).
"""
from __future__ import annotations

import os
from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status  # type: ignore[import-not-found]

from ..matching.engine import MatchingEngine
from ..repositories import CohortRepository, InMemoryCohortRepository

ROLES = ("student", "lecturer", "admin")


def get_engine() -> MatchingEngine:
    """Production default: the real OR-Tools engine (free, OSS, local). Lazy-imported so the
    API module does not require OR-Tools at import time; tests override this with the mock."""
    from ..matching.ortools_engine import OrToolsMatchingEngine

    return OrToolsMatchingEngine(max_time_s=5.0)

# Repo provider: SQL (Postgres/SQLite) when DATABASE_URL is set, else in-memory for local dev.
# Tests override this via FastAPI dependency_overrides. Built lazily so the API module does not
# require SQLAlchemy at import time.
_cohort_repo: CohortRepository | None = None


def get_cohort_repo() -> CohortRepository:
    global _cohort_repo
    if _cohort_repo is None:
        url = os.environ.get("DATABASE_URL", "sqlite:///./tfa.db")
        if url:
            from ..infra.db import init_db, make_engine, make_session_factory
            from ..infra.sql_repository import SqlCohortRepository

            engine = make_engine(url)
            init_db(engine)
            _cohort_repo = SqlCohortRepository(make_session_factory(engine))
        else:
            _cohort_repo = InMemoryCohortRepository()
    return _cohort_repo


@dataclass
class Principal:
    user_id: str
    role: str


async def current_principal(
    x_user_id: str = Header(default=""),
    x_role: str = Header(default=""),
) -> Principal:
    if not x_user_id or x_role not in ROLES:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "authentication required")
    return Principal(user_id=x_user_id, role=x_role)


def require_role(*allowed: str):
    async def _dep(principal: Principal = Depends(current_principal)) -> Principal:
        if principal.role not in allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "insufficient role")
        return principal

    return _dep
