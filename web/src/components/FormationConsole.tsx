import { useState } from "react";

import { runFormation } from "../api";
import type { Formation, StudentIn } from "../types";
import { CheckIcon, PlayIcon } from "./icons";

/** Build a quick demo roster (u0..u{n-1}); a real console loads students from the cohort. */
function demoRoster(n: number): StudentIn[] {
  const roles = ["leader", "coordinator", "researcher", "presenter", "member", "other"];
  return Array.from({ length: n }, (_, i) => ({
    id: `u${i}`,
    name: `Student ${i}`,
    skills: [{ name: "core", proficiency: (i % 5) + 1 }],
    experience_years: i % 3,
    desired_role: roles[i % roles.length],
  }));
}

/** Lecturer console: run a formation and review suggested teams + rationale. */
export default function FormationConsole() {
  const [cohortId, setCohortId] = useState("c1");
  const [userId, setUserId] = useState("lec1");
  const [count, setCount] = useState(9);
  const [minSize, setMinSize] = useState(3);
  const [maxSize, setMaxSize] = useState(5);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onRun() {
    setLoading(true);
    setError(null);
    setFormation(null);
    try {
      const result = await runFormation(
        cohortId,
        {
          project_id: "p1",
          min_size: minSize,
          max_size: maxSize,
          students: demoRoster(count),
          must_pair: [],
          cannot_pair: [],
          seed: 1,
        },
        { userId, role: "lecturer" },
      );
      setFormation(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="console-heading">
      <h2 id="console-heading">
        <PlayIcon size={15} /> Formation Console
      </h2>
      <p className="panel__hint">Run a formation for a cohort you own, then review the teams.</p>

      <div className="field field--row">
        <div className="field">
          <label htmlFor="cohort">Cohort id</label>
          <input id="cohort" value={cohortId} onChange={(e) => setCohortId(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="user">Acting lecturer id</label>
          <input id="user" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
      </div>

      <div className="field field--row">
        <div className="field">
          <label htmlFor="count">Students (demo roster)</label>
          <input id="count" type="number" inputMode="numeric" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="min">Min team size</label>
          <input id="min" type="number" inputMode="numeric" min={1} value={minSize} onChange={(e) => setMinSize(Number(e.target.value))} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="max">Max team size</label>
        <input id="max" type="number" inputMode="numeric" min={1} value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} />
      </div>

      <button type="button" className="btn btn--primary" onClick={onRun} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" /> Running…
          </>
        ) : (
          <>
            <PlayIcon /> Run Formation
          </>
        )}
      </button>

      {error && (
        <p className="alert" role="alert">
          {error}
          <br />
          Check the cohort id and that you own it, then try again.
        </p>
      )}

      {!formation && !error && !loading && (
        <p className="empty">No formation yet. Set the parameters and run to see suggested teams.</p>
      )}

      {formation && (
        <div>
          <div className="result-head">
            <span className="badge">{formation.status}</span>
            <span>
              Balance <span className="stat">{formation.balance}</span>
            </span>
          </div>
          <ul className="teams" aria-label="suggested teams">
            {formation.teams.map((t) => (
              <li className="team-card" key={t.id}>
                <div className="team-card__title">
                  {t.id}
                  <span className="team-card__count">{t.members.length} members</span>
                </div>
                <div className="team-card__members">{t.members.join(", ")}</div>
                <p className="team-card__rationale">{t.rationale}</p>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--ghost" style={{ marginTop: 12 }}>
            <CheckIcon /> Commit Teams
          </button>
        </div>
      )}
    </section>
  );
}
