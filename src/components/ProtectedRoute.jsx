import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  console.log("✅ ProtectedRoute is running");

  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) {
    console.log("➡️ Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Access granted");
  return children;
}

export default ProtectedRoute;