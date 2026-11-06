export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === "dark";
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">
          Convert<span>X</span>
        </span>
        <span className="brand-subtitle">Fast, Accurate &amp; Simple Unit Conversion</span>
      </div>
      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
          {isDark ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}
