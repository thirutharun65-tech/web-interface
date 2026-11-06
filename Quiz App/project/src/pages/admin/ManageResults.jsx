import { useState, useMemo } from "react";
import { storage } from "../../utils/storage";

export default function ManageResults() {
  const allResults = storage.getResults();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date-desc");

  const results = useMemo(() => {
    let filtered = allResults.filter((r) => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.quizTitle.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pass" && r.passed) ||
        (statusFilter === "fail" && !r.passed);
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sort) {
        case "date-desc": return new Date(b.date) - new Date(a.date);
        case "date-asc": return new Date(a.date) - new Date(b.date);
        case "score-desc": return b.percentage - a.percentage;
        case "score-asc": return a.percentage - b.percentage;
        default: return 0;
      }
    });
    return filtered;
  }, [allResults, search, statusFilter, sort]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>All Results</h1>
          <p className="page-subtitle">Every quiz attempt across all students</p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          className="input"
          placeholder="Search by student or quiz..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pass">Passed</option>
          <option value="fail">Failed</option>
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="score-desc">Highest Score</option>
          <option value="score-asc">Lowest Score</option>
        </select>
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>No results match your filters.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.studentName}</td>
                  <td>{r.quizTitle}</td>
                  <td>{r.obtainedMarks}/{r.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td><span className="grade-badge">{r.grade}</span></td>
                  <td>
                    <span className={`status-badge ${r.passed ? "pass" : "fail"}`}>
                      {r.passed ? "PASSED" : "FAILED"}
                    </span>
                  </td>
                  <td>{new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
