"""Auth / role dependency (scaffold). Requires FastAPI (install to run).

Enforces authentication + role server-side per request (docs/rbac.md, BR-13). This is a stub
that reads a role header for local development; replace with a real auth provider
(free OSS / free-tier — see docs/architecture.md, respecting the privacy caveat).
"""
from __future__ import annotations

from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status  # type: ignore[import-not-found]

from ..repositories import CohortRepository, InMemoryCohortRepository

ROLES = ("student", "lecturer", "admin")

# Default repo (in-memory). Tests and real infra override this via FastAPI dependency_overrides
# or by swapping the provider for a Postgres-backed CohortRepository.
_cohort_repo: CohortRepository = InMemoryCohortRepository()


def get_cohort_repo() -> CohortRepository:
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
