// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("bagatcinemaUserInfo"));

  // Not logged in? Redirect to login page
  if (!userInfo?.token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the protected page
  return children;
}
