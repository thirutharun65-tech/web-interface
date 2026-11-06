import { useState, useMemo } from "react";
import { storage } from "../../utils/storage";

export default function ManageStudents() {
  const users = storage.getUsers();
  const results = storage.getResults();
  const [search, setSearch] = useState("");

  const students = useMemo(() => {
    return users
      .filter((u) => u.role === "student")
      .map((u) => {
        const studentResults = results.filter((r) => r.studentEmail === u.email);
        const avg =
          studentResults.length > 0
            ? Math.round(studentResults.reduce((s, r) => s + r.percentage, 0) / studentResults.length)
            : 0;
        return {
          ...u,
          attempts: studentResults.length,
          avg,
          status: studentResults.length > 0 ? "Active" : "New",
        };
      })
      .filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [users, results, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p className="page-subtitle">All registered student accounts</p>
        </div>
        <input
          className="input"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students found.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Quizzes Attempted</th>
                <th>Average Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.attempts}</td>
                  <td>{s.avg}%</td>
                  <td>
                    <span className={`status-badge ${s.status === "Active" ? "pass" : "neutral"}`}>
                      {s.status}
                    </span>
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
