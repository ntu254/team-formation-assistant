import { useState } from "react";

import { DEFAULT_ROLE_SUGGESTIONS } from "../types";
import type { Role, SkillIn } from "../types";
import { UsersIcon } from "./icons";

/** Student profile intake. Collects only skills/experience/role — never protected attributes. */
export default function ProfileForm() {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState(0);
  const [desiredRole, setDesiredRole] = useState<Role>("member");
  const [skills, setSkills] = useState<SkillIn[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(3);
  const [saved, setSaved] = useState(false);

  function addSkill() {
    if (!skillName.trim()) return;
    setSkills([...skills, { name: skillName.trim(), proficiency: skillLevel }]);
    setSkillName("");
    setSkillLevel(3);
    setSaved(false);
  }

  return (
    <section className="panel" aria-labelledby="profile-heading">
      <h2 id="profile-heading">
        <UsersIcon size={16} /> My Profile
      </h2>
      <p className="panel__hint">Your skills and availability feed the AI suggestions.</p>

      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="field field--row">
        <div className="field">
          <label htmlFor="experience">Experience (years)</label>
          <input
            id="experience"
            type="number"
            inputMode="numeric"
            min={0}
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="role">Desired role</label>
          <input
            id="role"
            list="role-suggestions"
            value={desiredRole}
            onChange={(e) => setDesiredRole(e.target.value)}
            placeholder="e.g. researcher…"
          />
          <datalist id="role-suggestions">
            {DEFAULT_ROLE_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
      </div>

      <fieldset>
        <legend>Skills</legend>
        <div className="field field--row">
          <div className="field">
            <label htmlFor="skill-name">Skill</label>
            <input id="skill-name" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="e.g. data analysis…" />
          </div>
          <div className="field">
            <label htmlFor="skill-level">Proficiency (1–5)</label>
            <input
              id="skill-level"
              type="number"
              inputMode="numeric"
              min={1}
              max={5}
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
            />
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={addSkill}>
          Add Skill
        </button>
        {skills.length > 0 && (
          <ul className="chips" aria-label="added skills">
            {skills.map((s, i) => (
              <li key={`${s.name}-${i}`}>
                {s.name} · {s.proficiency}
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <button type="button" className="btn btn--primary" onClick={() => setSaved(true)}>
        Save Profile
      </button>
      <p className="status" role="status" aria-live="polite">
        {saved ? "Profile saved (demo — backend endpoint pending)." : ""}
      </p>
    </section>
  );
}
