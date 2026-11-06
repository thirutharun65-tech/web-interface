import { useMemo } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../utils/storage";

export default function StudentDashboard() {
  const user = storage.getCurrentUser();
  const quizzes = storage.getQuizzes();
  const results = storage.getResults().filter((r) => r.studentEmail === user.email);

  const available = quizzes.filter((q) => q.published);
  const completed = results.length;
  const avg =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
      : 0;
  const best =
    results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;

  const recent = results.slice(0, 5);

  const cards = useMemo(
    () => [
      { label: "Available Quizzes", value: available.length, icon: "\u{1F4DA}", tone: "primary" },
      { label: "Completed", value: completed, icon: "\u2705", tone: "success" },
      { label: "Average Score", value: `${avg}%`, icon: "\u{1F4CA}", tone: "accent" },
      { label: "Best Score", value: `${best}%`, icon: "\u{1F3C6}", tone: "warning" },
    ],
    [available.length, completed, avg, best]
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="page-subtitle">Here&apos;s your quiz overview</p>
        </div>
        <Link to="/student/quizzes" className="btn btn-primary">
          Browse Quizzes
        </Link>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.label} className={`stat-card stat-${c.tone}`}>
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-body">
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-header">
            <h2>Recent Results</h2>
            <Link to="/student/results" className="link">View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <p>No results yet. Take your first quiz to see results here.</p>
              <Link to="/student/quizzes" className="btn btn-primary btn-sm">Start a quiz</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td>{r.quizTitle}</td>
                    <td>{r.percentage}%</td>
                    <td><span className="grade-badge">{r.grade}</span></td>
                    <td>
                      <span className={`status-badge ${r.passed ? "pass" : "fail"}`}>
                        {r.passed ? "PASSED" : "FAILED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Available Quizzes</h2>
            <Link to="/student/quizzes" className="link">Browse</Link>
          </div>
          {available.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes are available right now.</p>
            </div>
          ) : (
            <div className="mini-quiz-list">
              {available.slice(0, 4).map((q) => (
                <Link to={`/student/quiz/${q.id}`} key={q.id} className="mini-quiz-item">
                  <div>
                    <div className="mini-quiz-title">{q.title}</div>
                    <div className="mini-quiz-meta">
                      {q.questions.length} Qs &middot; {q.durationMinutes} min &middot; {q.difficulty}
                    </div>
                  </div>
                  <span className="chevron">&rsaquo;</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
