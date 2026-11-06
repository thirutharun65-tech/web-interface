import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { storage, uid } from "../utils/storage";
import { seedIfEmpty } from "../data/defaultData";
import { toast } from "../components/Toast";

// Registration page. Creates a new account in localStorage with a chosen role.
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
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

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (storage.findUser(email)) {
      setError("An account with this email already exists.");
      return;
    }

    setLoading(true);
    const user = {
      id: uid("user"),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    storage.addUser(user);
    storage.setCurrentUser({ ...user });
    toast.success("Account created!");
    setLoading(false);
    window.location.href = role === "admin" ? "/admin/dashboard" : "/student/dashboard";
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">Q</span>
          <h1>Create Account</h1>
          <p>Register an account to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label">
            Full Name
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Email
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </label>
          <label className="form-label">
            Confirm Password
            <input
              type="password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>
          <div className="form-label">
            Account Type
            <div className="role-select">
              <label className={`role-option ${role === "student" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                />
                <span className="role-icon">S</span>
                <span className="role-text">
                  <strong>Student</strong>
                  <small>Take quizzes and track progress</small>
                </span>
              </label>
              <label className={`role-option ${role === "admin" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                <span className="role-icon">A</span>
                <span className="role-text">
                  <strong>Admin</strong>
                  <small>Create quizzes and manage students</small>
                </span>
              </label>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
