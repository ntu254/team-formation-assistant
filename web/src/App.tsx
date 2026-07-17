import { useState } from "react";
import Dashboard from "./components/Dashboard";
import FormationConsole from "./components/FormationConsole";
import { UsersIcon } from "./components/icons";
import ProfileForm from "./components/ProfileForm";
import Login from "./components/Login";
import { useAuth } from "./lib/auth";

export default function App() {
  const { user, role, loading, logout } = useAuth();
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  
  if (!user || !role) {
    return (
      <main className="container">
        <Login />
      </main>
    );
  }

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
          <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>Logged in as <b>{user.uid || "user"}</b> ({role})</span>
            <button className="btn btn--ghost" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="container">
        {role === "student" && <ProfileForm />}
        {role === "lecturer" && !selectedCohort && (
          <Dashboard onSelectCohort={setSelectedCohort} />
        )}
        {role === "lecturer" && selectedCohort && (
          <FormationConsole cohortId={selectedCohort} onBack={() => setSelectedCohort(null)} />
        )}
      </main>
    </>
  );
}
