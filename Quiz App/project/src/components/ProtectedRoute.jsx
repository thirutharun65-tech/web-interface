import { Navigate, useLocation } from "react-router-dom";
import { storage } from "../utils/storage";

// Wraps protected routes. `role` restricts to "student" or "admin".
export default function ProtectedRoute({ role, children }) {
  const user = storage.getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
        replace
      />
    );
  }
  return children;
}
