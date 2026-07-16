import FormationConsole from "./components/FormationConsole";
import { UsersIcon } from "./components/icons";
import ProfileForm from "./components/ProfileForm";

/** App shell: student profile intake + lecturer formation console.
 *  Authorization is enforced server-side (app/api); the UI never gates security by itself.
 *  Targets WCAG 2.1 AA (NFR-08): semantic landmarks, labelled inputs, visible focus. */
export default function App() {
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
        </div>
      </header>
      <main className="container">
        <ProfileForm />
        <FormationConsole />
      </main>
    </>
  );
}
