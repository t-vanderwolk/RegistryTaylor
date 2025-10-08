import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const normalizeRole = (role) => (role || "").toString().toUpperCase();

export function RoleGuard({ children, allow }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6 text-blueberry">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const role = normalizeRole(user.role);
  const allowedRoles = Array.isArray(allow) ? allow.map(normalizeRole) : [];

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RoleGuard;
