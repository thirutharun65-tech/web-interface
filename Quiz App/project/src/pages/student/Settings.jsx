import { storage } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/Toast";

export default function Settings() {
  const navigate = useNavigate();
  const user = storage.getCurrentUser();

  function logout() {
    storage.clearCurrentUser();
    toast.info("Signed out");
    navigate("/login", { replace: true });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <section className="panel">
        <h2>Account</h2>
        <p>Signed in as <strong>{user.email}</strong> ({user.role}).</p>
        <button className="btn btn-danger" onClick={logout}>Sign Out</button>
      </section>
    </div>
  );
}
