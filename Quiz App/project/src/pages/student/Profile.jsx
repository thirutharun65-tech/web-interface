import { useState } from "react";
import { storage } from "../../utils/storage";
import { toast } from "../../components/Toast";

export default function Profile() {
  const user = storage.getCurrentUser();
  const results = storage.getResults().filter((r) => r.studentEmail === user.email);
  const [name, setName] = useState(user.name);

  function save(e) {
    e.preventDefault();
    storage.updateUser(user.email, { name });
    storage.setCurrentUser({ ...user, name });
    toast.success("Profile updated");
    window.location.reload();
  }

  const avg =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
      : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
      </div>
      <div className="two-col">
        <section className="panel">
          <h2>Account Details</h2>
          <form onSubmit={save} className="form">
            <label className="form-label">
              Full Name
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="form-label">
              Email
              <input className="input" value={user.email} disabled />
            </label>
            <label className="form-label">
              Role
              <input className="input" value={user.role} disabled />
            </label>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </section>
        <section className="panel">
          <h2>Quick Stats</h2>
          <div className="stat-grid">
            <div className="stat-card stat-primary">
              <div className="stat-body">
                <div className="stat-value">{results.length}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
            </div>
            <div className="stat-card stat-accent">
              <div className="stat-body">
                <div className="stat-value">{avg}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
