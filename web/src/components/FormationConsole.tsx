import { useState, useEffect } from "react";
import { runFormation, overrideFormation, commitFormation, getConstraints, approveConstraint, rejectConstraint } from "../api";
import type { Formation, StudentIn, Team, Constraint } from "../types";
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
export default function FormationConsole({ cohortId, userId, onBack }: { cohortId: string, userId: string, onBack: () => void }) {
  const [count, setCount] = useState(9);
  const [minSize, setMinSize] = useState(3);
  const [maxSize, setMaxSize] = useState(5);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);

  useEffect(() => {
    getConstraints(cohortId, { userId, role: "lecturer" })
      .then(setConstraints)
      .catch(() => setConstraints([]));
  }, [cohortId, userId]);

  async function onApproveConstraint(c: Constraint) {
    await approveConstraint(c.cohort_id, c.id, { userId, role: "lecturer" });
    setConstraints(constraints.map(x => x.id === c.id ? { ...x, status: "approved" } : x));
  }

  async function onRejectConstraint(c: Constraint) {
    await rejectConstraint(c.cohort_id, c.id, { userId, role: "lecturer" });
    setConstraints(constraints.map(x => x.id === c.id ? { ...x, status: "rejected" } : x));
  }

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

  const handleDragStart = (e: React.DragEvent, studentId: string, sourceTeamId: string) => {
    e.dataTransfer.setData("studentId", studentId);
    e.dataTransfer.setData("sourceTeamId", sourceTeamId);
  };

  const handleDrop = (e: React.DragEvent, targetTeamId: string) => {
    e.preventDefault();
    if (!formation) return;
    
    const studentId = e.dataTransfer.getData("studentId");
    const sourceTeamId = e.dataTransfer.getData("sourceTeamId");
    
    if (!studentId || !sourceTeamId || sourceTeamId === targetTeamId) return;

    // Move student from source to target
    const newTeams = formation.teams.map((t) => {
      if (t.id === sourceTeamId) {
        return { ...t, members: t.members.filter((m) => m !== studentId) };
      }
      if (t.id === targetTeamId) {
        return { ...t, members: [...t.members, studentId] };
      }
      return t;
    });

    setFormation({ ...formation, teams: newTeams });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  async function onSaveOverrides() {
    if (!formation) return;
    setSaving(true);
    try {
      const teamsForApi = formation.teams.map(t => ({
        id: t.id,
        member_ids: t.members,
        rationale: t.rationale
      }));
      await overrideFormation(formation.id, teamsForApi, { userId, role: "lecturer" });
      alert("Overrides saved successfully!");
    } catch (err) {
      alert(`Error saving overrides: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  async function onCommit() {
    if (!formation) return;
    setCommitting(true);
    try {
      await commitFormation(formation.id, { userId, role: "lecturer" });
      setCommitted(true);
      alert("Teams committed successfully!");
    } catch (err) {
      alert(`Error committing teams: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setCommitting(false);
    }
  }


  return (
    <section className="panel" aria-labelledby="console-heading">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 id="console-heading">
          <PlayIcon size={15} /> Formation Console
        </h2>
        <button type="button" className="btn btn--ghost" onClick={onBack}>&larr; Back to Dashboard</button>
      </div>
      <p className="panel__hint">Run a formation for cohort <strong>{cohortId}</strong>, then review the teams.</p>



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
          <div style={{ marginBottom: "1rem" }}>
            <em>Hint: You can drag and drop members between teams to override the formation.</em>
          </div>
          <ul className="teams" aria-label="suggested teams">
            {formation.teams.map((t) => (
              <li 
                className="team-card" 
                key={t.id}
                onDrop={(e) => handleDrop(e, t.id)}
                onDragOver={handleDragOver}
                style={{ border: "1px dashed transparent", transition: "border 0.2s" }}
              >
                <div className="team-card__title">
                  {t.id}
                  <span className="team-card__count">{t.members.length} members</span>
                </div>
                <div className="team-card__members" style={{ minHeight: "2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {t.members.map(m => (
                    <span 
                      key={m} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, m, t.id)}
                      style={{ cursor: "grab", padding: "2px 8px", background: "rgba(0,0,0,0.1)", borderRadius: "12px", fontSize: "0.85rem" }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <p className="team-card__rationale">{t.rationale}</p>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "1rem", marginTop: 12 }}>
            <button type="button" className="btn btn--ghost" onClick={onSaveOverrides} disabled={saving || committing}>
              {saving ? "Saving..." : "Save Overrides"}
            </button>
            <button type="button" className="btn btn--primary" onClick={onCommit} disabled={committing || saving || committed}>
              <CheckIcon /> {committed ? "Committed" : (committing ? "Committing..." : "Commit Teams")}
            </button>
          </div>
        </div>
      )}

      {constraints.length > 0 && (
        <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "1rem" }}>
          <h3>Pending Constraints</h3>
          <ul className="teams" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {constraints.filter(c => c.status === "pending").map(c => (
              <li key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", background: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.1)" }}>
                <div>
                  <strong>{c.type === "must_pair" ? "Must Pair" : "Cannot Pair"}:</strong> {c.student_a} and {c.student_b}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="btn btn--primary" style={{ padding: "4px 8px", fontSize: "0.85rem" }} onClick={() => onApproveConstraint(c)}>Approve</button>
                  <button type="button" className="btn btn--ghost" style={{ padding: "4px 8px", fontSize: "0.85rem" }} onClick={() => onRejectConstraint(c)}>Reject</button>
                </div>
              </li>
            ))}
            {constraints.filter(c => c.status === "pending").length === 0 && (
              <p>No pending constraints.</p>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
