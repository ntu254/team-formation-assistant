"""Real matching engine using OR-Tools CP-SAT (free, OSS, runs locally — no PII leaves).

Same MatchingEngine interface as the mock, so it drops in without route/test changes.
Hard constraints are model constraints (guaranteed by the solver or reported infeasible):
  - exactly-once assignment (R7)
  - team size band (R1)
  - must-pair / cannot-pair (R2)

Objective: minimize the spread (max - min) of per-team total competency. This is a linear,
solver-friendly proxy for assumption A-01 (variance of per-team mean competency); the reported
`balance` still uses the A-01 variance formula for a consistent output score.

Determinism (R8): single worker + fixed random_seed, and the output teams are canonicalized
(sorted by members) so the result is identical for the same inputs + seed.
"""
from __future__ import annotations

import math

from ortools.sat.python import cp_model

from ..domain.models import Constraints, Formation, Project, Student, Team
from . import balance as balance_mod


class OrToolsMatchingEngine:
    def __init__(self, max_time_s: float = 5.0) -> None:
        self.max_time_s = max_time_s

    def form_teams(
        self,
        students: list[Student],
        project: Project,
        constraints: Constraints,
        seed: int = 0,
    ) -> Formation:
        by_id = {s.id: s for s in students}
        ids = [s.id for s in students]
        n = len(ids)
        if n == 0:
            return Formation(status="ok", seed=seed, balance=1.0)

        idx = {sid: i for i, sid in enumerate(ids)}

        k_min = math.ceil(n / project.max_size)
        k_max = n // project.min_size
        if k_min > k_max:
            return Formation(
                status="infeasible", seed=seed,
                conflicts=[f"cohort size {n} cannot be partitioned into teams of "
                           f"[{project.min_size}, {project.max_size}]"],
            )
        k = k_min
        comp = [round(by_id[sid].competency() * 100) for sid in ids]  # integer-scaled
        total = sum(comp)

        model = cp_model.CpModel()
        x = {(i, t): model.new_bool_var(f"x_{i}_{t}") for i in range(n) for t in range(k)}

        for i in range(n):  # R7 exactly-once
            model.add(sum(x[i, t] for t in range(k)) == 1)
        for t in range(k):  # R1 size band
            size = sum(x[i, t] for i in range(n))
            model.add(size >= project.min_size)
            model.add(size <= project.max_size)
        for a, b in constraints.must_pair:  # R2 must-pair
            if a in idx and b in idx:
                for t in range(k):
                    model.add(x[idx[a], t] == x[idx[b], t])
        for a, b in constraints.cannot_pair:  # R2 cannot-pair
            if a in idx and b in idx:
                for t in range(k):
                    model.add(x[idx[a], t] + x[idx[b], t] <= 1)

        # Objective: minimize competency spread across teams (A-01 proxy).
        team_comp = []
        for t in range(k):
            tc = model.new_int_var(0, total, f"tc_{t}")
            model.add(tc == sum(comp[i] * x[i, t] for i in range(n)))
            team_comp.append(tc)
        hi = model.new_int_var(0, total, "hi")
        lo = model.new_int_var(0, total, "lo")
        for t in range(k):
            model.add(hi >= team_comp[t])
            model.add(lo <= team_comp[t])
        model.minimize(hi - lo)

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = self.max_time_s
        solver.parameters.random_seed = int(seed)
        solver.parameters.num_workers = 1  # determinism
        status = solver.solve(model)

        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            return Formation(
                status="infeasible", seed=seed,
                conflicts=["no valid formation satisfies the hard constraints"],
            )

        members_by_team = [[] for _ in range(k)]
        for i in range(n):
            for t in range(k):
                if solver.value(x[i, t]) == 1:
                    members_by_team[t].append(ids[i])
                    break

        # Canonicalize: sort members, then sort teams by members, then relabel (R8-stable).
        canonical = sorted((sorted(m) for m in members_by_team))
        result_teams: list[Team] = []
        for t, members in enumerate(canonical):
            mean_comp = sum(by_id[m].competency() for m in members) / len(members) if members else 0.0
            result_teams.append(
                Team(
                    id=f"team-{t + 1}",
                    member_ids=members,
                    scores={"mean_competency": round(mean_comp, 4)},
                    rationale=(
                        f"Optimized to minimize competency spread (CP-SAT); "
                        f"{len(members)} members within [{project.min_size},{project.max_size}]; "
                        f"hard constraints honored."
                    ),
                )
            )

        return Formation(
            status="ok", seed=seed, teams=result_teams,
            balance=balance_mod.balance_score(result_teams, by_id),
        )
