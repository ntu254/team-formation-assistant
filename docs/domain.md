# Domain — Team Formation Assistant

## Glossary

| Term | Meaning |
|------|---------|
| Student | A person to be placed into a team; owns a profile. |
| Skill | A named competency with a proficiency level (e.g. beginner..expert). |
| Major | The student's field of study / program. |
| Experience | Prior relevant experience (projects, internships), weighted into balance. |
| Availability | The time slots a student is free (used for schedule overlap). |
| Preference | Soft wish: teammates to be with, topics, or role. May be traded off. |
| Desired role | The project role a student wants (e.g. lead, backend, frontend, design, research). |
| Constraint | A rule on formation. **Hard** (must hold) or **soft** (maximize if possible). |
| Cohort | A group of students formed together for a course/term. |
| Project | A unit of work needing a team; declares size band and required skills/roles. |
| Team | A set of students assigned to one project, with a balance score and rationale. |
| Formation | One versioned run: the full set of teams for a cohort/project + scores + rationale. |
| Balance score | How well competency, experience, roles, and schedule are distributed. |

## Core entities and invariants

- **Student** — has skills, major, experience, availability, preferences, desired roles.
  Belongs to at most one team per project.
- **Constraint**
  - *Hard*: team size within the project's size band; must-pair (two students together);
    cannot-pair (two students apart); required-skill coverage per team.
  - *Soft*: preferred teammates, role match, schedule overlap, competency balance.
- **Team** — size within the band; satisfies every hard constraint; carries a rationale.
- **Formation** — every eligible student is assigned to exactly one team, or explicitly
  flagged as unassignable with a reason. Immutable once committed; a new run is a new version.

## Business rules (testable)

- **R1** Team size stays within the project's `[min, max]` band. (hard)
- **R2** No suggestion violates a must-pair or cannot-pair constraint. (hard)
- **R3** Each team covers the project's required skills/roles when the cohort makes it feasible;
  otherwise the gap is reported, not hidden. (hard-report)
- **R4** Competency and experience are spread across teams (no team is all-expert or all-novice)
  as far as hard constraints allow. (soft, maximized)
- **R5** Team members share at least the project's minimum common availability. (soft, maximized)
- **R6** Soft preferences are maximized but may be traded off; every trade-off is explained. (soft)
- **R7** Every student is assigned exactly once, or flagged unassignable with a reason. (hard)
- **R8** A run is reproducible: same inputs + same seed produce the same formation. (hard)

## Out of scope (v1)

- Cross-cohort formation, live re-balancing after teams start, and peer-review scoring.
