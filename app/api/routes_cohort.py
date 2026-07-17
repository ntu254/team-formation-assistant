"""Cohort management routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid

from ..domain.models import Cohort
from ..repositories import CohortRepository
from .deps import Principal, get_cohort_repo, require_role

router = APIRouter(prefix="/v1/cohorts", tags=["cohort"])


class CreateCohortIn(BaseModel):
    name: str


@router.get("")
async def list_cohorts(
    principal: Principal = Depends(require_role("lecturer")),
    cohorts: CohortRepository = Depends(get_cohort_repo),
) -> dict:
    """List cohorts owned by the currently authenticated lecturer."""
    owner_cohorts = cohorts.get_cohorts_by_owner(principal.user_id)
    return {
        "cohorts": [
            {"id": c.id, "name": c.name, "owner_id": c.owner_id}
            for c in owner_cohorts
        ]
    }


@router.post("")
async def create_cohort(
    body: CreateCohortIn,
    principal: Principal = Depends(require_role("lecturer")),
    cohorts: CohortRepository = Depends(get_cohort_repo),
) -> dict:
    """Create a new cohort for the lecturer."""
    cohort_id = str(uuid.uuid4())
    cohort = Cohort(id=cohort_id, owner_id=principal.user_id, name=body.name)
    cohorts.add(cohort)
    return {"id": cohort.id, "name": cohort.name, "owner_id": cohort.owner_id}
