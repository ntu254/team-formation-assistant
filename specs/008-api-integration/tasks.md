# Tasks — 008 API Integration

### Phase 1: Static vs Dynamic Decoupling [x]
- [x] Create `web/src/types/constants.ts` containing pure static catalogs (`SKILL_CATALOG`, `DAYS`, `SLOTS`, `SLOT_LABELS`)
- [x] Update UI components (`StudentSkills`, `StudentAvailability`, `FormationBoard`, `CohortWorkspace`) to import static constants from `constants.ts` instead of `data/mock.ts`
- [x] Verify `npm run typecheck` passes after decoupling static constants

### Phase 2: API Client & Auth Wiring [x]
- [x] Review `web/src/api.ts` to ensure full coverage of `routes_profile.py`, `routes_cohort.py`, and `routes_formation.py` endpoints
- [x] Add error/status helpers or loading hooks if needed across components
- [x] Ensure `useAuth().token` is passed cleanly into `api.ts` methods across all pages

### Phase 3: Student Flow Integration [ ]
- [ ] Wire `StudentDashboard` to fetch real profile status (`GET /v1/profiles/me`) and enrolled cohorts
- [ ] Wire `StudentProfile` to load/save basic info (`PUT /v1/profiles/me`)
- [ ] Wire `StudentSkills` to load/save skill list (`PUT /v1/profiles/me`)
- [ ] Wire `StudentAvailability` to load/save schedule (`PUT /v1/profiles/me`)
- [ ] Wire `StudentPreferences` to submit and fetch constraints (`POST /v1/cohorts/{id}/constraints`, `GET /v1/cohorts/{id}/constraints`)
- [ ] Wire `StudentReview` and `StudentTeam` to real data

### Phase 4: Lecturer Flow Integration [ ]
- [ ] Wire `LecturerCohorts` to list and create cohorts (`GET /v1/cohorts`, `POST /v1/cohorts`)
- [ ] Wire `CohortWorkspace` (Students tab) to list enrolled students (`GET /v1/cohorts/{id}/students`) and enroll (`POST /v1/cohorts/{id}/enroll`)
- [ ] Wire `CohortWorkspace` (Constraints tab) to list (`GET /v1/cohorts/{id}/constraints`) and approve/reject (`POST .../approve`, `POST .../reject`)
- [ ] Wire `FormationBoard` to trigger runs (`POST .../formations`), fetch results (`GET .../formations/{id}`), adjust (`POST .../override`), and commit (`POST .../commit`)

### Phase 5: Verification & Polish [ ]
- [ ] Run `npm run typecheck` (`tsc --noEmit`) — must pass with 0 errors
- [ ] Run `npm test` (`vitest`) — must pass 100%
- [ ] Run `npm run build` (`vite build`) — must generate clean production bundle
- [ ] Manual smoke test across Student and Lecturer roles
