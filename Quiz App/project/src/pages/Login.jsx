import { useState } from "react";
import { Navigate } from "react-router-dom";
import { storage, uid } from "../utils/storage";
import { seedIfEmpty } from "../data/defaultData";
import { toast } from "../components/Toast";

// Login page. Checks credentials against localStorage users.
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  seedIfEmpty();

  const currentUser = storage.getCurrentUser();
  if (currentUser) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
        replace
      />
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const user = storage.findUser(email);
    if (!user || user.password !== password) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    storage.setCurrentUser({ ...user });
    toast.success(`Welcome back, ${user.name}!`);
    setLoading(false);
    // Force a full navigation so the protected route picks up the new session.
    window.location.href =
      user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">Q</span>
          <h1>QuizPortal</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label">
            Email
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="form-label">
            Password
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </label>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="auth-demo">
          <p className="auth-demo-title">Demo accounts</p>
          <div className="auth-demo-grid">
            <div>
              <strong>Admin</strong>
              <span>admin@quiz.com</span>
              <span>admin123</span>
            </div>
            <div>
              <strong>Student</strong>
              <span>student@quiz.com</span>
              <span>student123</span>
            </div>
          </div>
          <p className="auth-demo-note">
            Click an account to autofill credentials.
          </p>
          <div className="auth-demo-buttons">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEmail("admin@quiz.com");
                setPassword("admin123");
              }}
            >
              Use Admin
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEmail("student@quiz.com");
                setPassword("student123");
              }}
            >
              Use Student
            </button>
          </div>
        </div>
        <p className="auth-switch">
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
