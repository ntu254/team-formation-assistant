"""Formation routes (scaffold). Requires FastAPI (install to run).

Maps the run-formation use case onto HTTP. Ownership check (lecturer owns the cohort) is a
TODO wired to the datastore in the next iteration (docs/rbac.md, BR-13). The route already
delegates to the engine interface, so swapping the mock for OR-Tools needs no route change.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status  # type: ignore[import-not-found]
from pydantic import BaseModel  # type: ignore[import-not-found]

from ..domain.models import Constraints, Project, Skill, Student
from ..matching.engine import MatchingEngine
from ..matching.mock_engine import MockMatchingEngine
from .deps import Principal, require_role

router = APIRouter(prefix="/v1", tags=["formation"])

# Inject the engine (mock now; OR-Tools later — same interface).
_engine: MatchingEngine = MockMatchingEngine()


class SkillIn(BaseModel):
    name: str
    proficiency: int


class StudentIn(BaseModel):
    id: str
    name: str = ""
    major: str = ""
    experience_years: float = 0.0
    skills: list[SkillIn] = []
    availability: list[str] = []
    desired_role: str = "other"


class RunFormationIn(BaseModel):
    project_id: str
    min_size: int = 3
    max_size: int = 5
    students: list[StudentIn]
    must_pair: list[tuple[str, str]] = []
    cannot_pair: list[tuple[str, str]] = []
    seed: int = 0


@router.post("/cohorts/{cohort_id}/formations")
async def run_formation(
    cohort_id: str,
    body: RunFormationIn,
    principal: Principal = Depends(require_role("lecturer")),
) -> dict:
    # TODO(next iteration): verify `principal` owns `cohort_id` against the datastore (BR-13).
    students = [
        Student(
            id=s.id,
            name=s.name,
            major=s.major,
            experience_years=s.experience_years,
            skills=[Skill(k.name, k.proficiency) for k in s.skills],
            availability=frozenset(s.availability),
            desired_role=s.desired_role,
        )
        for s in body.students
    ]
    project = Project(id=body.project_id, min_size=body.min_size, max_size=body.max_size)
    cons = Constraints(must_pair=list(body.must_pair), cannot_pair=list(body.cannot_pair))
    formation = _engine.form_teams(students, project, cons, seed=body.seed)

    if formation.status == "infeasible":
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, {"conflicts": formation.conflicts})
    return {
        "status": formation.status,
        "seed": formation.seed,
        "balance": formation.balance,
        "teams": [
            {"id": t.id, "members": t.member_ids, "scores": t.scores, "rationale": t.rationale}
            for t in formation.teams
        ],
        "unassignable": formation.unassignable,
    }
