import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user"); // only store user info, not token
  if (!user) return <Navigate to="/" replace />;
  return children;
}
