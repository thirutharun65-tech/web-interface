import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { storage } from "../../utils/storage";

export default function ResultHistory() {
  const user = storage.getCurrentUser();
  const allResults = storage
    .getResults()
    .filter((r) => r.studentEmail === user.email);

  const [sort, setSort] = useState("date-desc");

  const results = useMemo(() => {
    const sorted = [...allResults];
    sorted.sort((a, b) => {
      switch (sort) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "score-desc":
          return b.percentage - a.percentage;
        case "score-asc":
          return a.percentage - b.percentage;
        default:
          return 0;
      }
    });
    return sorted;
  }, [allResults, sort]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Results</h1>
          <p className="page-subtitle">Your quiz attempt history</p>
        </div>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="score-desc">Highest Score</option>
          <option value="score-asc">Lowest Score</option>
        </select>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>You haven&apos;t taken any quizzes yet.</p>
          <Link to="/student/quizzes" className="btn btn-primary">Browse Quizzes</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Date</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.quizTitle}</td>
                  <td>{new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>{r.obtainedMarks}/{r.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td><span className="grade-badge">{r.grade}</span></td>
                  <td>
                    <span className={`status-badge ${r.passed ? "pass" : "fail"}`}>
                      {r.passed ? "PASSED" : "FAILED"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/student/result/${r.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
