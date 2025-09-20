import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { token, user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-10 py-12 text-center shadow-soft">
          <p className="font-heading text-blueberry">Loading your concierge experience…</p>
        </div>
      </main>
    );
  }

  if (!token) {
    return <Navigate to="/portal" state={{ redirectTo: location.pathname }} replace />;
  }

  if (allowedRoles.length > 0) {
    const effectiveRole = user?.role || role;
    if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
      return <Navigate to="/portal" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
