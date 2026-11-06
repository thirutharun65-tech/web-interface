import { Link, useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";

// Top navigation bar. Shows the app name, current user, theme toggle, and logout.
export default function Navbar({ theme, onToggleTheme }) {
  const user = storage.getCurrentUser();
  const navigate = useNavigate();

  function logout() {
    storage.clearCurrentUser();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}>
          <span className="navbar-logo">Q</span>
          <span className="navbar-title">QuizPortal</span>
        </Link>
      </div>

      <div className="navbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>
        {user && (
          <div className="navbar-user">
            <span className="navbar-user-name">{user.name}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
        )}
        {user && (
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
