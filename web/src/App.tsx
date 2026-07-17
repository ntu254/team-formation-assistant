import { useState } from "react";
import Dashboard from "./components/Dashboard";
import FormationConsole from "./components/FormationConsole";
import { UsersIcon } from "./components/icons";
import ProfileForm from "./components/ProfileForm";

/** App shell: student profile intake + lecturer formation console.
 *  Authorization is enforced server-side (app/api); the UI never gates security by itself.
 *  Targets WCAG 2.1 AA (NFR-08): semantic landmarks, labelled inputs, visible focus. */
export default function App() {
  const [view, setView] = useState<"student" | "lecturer">("lecturer");
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const userId = "lec1"; // Hardcoded for demo until auth is added

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <span className="app-header__mark">
            <UsersIcon />
          </span>
          <div>
            <h1>Team Formation Assistant</h1>
            <p>AI suggests balanced teams — a lecturer reviews, overrides, and commits.</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "1rem" }}>
            <button className={`btn ${view === "student" ? "btn--primary" : "btn--ghost"}`} onClick={() => setView("student")}>Student View</button>
            <button className={`btn ${view === "lecturer" ? "btn--primary" : "btn--ghost"}`} onClick={() => setView("lecturer")}>Lecturer View</button>
          </div>
        </div>
      </header>
      <main className="container">
        {view === "student" && <ProfileForm />}
        {view === "lecturer" && !selectedCohort && (
          <Dashboard userId={userId} onSelectCohort={setSelectedCohort} />
        )}
        {view === "lecturer" && selectedCohort && (
          <FormationConsole cohortId={selectedCohort} userId={userId} onBack={() => setSelectedCohort(null)} />
        )}
      </main>
    </>
  );
}
