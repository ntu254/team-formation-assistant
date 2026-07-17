"""Domain models for Team Formation Assistant.

Pure stdlib (dataclasses) — no FastAPI / ORM / OR-Tools imports here, so the domain and the
matching engine run and are tested without external dependencies (see docs/architecture.md).

Privacy (constitution BR-08/BR-09, A-05): the model carries NO protected attributes
(gender, ethnicity, religion, health, age). Competency derives only from skills + experience.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime

# Desired role is domain-neutral and configured per course/project — NOT software-specific.
# This is only a generic default vocabulary (assumption A-04, needs confirmation); a course can
# supply its own (e.g. lab roles for a science capstone, business roles for a marketing project).
# The field itself is a free-form string; this tuple is just a suggestion list.
DEFAULT_ROLES = ("leader", "coordinator", "researcher", "presenter", "member", "other")


@dataclass(frozen=True)
class Skill:
    name: str
    proficiency: int  # 1..5 (A-04)

    def __post_init__(self) -> None:
        if not 1 <= self.proficiency <= 5:
            raise ValueError(f"proficiency must be 1..5, got {self.proficiency}")


@dataclass
class Student:
    id: str
    name: str = ""
    major: str = ""
    experience_years: float = 0.0
    skills: list[Skill] = field(default_factory=list)
    availability: frozenset[str] = frozenset()      # weekly slot ids, e.g. {"mon-am", "wed-pm"}
    preferred_teammates: frozenset[str] = frozenset()  # soft preference (student ids)
    desired_role: str = "other"

    def competency(self) -> float:
        """Deterministic competency signal (A-04): mean skill proficiency + capped experience.

        Uses only skills and experience — never a protected attribute.
        """
        base = (sum(s.proficiency for s in self.skills) / len(self.skills)) if self.skills else 0.0
        experience_bonus = min(self.experience_years, 3.0) * 0.5  # capped
        return round(base + experience_bonus, 6)


@dataclass
class Project:
    id: str
    min_size: int = 3   # A-02
    max_size: int = 5   # A-02
    required_roles: tuple[str, ...] = ()
    required_skills: tuple[str, ...] = ()

    def __post_init__(self) -> None:
        if self.min_size < 1 or self.max_size < self.min_size:
            raise ValueError("require 1 <= min_size <= max_size")


@dataclass
class Constraints:
    must_pair: list[tuple[str, str]] = field(default_factory=list)   # hard (R2)
    cannot_pair: list[tuple[str, str]] = field(default_factory=list)  # hard (R2)


@dataclass
class Team:
    id: str
    member_ids: list[str]
    rationale: str = ""
    scores: dict[str, float] = field(default_factory=dict)


@dataclass
class Formation:
    """Result of one run. status is 'ok' or 'infeasible'."""
    status: str
    seed: int
    teams: list[Team] = field(default_factory=list)
    unassignable: list[tuple[str, str]] = field(default_factory=list)  # (student_id, reason)
    conflicts: list[str] = field(default_factory=list)  # why infeasible
    balance: float = 0.0


@dataclass
class Cohort:
    """A group of students owned by one lecturer (object-level authz anchor, BR-13)."""
    id: str
    owner_id: str  # the lecturer (user id) who owns this cohort
    name: str = ""


@dataclass
class FormationRun:
    id: str
    cohort_id: str
    project_id: str
    min_size: int
    max_size: int
    seed: int
    status: str
    balance: float
    created_at: datetime
    teams: list[Team] = field(default_factory=list)


@dataclass
class Constraint:
    id: str
    cohort_id: str
    type: str  # 'must_pair', 'cannot_pair'
    student_a: str
    student_b: str
    status: str  # 'pending', 'approved', 'rejected'


@dataclass
class CommittedResult:
    id: str
    cohort_id: str
    formation_id: str
    version: int
    status: str
    committed_by: str
    committed_at: datetime


@dataclass
class AuditEvent:
    id: int
    cohort_id: str
    user_id: str
    action: str
    payload: str
    timestamp: datetime
