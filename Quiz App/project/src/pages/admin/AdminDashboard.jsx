import { useMemo } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../utils/storage";

export default function AdminDashboard() {
  const users = storage.getUsers();
  const quizzes = storage.getQuizzes();
  const results = storage.getResults();

  const students = users.filter((u) => u.role === "student");
  const totalQuestions = quizzes.reduce((s, q) => s + q.questions.length, 0);
  const avg =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
      : 0;
  const passCount = results.filter((r) => r.passed).length;
  const passRate =
    results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;

  const cards = useMemo(
    () => [
      { label: "Total Students", value: students.length, icon: "\u{1F465}", tone: "primary" },
      { label: "Total Quizzes", value: quizzes.length, icon: "\u{1F4DA}", tone: "accent" },
      { label: "Total Questions", value: totalQuestions, icon: "\u2753", tone: "warning" },
      { label: "Total Attempts", value: results.length, icon: "\u{1F4DD}", tone: "success" },
      { label: "Average Score", value: `${avg}%`, icon: "\u{1F4CA}", tone: "primary" },
      { label: "Pass Rate", value: `${passRate}%`, icon: "\u2705", tone: "accent" },
    ],
    [students.length, quizzes.length, totalQuestions, results.length, avg, passRate]
  );

  const recentResults = results.slice(0, 6);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Overview of your quiz platform</p>
        </div>
        <Link to="/admin/quizzes/create" className="btn btn-primary">Create Quiz</Link>
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
            <h2>Recent Attempts</h2>
            <Link to="/admin/results" className="link">View all</Link>
          </div>
          {recentResults.length === 0 ? (
            <div className="empty-state"><p>No attempts yet.</p></div>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Student</th><th>Quiz</th><th>Score</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentResults.map((r) => (
                  <tr key={r.id}>
                    <td>{r.studentName}</td>
                    <td>{r.quizTitle}</td>
                    <td>{r.percentage}%</td>
                    <td>
                      <span className={`status-badge ${r.passed ? "pass" : "fail"}`}>
                        {r.passed ? "PASS" : "FAIL"}
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
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/admin/quizzes" className="quick-action">
              <span className="qa-icon">{"\uD83D\uDCDA"}</span>
              <span>Manage Quizzes</span>
            </Link>
            <Link to="/admin/quizzes/create" className="quick-action">
              <span className="qa-icon">+</span>
              <span>Create Quiz</span>
            </Link>
            <Link to="/admin/students" className="quick-action">
              <span className="qa-icon">{"\uD83D\uDC65"}</span>
              <span>View Students</span>
            </Link>
            <Link to="/admin/analytics" className="quick-action">
              <span className="qa-icon">{"\uD83D\uDCC8"}</span>
              <span>Analytics</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
