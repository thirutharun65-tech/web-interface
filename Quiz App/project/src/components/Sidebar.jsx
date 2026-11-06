import { NavLink } from "react-router-dom";

// Sidebar with role-based navigation.
export default function Sidebar({ role }) {
  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: "\u{1F3E0}" },
    { to: "/student/quizzes", label: "Quizzes", icon: "\u{1F4DA}" },
    { to: "/student/results", label: "My Results", icon: "\u{1F4CA}" },
    { to: "/student/profile", label: "Profile", icon: "\u{1F464}" },
    { to: "/student/settings", label: "Settings", icon: "\u2699\uFE0F" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "\u{1F3E0}" },
    { to: "/admin/quizzes", label: "Quizzes", icon: "\u{1F4DA}" },
    { to: "/admin/students", label: "Students", icon: "\u{1F465}" },
    { to: "/admin/results", label: "Results", icon: "\u{1F4CA}" },
    { to: "/admin/analytics", label: "Analytics", icon: "\u{1F4C8}" },
    { to: "/admin/settings", label: "Settings", icon: "\u2699\uFE0F" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <span className="sidebar-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
