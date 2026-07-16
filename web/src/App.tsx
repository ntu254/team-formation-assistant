// Minimal placeholder for the lecturer console (scaffold). Requires `npm ci` to build/run.
// Next iteration: profile intake (student) + run/review/override formation (lecturer),
// calling POST /v1/cohorts/{id}/formations. UI must meet WCAG 2.1 AA (NFR-08).
import { useState } from "react";

type Team = { id: string; members: string[]; rationale: string };

export default function App() {
  const [teams, setTeams] = useState<Team[]>([]);

  async function runFormation() {
    // TODO(next iteration): collect cohort input and post to the API.
    // const res = await fetch(`/v1/cohorts/${cohortId}/formations`, { method: "POST", ... });
    setTeams([]);
  }

  return (
    <main>
      <h1>Team Formation Assistant</h1>
      <p>Lecturer console — placeholder. Run a formation, review teams and rationale, override, commit.</p>
      <button onClick={runFormation}>Run formation</button>
      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            <strong>{t.id}</strong>: {t.members.join(", ")} — {t.rationale}
          </li>
        ))}
      </ul>
    </main>
  );
}
