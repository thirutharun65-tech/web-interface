import { useMemo } from "react";
import { storage } from "../../utils/storage";
import ProgressBar from "../../components/ProgressBar";

export default function Analytics() {
  const results = storage.getResults();
  const quizzes = storage.getQuizzes();

  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalAttempts: 0,
        avgScore: 0,
        passPct: 0,
        failPct: 0,
        highest: 0,
        lowest: 0,
      };
    }
    const scores = results.map((r) => r.percentage);
    const total = results.length;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const passCount = results.filter((r) => r.passed).length;
    const failCount = total - passCount;
    return {
      totalAttempts: total,
      avgScore: avg,
      passPct: Math.round((passCount / total) * 100),
      failPct: Math.round((failCount / total) * 100),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  }, [results]);

  // Per-quiz average score
  const quizPerformance = useMemo(() => {
    return quizzes
      .map((q) => {
        const qResults = results.filter((r) => r.quizId === q.id);
        const avg =
          qResults.length > 0
            ? Math.round(qResults.reduce((s, r) => s + r.percentage, 0) / qResults.length)
            : 0;
        return { title: q.title, attempts: qResults.length, avg };
      })
      .filter((q) => q.attempts > 0)
      .sort((a, b) => b.avg - a.avg);
  }, [quizzes, results]);

  // Grade distribution
  const gradeDist = useMemo(() => {
    const dist = { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, F: 0 };
    results.forEach((r) => {
      dist[r.grade] = (dist[r.grade] || 0) + 1;
    });
    return dist;
  }, [results]);

  const maxGradeCount = Math.max(1, ...Object.values(gradeDist));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-subtitle">Platform-wide performance insights</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card stat-primary">
          <div className="stat-body">
            <div className="stat-value">{stats.totalAttempts}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
        </div>
        <div className="stat-card stat-accent">
          <div className="stat-body">
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-body">
            <div className="stat-value">{stats.passPct}%</div>
            <div className="stat-label">Pass Percentage</div>
          </div>
        </div>
        <div className="stat-card stat-error">
          <div className="stat-body">
            <div className="stat-value">{stats.failPct}%</div>
            <div className="stat-label">Fail Percentage</div>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-body">
            <div className="stat-value">{stats.highest}%</div>
            <div className="stat-label">Highest Score</div>
          </div>
        </div>
        <div className="stat-card stat-primary">
          <div className="stat-body">
            <div className="stat-value">{stats.lowest}%</div>
            <div className="stat-label">Lowest Score</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <h2>Pass vs Fail</h2>
          {results.length === 0 ? (
            <div className="empty-state"><p>No data yet.</p></div>
          ) : (
            <div className="chart-block">
              <div className="pass-fail-bar">
                <div className="pass-fail-pass" style={{ width: `${stats.passPct}%` }}>
                  Pass {stats.passPct}%
                </div>
                <div className="pass-fail-fail" style={{ width: `${stats.failPct}%` }}>
                  Fail {stats.failPct}%
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Grade Distribution</h2>
          {results.length === 0 ? (
            <div className="empty-state"><p>No data yet.</p></div>
          ) : (
            <div className="bar-chart">
              {Object.entries(gradeDist).map(([grade, count]) => (
                <div key={grade} className="bar-chart-row">
                  <span className="bar-chart-label">{grade}</span>
                  <div className="bar-chart-track">
                    <div
                      className={`bar-chart-fill grade-${grade.replace("+", "plus").toLowerCase()}`}
                      style={{ width: `${(count / maxGradeCount) * 100}%` }}
                    />
                  </div>
                  <span className="bar-chart-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>Quiz Performance</h2>
        {quizPerformance.length === 0 ? (
          <div className="empty-state"><p>No quiz attempts recorded yet.</p></div>
        ) : (
          <div className="quiz-perf-list">
            {quizPerformance.map((q) => (
              <div key={q.title} className="quiz-perf-item">
                <div className="quiz-perf-info">
                  <span className="quiz-perf-title">{q.title}</span>
                  <span className="quiz-perf-meta">{q.attempts} attempts</span>
                </div>
                <ProgressBar value={q.avg} max={100} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
